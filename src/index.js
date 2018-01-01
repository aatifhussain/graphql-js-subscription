const express = require('express')

// This package automatically parses JSON requests.
const bodyParser = require('body-parser')

// This package will handle GraphQL server requests and responses
// for you, based on your schema.
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express')
const graphqlHTTP = require('express-graphql')
const {execute, subscribe} = require('graphql')
const {createServer} = require('http')
const {SubscriptionServer} = require('subscriptions-transport-ws')

const schema = require('./schema')

const start = async () => {
  const app = express()

  app.use('/graphql', bodyParser.json(), graphqlHTTP({
    schema: schema,
    rootValue: global,
    graphiql: true
  }))
  const PORT = 3000
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
  }))

  const server = createServer(app)
  server.listen(PORT, () => {
    SubscriptionServer.create(
      {execute, subscribe, schema},
      {server, path: '/subscriptions'}
    )
    console.log(`Hackernews GraphQL server running on port ${PORT}.`)
  })
}

start()
