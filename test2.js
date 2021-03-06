
function createFlow(effects=[]){
    const queue=[...effects.flat()]

    const run = async function (cb){
        for(let i=0;i<queue.length;i++){
            if(queue[i].run){
                await queue[i].run()
            }else{
                await queue[i]()
            }
        }
        cb&&cb()
    }
    return {
        run,
        queue
    }
}

const log=console.log
// 需要按照 a,b,延迟1秒,c,延迟1秒,d,e, done 的顺序打印
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const subFlow = createFlow([() => delay(1000).then(() => log("c"))]);

createFlow([
  () => log("a"),
  () => log("b"),
  subFlow,
  [() => delay(1000).then(() => log("d")), () => log("e")],
]).run(() => {
  console.log("done");
});