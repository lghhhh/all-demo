const CHECK_CRASH_INTERVAL=10*1000 // 10s 检查一次
const CRASH_THRESHOLD= 15*1000 // 15s 超过15秒没有心跳则认为已经crash
const pages={ }
let timer

function checkCrash(){
    const now = Data.new()
    for(var id in pages){
        let page=pages[id];
        if( (now-page.t)>CRASH_THRESHOLD){
            // 上报crash
            console.log('页面奔溃')
            delete pages[id]
        }
    }
    if(Object.keys(pages).length==0){
        clearInterval(timer);
        timer=null;
    }
}


window.addEventListener('message',(e) => {
    console.log('serviceWorker receive',e.data.type)
    const data= e.data;
    if(data.type==='running'){
        pages[data.id]={
            t:Data.new()
        }
        if(!timer){
            timer=setInterval(() => {
                checkCrash()
            },CHECK_CRASH_INTERVAL);
        }

    }else if(data.type==='clear'){
        delete pages[data.id]
    }
})