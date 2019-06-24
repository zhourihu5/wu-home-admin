<template>
  <div class="screen">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="增加图文保护" name="imageTextProtect"></el-tab-pane>
      <el-tab-pane label="增加链接型保护" name="linkProtect"></el-tab-pane>
      <el-tab-pane label="增加功能保护" name="functionProtect"></el-tab-pane>
    </el-tabs>
    <transition name="el-fade-in">
      <component :is="currentView"></component>
    </transition>
  </div>
</template>
<style lang="scss">
.screen {
  margin: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}
</style>
<script>
import imageTextProtect from "./components/imageTextProtect";
import functionProtect from "./components/functionProtect";
import linkProtect from "./components/linkProtect";
export default {
  data() {
    return {
      activeName: "imageTextProtect",
      index: 0,
      arr: ["imageTextProtect", "linkProtect", "functionProtect"]
    };
  },
  computed: {
    // 动态组件
    currentView() {
      return this.arr[this.index];
    }
  },
  components: {
    imageTextProtect,
    functionProtect,
    linkProtect
  },
  methods: {
    handleClick(tab, event) {
      this.index = tab.index;
    }
  }
};
</script>

