const {isObject} = require('util')

const Promise = require('es6-promise').Promise
const isPromise = require('is-promise')
const setIn = require('set-in')
const getIn = require('get-in')

module.exports = swear

function swear (obj) {
  let previousLocations = null

  if (isPromise(obj)) {
    return new Promise((resolve, reject) => {
      obj
        .then(x => {
          if (!isObject(x)) {
            resolve(x)
          }

          obj = x
          resolveObj(resolve, reject)
        })
        .catch(reject)
    })
  } else if (isObject(obj)) {
    return new Promise(resolveObj)
  } else {
    return Promise.resolve(obj)
  }

  function resolveObj (resolve, reject) {
    let {promises, locations} = previousLocations === null
      ? getPromises(obj)
      : recheckPromises(obj, previousLocations)

    previousLocations = locations.slice()

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

function recheckPromises (obj, locations) {
  let promises = []
  let newLocations = []

  for (let location of locations) {
    let check = getPromises(getIn(obj, location), location)
    promises = promises.concat(check.promises)
    newLocations = newLocations.concat(check.locations)
  }

  return {promises, locations: newLocations}
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
