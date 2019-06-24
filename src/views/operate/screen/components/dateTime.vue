<template>
  <div class="date-time">
    <h3>投放时间</h3>
    <span class="time-item">
      <span class="demonstration">上线时间</span>
      <el-date-picker v-model="onlineTime" type="date" placeholder="选择日期"></el-date-picker>
    </span>
    <span class="time-item">
      <span class="demonstration">下线时间</span>
      <el-date-picker v-model="offlineTime" type="date" placeholder="选择日期"></el-date-picker>
    </span>
  </div>
</template>
<style lang="scss">
.date-time {
  margin: 50px 0 50px 0;
  .time-item {
    margin-right: 30px;
    text-align: center;
    display: inline-block;
    .demonstration {
      font-size: 14px;
      color: #8492a6;
      display: block;
      margin-bottom: 20px;
    }
  }
}
</style>
<script>
export default {
  data() {
    return {
      onlineTime: "", // 上线时间
      offlineTime: "" // 下线时间
    };
  }
};
</script>


