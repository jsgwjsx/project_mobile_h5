const CONFIG = {
	// 开发环境配置
	development: {
		assetsPath: '/static', // 静态资源路径
		baseUrl: 'https://administrator.dongtiyan.com', // 后台接口请求地址
		hostUrl: 'https://administrator.dongtiyan.com', // H5地址(前端运行地址)
		websocketUrl: '', // websocket服务端地址
		weixinAppId: '' // 微信公众号appid
	},
	// 生产环境配置
	production: {
		assetsPath: '/static', // 静态资源路径
		baseUrl: 'https://administrator.dongtiyan.com', // 后台接口请求地址
		hostUrl: 'https://administrator.dongtiyan.com', // H5地址(前端运行地址)
		websocketUrl: '', // websocket服务端地址
		weixinAppId: '' // 微信公众号appid
	}
 
};
export default CONFIG[process.env.NODE_ENV];