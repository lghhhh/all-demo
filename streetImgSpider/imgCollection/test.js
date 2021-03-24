'use strict'
const testElement = document.getElementById('testElement')
setTimeout(() => {
  console.log(performance.now(), 'settimeout')
}, 0)
requestAnimationFrame(() => {
  console.log(performance.now(),
 'requestAnimationFrame')
})
var observer = new MutationObserver(() => {
  console.log('MutationObserver')
});
observer.observe(testElement, {
 childList: true 
})
const div = document.createElement('div')testElement.appendChild(div)
new Promise(resolve => {
  console.log('promise')
  resolve()
}).then(() => console.log('then'))
console.log(performance.now(), 'global')

