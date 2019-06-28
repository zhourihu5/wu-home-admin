<template>
  <div class="pushIndex">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('form.popup')" name="tabletPopup"></el-tab-pane>
      <el-tab-pane :label="$t('form.bottom')" name="tabletBottom" :disabled="true"></el-tab-pane>
      <el-tab-pane :label="$t('form.short')" name="shortMessage" :disabled="true"></el-tab-pane>
      <el-tab-pane :label="$t('form.machine')" name="doorway" :disabled="true"></el-tab-pane>
    </el-tabs>
    <transition name="el-fade-in">
      <component :is="currentView"></component>
    </transition>
  </div>
</template>
<style>
.pushIndex {
  margin: 20px;
}
</style>

<script>
import tabletBottom from "./components/tabletBottom"; // 平板首页底部广告
import tabletPopup from "./components/tabletPopup"; // 平板弹屏广告
import shortMessage from "./components/shortMessage"; // 短信广告
import doorway from "./components/doorway"; // 单元门口机广告
export default {
  data() {
    return {
      activeName: "tabletPopup",
      index: 0,
      arr: ["tabletPopup", "tabletBottom", "shortMessage", "doorway"]
    };
  },
  computed: {
    // 动态组件
    currentView() {
      return this.arr[this.index];
    }
  },
  components: {
    tabletBottom,
    tabletPopup,
    shortMessage,
    doorway
  },
  methods: {
    handleClick(tab, event) {
      this.index = tab.index;
    }
  }
};
</script>