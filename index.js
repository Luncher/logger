/**
 * Module dependencies.
 */
'use strict'

const util = require('util')
const bytes = require('bytes')
const chalk = require('chalk')
const Counter = require('passthrough-counter')
const humanize = require('humanize-number')

const DefaultOption = {
  color: true,  
  stream: process.stdout,
  headers: []
}

function Logger (option = {}) {
  option = Object.assign({}, DefaultOption, option)
  return async function (ctx, next) {
    const start = Date.now()

    Logger.writeBefore(ctx, option, start)

    try {
      await next()
    } catch (err) {
      // log uncaught downstream errors
      Logger.writeAfter(ctx, option, start , err)
      throw err
    }

    // log when the response is finished or closed,
    // whichever happens first.
    const res = ctx.res

    const onfinish = done.bind(null, 'finish')
    const onclose = done.bind(null, 'close')

    res.once('finish', onfinish)
    res.once('close', onclose)

    function done (event) {
      res.removeListener('finish', onfinish)
      res.removeListener('close', onclose)
      Logger.writeAfter(ctx, option, start)
    }
  }
}

Logger.formatTime = function (start) {
  const delta = Date.now() - start
  return humanize(delta < 10000
    ? delta + 'ms'
    : Math.round(delta / 1000) + 's')
}

Logger.formatAfterColors = function (ctx, status, start) {
  const colorCodes = {
    7: 'magenta',
    5: 'red',
    4: 'yellow',
    3: 'cyan',
    2: 'green',
    1: 'green',
    0: 'yellow'
  }
  const s = status / 100
  const color = colorCodes.hasOwnProperty(s) ? colorCodes[s] : colorCodes[0]
  
  return util.format(' ' + '>>>' +
    ' ' + chalk.blue('%s') +
    ' ' + chalk.green('%s') +
    ' ' + chalk.bold('%s') +
    ' ' + chalk.gray('%s') +
    ' ' + chalk.white('%j') +
    ' ' + chalk[color]('%s') +
    ' ' + chalk.gray('%s') +
    ' ' + chalk.white('%j'),
      new Date().toISOString(),
      ctx.ip,
      ctx.method,
      ctx.originalUrl,
      ctx.request.body || {},
      status,
      this.formatTime(start),
      ctx.body || {})
}

Logger.formatAfterNormal = function (ctx, status, start) {
  console.log(ctx.body || {})
  return util.format(' ' + '>>>' +
    ' %s' +
    ' %s' +
    ' %s' +
    ' %s' +
    ' %j' +
    ' %s' +
    ' %s' +
    ' %j',
      new Date().toISOString(),
      ctx.ip,
      ctx.method,
      ctx.originalUrl,
      ctx.request.body || {},
      status,
      this.formatTime(start),
      ctx.body || {})
}

Logger.writeAfter = function (ctx, option, start, err) {
  const status = err
    ? (err.status || 500)
    : (ctx.status || 404)

  let logStr = ""
  const { color, stream } = option

  if (color) {
    logStr = this.formatAfterColors(ctx, status, start)
  } else {
    logStr = this.formatAfterNormal(ctx, status, start)
  }

  stream.write(logStr + '\n')

  return
}

Logger.formatBeforeColors = function (ctx, option, start) {
  const headers = option.headers
  
  const extStr = util.format(headers.reduce((acc, cur) => {
      return acc + cur + ':' + chalk.gray('%s')
    }, ' '),
    ...headers.map(it => ctx.get(it) || ''))
  
  
  const normalStr = util.format(' ' + '<<<' +
    ' ' + chalk.blue('%s') +
    ' ' + chalk.green('%s') + 
    ' ' + chalk.bold('%s') +
    ' ' + chalk.gray('%s'),
    new Date(start).toISOString(),
    ctx.ip,
    ctx.method,
    ctx.originalUrl);

  return normalStr + extStr
}

Logger.formatBeforeNormal = function (ctx, option, start) {
  const headers = option.headers

  const extStr = util.format(headers.reduce((acc, cur) => {
      return acc + cur + ':%s'
    }, ' '), 
    ...headers.map(it => ctx.get(it) || ''))

  const normalStr = util.format(' ' + '<<<' +
    ' %s' + 
    ' %s' + 
    ' %s' + 
    ' %s',
    new Date(start).toISOString(),
    ctx.ip,
    ctx.method,
    ctx.originalUrl);
  
  return normalStr + extStr
}

Logger.writeBefore = function (ctx, option, start, err) {
  let logStr = ""
  const { color, stream } = option

  if (color) {
    logStr = this.formatBeforeColors(ctx, option, start)
  } else {
    logStr = this.formatBeforeNormal(ctx, option, start)
  }

  stream.write(logStr + '\n')

  return
}

/**
 * Expose logger.
 */

module.exports = Logger