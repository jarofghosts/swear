const {isObject} = require('util')

const Promise = require('es6-promise').Promise
const isPromise = require('is-promise')
const setIn = require('set-in')

module.exports = swear

function swear (obj) {
  if (isPromise(obj)) {
    return new Promise((resolve, reject) => {
      obj
        .then(x => {
          obj = x
          resolveObj(resolve, reject)
        })
        .catch(reject)
    })
  } else if (isObject(obj)) {
    return new Promise(resolveObj)
  } else {
    return new Promise(resolve => resolve(obj))
  }

  function resolveObj (resolve, reject) {
    let {promises, locations} = getPromises(obj)

    if (!promises.length) {
      return resolve(obj)
    } else {
      Promise.all(promises)
        .then(updateObj)
        .catch(reject)
    }

    function updateObj (resolved) {
      for (let i = 0; i < resolved.length; ++i) {
        setIn(obj, locations[i], resolved[i])
      }

      resolveObj(resolve, reject)
    }
  }
}

function getPromises (obj, keys = [], promises = [], locations = []) {
  const objKeys = Object.keys(obj)

  for (let key of objKeys) {
    if (isPromise(obj[key])) {
      promises.push(obj[key])
      locations.push(keys.concat(key))
    } else if (isObject(obj[key])) {
      getPromises(obj[key], keys.concat(key), promises, locations)
    }
  }

  return {promises, locations}
}
