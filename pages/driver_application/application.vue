<template>
	<view class="lunbo">
		<view class="application_container" v-if="!ifapplyed">
			<form>
				<view class="uni-form-item uni-column">
					<view class="title">账户:</view>
					<input class="uni-input" v-model="username" disabled name="input"
						style="border-bottom: 0.5px solid grey;" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">名称:</view>
					<input class="uni-input" name="input" v-model="name" disabled
						style="border-bottom: 0.5px solid grey;" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">申请类型</view>

					<radio-group @change="radioChange">
						<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
							<view>
								<radio :value="item.value" :checked="index === current" />{{item.name}}
							</view>
						</label>
					</radio-group>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">上传驾照:</view>
					<image :src="avator" mode="aspectFit" class="img_upload" id="show" v-on:click="uploadAvator">
					</image>
				</view>
				<view class="uni-btn-v">
					<button form-type="submit"
						style="background-color:#409eff; width: 80vw; height: 50px;line-height: 50px; color: white;font-size: 24px; font-weight: 500;"
						v-on:click="uploadFile">Submit</button>

				</view>
			</form>
		</view>
		<view class="applyed" v-if="ifapplyed">
			<view class="applyed_item" v-if="ifapplyed==1">
			<svg t="1739619972018" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
				p-id="6933" width="50%" height="100%" >
				<path
					d="M971.48416 232.63744L895.90784 152.7296a34.304 34.304 0 0 0-50.4064 0l-453.24288 479.1552L176.64 402.28352a34.304 34.304 0 0 0-50.4064 0L50.688 482.18112a39.18848 39.18848 0 0 0 0 53.28896l239.77984 255.30368c0.31744 0.36352 0.41472 0.8448 0.74752 1.23904l51.85024 54.8352 12.4928 13.312 11.17696 11.83232a34.304 34.304 0 0 0 50.40128 0L971.46368 285.97248a39.22432 39.22432 0 0 0 0-53.28384z"
					fill="#388BFA" p-id="6934"></path>
			</svg>
			已申请
			</view>
			<view class="applyed_item" v-if="ifapplyed==2">
			<svg t="1739621334873" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4228" width="50%" height="100%"><path d="M512 1024a512 512 0 1 1 512-512 512 512 0 0 1-512 512z m142.364444-696.888889l-183.466666 251.875556a7.552 7.552 0 0 1-13.511111 0L369.777778 469.333333h-85.333334l159.431112 215.352889a22.755556 22.755556 0 0 0 40.533333 0L739.555556 327.111111h-85.191112z" fill="#00C579" p-id="4229"></path></svg>
			申请成功
			</view>
			<view class="applyed_item" v-if="ifapplyed==3">
			<svg t="1739621445337" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5426" width="50%" height="100%"><path d="M644.608 307.2L512 439.808 379.392 307.2 307.2 379.392 439.808 512 307.2 644.608 379.392 716.8 512 584.192 644.608 716.8 716.8 644.608 584.192 512 716.8 379.392 644.608 307.2zM512 0C228.864 0 0 228.864 0 512s228.864 512 512 512 512-228.864 512-512S795.136 0 512 0z m0 921.6C286.208 921.6 102.4 737.792 102.4 512S286.208 102.4 512 102.4s409.6 183.808 409.6 409.6-183.808 409.6-409.6 409.6z" fill="#D72327" p-id="5427"></path></svg>
			申请失败
			<view style="color: red; border-bottom:0.5px solid gray ;" v-on:click="reapplication">
				再次申请
			</view>
			</view>
		</view>
	</view>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				ifapplyed: 0,
				images: {},
				avator: '/static/avator_defalut.png',
				name: '',
				username: '',
				items: [{
						value: '铲雪车',
						name: '铲雪车',

					},
					{
						value: '运雪车',
						name: '运雪车'
					},
				],
				current: 0,
				Machine_type: '铲雪车'
			}
		},
		mounted() {
			this.init()
		},
		onBackPress(e) {
			uni.switchTab({
				url: '/pages/account/account' // 这里填写目标页面的路径
			});
		},
		methods: {
			reapplication(){
				console.log(this.username)
				//接口删除原有的申请
				axios.post('/api/map/delApplication', {
					username: this.username,
				}).then(res => {
					this.ifapplyed=0
				})
			},
			uploadFile() {
				var headimgurl = this.images
				var formData = new FormData()
				formData.append("username", this.username)
				formData.append("type", this.Machine_type)
				formData.append("avator", headimgurl)
				if (this.username && "type", this.Machine_type && "avator", headimgurl) {
					axios.post("/api/map/addApplication", formData, {
						headers: {
							"Content-Type": "multipart/form-data"
						}
					}).then(res => {
						if (res.data == 'ok') {
							uni.switchTab({
								url: '/pages/account/account' // 这里填写目标页面的路径
							});
						}
					})
				} else {
					this.$message.error('有属性值为空')
				}

			},
			init() {
				var avator = document.cookie
				var cookiearray = avator.split(';');
				var res = {};

				this.name = getCookie('name')
				this.username = getCookie('username')
				axios.post('/api/map/regApplication', {
					username: this.username,
				}).then(res => {
					this.ifapplyed = res.data
				})
			},

			radioChange(value) {
				this.Machine_type = value.detail.value
				console.log(this.Machine_type)
			},
			uploadAvator() {
				var re = this
				uni.chooseImage({
					count: 1, // 最多可以选择的图片张数，默认9
					sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
					sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
					success: function(res) {
						var f = document.getElementById('show');
						re.avator = res.tempFiles[0].path
						re.images = res.tempFiles[0]
					}
				})
			},

		}
	}

	function getCookie(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	}
</script>

<style>
	.uni-form-item .title {
		padding: 20rpx 0;
	}

	.img_upload {
		position: relative;
		left: -50rpx;
	}

	.applyed {
		width: 80vw;
		height: 30vh;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		
	
	}
	.applyed_item{
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>