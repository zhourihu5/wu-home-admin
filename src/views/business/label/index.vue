<template>
  <div class="label">
    <!-- search --->
    <div class="label-container">
      <!-- <el-input
        v-model="listQuery.lablesName"
        :placeholder="$t('table.temp.community')"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="queryTabel"
      >{{ $t('table.search') }}</el-button>-->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="label-table">
      <el-table
        v-loading="listLoading"
        :data="labelList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.name')" width="730">
          <template
            slot-scope="scope"
          >{{ scope.row.lablesName ? scope.row.lablesName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.uploadTime')" width="500">
          <template
            slot-scope="scope"
          >{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="500">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="showEditView(row)">{{ $t('table.edit') }}</el-button>
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
    <el-dialog
      :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
      :visible.sync="dialogFormVisible"
      @close="close"
    >
      <el-form
        ref="labelForm"
        :rules="rules"
        :model="labelForm"
        label-position="right"
        label-width="100px"
        style="width: 60%"
      >
        <el-form-item :label="$t('form.name')" prop="lablesName">
          <el-input v-model="labelForm.lablesName" :placeholder="$t('table.temp.name')"/>
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
</template>
<style lang="scss">
.label {
  padding: 20px;
  .label-container {
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
    .el-date-editor .el-range-separator {
      padding: 0 !important;
    }
  }
}
</style>
<script>
import Pagination from "@/components/Pagination"; // 分页
import { generatePoint } from "@/utils/i18n";
import { getLablesAll, addLables } from "@/api/business";
export default {
  components: { Pagination },
  data() {
    return {
      // 查询参数
      listQuery: {
        // lablesName: "",
        pageNum: 1,
        pageSize: 10
      },
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      listLoading: false, // 列表加载
      buttonLoading: false, // 按钮加载请求
      labelList: [],
      total: 0, // 列表分页
      labelForm: {
        lablesName: "", // 标签名称
        id: ""
      },
      rules: {
        lablesName: [
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
    this.fetchData();
  },
  methods: {
    generatePoint,
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getLablesAll(this.listQuery).then(function(res) {
        console.log("res --- ", res);
        _this.listLoading = false;
        _this.labelList = res.data.content;
        _this.total = res.data.totalPages;
      });
    },
    // 查询
    queryTabel() {
      console.log(" --- ", this.listQuery);
      this.fetchData();
    },
    // 显示添加页面
    showAddView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 修改页面
    showEditView(row) {
      console.log("row --- >", row);
      this.labelForm.lablesName = row.lablesName;
      this.labelForm.id = row.id;
      this.dialogStatus = "update"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 添加数据
    createData() {
      let _this = this;
      console.log(" ---- >", _this.labelForm);
      _this.$refs.labelForm.validate(valid => {
        if (valid) {
          try {
            addLables(_this.labelForm).then(function(res) {
              console.log("res --- >", res);
              if (res.message == "SUCCESS") {
                _this.buttonLoading = false; // 清空按钮加载状态
                _this.$notify({
                  title: _this.generatePoint("notifySuccess.title"),
                  message: _this.generatePoint("notifySuccess.message"),
                  type: "success"
                });
                _this.dialogFormVisible = false; // 关闭弹窗
                _this.fetchData();
              } else {
                _this.buttonLoading = false; // 清空按钮加载状态
                _this.$message.error(_this.generatePoint("system"));
              }
            });
          } catch (err) {
            console.error("err --- ", err); // 控制台打印异常
            _this.buttonLoading = false; // 清空按钮加载状态
            _this.$message.error(_this.generatePoint("system"));
          }
        } else {
          _this.$emit("initButtonLoading"); // 清楚加载中
          return false;
        }
      });
    },
    // 修改数据
    updateData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.labelForm.validate(valid => {
        if (valid) {
          try {
            addLables(_this.labelForm).then(function(res) {
              console.log("res --- >", res);
              if (res.message == "SUCCESS") {
                _this.buttonLoading = false; // 清空按钮加载状态
                _this.$notify({
                  title: _this.generatePoint("notifySuccess.title"),
                  message: _this.generatePoint("notifySuccess.message"),
                  type: "success"
                });
                _this.dialogFormVisible = false; // 关闭弹窗
                _this.fetchData();
              } else {
                _this.buttonLoading = false; // 清空按钮加载状态
                _this.$message.error(_this.generatePoint("system"));
              }
            });
          } catch (err) {
            console.error("err --- ", err); // 控制台打印异常
            _this.buttonLoading = false; // 清空按钮加载状态
            _this.$message.error(_this.generatePoint("system"));
          }
        } else {
          _this.$emit("initButtonLoading"); // 清楚加载中
          return false;
        }
      });
    },
    close() {
      this.dialogFormVisible = false;
      this.labelForm = {
        lablesName: "", // 标签名称
        id: ""
      };
    }
  }
};
</script>
