## 问题： A页面打开B页面，B页面关闭时（包括崩溃）如何通知A页面
- B页面正常关闭
   
    方案：正常关闭时 可以添加监听事件

        1. window.addEventListener('beforeunload',function) // 不适用onunload ，因为他打开新页面也会提示
        2.
- B页面非正常关闭
    B 页面打开后使用serviceworker，然后定时给service worker 发送心跳，当超时后通知A页面。