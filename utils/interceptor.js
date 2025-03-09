import axios from "axios";

let list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
list.forEach(item => { //用遍历的方式分别为,uni.navigateTo,uni.redirectTo,uni.reLaunch,uni.switchTab这4个路由方法添加拦截器
	uni.addInterceptor(item, {
		invoke(e) { // 调用前拦截e
			const url = e.url.split('?')[0]
			if (url !== "pages/index/index") {
				axios.get('/api/work/verify').then(res => {
					if (res.data) {
						return true
					} else {
						uni.showToast({
							title: '该页面需要登录才能访问，请先登录',
							icon: 'error',
							duration: 2000
						});
						uni.navigateTo({
							url: "/pages/index/index"
						});
						return false;
					}
				})
			}
			return true
		},
		fail(err) { // 失败回调拦截 
			console.log(err);
		},
	})
})