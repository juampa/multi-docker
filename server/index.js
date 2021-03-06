const {
  redisHost,
  redisPort,
  pgUser,
  pgPort,
  pgHost,
  pgDatabase,
  pgPassword
} = require('./keys')

const express    = require('express')
const bodyParser = require('body-parser')
const cors       = require('cors')
const redis      = require('redis')

/* Express Config */
const app = express()
app.use(cors())
app.use(bodyParser.json())

/* Postgres Config */
const { Pool } = require('pg')
const pgClient = new Pool({
  user: pgUser,
  port: pgPort,
  host: pgHost,
  database: pgDatabase,
  password: pgPassword
})

pgClient.on('error', () => {
  console.log('Lost PG Connection')
})

pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(console.log)

/* Redis Config */
const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000
})
const redisPublisher = redisClient.duplicate()

/* Route Handlers */
app.get('/', (req, res) => {
  res.send('Hi')
})

app.get('/values', async (req, res) => {
  const values = await pgClient.query('SELECT * from values')

  res.send(values.rows)
})

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values)
  })
})

app.post('/values', async (req, res) => {
  const index = req.body.index
  if (parseInt(index) > 45) {
    return res.status(422).send('Index too high')
  }

  redisClient.hset('values', index, 'Nothing Yet!')
  redisPublisher.publish('insert', index)
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index])

  res.send({ working: true })
})

/* Start Express Server */
app.listen(5000, () => {
  console.log('Listening on port 5000');
})
