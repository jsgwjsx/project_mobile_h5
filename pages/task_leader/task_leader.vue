<template>
	<view class="container">
		<view class="tab-bar">
			<view class="tab" :class="{ active: currentTab === 0 }" @click="currentTab = 0">未完成</view>
			<view class="tab" :class="{ active: currentTab === 1 }" @click="currentTab = 1">已完成</view>
		</view>
		<swiper :current="currentTab" @change="onSwiperChange" class="lunbo">
			<swiper-item >
				<view class="task-list">
					<view v-for="task in unfinishedTasks" :key="task.id"  :class="task.avator?'task-box':'aleaderwork'">
						<view class="task_content"  >
							<view class="task-text">开始时间:{{ task.starttime }}</view>
							<view class="task-text">结束时间: {{ task.endtime }}</view>
							<view class="task-text">范围: {{task.center}}为中心{{task.radius}}m内的道路</view>
							<view class="task-text" v-if="task.license">车牌号:{{task.license}}</view>
							<view class="task-text" v-if="!task.license">组长电话:{{task.group_tel}}</view>
							<view class="task-text">状态: 未完成</view>
						</view>
						<view class="task_button">
							<button type="primary" size='mini' @click="settingWork(task.id,task.position,task.geom,task.radius)" class="startwork">开始工作</button>
							<button type="primary" size='mini' @click="submitWork(task.id,task.position,task.radius,task.avator)" v-if="ifsumbit"  class="submitwork">提交工作</button>
						</view>
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="task-list">
					<view v-for="task in finishedTasks" :key="task.id" class="task-box">
						<view class="task_content"  >
							<view class="task-text">开始时间:{{task.starttime}}</view>
							<view class="task-text">完成时间: {{ task.computedtime }}</view>
							<view class="task-text">范围: {{task.center}}为中心{{task.radius}}m内的道路</view>
							<view class="task-text">状态: 已完成</view>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import axios from 'axios';
	import * as turf from '@turf/turf';
	import {
		wgs84togcj02
	} from '../../utils/wgs842gcj02.js'
	import {
		calculateBoundingCircle
	} from '../../utils/mincircle.js'
import { onMounted } from "vue";
	export default {
		data() {
			return {
				currentTab: 0,
				unfinishedTasks: [],
				finishedTasks: [],
				ifsumbit:false
			};
		},
		async mounted() {
			uni.showLoading({
				title:'加载中...',
			})
			//清楚缓存
			uni.clearStorage()
			var avator = document.cookie
			var cookiearray = avator.split(';');
			var res = {};
			for (var i = 0; i < cookiearray.length; i++) {
				var name = cookiearray[i].split('=')[0];
				var value = cookiearray[i].split('=')[1];
				res[name] = value
			}
			var username = getCookie('username')
			//15643897210
			var data = await axios.post('/api/work/employeeInf', {
				username: username,
			}).then(res => {
				//组长与司机可以使用提交任务系统，组员不能自主提交
				if(res.data.identity=='0'){
					this.ifsumbit = true
				}
				if (res.data.isdriver) {
					//是司机，此时要根据username找对应的machine，然后去workmachine中查找对应的任务
					axios.post('/api/map/MachineWorkSearch', {
						username: username,
					}).then(res => {
						
						uni.setStorageSync('infoMachine', {
							license: res.data.license,
							accumulation: res.data.accumulation_id,
							types: res.data.types
						})
						this.ifsumbit = true
						this.processData(res.data.worklist,{license:res.data.license})
					})
				} else {
					//是员工，此时要根据groupid找对应的group，然后去work中查找对应的任务
					axios.post('/api/map/WorkSearch', {
						groupid:res.data.groupid,
					}).then(res => {
						uni.setStorageSync('infoGroup', {
							group_tel: res.data.group_leader_tele,
							accumulation:res.data.group_pos,
						})
						this.processData(res.data.worklist,{group_tel:res.data.group_leader_tele})
					})
					
				}
			})
		},
		methods: {
			submitWork(id,position,radius,avator){
				if(!avator){
					uni.showToast({
					    title: "该任务已经提交完成，不允许重复提交",
					    icon: "error",
					    duration: 2000
					});
					return
				}
				uni.showLoading({
					title:'获取位置中...',
				})
			 const	submittypes = uni.getStorageSync('infoMachine')
			 uni.getLocation({
			 	type: 'wgs84',
			 	success: function(res) {
			 		uni.hideLoading()
					if(submittypes&&submittypes.types=='运雪车'){
						var geolocation = wgs84togcj02(res.longitude, res.latitude)
						
						//运雪车要判断是否在堆雪区域
						var params = {
							center: position
						}
						axios.post('/api/map/nearsnowpos', params).then(res => {
							var processPolygon = res.data.geom.coordinates[0]
							var resData = []
							for(var i = 0 ;i<processPolygon.length;i++){
								var DataArr = []
								for(var j = 0;j<processPolygon[i].length;j++){
									DataArr.push(wgs84togcj02(processPolygon[i][j][0], processPolygon[i][j][1]))
								}
							}
							resData.push(DataArr)
							//定义一个点
							const point = turf.point(geolocation); // [经度, 纬度]
							// 定义一个多边形
							const polygon = turf.polygon(resData);
							// 判断点是否在多边形内部
							const isInside = turf.booleanPointInPolygon(point, polygon);
							if(isInside){
								//进入提交任务界面
								uni.navigateTo({
									url:`/pages/work_submit/worksubmit?id=${id}`, // 这里填写目标页面的路径
								});
							}else{
								//警告
								uni.showToast({
								    title: "不在积雪区域范围内，不允许提交",
								    icon: "error",
								    duration: 2000
								});
								return
							}
						})
					}else{
						//组长与铲雪车要判断是否在工作地点的最小圆半径中
						var geolocation = wgs84togcj02(res.longitude, res.latitude)
						var worklocation = wgs84togcj02(position[0], position[1])
						const point1 = turf.point(geolocation); // [经度, 纬度]
						const point2 = turf.point(worklocation); // [经度, 纬度]
						const distanceInMeters = turf.distance(point1, point2, { units: 'meters' });
						console.log(distanceInMeters,radius)
						if(distanceInMeters>parseInt(radius)){
							//进入提交任务界面
							uni.navigateTo({
								url:`/pages/work_submit/worksubmit?id=${id}`, // 这里填写目标页面的路径
						
							});
						}else{
							//警告
							uni.showToast({
							    title: "不在工作范围内，不允许提交",
							    icon: "error",
							    duration: 2000
							});
							return
						}
					}
			
			 	},
			 	error: function(error) {
			 		console.log(error)
			 	}
			 });
		},
			async processData(data,params) {
				console.log(data)
				var computedArr = []
				var uncomputedArr = []
				//处理时间
				data.map(item => {
					if (item.iscomputed) {
						//已经完成的任务
						computedArr.push(item)
					} else {
						//没有完成的任务
						uncomputedArr.push(item)
					}
				})
				for (var i = 0; i < uncomputedArr.length; i++) {
					uncomputedArr[i].endtime = processtime(uncomputedArr[i].endtime * 1000)
					uncomputedArr[i].starttime = processtime(uncomputedArr[i].starttime * 1000)
					
					if(uncomputedArr[i].avator){
						uncomputedArr[i].avator = false
					}else{
						uncomputedArr[i].avator = true
					}
					if (uncomputedArr[i].data.features[0]) {
						await processcenter(uncomputedArr[i].data).then(res => {
							uncomputedArr[i].center = res.data.regeocode.formatted_address
						});
						uncomputedArr[i].position = processposition(uncomputedArr[i].data)
					} else {
						uncomputedArr[i].center = '没有设置清扫区域'
					}
					uncomputedArr[i].id = uncomputedArr[i].workid
					uncomputedArr[i].radius = calculateBoundingCircle(uncomputedArr[i].data1).radius.toFixed(0)
					uncomputedArr[i].geom = uncomputedArr[i].data
						
					params.license?uncomputedArr[i].license = params.license:uncomputedArr[i].group_tel = params.group_tel
					
				}
				this.unfinishedTasks = uncomputedArr
				for (var i = 0; i < computedArr.length; i++) {
					computedArr[i].computedtime = processtime(computedArr[i].computedtime * 1000)
					computedArr[i].starttime = processtime(computedArr[i].starttime * 1000)
					if (computedArr[i].data.features[0]) {
						await processcenter(computedArr[i].data).then(res => {
							computedArr[i].center = res.data.regeocode.formatted_address
						});
						computedArr[i].position = processposition(computedArr[i].data)
					} else {
						computedArr[i].center = '没有设置清扫区域'
					}
					computedArr[i].avator = computedArr[i].avator
					computedArr[i].id = computedArr[i].workid
					computedArr[i].radius = calculateBoundingCircle(computedArr[i].data1).radius.toFixed(0)
				}

				this.finishedTasks = computedArr
				uni.hideLoading()
			},
			onSwiperChange(e) {
				this.currentTab = e.detail.current;
			},
			settingWork(workid, position,geom,radius) {
				uni.setStorageSync('workpos', {
					position: position,
					workid: workid,
					geom : geom,
					radius:radius,
				})
				uni.switchTab({
					url: "/pages/log/log" // 这里填写目标页面的路径
				});
			},
		},
	};

	function processposition(geojson) {
		console.log(geojson)
		var center = turf.center(geojson).geometry.coordinates
		return center
	}
	async function processcenter(geojson) {
		var center = turf.center(geojson).geometry.coordinates
		var res = wgs84togcj02(center[0], center[1])
		var params = {
			key: '275ccc01069ccdb142f46282d65100c3',
			location: `${res[0]},${res[1]}`
		}

		var address = await axios.post(`/api/map/geoencode`, params)
		return address
	}

	function processtime(timestamp) {
		const date = new Date(timestamp);
		// 转换为本地时间字符串
		const localTimeString = date.toLocaleString();
		return localTimeString
	}

	function getCookie(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	}

	function setCookie(c_name, value, expiredays) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie = c_name + "=" + value + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
	}
</script>

<style>
	.submitwork{
		background-color:darkorange;
		width: 130px;
		font-weight: bold;
	/* 	position: relative;
		top: 10px; */
	}
	.startwork{
		width: 130px;
		background-color:rgb(72, 86, 104,1) ;
		font-weight: bold;
	}
	.aleaderwork{
		background-color:rgb(72, 86, 104,0.1);
		margin: 20px;
		margin-bottom: 10px;
		padding: 15px;
		border: 1px solid rgb(72, 86, 104,0.3);
		border-radius: 5px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		width:calc(100% - 60px);
		height: 100%;
	}
	.task_button>button {
		color: white;
		
	}

	.lunbo {
		height: 8000rpx;
	}

	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.tab-bar {
		display: flex;
		justify-content: space-around;
		background-color: #f8f8f8;
	}

	.tab {
		flex: 1;
		text-align: center;
		padding: 10px 0;
		cursor: pointer;
	}

	.tab.active {
		color: #007aff;
		border-bottom: 2px solid #007aff;
	}

	.task-list {
		padding: 10px;
	}

	.task-box {
		background-color:#fff;
		margin: 20px;
		margin-bottom: 10px;
		padding: 15px;
		border: 1px solid rgb(72, 86, 104,1);
		border-radius: 5px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		width:calc(100% - 60px);
		height: 100%;
	}

	.task_content {
		flex: 4;
	}

	.task_button {
		flex: 2;
		display: flex;
		
		justify-content: center;
		
	}

	.task-text {
		margin-bottom: 5px;
	}
</style>