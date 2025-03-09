<template>
	<view class="lunbo">
		<view class="application_container">
			<form>
				<view class="uni-form-item uni-column">
					<view class="title">任务单号:</view>
					<input class="uni-input" name="input" v-model="workid" disabled
						style="border-bottom: 0.5px solid grey;" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">上传照片:</view>
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
	</view>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				workid:'',
				images: {},
				avator: '/static/avator_defalut.png',
				current: 0,
				Machine_type: '铲雪车'
			}
		},
		mounted() {
			this.init()
		},
		onBackPress(e) {
			uni.switchTab({
				url: '/pages/task_leader/task_leader' // 这里填写目标页面的路径
			});
		},
		onLoad(option){
			this.workid = option.id
		},
		methods: {
			uploadFile() {
				var ifMachine =	uni.getStorageSync('infoMachine')
				console.log(ifMachine)
				var types = 'work' 
				if(ifMachine){
					types = 'workmachine'
				}
				var headimgurl = this.images
				var formData = new FormData()
				formData.append("workid", this.workid)
				formData.append("avator", headimgurl)
				formData.append('types',types)
				if (this.workid && headimgurl) {
					axios.post("/api/map/submitWork", formData, {
						headers: {
							"Content-Type": "multipart/form-data"
						}
					}).then(res => {
						if (res.data == 'ok') {
							uni.switchTab({
								url: '/pages/task_leader/task_leader' // 这里填写目标页面的路径
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