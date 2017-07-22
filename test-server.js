
/**
 * test server
 */

const Koa = require('koa')
const _ = require('koa-route')
const bodyParser = require('koa-bodyparser')
const logger = require('./index')

const app = new Koa()
app.use(logger())
app.use(bodyParser())

app.use(_.get('/200', function (ctx) {
  ctx.body = 'hello world'
}))

app.use(_.get('/301', function (ctx) {
  ctx.status = 301
}))

app.use(_.get('/304', function (ctx) {
  ctx.status = 304
}))

app.use(_.get('/404', function (ctx) {
  ctx.status = 404
  ctx.body = { learn: 'forever' }
}))

app.use(_.post('/hello', function (ctx) {
  ctx.body = { learn: 'forever', bb: { a: 'xxx', c: { aaa: 111 }}}
}))

app.use(_.get('/500', function (ctx) {
  ctx.status = 500
  ctx.body = 'server error'
}))

app.use(_.get('/error', function (ctx) {
  throw new Error('oh no')
}))

app.listen(3008)

module.exports = app
