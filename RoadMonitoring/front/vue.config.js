// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// 引入path模块
function resolve(dir) {
  return path.join(__dirname, dir);// path.join(__dirname)设置绝对路径
}
module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? './' : '/api',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000/', // 别忘记加协议！！如http://
        secure: false, // 如果是 https ,需要开启这个选项
        changeOrigin: true, // 开启跨域
        pathRewrite: {
          '^/api': '/', // 正则匹配，相当于用api替换target中的地址
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'));
    // set第一个参数：设置的别名，第二个参数：设置的路径
  },

};
