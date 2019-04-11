const path = require('path')
const resolve = (dir) => {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  chainWebpack: config => {
    /**清除已有的loader规则，如果你不这样做，接下来的loader会附加在该规则现有的loader之后 */
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()

    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include
      .add(resolve('src/assets/icons/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/styles/mixin.less')]
    }
  },
  devServer: {
    open: true,
    proxy: {
      '/pro_reconcili': {
        // target: 'http://39.98.195.15:8780/pro_reconcili',
        //target: 'http://114.215.198.87:8780/test-reconcili/',
        target: 'http://39.98.195.15/api/pro_reconcili',
        ws: false,
        changeOrigin: true,
        pathRewrite: { "^/pro_reconcili": "" }
      },
      '/': {
        target: 'http://192.168.1.245:8082',
        ws: false,
        changeOrigin: true
      }
    },
  },
  publicPath: process.env.BASE_URL
}