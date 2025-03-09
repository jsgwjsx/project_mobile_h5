<<template>
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

	.refund-reason {
	  margin: 10px;
	  width: 85%;
	  height:100px;
	  padding: 10px;
	  border: 1px solid #ccc;
	  border-radius: 5px;
	  font-size: 14px;
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