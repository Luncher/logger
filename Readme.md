
# koa-logger

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

 logger middleware for [koav2](https://github.com/Luncher/logger).


>Wrapper `koa-logger` adapt production enveriment


## Example

```js
const logger = require('koa-logger-adapter')
const Koa = require('koa')

const option = {
  stream: fs.createWriteStream('./logs/access.log'), //setup log stream(default is process.stdout)
  color: true, //enable color output
  headers: []//customize headers
}
const app = new Koa()
app.use(logger(option))
```

## Notes

  Recommended that you `.use()` this middleware near the top
  to "wrap" all subsequent middleware. If you using proxy, please setup `app.proxy = true`

## License

  MIT

[npm-image]: https://img.shields.io/npm/v/koa-logger-adapter.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/koa-logger-adapter
[travis-image]: https://img.shields.io/travis/Luncher/logger.svg?style=flat-square
[travis-url]: https://travis-ci.org/Luncher/logger
