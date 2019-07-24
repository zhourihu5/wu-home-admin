<template>
  <div class="area">
    <el-cascader
      :options="options"
      :props="areaProps"
      @change="handleAreaList"
      v-model="areaOptionsVal"
      :placeholder="$t('table.temp.area')"
    ></el-cascader>
  </div>
</template>
<style lang="scss" scoped>
.area {
  display: inline-block
}
</style>
<script>
import { getAreasAll } from "@/api/area";
export default {
  data() {
    return {
      areaOptionsVal: [],
      options: [],
      // 省市区
      areaProps: {
        label: "areaName",
        children: "children",
        value: "id"
      }
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  created() {
    let _this = this;
    // 获取所有的省市区
    getAreasAll().then(function(res) {
      _this.options = res.data;
    });
  },
  methods: {
    // 监听区域查询社区 列表
    handleAreaList(val) {
      this.$emit("getProvinceVal", val, this.params.code); // 返回省市区ID
    },
    initialization() {
      this.areaOptionsVal = ""; // 重置用户选择的省市区
    },
    echoArea(areaValue) {
      this.areaOptionsVal = areaValue;
      // this.areaOptionsVal.push(city);
      // this.areaOptionsVal.push(province);
      // this.areaOptionsVal.push(area);
      // console.log("areaOptionsVal - ", this.areaOptionsVal)
    }
  }
};
</script>