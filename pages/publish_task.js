//本页面由uniapp切片工具生成，uni-app切片-可视化设计工具(一套代码编译到7个平台iOS、Android、H5、小程序)，软件下载地址：http://www.ymznkf.com/new_view_669.htm
import app from ""


	// 定义全局参数,控制数据加载
	var _self, page = 1,timer = null;

	export default {
		data() {
			return {
				loadingText: '',
				animation: '',
				animationData: {},
				type:'',//多选框选中值
				publish_task_17:false,//多选框选中值
				publish_task_20:false,//多选框选中值
				publish_task_23:false,//多选框选中值
				publish_task_26:false,//多选框选中值
				publish_task_30:false,//多选框选中值
				publish_task_33:false,//多选框选中值
				publish_task_36:false,//多选框选中值
				publish_task_39:false,//多选框选中值
				publish_task_43:false,//多选框选中值
				publish_task_46:false,//多选框选中值
				publish_task_49:false,//多选框选中值
				publish_task_52:false,//多选框选中值
				device:'',//多选框选中值
				publish_task_59:false,//多选框选中值
				publish_task_62:false,//多选框选中值
				publish_task_65:false,//多选框选中值
				name:'',//项目名称
				subject:'',//项目名称+核心要求
				content:'',//请填写任务说明
				getTime:'',//接单时间
				AuthorTime:'',//审核时间
				percent:'',//单选框选中值
			
 
				page:0,//当前分页页码
				apiUrl:'https://www.ymznkf.com/wx_server',//后端接口地址
				id:'',//传值使用,方便存在本地的locakStorage  
				del_id:''//方便存在本地的locakStorage  
			}
		},
		components:{

		},
		onLoad(options) {
			_self = this;
			
			//检查是否登录参考代码,需要用的时候，可以把注释取掉
			//if(this.checkLogin()==false){
			//	return;
			//}
			
			//this.getLaction();//得到gps

			this.page=0;

			//检测有没有传入id参数
			if (options.id != null && options.id !=""){
				this.id=options.id;
			}  
			
			// 初始化一个动画
			var animation = uni.createAnimation({
				transformOrigin: "50% 0 50%",
				duration: 1000, //动画持续1秒
				timingFunction: 'linear', //linear 全程匀速运动
				delay: 200 //延迟两秒执行动画
			})
			this.animation = animation;
			this.scaleAndScale();

			//执行初始化,需要用的时候，可以把注释取掉
			//this.Refresh("init");

		},
		onShow() {
			console.log("on show");
			//if(this.checkLogin()==false){
			//	return;
			//}

			//执行初始化,需要用的时候，可以把注释取掉
			//this.Refresh("init");
		},
		onPullDownRefresh: function() {
			//下拉刷新的时候请求一次数据
			this.Refresh();
		},
		methods: {
			// 定义动画内容
			scaleAndScale() {
				// 定义动画内容
				this.animation.opacity(0, 1).step() //先放大1,2倍
				this.animation.opacity(1, 0).step() //缩小至原来的大小
				// 导出动画数据传递给data层
				this.animationData = this.animation.export(); //每次执行导出动画时 会覆盖之前的动画
			},
			noscaleAndScale() {
				this.animation.scale(1, 1).step()
				this.animationData = this.animation.export()
			},
			/**
			* publish_task_9_9处理函数
			* 数据绑定  data-index="{{index}}" 
			* 数据取值  var index = e.currentTarget.dataset.index; var cata = this.list_cata_list[index];
			*/
			publish_task_9_9_click:function(event){
			  if(this.type==''){
			      uni.showToast({title: '不能为空！',icon: 'none',duration: 2000});
			     return; 
			  }
			  if(this.device==''){
			      uni.showToast({title: '不能为空！',icon: 'none',duration: 2000});
			     return; 
			  }
			  if(this.name==''){
			      uni.showToast({title: '项目名称不能为空！',icon: 'none',duration: 2000});
			     return; 
			  }
			  if(this.subject==''){
			      uni.showToast({title: '项目名称+核心要求不能为空！',icon: 'none',duration: 2000});
			     return; 
			  }
			  if(this.content==''){
			      uni.showToast({title: '请填写任务说明不能为空！',icon: 'none',duration: 2000});
			     return; 
			  }
			  if(this.getTime==''){
			      uni.showToast({title: '接单时间不能为空！',icon: 'none',duration: 2000});
			     return; 
			  }
			  if(this.AuthorTime==''){
			      uni.showToast({title: '审核时间不能为空！',icon: 'none',duration: 2000});
			     return; 
			  }
			  if(this.percent==''){
			      uni.showToast({title: '不能为空！',icon: 'none',duration: 2000});
			     return; 
			  }
			
			},
			
			/**
			* publish_task_10_10处理函数
			* 数据绑定  data-index="{{index}}" 
			* 数据取值  var index = e.currentTarget.dataset.index; var cata = this.list_cata_list[index];
			*/
			publish_task_10_10_click:function(event){
			
			},
			
			/**
			* publish_task_14_14处理函数
			* 数据绑定  data-index="{{index}}" 
			* 数据取值  var index = e.currentTarget.dataset.index; var cata = this.list_cata_list[index];
			*/
			publish_task_14_14_click:function(event){
			
			},
			
			/**
			* checkbox-group处理函数
			*/
			type_change:function(event){
			    console.log(event.target.value);
			    this.type=event.target.value;
			},
			
			/**
			* checkbox-group处理函数
			*/
			device_change:function(event){
			    console.log(event.target.value);
			    this.device=event.target.value;
			},
			
			/**
			* input处理函数
			*/
			name_input:function(event){
			    this.name=event.target.value;
			    console.log(event.target.value);
			},
			
			/**
			* publish_task_70_70处理函数
			* 数据绑定  data-index="{{index}}" 
			* 数据取值  var index = e.currentTarget.dataset.index; var cata = this.list_cata_list[index];
			*/
			publish_task_70_70_click:function(event){
			
			},
			
			/**
			* input处理函数
			*/
			subject_input:function(event){
			    this.subject=event.target.value;
			    console.log(event.target.value);
			},
			
			/**
			* input处理函数
			*/
			content_input:function(event){
			    this.content=event.target.value;
			    console.log(event.target.value);
			},
			
			/**
			* input处理函数
			*/
			getTime_input:function(event){
			    this.getTime=event.target.value;
			    console.log(event.target.value);
			},
			
			/**
			* publish_task_81_81处理函数
			* 数据绑定  data-index="{{index}}" 
			* 数据取值  var index = e.currentTarget.dataset.index; var cata = this.list_cata_list[index];
			*/
			publish_task_81_81_click:function(event){
			
			},
			
			/**
			* input处理函数
			*/
			AuthorTime_input:function(event){
			    this.AuthorTime=event.target.value;
			    console.log(event.target.value);
			},
			
			/**
			* publish_task_85_85处理函数
			* 数据绑定  data-index="{{index}}" 
			* 数据取值  var index = e.currentTarget.dataset.index; var cata = this.list_cata_list[index];
			*/
			publish_task_85_85_click:function(event){
			
			},
			
			/**
			* radio处理函数
			*/
			percent_change:function(event){
			    console.log(event.target.value);
			    this.percent=event.target.value;
			},
			
			

			//刷新数据
			Refresh:function(_action) {
			
				uni.showLoading();
				
				//提交到服务器
				var that = this
				var url=that.apiUrl+'{server_code_file_path}';
				console.log(url);
				uni.request({
				url: url,//后端接口地址，需要改成自己的接口地址
				data: {
					action: _action,//上传动作，如按钮点击会产生click动作，分页也会产生，在后端根据具体的动作来判断事件
					uid: that.getUid(),//上传用户id,在登录中获得
					//上传页面中的变量
					//定义变量---start
					name: that.name,
subject: that.subject,
content: that.content,
getTime: that.getTime,
AuthorTime: that.AuthorTime,
percent: that.percent,

					//定义变量---end
					id: that.id,//上传id值，后端可以根据此值来操作当前id
					del_id: that.del_id,//在列表中删除按钮选中时，上传到有后端，进行删除操作
					page:that.page
				},
				method: 'GET',
				success: function (res) {//后端返回数据

					// 隐藏导航栏加载框  
					uni.hideNavigationBarLoading();
					// 停止下拉动作  
					uni.stopPullDownRefresh();  

					// 隐藏加载框  
					uni.hideLoading();  

					var tmp = res.data;

					//初始化，对页面上的控件进行赋值操作
					if(_action=="init"){
		that.percent_array= tmp.percent_array;

					}



					that.name=tmp.name;
					that.subject=tmp.subject;
					that.content=tmp.content;
					that.getTime=tmp.getTime;
					that.AuthorTime=tmp.AuthorTime;
					


					//如果后端有返回消息，则弹出消息提示
					if (tmp.message != null && tmp.message != "") {
						uni.showToast({
						title: tmp.message,
						icon: 'none',
						duration: 2000
						})
					}



					//如果后端有返回页码，则更改当前页码
					if(tmp.page!=null && tmp.page!=""){
						page=tmp.page;
					}					

				},
				fail: function (res) {
					uni.showToast({
						title: "服务器访问失败",
						icon: 'none',
						duration: 2000
					})
					console.log(res.data);
					console.log('is failed')
				}
				})
			},
		}
	}
