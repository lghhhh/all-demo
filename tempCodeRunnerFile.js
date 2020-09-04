

function createFlow(effects=[]){
    let sources= effects.slice().flat()

    function run (cb){
        while(sources.length){
            const task=sources.shift()
            const next=createFlow(sources).run(cb)
            if(typeof task==="function"){
                const  res= task()
                if(res?.then){
                    // 中断Flow的执行，将后学步骤  添加到promise的then后
                    res.then(next)
                    return
                }else if(task?.isFlow){
                    task.run(next)
                    return
                }
            }
        }
        // 执行网进行回调
        cb?.()
      
    }

    return {
        run,
        isFlow:true
    }
}


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