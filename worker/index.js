const {
  redisHost,
  redisPort
} = require('./keys')

const redis = require('redis')

const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000
})

const subscription = redisClient.duplicate()

const fib = i => {
  if(i < 2) return 1
  return fib(i - 1) + fib(i - 2)
}

subscription.on('message', (channel, message) => {
  const fibValue = fib(parseInt(message))
  redisClient.hset('values', message, fib(parseInt(message)))
})

subscription.subscribe('insert')
