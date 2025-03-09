<template>
	<view class="page">
		<view class="user">
			<image :src="imageurl" class="avatar"></image>
			<text>{{name}}</text>
			<view class="scan">
				<image src="/static/center2/scan.png"></image>
			</view>
		</view>
		<view class="card">
			<view class="status">
				<view class="groupid">{{groupid}}</view>
				<view class="statusid">
					<svg v-if="statusid" t="1739531912715" class="icon" viewBox="0 0 1024 1024" version="1.1"
						xmlns="http://www.w3.org/2000/svg" p-id="11493" width="100%" height="100%">
						<path
							d="M511.860364 0.139636A511.813818 511.813818 0 1 0 1023.744 512 511.744 511.744 0 0 0 511.860364 0.139636zM716.8 706.187636a45.149091 45.149091 0 0 1-63.488 6.4L476.346182 567.854545a44.916364 44.916364 0 0 1-16.570182-34.90909v-211.525819a45.102545 45.102545 0 1 1 90.205091 0v190.045091l160.581818 131.351273a45.102545 45.102545 0 0 1 6.283636 63.394909z m0 0"
							fill="#3CB034" p-id="11494"></path>
					</svg>
					<svg v-if="!statusid" t="1739532838972" class="icon" viewBox="0 0 1024 1024" version="1.1"
						xmlns="http://www.w3.org/2000/svg" p-id="15198" width="100%" height="100%">
						<path
							d="M512 0C229.23264 0 0 229.23264 0 512s229.23264 512 512 512 512-229.23264 512-512S794.76736 0 512 0z m256 576H256A60.16 60.16 0 0 1 192 512 60.16 60.16 0 0 1 256 448h512a60.16 60.16 0 0 1 64 64 60.16 60.16 0 0 1-64 64z"
							fill="#F8353F" p-id="15199"></path>
					</svg>
				</view>
				<view class="status_item">
					<view style="font-size: 18px; font-weight: 500;color: greenyellow;" v-if="statusid">
						休息中
					</view>
					<view style="font-size: 18px; font-weight: 500;color: orangered;" v-if="!statusid">
						工作中
					</view>
				</view>
			</view>
		</view>
		<view class="card">
			<view class="item" v-for="v in menus1" :key="v.id" v-on:click="navigate(v.id)">
				<image :src="v.icon"></image>
				<text>{{v.name}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				imageurl: '/api/static',
				name: '',
				groupid: '',
				statusid: '',
				username: '',
				identity: '',
				isdriver:false,
				menus1: [{
						id: 1,
						name: '意见反馈',
						icon: '/static/center2/solution.png'
					},
					{
						id: 2,
						name: '司机申请',
						icon: '/static/center2/reload-time.png'
					},
					{
						id: 3,
						name: '个人任务',
						icon: '/static/center2/star.png'
					},
					{
						id: 4,
						name: '退出登录',
						icon: '/static/center2/Field-time.png'
					}
				],
			}
		},
		mounted() {
			this.init()
		},
		onShow(){
			if(this.username){
				axios.post('/api/work/employeeInf', {
					username: this.username,
				}).then(res => {
					res.data.status=='0'?this.statusid = true:this.statusid = false
				})
			}
		},
		methods: {
			init() {
				var avator = document.cookie
				var cookiearray = avator.split(';');
				var res = {};
				for (var i = 0; i < cookiearray.length; i++) {
					var name = cookiearray[i].split('=')[0];
					var value = cookiearray[i].split('=')[1];
					res[name] = value
				}
				this.imageurl = this.imageurl + getCookie('images')
				this.name = getCookie('name')
				this.username = getCookie('username')
				//15643897210

				axios.post('/api/work/employeeInf', {
					username: this.username,
				}).then(res => {
					console.log(res.data)
					this.identity = res.data.identity
					if (res.data.isdriver) {
						//1
						this.groupid = '司机'
						this.isdriver = true
					} else {
						if (res.data.identity == '0') {
							this.groupid = `${res.data.groupid}-组长`
							//阻止申请
						} else {
							this.groupid = `${res.data.groupid}-组员`
						}
						if (res.data.groupid == '0') {
							this.groupid = '未分配组'
						}
					}
					res.data.status=='0'?this.statusid = true:this.statusid = false
				})
			},
			navigate(id) {
				switch (id) {
					case 1:
						uni.navigateTo({
							url: "/pages/advice/advice" // 这里填写目标页面的路径
						});
						break
					case 2:
						if (this.identity == '0') {
							uni.showToast({
							    title: "组长不能申请成为司机，请转移组长后申请",
							    icon: "error",
							    duration: 2000
							});
							return
						}
						uni.navigateTo({
							url: "/pages/driver_application/application" // 这里填写目标页面的路径
						});
						break;
					case 3:
						uni.switchTab({
							url: "/pages/task_leader/task_leader" // 这里填写目标页面的路径
						});
						break;
					case 4:
						clearAllCookie()
						uni.navigateTo({
							url: "/pages/index/index" // 这里填写目标页面的路径
						});
						break;
						// 其他跳转逻辑可以根据需要添加
					default:
						uni.showToast({
							title: '此功能暂未开放',
							icon: 'none'
						});
				}
			}
		}
	}

	function getCookie(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	}

	function clearAllCookie() {
		var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
		if (keys) {
			for (var i = keys.length; i--;)
				document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
		}
	}
</script>

<style lang="scss">
	.status {
		display: flex;
		flex-direction: row;
		height: 50px;
		width: 100%;
		justify-content: space-around;
		flex-wrap: wrap;

		.groupid {
			height: 50px;
			line-height: 50px;
			flex: 7;
		}

		.status_item {
			height: 50px;
			line-height: 50px;
			flex: 2;
		}

		.statusid {
			height: 50px;
			line-height: 50px;
			flex: 1;

		}
	}

	.page {
		background: #f0f0f0;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;

		.user {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 150rpx;
			background: #fff;
			width: 750rpx;

			.avatar {
				height: 80rpx;
				width: 80rpx;
				border-radius: 50%;
				margin-left: 25rpx;
				margin-right: 20rpx;
				overflow: hidden;
			}

			text {
				display: block;
				font-size: 16px;
				flex-grow: 1;
			}

			.scan {
				width: 120rpx;
				background: #D8B774;
				border-radius: 30rpx 0% 0% 30rpx;
				box-sizing: border-box;
				padding-left: 20rpx;
				height: 60rpx;
				align-items: center;
				display: flex;

				&:active {
					background: #9e8655;
				}

				image {
					height: 50rpx;
					width: 50rpx;
				}
			}
		}

		.card {
			display: flex;
			flex-wrap: wrap;
			width: 700rpx;
			background: #fff;
			border-radius: 16rpx;
			padding: 20rpx;
			box-sizing: border-box;
			margin-top: 20rpx;

			.title {
				width: 100%;
				font-size: 16px;
				font-weight: bold;
				margin-bottom: 10rpx;
			}

			.item {
				display: flex;
				color: #50525A;
				flex-direction: column;
				align-items: center;
				width: 50%;
				height: 250rpx;
				justify-content: center;
				border-radius: 8rpx;
				margin-bottom: 20rpx;

				&:active {
					background: #f0f0f0;
				}

				image {
					width: 70rpx;
					height: 70rpx;
					margin-bottom: 10rpx;
				}

				text {
					font-size: 12px;
				}
			}
		}
	}
</style>