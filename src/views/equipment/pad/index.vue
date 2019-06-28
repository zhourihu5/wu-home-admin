<template>
  <div class="base">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('form.install')" name="install"></el-tab-pane>
      <el-tab-pane :label="$t('form.notInstalled')" name="NotInstalled" :disabled="true"></el-tab-pane>
      <el-tab-pane :label="$t('form.onReplace')" name="onReplace" :disabled="true"></el-tab-pane>
    </el-tabs>
    <transition name="el-fade-in">
      <component :is="currentView"></component>
    </transition>
  </div>
</template>
<style lang="scss">
.base {
  margin: 20px;
}
</style>
<script>
import install from "./components/install"; // 平板首页底部广告
export default {
  data() {
    return {
      activeName: "install",
      index: 0,
      arr: ["install"]
    };
  },
  computed: {
    // 动态组件
    currentView() {
      return this.arr[this.index];
    }
  },
  components: {
    install
  },
  methods: {
    handleClick(tab, event) {
      this.index = tab.index;
    }
  }
};
</script>
