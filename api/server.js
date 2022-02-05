const Enforcer = require('openapi-enforcer')
const EnforcerMiddleware = require('openapi-enforcer-middleware')
const express = require('express')
const path = require('path')

const app = express()

// Any paths defined in your openapi.yml will validate and parse the request
// before it calls your route code.
const openapiPath = path.resolve(__dirname, '../openapi.yaml')
const enforcerPromise = Enforcer(openapiPath, {hideWarnings: true})
const enforcerMiddleware = EnforcerMiddleware(enforcerPromise)

app.use(express.json())

app.use((req, res, next) => {
  console.log(req.method + ' ' + req.path, req.headers, req.body)
  next()
})

app.use(enforcerMiddleware.init({basePath: '/api'}))

// Catch errors
enforcerMiddleware.on('error', err => {
  console.error(err)
  process.exit(1)
}) 

// app.use(enforcerMiddleware.route({
//   // The "users" is mapped to via the "x-controller" value.
//   accounts: {
//     // The "listUsers" is mapped to via the "x-operation" or "operationId" value.
//     async createAccount (req, res) {
//       const { rows } = dbClient.query('SELECT * FROM users')
//       const users = rows.map(row => {
//         return {
//           id: row.id,
//           name: row.name,
//           email: row.email
//         }
//       })
//       res.enforcer.send(users)
//     }
//   }
// }))


// fallback mocking middleware
app.use(enforcerMiddleware.mock())

module.exports = app;
