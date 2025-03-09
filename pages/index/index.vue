<template>
	<view>
		
		
		<image src="../../static/snow.jpg" mode="" class="images"></image>	
	
		<view class="out">
			<view class="row">
				<input type="text" class="border"  placeholder="请输入账号" v-model="message.username">
			</view>
			<view class="row" >
				<input type="password" class="border" placeholder="请输入密码" v-model="message.password">
			</view>
			
		</view >
			
		<view class="buttonregister">
			<button size="mini" type="primary" @click="register">注册</button>
		</view>
      <view class="buttonlog">
			<button size="mini" type="primary" @click="login" >登录</button>
		</view>
		
	</view>
</template>

<script>
import axios from 'axios';
	export default {
		data() {
			return {
				title:"asd",
				message:{
					username:"",
					password:'',
				}
			}
		},
		methods: {
			login(){
	
					    if (!this.message.username) {
					        uni.showToast({
					            title: "账号不能为空！",
					            icon: "none",
					            duration: 2000
					        });
					        return;
					    }
					    if (!this.message.password) {
					        uni.showToast({
					            title: "密码不能为空！",
					            icon: "none",
					            duration: 2000
					        });
					        return;
					    }
					axios.post('/api/work/employeeReg',{
						username:this.message.username,
						password:this.message.password
					}).then(res=>{
						if(res.data.code){
							console.log(res.data)
							//存储名称与图片路径
							this.setCookie('name',res.data.name,1)
							this.setCookie('images',res.data.images,1)
							this.setCookie('username',res.data.username,1)
							this.setCookie('id',res.data.gid,1)
							uni.switchTab({
								url: "/pages/log/log"
							})	
						}else{
							uni.showToast({
							    title: "用户名或密码错误",
							    icon: "error",
							    duration: 2000
							});
						}
					})
				       
				},
				setCookie(c_name,value,expiredays){
						    var exdate = new Date();
						    exdate.setDate(exdate.getDate() + expiredays);
						    document.cookie = c_name + "=" + value +  ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
				},
				onsubmit(){
					console.log(this.message)
				},
				onclick(){
					this.title=Math.random()
				},
				comeBack(){
					uni.navigateBack()
				},
			
	register() {
			    uni.showToast({
			        title: "正在加载",
			        icon: "loading",
			        mask: true,
			    });
			    setTimeout(() => {
			        uni.navigateTo({
			            url: "/pages/register/register"
			        });
			    }, 500);
				
			},
			onsubmit(){
				console.log(this.message)
			},
			onclick(){
				this.title=Math.random()
			},
			comeBack(){
				uni.navigateBack()
			}
			
		}
	}
</script>

<style lang="scss">
.images{
	width: 100%;
	
}
input{
	border: 10px solid #485668;
	width: 80%;
	height: 50px;
	
}
.out{
	width: 100%;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	.row{
		margin-bottom: 10px;
		border: 1px solid #485668;
		width: 80%;
		border-radius: 10px;
		position: relative;
		top: 20px;
		
	}
	.border{
	 border: none;
	 border-radius: 10px;
	 width: 100%;
	 min-height: 60rpx;
	 padding: 0 20rpx;
	 box-sizing:border-box;
}
}
.log_pic {
    display: flex;
    justify-content: center;
    align-items: center;
	width: 100%;
	
}
.log_pic img{
	width: 100%;
}
view{
	width: 100%;
}
.buttonlog, .buttonregister {
    display: flex;
    justify-content: center;
    margin-top: 20px;
	
}

button {
    width: 80%;
    padding: 10px 0;
    font-size: 18px;
    border-radius: 10px;
	background-color: #485668 ;
	font-weight: bold;
	position: relative;
	top: 20px;
}
</style>