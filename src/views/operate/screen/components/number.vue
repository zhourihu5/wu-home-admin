<template>
  <div class="number">
    <h3>屏保位置管理</h3>
    <p>Banner默认为队尾，自定义卡片位置</p>
    <el-input-number v-model="num"></el-input-number>
  </div>
</template>
<style lang="scss">
.number {
  margin: 50px 0 30px 0;
  p {
    color: #909399;
  }
}
</style>

<script>
export default {
  data() {
    return {
      num: 1
    };
  }
};
</script>
