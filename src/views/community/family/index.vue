<template>
  <div class="family">
    <!-- search --->
    <div class="family-container">
      <province ref="provinceList" :params="myList" @getProvinceVal="getProvinceVal"></province>
      <el-cascader
        :props="communitypProps"
        :options="communityOptions"
        @change="getFamilyList"
        :placeholder="$t('table.temp.communityChoice')"
      ></el-cascader>
    </div>
    <!-- table --->
    <div class="family-table">
      <div v-if="familyList.length == 0" class="not-date">
        <p>{{ $t('table.noData') }}</p>
      </div>
      <el-collapse class="switch" v-else v-model="activeNames" @change="handleChange">
        <el-collapse-item
          v-for="(item, index) in familyList"
          :key="index"
          :title="item.name"
          name="1"
        >
          <el-button
            v-for="(it, index) in item.list"
            :key="index"
            type="primary"
            size="medium"
          >{{it.num}}</el-button>
        </el-collapse-item>
      </el-collapse>
    </div>
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
  .family-table {
    .not-date {
      font-size: 14px;
      text-align: center;
      margin-top: 150px;
      color: #909399;
    }
    .switch {
      animation: mymove 0.5s ease-in;
      -webkit-animation: mymove 0.5s ease-in; /*Safari and Chrome*/
    }
  }
}
</style>
<script>
import Province from "@/components/Linkage/province"; // 省市区三级联动
import { getCommuntityByArea, findFamilyListByCode } from "@/api/community";
export default {
  components: { Province },
  data() {
    return {
      communitypProps: {
        label: "name",
        value: "code"
      },
      myList: {
        code: "list",
        areaValue: [],
        communityValue: []
      },
      //   // 查询参数
      listQuery: {
        communtityCode: ""
      },
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      communityOptions: [], // 社区下拉列表数据
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      activeNames: ["1"],
      familyList: []
    };
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
    // 获取省市区数据 联动查询社区
    getProvinceVal(val, code) {
      let _this = this;
      getCommuntityByArea({ areaCode: val[2] }).then(function(res) {
        console.log("根据地区code 获取的社区数据 -- ", res);
        _this.communityOptions = res.data; // 列表中 社区
      });
    },
    // 根据社区code 获取家庭
    getFamilyList(val) {
      let _this = this;
      findFamilyListByCode({ communtityCode: val[0] }).then(function(res) {
        console.log("查询家庭结果 --- ", res);
        _this.familyList = res.data;
      });
    },
    close() {
      console.log("关闭");
    }
  }
};
</script>