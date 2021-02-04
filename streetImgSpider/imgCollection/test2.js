'use strict'
const boa = require('@pipcook/boa')
const os = boa.import('os')
console.log(os.getpid()) // prints the pid from python.
