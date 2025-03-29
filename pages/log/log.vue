<template>
	<div style="width: 100%; height:100%;">
		<view v-on:click="ifgeoposition" class="TrackingButton">
			<svg t="1738989807605" style="position: relative;top: 2px;" class="icon" viewBox="0 0 1024 1024"
				version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4196" width="20" height="20">
				<path
					d="M469.333333 850.688A341.504 341.504 0 0 1 173.312 554.666667H106.666667a21.333333 21.333333 0 0 1-21.333334-21.333334v-42.666666a21.333333 21.333333 0 0 1 21.333334-21.333334h66.645333A341.504 341.504 0 0 1 469.333333 173.312V106.666667a21.333333 21.333333 0 0 1 21.333334-21.333334h42.666666a21.333333 21.333333 0 0 1 21.333334 21.333334v66.645333A341.504 341.504 0 0 1 850.688 469.333333H917.333333a21.333333 21.333333 0 0 1 21.333334 21.333334v42.666666a21.333333 21.333333 0 0 1-21.333334 21.333334h-66.645333A341.504 341.504 0 0 1 554.666667 850.688V917.333333a21.333333 21.333333 0 0 1-21.333334 21.333334h-42.666666a21.333333 21.333333 0 0 1-21.333334-21.333334v-66.645333zM512 768a256 256 0 1 0 0-512 256 256 0 0 0 0 512z m0-128a128 128 0 1 1 0-256 128 128 0 0 1 0 256z"
					:fill="Tracking?'#00aaaa':'#444444'" p-id="4197"></path>
			</svg>
		</view>
		<div id="mapContainer" style="width: 100%; height:100%;position: absolute;"></div>
	</div>

</template>


<script>
	import AMapLoader from '@amap/amap-jsapi-loader'
	import {
		wgs84togcj02
	} from '../../utils/wgs842gcj02.js'
	import axios from 'axios';
	import * as turf from '@turf/turf';
	import gcoord from 'gcoord';
	//配置安全密钥
	window._AMapSecurityConfig = {
		securityJsCode: '8d3368de5033627721c906279b70faf6',
	}

	var map;
	var workmarker //任务坐标点
	var posmarker //自己坐标点
	var intervalpos //定位定时器
	var accumulationmarker //聚集点标点
	var snowareamarker //积雪去区域标点

	var driving
	var endMarker;
	//工作范围
	var workRange;
	//工作路线
	var workRoute;
	//清雪区域
	var snowarea;
	//socket连接
	var socket
	export default {
		data() {
			return {
				map: null,
				Tracking: false,
				startpos: [],
				endpos: [],
				radius: '',
				targetdestinction: '',
				hasgeojsonlayer: false

			}
		},
		onShow() {
			var re = this
			var workpos = uni.getStorageSync('workpos')
			if (workpos && map) {
				var lnglat = wgs84togcj02(workpos.position[0], workpos.position[1])
				workRange = new AMap.Circle({
					center: new AMap.LngLat(lnglat[0], lnglat[1]), // 中心点
					radius: workpos.radius, // 半径
					strokeColor: "#ffffff", // 边框颜色
					strokeOpacity: 0.5, // 边框透明度
					strokeWeight: 2, // 边框宽度
					fillColor: "#1791fc", // 填充颜色
					fillOpacity: 0.35, // 填充透明度
				});
				this.radius = workpos.radius
				map.add(workRange)
				map.setCenter(lnglat, true)
				workmarker = new AMap.Marker({
					position: lnglat,
					icon: new AMap.Icon({
					    image: '/static/深蓝色起点.png',
					    size: new AMap.Size(40, 40),
					    imageSize: new AMap.Size(40, 40),
					   
					  }),
					  autoCenter: true, 
					  
                   offset: new AMap.Pixel(-20, -32),
					// icon: '/static/深蓝色起点.png',
					label: {
						direction: 'top',
						offset: new AMap.Pixel(0, 0), //设置文本标注偏移量
						content: "<div class='info'>工作地点</div>",
					}
				});
				endMarker = workmarker
				
				
				
				// var marker = new AMap.Marker({
				//     position: new AMap.LngLat(113.8,22.5),   
				//     offset: new AMap.Pixel(-25, -50),
				//     icon: icon,
				// });
				workmarker.on('click', function() {
					if (re.Tracking) {
						re.drivingRoute()
					} else {
						uni.showToast({
							title: "请先开启定位",
							icon: "error",
							duration: 2000
						});
						return
					}
					re.targetdestinction = '工作地点'
					endMarker.setIcon(new AMap.Icon({
						size: new AMap.Size(36, 36),
						image: '/static/酒红色起点.png',
						imageSize: new AMap.Size(36, 36),
						//imageOffset: new AMap.Pixel(-90, -3)
					}))
					workmarker.setIcon(new AMap.Icon({
						size: new AMap.Size(36, 36),
						image: '/static/终点.png',
						imageSize: new AMap.Size(36, 36),
					}))
					endMarker = workmarker
					re.endpos = [workmarker.getPosition().lng, workmarker.getPosition().lat]


				});
				map.add(workmarker);
				workmarker.setTitle('工作地点');
				var infoMachine = uni.getStorageSync('infoMachine')
				if (infoMachine && map) {
					axios.post('/api/map/accumulationpos', {
						id: infoMachine.accumulation
					}).then(res => {
						var lnglat = wgs84togcj02(res.data.coordinates[0], res.data.coordinates[1])
						// accumulationmarker = new AMap.Marker({
						// 	position: lnglat,
						// 	label: {
						// 		image: '/static/终点-y.png',
						// 		// icon: new AMap.Icon({
						// 		// image: '/static/聚雪区.png', 
						// 		//   size: new AMap.Size(40, 40),
						// 		//   imageSize: new AMap.Size(40, 40),
						// 		// }),
						// 		direction: 'top',
						// 		offset: new AMap.Pixel(0, 0), //设置文本标注偏移量
						// 		content: "<div class='info'>聚集点</div>",
						// 	}
						// });
						accumulationmarker = new AMap.Marker({
								position: lnglat,
								icon: new AMap.Icon({
								    image: '/static/酒红色起点.png', 
								    size: new AMap.Size(40, 40), 
								    imageSize: new AMap.Size(40, 40), 
								  }),
								label: {
									direction: 'top',
									offset: new AMap.Pixel(0, 0), //设置文本标注偏移量
									content: "<div class='info'>聚集点</div>",
								}
							});
						map.add(accumulationmarker);
						accumulationmarker.on('click', function() {
							if (re.Tracking) {
								re.drivingRoute()
							} else {
								uni.showToast({
									title: "请先开启定位",
									icon: "error",
									duration: 2000
								});
								return
							}
							re.targetdestinction = '聚集地'
							endMarker.setIcon(new AMap.Icon({
								size: new AMap.Size(36, 36),
								image: '/static/深蓝色起点.png',
								imageSize: new AMap.Size(36, 36),
								//imageOffset: new AMap.Pixel(-90, -3)
							}))
							accumulationmarker.setIcon(new AMap.Icon({
								size: new AMap.Size(36, 36),
								image: '/static/终点.png',
								imageSize: new AMap.Size(36, 36),
								//imageOffset: new AMap.Pixel(-90, -3)
							}))
							endMarker = accumulationmarker
							re.endpos = [accumulationmarker.getPosition().lng, accumulationmarker
								.getPosition().lat
							]
						});
						accumulationmarker.setTitle('聚集地');
					})
					if (infoMachine.types == '运雪车') {
						//运雪车就需要 ， workMaker，聚集点，最近的清雪区域
						var params = {
							center: workpos.position
						}
						axios.post('/api/map/nearsnowpos', params).then(res => {
							console.log(res.data.geom)

							var processPolygon = res.data.geom.coordinates[0]
							var resData = []
							for (var i = 0; i < processPolygon.length; i++) {
								var DataArr = []
								for (var j = 0; j < processPolygon[i].length; j++) {
									DataArr.push(wgs84togcj02(processPolygon[i][j][0], processPolygon[i][j][1]))
								}
							}
							resData.push(DataArr)
							console.log(resData)
							snowarea = new AMap.Polygon({
								path: DataArr, //路径
								strokeColor: 'white',
								strokeWeight: 2,
								strokeOpacity: 0.5,
								fillColor: '#4288e2',
								fillOpacity: 0.8,
							});
							map.add(snowarea)
							var poscenter = processposition(res.data.geom)
							var lnglat = wgs84togcj02(poscenter[0], poscenter[1])
							snowareamarker = new AMap.Marker({
								position: lnglat,
								icon: new AMap.Icon({
								    image: '/static/积雪区起点.png', 
								    size: new AMap.Size(40, 40), 
								    imageSize: new AMap.Size(40, 40), 
								  }),
								label: {
									direction: 'top',
									offset: new AMap.Pixel(0, 0), //设置文本标注偏移量
									content: "<div class='info'>积雪区域</div>",
								}
							});
							map.add(snowareamarker);
							snowareamarker.on('click', function() {
								if (re.Tracking) {
									re.drivingRoute()
								} else {
									uni.showToast({
										title: "请先开启定位",
										icon: "error",
										duration: 2000
									});
									return
								}
								re.targetdestinction = '积雪区域'
								endMarker.setIcon(new AMap.Icon({
									size: new AMap.Size(36, 36),
									image: '/static/积雪区起点.png',
									imageSize: new AMap.Size(36, 36),
								}))
								snowareamarker.setIcon(new AMap.Icon({
									size: new AMap.Size(36, 36),
									image: '/static/终点.png',
									imageSize: new AMap.Size(36, 36),
								}))
								endMarker = snowareamarker
								re.endpos = [snowareamarker.getPosition().lng, snowareamarker.getPosition()
									.lat
								]
							});
							snowareamarker.setTitle('积雪区域');

						})
					}
				}
			}
			var grouppos = uni.getStorageSync('infoGroup')
			if (grouppos && map) {
				var lnglat = wgs84togcj02(grouppos.accumulation.coordinates[0], grouppos.accumulation.coordinates[1])
				map.setCenter(lnglat, true)
				accumulationmarker = new AMap.Marker({
					position: lnglat,
					icon: new AMap.Icon({
					    image: '/static/酒红色起点.png', 
					    size: new AMap.Size(40, 40), 
					    imageSize: new AMap.Size(40, 40), 
					  }),
					label: {
						direction: 'top',
						offset: new AMap.Pixel(0, 0), //设置文本标注偏移量
						content: `<div class='info'>聚集地</div>`,
					}
				});
				// 为 Marker 设置点击事件
				accumulationmarker.on('click', function() {
					if (re.Tracking) {
						re.drivingRoute()
					} else {
						uni.showToast({
							title: "请先开启定位",
							icon: "error",
							duration: 2000
						});
						return
					}
					re.targetdestinction = '聚集地'
					endMarker.setIcon(new AMap.Icon({
						size: new AMap.Size(36, 36),
						image: '/static/深蓝色起点.png',
						imageSize: new AMap.Size(36, 36),
						//imageOffset: new AMap.Pixel(-90, -3)
					}))
					accumulationmarker.setIcon(new AMap.Icon({
						size: new AMap.Size(36, 36),
						image: '/static/终点.png',
						imageSize: new AMap.Size(36, 36),
					}))
					endMarker = accumulationmarker
					re.endpos = [accumulationmarker.getPosition().lng, accumulationmarker.getPosition().lat]

				});
				map.add(accumulationmarker);
				accumulationmarker.setTitle('聚集地');
			}
		},
		onLoad() {
			this.initMap();
		},
		onHide() {
			workmarker ? map.remove(workmarker) : ''
			snowareamarker ? map.remove(snowareamarker) : ''
			accumulationmarker ? map.remove(accumulationmarker) : ''
			posmarker && !this.Tracking ? map.remove(posmarker) : ''
			workRange ? map.remove(workRange) : ''
			this.targetdestinction = ''
		},
		methods: {
			ControlLayer(lnglat) {
				const point1 = turf.point(lnglat);
				const point2 = turf.point([this.endpos[0], this.endpos[1]]);
				const distanceInMeters = turf.distance(point1, point2, {
					units: 'meters'
				});
				if (this.targetdestinction == '工作地点') {
					if (distanceInMeters >= this.radius) {
						if (!hasSpecificCircle(map, workRange)) {
							map.add(workRange)
						}
						if (this.hasgeojsonlayer) {
							map.remove(workRoute)
							this.hasgeojsonlayer = false
						}
						return
					}

					var geomData = uni.getStorageSync('workpos').geom
					geomData.features.map(features => {
						features.geometry = gcoord.transform(
							features.geometry, // 原始geometry
							gcoord.WGS84, // 原始坐标系
							gcoord.GCJ02 // 目标坐标系
						);
						return features
					})
					// 过滤500米范围内的数据
					const filteredFeatures = filterFeaturesByDistance(geomData.features, lnglat, 500);
					// 创建新的GeoJSON数据
					const filteredGeoJson = {
						...geomData,
						features: filteredFeatures,
					};
					console.log(this.hasgeojsonlayer)
					var re = this
					//是否有范围或者没有geojsonlayer
					if (hasSpecificCircle(map, workRange) || !this.hasgeojsonlayer) {
						if (hasSpecificCircle(map, workRange)) {
							map.remove(workRange)
						}
						AMapLoader.load({
							key: '	60cadebb9484029330544d1d414a4e9a', // 你的高德地图Key
							version: '2.0', // SDK版本
							plugins: ['AMap.GeoJSON', 'AMap.Layer'] // 需要使用的插件
						}).then((AMap) => {
							workRoute = new AMap.GeoJSON({
								geoJSON: filteredGeoJson,
								getPolyline: (feature, path) => {
									// 自定义道路样式
									return new AMap.Polyline({
										path: path, // 路径
										strokeColor: "#3366FF", // 道路颜色
										strokeWeight: 4, // 道路宽度
										strokeOpacity: 0.8, // 透明度
									});
								},
							})
							map.add(workRoute)
							re.hasgeojsonlayer = true
						})
					} else {
						workRoute.importData(filteredGeoJson)
					}
				} else {
					if (!hasSpecificCircle(map, workRange)) {
						map.add(workRange)
					}
					if (this.hasgeojsonlayer) {
						map.remove(workRoute)
						this.hasgeojsonlayer = false
					}
					return
				}


			},
			drivingRoute() {
				if (!this.Tracking || !this.endpos) return
				if (driving) {
					planRoute(this.startpos, this.endpos);
				} else {
					var re = this
					console.log(111)
					AMapLoader.load({
						key: '	60cadebb9484029330544d1d414a4e9a', // 你的高德地图Key
						version: '2.0', // SDK版本
						plugins: ['AMap.Geolocation'] // 需要使用的插件
					}).then((AMap) => {
						AMap.plugin("AMap.Driving", function() {
							driving = new AMap.Driving({
								policy: 0, //驾车路线规划策略，0是速度优先的策略
								map: map,
								hideMarkers: true,
								isOutline: false,
								autoFitView: false
							});
							planRoute(re.startpos, re.endpos);

						});
					})
				}

			},
			ifgeoposition() {
				var infoMachine = uni.getStorageSync('infoMachine')
				var avator = document.cookie
				var cookiearray = avator.split(';');
				var res = {};
				for (var i = 0; i < cookiearray.length; i++) {
					var name = cookiearray[i].split('=')[0];
					var value = cookiearray[i].split('=')[1];
					res[name] = value
				}
				var username = getCookie('username')
				this.Tracking = !this.Tracking
				if (this.Tracking) {
					if (infoMachine && map) {
					//连接websocket
					socket = new WebSocket('/geolocation/ws/geolocation/mobileMachine')
					socket.onopen = (events) => {
						uni.showToast({
							title: '连接成功', // 弹窗的标题
							icon: 'success', // 使用内置的成功图标
							duration: 2000 // 弹窗显示持续2秒
						});
					}
					axios.post('/api/map/updatemStatus',{
						license:infoMachine.license,
						status:1
					}).then(res=>{
						console.log(res.data)
					})
					}
					axios.post('/api/map/updateStatus', {
						username: username,
						status: 1
					}).then(res => {
						console.log(res.data)
					})
					var re = this
					//开始定位
					AMapLoader.load({
						key: '	60cadebb9484029330544d1d414a4e9a', // 你的高德地图Key
						version: '2.0', // SDK版本
						plugins: ['AMap.Geolocation'] // 需要使用的插件
					}).then((AMap) => {
						map.add(posmarker)
						intervalpos = setInterval(function() {
							uni.getLocation({
								type: 'wgs84',
								success: function(res) {
									var lnglat = wgs84togcj02(res.longitude, res.latitude)
									re.startpos = lnglat
									re.drivingRoute()
									posmarker.setOptions({
										center: lnglat
									})
									if (re.endpos[0] && re.startpos[0]) {
										re.ControlLayer(lnglat)
									}
									//定位
									if(socket){
										console.log(infoMachine.license)
										socket.send(JSON.stringify({license:infoMachine.license,types:'open',position:[res.longitude, res.latitude]}))
									}
								},
								error: function(error) {
									console.log(error)
								}
							});
						}, 2000)
					});
				} else {
					map.remove(posmarker)
					if (driving) {
						driving.clear()
					}
					if (!hasSpecificCircle(map, workRange)&&workRange) {
						map.add(workRange)
					}
					if (this.hasgeojsonlayer) {
						map.remove(workRoute)
						this.hasgeojsonlayer = false
					}
					clearInterval(intervalpos)
					axios.post('/api/map/updateStatus', {
						username: username,
						status: 0
					}).then(res => {
						console.log(res.data)
					})
					if(socket){
						socket.send(JSON.stringify({license:infoMachine.license,types:'close'}))
						socket.close()
						uni.showToast({
							title: '断开连接', // 弹窗的标题
							icon: 'error', // 使用内置的成功图标
							duration: 2000 // 弹窗显示持续2秒
						});
						axios.post('/api/map/updatemStatus',{
							license:infoMachine.license,
							status:0
						}).then(res=>{
							console.log(res.data)
						})
					}
					
				}

			},
			initMap() {
				AMapLoader.load({
					key: '	60cadebb9484029330544d1d414a4e9a', // 你的高德地图Key
					version: '2.0', // SDK版本
					plugins: ['AMap.Geolocation'] // 需要使用的插件
				}).then((AMap) => {
					var bbox = document.getElementById('mapContainer')
					map = new AMap.Map(bbox, {
						zoom: 13, // 地图缩放级别
						center: [116.397428, 39.90923] // 地图中心点
					});
					this.map = map

					//异步加载控件
					AMap.plugin('AMap.ToolBar', function() {
						var toolbar = new AMap.ToolBar({
							position: 'LT'
						}); //缩放工具条实例化
						map.addControl(toolbar); //添加控件
					});
					uni.getLocation({
						type: 'wgs84',
						success: function(res) {
							var lnglat = wgs84togcj02(res.longitude, res.latitude)
							map.setCenter(lnglat, true)
							posmarker = new AMap.CircleMarker({
								center: lnglat,
								radius: 10 + Math.random() * 5, //3D视图下，CircleMarker半径不要超过64px
								strokeColor: 'white',
								strokeWeight: 2,
								strokeOpacity: 0.5,
								fillColor: '#d76136',
								fillOpacity: 0.8,
								zIndex: 10,
								bubble: true,
								cursor: 'pointer',
								clickable: true
							});
						},
						error: function(error) {
							console.log(error)
						}
					});
				})

			}
		}
	};

	// 判断地图上是否存在特定的 Circle 对象
	function hasSpecificCircle(map, targetCircle) {
		var overlays = map.getAllOverlays();
		for (var i = 0; i < overlays.length; i++) {
			if (overlays[i] === targetCircle) {
				return true;
			}
		}
		return false;
	}


	// 过滤500米范围内的数据
	function filterFeaturesByDistance(features, center, maxDistance) {
		var point1 = turf.point(center); // [经度, 纬度]
		return features.filter((feature) => {
			const coordinates = feature.geometry.coordinates;
			var point2 = turf.point(coordinates[0]); // [经度, 纬度]
			const distance = turf.distance(point1, point2, {
				units: 'meters'
			});; // 计算距离
			return distance <= maxDistance;
		});
	}

	function planRoute(start, end) {

		driving.search(start, end, function(status, result) {

		});
	}

	function processposition(geojson) {
		var center = turf.center(geojson).geometry.coordinates
		return center
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
	.amap-icon img {
		width: 25px;
		height: 34px;
	}


	.info {
		position: relative;
		margin: 0;
		top: 0;
		right: 0;
		min-width: 0;
	}

	.controls {
		z-index: 2;
		width: 100px;
		height: 50px;
		background-color: white;
	}

	.TrackingButton {
		position: absolute;
		z-index: 3;
		width: 30px;
		height: 30px;
		background-color: white;
		border-radius: 5px;
		left: 4%;
		text-align: center;
		top: 15%;
		line-height: 30px;

	}
</style>