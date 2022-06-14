// INIT

const express = require('express')
const cors = require('cors')
const server = express()
server.listen(3000)
server.use(express.json())
server.use(cors())

// DB CONNECT

const { Client } = require('pg')
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'feed',
  password: 'Arcom2999',
  port: 5432,
})
client.connect()

// GETS //

server.get('/get-users', async (req, res) =>  {
  const query =
    'SELECT * FROM public.users'

  client.query(query, (err, resp) => {
    return res.json(resp.rows)
  })
})

server.get('/get-posts', (req, res) => {
  const query =
    'SELECT * FROM public.posts'

  client.query(query, (err, resp) => {
    return res.json(resp.rows)
  })
})

server.get('/get-messages-chat', (req, res) => {
  const params = req.query

  const query = `
    SELECT * FROM public.mensagens_diretas
    WHERE "from" = '${params?.user}' OR "from" = '${params?.other}'
    AND "to" = '${params?.user}' OR "to" = '${params?.other}'
  `

  client.query(query, (err, resp) => {
    return res.json(resp.rows)
  })
})

server.get('/get-messages-group', (req, res) => {
  const params = req.query

  const query = `
    SELECT * FROM public.mensagens_grupo
    WHERE "to" = '${params.group}'
  `

  client.query(query, (err, resp) => {
    return res.json(resp.rows)
  })
})

server.get('/get-groups', (req, res) => {
  const query =
    'SELECT * FROM public.grupos'

  client.query(query, (err, resp) => {
    return res.json(resp.rows)
  })
})

// POSTS

server.post('/login', (req, res) => {
  const params = req.query

  const query = `
    SELECT * FROM public.users
    WHERE "user" = '${params?.user}'
    AND senha = '${params?.senha}'
  `

  client.query(query, (err, resp) => {
    return res.json(resp?.rows?.length > 0)
  })
})

server.post('/register', (req, res) => {
  const params = req.query

  const query = `
    INSERT INTO public.users ("user", senha)
    VALUES ('${params?.user}', '${params?.senha}')
  `

  client.query(query, (err) => {
    return res.json(!err)
  })
})

server.post('/create-post', (req, res) => {
  const params = req.query

  const query = `
    INSERT INTO public.posts ("user", url, legenda)
    VALUES ('${params?.user}', '${params?.url}', '${params?.legenda}')
  `

  client.query(query, (err) => {
    return res.json(!err)
  })
})

server.post('/create-group', (req, res) => {
  const params = req.body

  const query = `
    INSERT INTO public.grupos (nome, membros)
    VALUES ('${params?.name}', '{${params?.members?.map(e => {return `"${e}"`})}}')
  `

  client.query(query, (err) => {
    return res.json(!err)
  })
})

server.post('/send-message-chat', (req, res) => {
  const params = req.query

  const query = `
    INSERT INTO public.mensagens_diretas (text, "from", "to")
    VALUES ('${params?.text}', '${params?.from}', '${params?.to}')
  `

  client.query(query, (err) => {
    return res.json(!err)
  })
})

server.post('/send-message-group', (req, res) => {
  const params = req.query

  const query = `
    INSERT INTO public.mensagens_grupo (text, "from", "to")
    VALUES ('${params?.text}', '${params?.from}', '${params?.to}')
  `

  client.query(query, (err) => {
    return res.json(!err)
  })
})

// PATCH

server.patch('/change-user', (req, res) => {
  const params = req.query

  const query = `
    UPDATE public.users
    SET "user" = '${params?.newUser}'
    WHERE "user" = '${params?.oldUser}'
  `

  client.query(query, (err) => {
    return res.json(!err)
  })
})