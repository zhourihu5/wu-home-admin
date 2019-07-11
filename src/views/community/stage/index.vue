<template>
  <div class="stage">
    <!-- search --->
    <div class="stage-container">
      <province ref="provinceList" :params="list" @getProvinceVal="getProvinceVal"></province>
      <community ref="communityList" :params="list" @getCommunityVal="getCommunityVal"></community>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="queryStage"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddStageView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="stage-table"></div>
    <!-- dialog -->
    <div class="stage-dialog">
      <el-dialog
        :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
        :visible.sync="dialogFormVisible"
        @close="close"
      >
        <el-form
          ref="stageForm"
          :rules="rules"
          :model="stageForm"
          label-position="right"
          label-width="100px"
          style="width: 60%"
        >
          <el-form-item :label="$t('form.area')" prop="areaValue">
            <province ref="provinceForm" :params="stageForm" @getProvinceVal="getProvinceVal"></province>
          </el-form-item>
          <el-form-item
            v-if="dialogStatus==='create'"
            :label="$t('form.community')"
            prop="communityValue"
          >
            <community ref="communityForm" :params="stageForm" @getCommunityVal="getCommunityVal"></community>
          </el-form-item>
          <el-form-item v-if="dialogStatus==='create'" :label="$t('form.name')" prop="num">
            <el-input
              style="width: 60%;"
              v-model="stageForm.num"
              :placeholder="$t('table.temp.name')"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close">{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="dialogStatus==='create'?createData():updateData()"
            :loading="buttonLoading"
          >{{ $t('table.confirm') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="scss">
.stage {
  padding: 20px;
  .stage-container {
    margin-bottom: 20px;
    .el-cascader {
      margin-top: 5px;
    }
    .el-button--medium {
      margin-top: 5px;
    }
    .el-input--medium {
      margin-top: 5px;
    }
  }
}
</style>
<script>
import { getAreas } from "@/api/area";
import { getStageAll, addStage } from "@/api/community";
import { generatePoint } from "@/utils/i18n";
import Province from "@/components/Linkage/province"; // 省市区三级联动
import Community from "@/components/Linkage/community"; // 省市区三级联动
export default {
  components: { Province, Community },
  data() {
    return {
      list: {
        code: "list",
        areaValue: [],
        communityValue: []
      },
      listLoading: false,
      buttonLoading: false,
      listQuery: {
        communtityId: "",
        pageNum: 1,
        pageSize: 10
      },
      stageList: [],
      total: 0,
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      stageForm: {
        code: "form",
        num: "", // 名称
        areaValue: [], // 区域信息
        communityValue: [] // 社区信息
      },
      // 验证规则
      rules: {
        areaValue: [
          {
            type: "array",
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.stageForm.areaValue.length <= 0) {
                callback(this.generatePoint("mandatory"));
              } else {
                callback();
              }
            }
          }
        ],
        communityValue: [
          {
            type: "array",
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.stageForm.communityValue.length <= 0) {
                callback(this.generatePoint("mandatory"));
              } else {
                callback();
              }
            }
            // message: this.generatePoint("mandatory")
          }
        ],
        name: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ]
      }
    };
  },
  created() {
    this.fetchData(); // 获取列表数据
  },
  methods: {
    generatePoint,
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getStageAll(_this.listQuery).then(function(res) {
        console.log("res ---- ", res);
        _this.listLoading = false;
        _this.stageList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 查询
    queryStage() {
      this.fetchData();
    },
    // 获取省市区数据
    getProvinceVal(val, code) {
      console.log("huoqu ");
      if (code == "list") {
        this.list.areaValue = val;
      } else {
        this.stageForm.areaValue = val;
      }
    },
    // 获取社区数据
    getCommunityVal(val, code) {
      if (code == "list") {
        this.list.communityValue = val;
      } else {
        this.stageForm.communityValue = val;
      }
    },
    // 显示添加页面
    showAddStageView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 创建数据
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.stageForm.validate(valid => {
        if (valid) {
          console.log(_this.stageForm);
        } else {
          _this.buttonLoading = false; // 清楚加载中
          return false;
        }
      });
    },
    // 关闭弹窗
    close() {
      this.dialogFormVisible = false; // 关闭弹窗
      this.$refs.stageForm.resetFields(); // 重置表单
      this.stageForm.num = ""
      this.$refs.provinceForm.initialization()
    //   this.stageForm = {
    //     code: "form",
    //     num: "", // 名称
    //     areaValue: [], // 区域信息
    //     communityValue: [] // 社区信息
    //   };
      //   console.log(this.$refs, this.temp);
      //   this.dialogFormVisible = false; // 关闭弹窗
      //   this.$refs.communityForm.resetFields(); // 重置表单
      //   this.communityForm.cname = "";
      //   this.communityForm.address = "";
      //   this.communityForm.optionsVal = [];
    }
  }
};
</script>
