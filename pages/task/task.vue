<template>
  <view class="container">
    <view v-for="group in groups" :key="group.id" class="group-box" @click="navi">
      <text>位置：{{ group.location }}</text>
      <text>组编号：{{ group.number }}</text>
      <text>组长名：{{ group.leaderName }}</text>
      <text>组长ID：{{ group.leaderId }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      groups: [
        { id: 1, location: '南岗区', number: '001', leaderName: '张三', leaderId: 'ZS001' },
        { id: 2, location: '江北', number: '002', leaderName: '李四', leaderId: 'LS002' },
          { id: 3, location: '位置2', number: '002', leaderName: '李四', leaderId: 'LS002' } ,
        { id: 4, location: '位置10', number: '010', leaderName: '王五', leaderId: 'WU010' },
		  { id: 5, location: '位置2', number: '002', leaderName: '李四', leaderId: 'LS002' }
		  
      ],
    };
  },
  methods:{
	  navi(){
		  uni.navigateTo({
		  	url: "/pages/task_detail/task_detail",
		  	success: res => {},
		  	fail: () => {},
		  	complete: () => {}
		  });
	  }
  }
 
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.group-box {
  margin: 10px;
  padding: 15px; /* 增加内边距 */
  border: 1px solid #ddd;
  border-radius: 4px;
}
text {
  display: block; /* 使每个文本独占一行 */
  margin-bottom: 8px; /* 增加文本之间的外边距 */
  line-height: 1.6; /* 设置行高 */
}
</style>
