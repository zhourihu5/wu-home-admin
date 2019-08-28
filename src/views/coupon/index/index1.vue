<template>
  <div class="coupon">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('form.issued')" name="issued"></el-tab-pane>
      <el-tab-pane :label="$t('form.unissued')" name="unissued"></el-tab-pane>
    </el-tabs>
    <component :is="currentView"></component>
  </div>
</template>
<script>
import issued from "./components/issued"; // 已发放
import unissued from "./components/unissued"; // 未发放
export default {
  components: { issued, unissued },
  data() {
    return {
      activeName: "issued",
      index: 0,
      arr: ["issued", "unissued"]
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
<style lang="scss">
.coupon {
  margin: 20px;
}
</style>