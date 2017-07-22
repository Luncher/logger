'use strict'
/**
 * test cases
 */

// test tools
const chai = require('chai')
const sinon = require('sinon')
const sc = require('sinon-chai')
const request = require('supertest')
chai.use(sc)
const expect = chai.expect

// test subjects
const chalk = require('chalk')
const app = require('./test-server')
let log, sandbox

describe('koa-logger', function () {
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    log = sandbox.spy(process.stdout, 'write')
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('should log a request', function (done) {
    request(app.listen()).get('/200').expect(200, 'hello world', function () {
      expect(log).to.have.been.called // eslint-disable-line
      done()
    })
  })
})