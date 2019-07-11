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
    <div class="stage-table">
      <el-table
        v-loading="listLoading"
        :data="stageList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column :label="$t('table.name')" width="400" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name ? scope.row.name : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.belongToCommunity')" width="500">
          <template
            slot-scope="scope"
          >{{ scope.row.communtityName ? scope.row.communtityName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="created_at"
          :label="$t('table.createTime')"
          width="430"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="400">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="mini"
              @click="showEditStageView(row)"
            >{{ $t('table.edit') }}</el-button>
            <!-- <el-button type="danger" size="mini" @click="deleteData(row)">{{ $t('table.delete') }}</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="fetchData"
      />
    </div>
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
          <el-form-item v-if="dialogStatus==='create'" :label="$t('form.area')" prop="areaValue">
            <province ref="provinceForm" :params="stageForm" @getProvinceVal="getProvinceVal"></province>
          </el-form-item>
          <el-form-item
            v-if="dialogStatus==='create'"
            :label="$t('form.community')"
            prop="communityValue"
          >
            <community ref="communityForm" :params="stageForm" @getCommunityVal="getCommunityVal"></community>
          </el-form-item>
          <el-form-item :label="$t('form.name')" prop="name">
            <el-input
              style="width: 60%;"
              v-model="stageForm.name"
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
import Pagination from "@/components/Pagination"; // 分页
export default {
  components: { Province, Community, Pagination },
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
        id: "",
        name: "", // 名称
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
      this.listQuery.communtityId = this.list.communityValue[0]; // 更新查询条件社区ID
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
    // 显示编辑页面
    showEditStageView(row) {
      this.stageForm.name = row.name;
      this.stageForm.id = row.id;
      this.stageForm.communtityId = row.communtityId;
      this.dialogStatus = "update"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 创建数据
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.stageForm.validate(valid => {
        if (valid) {
          _this.stageForm.communtityId = _this.stageForm.communityValue[0];
          addStage(_this.stageForm).then(function(res) {
            console.log(" 添加期: ", res);
            _this.buttonLoading = false; // 清楚加载中
            if (res.message == "SUCCESS") {
              _this.close(); // 关闭弹窗
              _this.$notify({
                title: _this.generatePoint("notifySuccess.title"),
                message: _this.generatePoint("notifySuccess.message"),
                type: "success"
              });
            } else {
              _this.$message.error(_this.generatePoint("system"));
            }
            _this.fetchData(); // 更新列表
          });
        } else {
          _this.buttonLoading = false; // 清楚加载中
          return false;
        }
      });
    },
    updateData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.stageForm.validate(valid => {
        if (valid) {
          addStage(_this.stageForm).then(function(res) {
            console.log(" 添加期: ", res);
            _this.buttonLoading = false; // 清楚加载中
            if (res.message == "SUCCESS") {
              _this.close(); // 关闭弹窗
              _this.$notify({
                title: _this.generatePoint("notifySuccess.title"),
                message: _this.generatePoint("notifySuccess.message1"),
                type: "success"
              });
            } else {
              _this.$message.error(_this.generatePoint("system"));
            }
            _this.fetchData(); // 更新列表
          });
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
      this.stageForm.name = "";
      this.stageForm.communtityId = "";
      if (this.dialogStatus == "create") {
        this.$refs.provinceForm.initialization();
        this.$refs.communityForm.initialization();
      }
    }
  }
};
</script>
