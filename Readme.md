
# koa-logger

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

 logger middleware for [koa](https://github.com/koajs/koa).


>Wrapper `koa-logger` adapt production enveriment

__Support `koa@2`;__


## Example

```js
const logger = require('koa-logger-adapter')
const Koa = require('koa')

const option = {
  stream: fs.createWriteStream('./logs/access.log'), //setup log stream(default is process.stdout)
  color: true //enable color output
}
const app = new Koa()
app.use(logger(option))
```

## Notes

  Recommended that you `.use()` this middleware near the top
  to "wrap" all subsequent middleware.

## License

  MIT

[npm-image]: https://img.shields.io/npm/v/koa-logger.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/koa-logger
[travis-image]: https://img.shields.io/travis/koajs/logger.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/logger
