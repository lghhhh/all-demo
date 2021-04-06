'use strict'
function * g () {
  yield 1
  console.log('throwing an exception')
  throw new Error('generator broke!')
  yield 2
  yield 3
}

function log (generator) {
  let v
  console.log('starting generator')
  try {
    v = generator.next()
    console.log('第一次运行next方法', v)
  } catch (err) {
    console.log('捕捉错误', v)
  }
  try {
    v = generator.next()
    console.log('第二次运行next方法', v)
  } catch (err) {
    console.log('捕捉错误', v)
  }
  try {
    v = generator.next()
    console.log('第三次运行next方法', v)
  } catch (err) {
    console.log('捕捉错误', v)
  }
  console.log('caller done')
}

log(g())
