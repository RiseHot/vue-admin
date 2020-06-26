const path = require('path');

module.exports = {
  // 将部署应用程序的基本URL
  // 将部署应用程序的基本URL。
  // 默认情况下，Vue CLI假设您的应用程序将部署在域的根目录下。
  // https://www.my-app.com/。如果应用程序部署在子路径上，则需要使用此选项指定子路径。例如，如果您的应用程序部署在https://www.foobar.com/my-app/，集baseUrl到'/my-app/'.

  publicPath: process.env.NODE_ENV === 'production' ? '' : './',

  // outputDir: 在npm run build时 生成文件的目录 type:string, default:'dist'

  outputDir: process.env.NODE_ENV === 'production' ? 'dist' : 'devdist',

  // pages:{ type:Object,Default:undfind } 
/*
构建多页面模式的应用程序.每个“页面”都应该有一个相应的JavaScript条目文件。该值应该是一
个对象，其中键是条目的名称，而该值要么是指定其条目、模板和文件名的对象，要么是指定其条目
的字符串，
注意：请保证pages里配置的路径和文件名 在你的文档目录都存在 否则启动服务会报错的
*/
  pages: {
      index: {
          //entry for the page
          entry: 'src/main.js',
          //the source template
          template: 'public/index.html',
          //output as dist/index.html
          filename: 'index.html'
      },
      // when using the entry-only string format,
      // template is inferred to be `public/subpage.html`
      // and falls back to `public/index.html` if not found.
      // Output filename is inferred to be `subpage.html`.
      // subpage: 'src/subpage/main.js'
 },

  //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
  lintOnSave: false,
  // productionSourceMap：{ type:Bollean,default:true } 生产源映射
  // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
  productionSourceMap: false,
  // devServer:{type:Object} 3个属性host,port,https
  // 它支持webPack-dev-server的所有选项

  devServer: {
      port: 8080, // 端口号
      host:"192.168.1.3",
      https: false, // https:{type:Boolean}
      open: false, //配置自动启动浏览器
      proxy: {
				'/devapi':{
					target:'http://127.0.0.1:8585/code',
					changeOrigin: true,
					pathRewrite: {   //重写URL路径 下面是正则匹配替换
						'^/devapi': ''
					}
				} // 配置跨域处理,只有一个代理
			}
  },

  css: {
	extract: true,
	sourceMap: false,
    loaderOptions: {
		sass: {
			prependData: '@import "./src/styles/main.scss";'
		},
    },
	modules: false
  },
   // 是否为 Babel 或 TypeScript 使用 thread-loader
    parallel: require('os').cpus().length > 1,
    // 向 PWA 插件传递选项
    pwa: {},
    // 可以用来传递任何第三方插件选项
    pluginOptions: {},
	
	configureWebpack:(config) => {
		config.resolve = {
			extensions: ['.js', '.json', '.vue'],
			alias: {
				'@': path.resolve(__dirname, './src'),
				'public': path.resolve(__dirname, './public'),
				'@c': path.resolve(__dirname, './src/components'),
				'common': path.resolve(__dirname, './src/common'),
				'api': path.resolve(__dirname, './src/api'),
				'views': path.resolve(__dirname, './src/views'),
				'data': path.resolve(__dirname, './src/data'),
			}
		}
	},
}
