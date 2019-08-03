<template>
  <div class="examine">
    <el-tabs v-model="examineName" @tab-click="handleClick">
      <el-tab-pane :label="$t('form.notAudited')" name="notAudited"></el-tab-pane>
      <el-tab-pane :label="$t('form.failed')" name="failed"></el-tab-pane>
      <el-tab-pane :label="$t('form.adopt')" name="adopt"></el-tab-pane>
    </el-tabs>
    <component :is="currentView"></component>
  </div>
</template>
<script>
import notAudited from "./components/notAudited"; // 未审核
import failed from "./components/failed"; // 未通过
import adopt from "./components/adopt"; // 已通过
export default {
  data() {
    return {
      examineName: "notAudited",
      index: 0,
      arr: ["notAudited", "failed", "adopt"]
    };
  },
  computed: {
    // 动态组件
    currentView() {
      return this.arr[this.index];
    }
  },
  components: {
    notAudited,
    failed,
    adopt
  },
  methods: {
    handleClick(tab, event) {
      this.index = tab.index;
    }
  }
};
</script>
<style lang="scss">
.examine {
  margin: 20px;
}
</style>