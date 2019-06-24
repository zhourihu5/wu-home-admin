<template>
  <div class="pushIndex">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="平板首页底部广告" name="bottom"></el-tab-pane>
      <el-tab-pane label="平板弹屏广告" name="popup"></el-tab-pane>
      <el-tab-pane label="短信广告" name="message"></el-tab-pane>
      <el-tab-pane label="单元门口机广告" name="doorway"></el-tab-pane>
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
import tabletBottom from "./components/tabletBottom";
import tabletPopup from "./components/tabletPopup";
import shortMessage from "./components/shortMessage";
import doorway from "./components/doorway";
export default {
  data() {
    return {
      activeName: "bottom",
      index: 0,
      arr: ["tabletBottom", "tabletPopup", "shortMessage", "doorway"]
    };
  },
  computed: { // 动态组件
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