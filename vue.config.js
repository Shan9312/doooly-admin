const path = require('path')
const resolve = dir => {
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
            .include.add(resolve('src/assets/icons/svg'))
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
            '/': {
                target: 'http://admin.doooly.com/dev_doooly-admin/',
                ws: false,
                changeOrigin: true,
                // pathRewrite: { "^/pro_reconcili": "" }
            }
        },
        overlay: { // 当出现编译错误或警告时，就在页面上显示一层黑色的背景层和错误信息 errors: true, },著作权归作者所有。
            errors: true,
        }
    },
    publicPath: '/'
}