const pTry = require('p-try')
const pify = require('pify')

Promise.join = (...all) => {
  const cb = all.pop()
  if (typeof cb !== 'function') all.push(cb)
  return Promise.all(all).then(resultArray => {
    if (typeof cb !== 'function') {
      return resultArray
    } else {
      return cb(...resultArray)
    }
  })
}
Promise.fromCallback = (cb) => pify(cb)()
Promise.try = pTry
Promise.prototype.finally = Promise.prototype.finally || function finallyPolyfill(callback) {
  const constructor = this.constructor;

  return this
    .then((value) => constructor.resolve(callback()).then(() => value))
    .catch((reason) => {
      constructor.resolve(callback()).then(() => reason)
    })
}

process.on('unhandledRejection', (...args) => console.log(...args))

module.exports = Promise
