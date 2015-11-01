# swear

[![Build Status](http://img.shields.io/travis/jarofghosts/swear.svg?style=flat-square)](https://travis-ci.org/jarofghosts/swear)
[![npm install](http://img.shields.io/npm/dm/swear.svg?style=flat-square)](https://www.npmjs.org/package/swear)
[![npm version](https://img.shields.io/npm/v/swear.svg?style=flat-square)](https://www.npmjs.org/package/swear)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
[![License](https://img.shields.io/npm/l/swear.svg?style=flat-square)](https://github.com/jarofghosts/swear/blob/master/LICENSE)
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A more flexible `Promise.all`.

## Usage

```javascript
const fetch = require('isomorphic-fetch')
const swear = require('swear')

swear({
  obj: fetch('/json').then(res => res.json()), 
  numbers: [1, 2, Promise.resolve(3)],
  wut: Promise.resolve({a: Promise.resolve('b'))}))
}).then(x => {
  // {obj: {api: 'result'}, numbers: [1, 2, 3], wut: {a: 'b'}}
})
```

Accepts anything and resolves once *every* promise within the input is resolved.

## Notes

* If any promise rejects, the returned promise will immediately reject.

## API

`swear(x) -> Promise`

* `x` can be basically anything.

## License

MIT
