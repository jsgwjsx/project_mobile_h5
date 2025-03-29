<!-- <template>
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
						v-on:click="uploadFile">提交</button>

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
</style> -->
<template>
  <view class="page-container">
 
    <view class="page-header">
   
      <text class="header-subtitle">请填写任务信息并上传照片</text>
    </view>

   
    <view class="form-container">
      <form>

        <view class="uni-form-item">
          <view class="title">任务单号:</view>
         <input class="uni-input" name="input" v-model="workid" disabled
         	style="border-bottom: 0.5px solid grey;" />
        </view>

        
        <view class="uni-form-item">
          <view class="title">上传照片:</view>
          <view class="upload-container" @click="uploadAvator">
            <image :src="avator" mode="aspectFit" class="upload-image" />
            <text class="upload-text" v-if="avator === '/static/avator_defalut.png'">点击上传照片</text>
          </view>
        </view>

        
        <view class="uni-btn-v">
          <button
            form-type="submit"
            class="submit-btn"
            @click="uploadFile"
            :class="{ 'btn-active': isBtnActive }"
            @touchstart="isBtnActive = true"
            @touchend="isBtnActive = false"
          >
            提交
          </button>
        </view>
      </form>
    </view>
  </view>
</template>
<style scoped>

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  padding: 20px;
  box-sizing: border-box;
}


.page-header {
  text-align: center;
  margin-bottom: 30px;
}
.header-subtitle {
  font-size: 24px;
  color: #666;
  margin-top: 8px;
  display: block;
}


.form-container {
  width: 100%;
  max-width: 500px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}


.uni-form-item {
  margin-bottom: 20px;
}

.uni-form-item .title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}

.uni-input {
  width: 100%;
  height: 40px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.uni-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 8px rgba(64, 158, 255, 0.3);
  outline: none;
}


.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.upload-container:hover {
  border-color: #409eff;
  background-color: #e0f7fa;
}

.upload-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.upload-text {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}

/* 提交按钮 */
.submit-btn {
  background: linear-gradient(135deg, #409eff, #66b1ff); 
  width: 100%; 
  height: 50px; 
  line-height: 50px; 
  color: white;
  font-size: 16px; 
  font-weight: 500; 
  border: none; 
  border-radius: 8px; 
  box-shadow: 0 4px 6px rgba(64, 158, 255, 0.2); 
  cursor: pointer; 
  transition: all 0.3s ease; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
}

.submit-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.2); 
}

.submit-btn.btn-active {
  transform: scale(0.95); 
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.2); 
}
</style>
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
				url: '/pages/task_leader/task_leader' 
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
								url: '/pages/task_leader/task_leader' 
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
					count: 1, 
					sizeType: ['compressed'], 
					sourceType: ['album', 'camera'], 
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
