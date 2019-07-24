<template>
  <div class="family">
    <!-- search --->
    <div class="family-container">
      <province ref="provinceList" :params="myList" @getProvinceVal="getProvinceVal"></province>
    </div>
    <!-- table --->
    <div class="family-table"></div>
    <!-- dialog -->
    <div class="family--dialog">
      <el-dialog
        :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.addHousehold')"
        :visible.sync="dialogFormVisible"
        width="75%"
        @close="close"
      ></el-dialog>
    </div>
  </div>
</template>
<style lang="scss">
.family {
  padding: 20px;
  .family-container {
    margin-bottom: 20px;
    .el-cascader {
      margin-top: 5px;
    }
    .el-button--medium {
      margin-top: 5px;
    }
  }
}
</style>
<script>
import Province from "@/components/Linkage/province"; // 省市区三级联动
export default {
  components: { Province },
  data() {
    return {
      myList: {
        code: "list",
        areaValue: [],
        communityValue: []
      },
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false // 是否展示dialog内容
    };
  },
  methods: {
    // 获取省市区数据
    getProvinceVal(val, code) {
      if (code == "list") {
        this.myList.areaValue = val;
        this.listQuery.areaCode = val[2];
      } else {
        this.myForm.areaValue = val;
      }
    },
    close() {
      console.log("关闭")
    
    }
  }
};
</script>