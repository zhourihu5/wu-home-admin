<template>
  <div class="experience">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('form.notStarted')" name="notStarted"></el-tab-pane>
      <el-tab-pane :label="$t('form.haveInhand')" name="haveInhand"></el-tab-pane>
      <el-tab-pane :label="$t('form.over')" name="over"></el-tab-pane>
    </el-tabs>
    <component :is="currentView"></component>
  </div>
</template>
<script>
import notStarted from "./components/notStarted";
import haveInhand from "./components/haveInhand";
import over from "./components/over";
export default {
  components: { notStarted, haveInhand, over },
  data() {
    return {
      activeName: "notStarted",
      index: 0,
      arr: ["notStarted", "haveInhand", "over"]
    };
  },
  computed: {
    // 动态组件
    currentView() {
      return this.arr[this.index];
    }
  },
  methods: {
    handleClick(tab, event) {
      this.index = tab.index;
    }
  }
};
</script>
<style lang="scss" scoped>
.experience {
  padding: 20px;
  .my-input {
    width: 55%;
  }
  .experience-container {
    margin-bottom: 20px;
    .el-cascader {
      margin-top: 5px;
    }
    .el-button--medium {
      margin-top: 5px;
    }
    .el-input--medium {
      margin-top: 5px;
    }
  }
  .rule {
    margin: 10px;
    .el-input {
      width: 80px;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
  .delivery-time {
    .el-input {
      width: 200px;
    }
  }
}
</style>
<style lang="scss">
.buying {
  .buying-container {
    .el-date-editor .el-range-separator {
      padding: 0 !important;
    }
  }
}
</style>