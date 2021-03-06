const isError = require('util').isError

const test = require('tape')
const isPromise = require('is-promise')

const swear = require('../lib/')

test('always returns a promise', t => {
  t.plan(1)

  t.true(isPromise(swear({})))
})

test('resolves promises in a provided object', t => {
  t.plan(1)

  swear({a: Promise.resolve('b')})
    .then(x => t.deepEqual(x, {a: 'b'}))
    .catch(t.fail)
})

test('rejects if any promise is rejected', t => {
  t.plan(2)

  swear({a: Promise.reject(new Error('error'))})
    .then(() => t.fail())
    .catch(err => {
      t.true(isError(err))
      t.equal(err.message, 'error')
    })
})

test('resolves all the way down', t => {
  t.plan(1)

  swear({a: Promise.resolve({b: Promise.resolve('c')})})
    .then(x => t.deepEqual(x, {a: {b: 'c'}}))
    .catch(t.fail)
})

test('works with arrays', t => {
  t.plan(1)

  swear([Promise.resolve(1)])
    .then(x => t.deepEqual(x, [1]))
    .catch(t.fail)
})

test('works with arrays chained', t => {
  t.plan(1)

  swear([Promise.resolve({a: Promise.resolve(1)})])
    .then(x => t.deepEqual(x, [{a: 1}]))
    .catch(t.fail)
})

test('works with a promise', t => {
  t.plan(3)

  swear(Promise.resolve('x'))
    .then(x => t.equal(x, 'x'))
    .catch(t.fail)

  swear(Promise.reject(new Error('x')))
    .then(t.fail)
    .catch(t.pass)

  swear(Promise.resolve({a: Promise.resolve('b')}))
    .then(x => t.deepEqual(x, {a: 'b'}))
    .catch(t.fail)
})

test('works with strings and numbers', t => {
  t.plan(2)

  swear(4)
    .then(x => t.equal(x, 4))
    .catch(t.fail)

  swear('lol')
    .then(x => t.equal(x, 'lol'))
    .catch(t.fail)
})

test('works with a promise that resolves to a string or number', t => {
  t.plan(2)

  swear(Promise.resolve(4))
    .then(x => t.equal(x, 4))
    .catch(t.fail)

  swear(Promise.resolve('lol'))
    .then(x => t.equal(x, 'lol'))
    .catch(t.fail)
})

test('safe to wrap', t => {
  t.plan(2)

  swear(swear(4))
    .then(x => t.equal(x, 4))
    .catch(t.fail)

  swear(swear(swear(4)))
    .then(x => t.equal(x, 4))
    .catch(t.fail)
})
