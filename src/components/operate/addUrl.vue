<template>
  <div class="add-url">
    <h3>输入连接网址</h3>
    <el-input placeholder="请输入内容" v-model="input1">
      <template slot="prepend">Http://</template>
    </el-input>
  </div>
</template>
<style lang="scss">
.add-url {
  margin: 50px 0 50px 0;
  span {
    color: #909399;
    text-align: center;
    margin-bottom: 10px;
    margin-left: 2px;
    display: inline-block;
  }
}
</style>
<script>
export default {
  data() {
    return {
      input1: ""
    };
  }
};
</script>

