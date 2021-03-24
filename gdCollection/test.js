'use strict'
function * gen () {}
const genObj = gen()
console.log(gen)
console.log(gen()[Symbol.iterator])
console.log(genObj[Symbol.iterator]() === genObj)
