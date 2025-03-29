<!-- <template>
	<view class="lunbo">
		<view class="application_container">
			<form>
				<view class="uni-form-item uni-column">
					<view class="title">意见:</view>
					<textarea
					      class="refund-reason"
					      placeholder="请填写您的意见"
					      maxlength="200"
					      auto-height
						@input="handleInput"
					    ></textarea>
				</view>

				<view class="uni-btn-v">
					<button form-type="submit"
						style="background-color:#409eff; width: 80vw; height: 50px;line-height: 50px; color: white;font-size: 24px; font-weight: 500;"
						v-on:click="uploadFile">提交</button>

				</view>
			</form>
		</view>
	</view>
</template> -->
<template>
  <view class="page-container">
   
    <view class="page-header">
  
      <text class="header-subtitle">您的意见对我们非常重要</text>
    </view>

    <view class="form-container">
      <form>
        <view class="uni-form-item">
          <textarea
            class="refund-reason"
            placeholder="请填写您的意见"
            maxlength="200"
            auto-height
            @input="handleInput"
          ></textarea>
        </view>

        <!-- 提交按钮 -->
        <view class="uni-btn-v">
          <button
            form-type="submit"
            class="submit-btn"
            v-on:click="uploadFile"
          >
            <text class="btn-text">提交</text>
          </button>
        </view>
      </form>
    </view>
    <view class="page-footer">
      <text class="footer-text">感谢您的支持！</text>
    </view>
  </view>
</template>
<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				advice_content:''
			}
		},

		onBackPress(e) {
			uni.switchTab({
				url: '/pages/task_leader/task_leader' // 这里填写目标页面的路径
			});
		},
		methods: {
			uploadFile() {
				var id = getCookie('id')
				if(!this.advice_content){
					uni.showToast({
					    title: "意见内容不能为空",
					    icon: "error",
					    duration: 2000
					});
					return 
				}
				axios.post('/api/work/addcomment',{
					id:id,
					content:this.advice_content
				}).then(res=>{
					if (res.data == 'ok') {
						uni.switchTab({
							url: '/pages/account/account' // 这里填写目标页面的路径
						});
					}
				})
			},
			handleInput(event){
				this.advice_content = event.detail.value
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
</script>

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

/* 顶部标题 */
.page-header {
  text-align: center;
  margin-bottom: 20px;
  width: 100%; 
}



.header-subtitle {
  font-size: 24px;
  color: #666;
  margin-top: 8px;
  display: block;
}

/* 表单容器 */
.form-container {
  width: 100%; /* 表单宽度占满父容器 */
  max-width: 500px; /* 限制最大宽度 */
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  box-sizing: border-box; /* 防止 padding 影响宽度 */
}

/* 输入框 */
.uni-form-item {
  margin-bottom: 20px;
}

.refund-reason {
  width: 100%; /* 输入框宽度占满父容器 */
  min-height: 150px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  resize: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box; /* 防止 padding 影响宽度 */
}

.refund-reason:focus {
  border-color: #409eff;
  box-shadow: 0 0 8px rgba(64, 158, 255, 0.3);
  outline: none;
}

.refund-reason::placeholder {
  color: #999;
}

/* 提交按钮 */
.submit-btn {
  background: linear-gradient(135deg, #409eff, #66b1ff);
  width: 100%; /* 按钮宽度占满父容器 */
  height: 50px;
  line-height: 50px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(64, 158, 255, 0.2);
  transition: background 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box; /* 防止 padding 影响宽度 */
}

.submit-btn:hover {
  background: linear-gradient(135deg, #66b1ff, #409eff);
  transform: translateY(-2px);
}

.submit-btn:active {
  transform: translateY(0);
}

.btn-text {
  margin-left: 8px;
}

/* 底部装饰 */
.page-footer {
  margin-top: 20px;
  text-align: center;
  width: 100%; /* 底部宽度占满父容器 */
}

.footer-text {
  font-size: 12px;
  color: #666;
}
</style>