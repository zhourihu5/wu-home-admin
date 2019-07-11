<template>
  <el-cascader
    :props="areaProps"
    v-model="areaOptionsVal"
    :placeholder="$t('table.temp.area')"
    @change="handleAreaList"
  ></el-cascader>
</template>
<style lang="scss">
</style>
<script>
import { getAreas } from "@/api/area";
export default {
  data() {
    return {
      areaOptionsVal: "",
      // 省市区
      areaProps: {
        label: "areaName",
        value: "id",
        children: "children",
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          switch (level) {
            case 0:
              getAreas().then(function(res) {
                resolve(res.data);
              });
              break;
            case 1:
              getAreas({ pid: node.value }).then(function(res) {
                resolve(res.data);
              });
              break;
            case 2:
              getAreas({ pid: node.value }).then(function(res) {
                for (let i = 0; i < res.data.length; i++) {
                  res.data[i].leaf = true;
                }
                resolve(res.data);
              });
              break;
          }
        }
      }
    };
  }, 
  props: {
    params: {
      type: Object,
    }
  },
  methods: {
    // 监听区域查询社区 列表
    handleAreaList(val) {
      this.$emit("getProvinceVal", val, this.params.code); // 返回省市区ID
    },
    initialization() {
      this.areaOptionsVal = ""
    }
  }
};
</script>