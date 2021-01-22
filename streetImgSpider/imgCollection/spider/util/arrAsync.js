'use strict';
const asyncFilter = async (arr, predicate) => Promise.all(arr.map(predicate))
  .then(results => arr.filter((_v, index) => results[index]));


module.exports = { asyncFilter };
