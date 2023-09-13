const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
module.exports = {
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['java', 'python', 'cpp'],
        features:["coreCommands","find"]
      }),
      new CompressionWebpackPlugin({ //gzip 压缩
        filename: '[path].gz[query]',
        test: new RegExp(
          '\\.(js|css)$'    //压缩 js 与 css
        ),
        threshold: 10240,
        minRatio: 0.8
      }),
    ]
  },
  /**
   * 接口代理配置
   * 如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API 服务器。
   * https://cli.vuejs.org/zh/config/#devserver-proxy
   * https://github.com/chimurai/http-proxy-middleware#proxycontext-config
   */
  devServer: {
    disableHostCheck: true
  }
}
