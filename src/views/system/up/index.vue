<template>
  <div class="up">
    <!-- search --->
    <div class="up-container">
      <!-- <el-input
        v-model="listQuery.title"
        :placeholder="$t('table.temp.community')"
        style="width: 200px;"
        class="filter-item"
      />-->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddUpView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="up-table">
      <el-table
        v-loading="listLoading"
        :data="upList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.version')" width="400">
          <template slot-scope="scope">{{ scope.row.showVer }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.upgrade')" width="400">
          <template slot-scope="scope">{{ scope.row.sysVer }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.content')" width="530">
          <template slot-scope="scope">{{ scope.row.versionDesc }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.uptime')" width="400">
          <template slot-scope="scope">{{ scope.row.createDate }}</template>
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
    <div class="up--dialog">
      <el-dialog
        :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
        :visible.sync="dialogFormVisible"
        width="75%"
        @close="close"
      >
        <el-form
          ref="upForm"
          :rules="rules"
          :model="upForm"
          label-position="right"
          label-width="100px"
          style="width: 60%"
        >
          <el-form-item :label="$t('form.version')" prop="showVer">
            <el-input
              style="width: 60%;"
              v-model="upForm.showVer"
              :placeholder="$t('table.temp.familyName')"
            />
          </el-form-item>
          <el-form-item :label="$t('form.upgrade')" prop="sysVer">
            <el-input
              style="width: 60%;"
              v-model="upForm.sysVer"
              :placeholder="$t('table.temp.familyName')"
            />
          </el-form-item>
          <el-form-item :label="$t('form.link')" prop="url">
            <el-input v-model="upForm.url" :placeholder="$t('table.temp.url')"/>
          </el-form-item>
          <el-form-item :label="$t('form.content')" prop="versionDesc">
            <el-input
              type="textarea"
              :placeholder="$t('placeholder.textarea')"
              :maxlength="textareaMaxLength"
              show-word-limit
              resize="none"
              v-model="upForm.versionDesc"
              @input="onChange"
              rows="5"
            ></el-input>
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
.up {
  padding: 20px;
  .up-container {
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
import Pagination from "@/components/Pagination"; // 分页
import { addVersion, getSystemAll } from "@/api/system";
import { generatePoint } from "@/utils/i18n";
export default {
  components: { Pagination },
  data() {
    return {
      listLoading: true,
      buttonLoading: false, // 按钮加载请求
      upList: [],
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      upForm: {
        showVer: "", // 版本号
        sysVer: "", // 升级号
        url: "", // 链接
        versionDesc: "" // 版本描述
      },
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      textareaMaxLength: 120, // textarea可输入的长度
      textareaLength: 120, // textarea 已经输入的长度
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      rules: {
        showVer: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        sysVer: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        url: [
          {
            required: true,
            trigger: "change",
            // message: this.generatePoint("required")
            validator: this.validateUrl
          }
        ],
        versionDesc: [
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
    // 验证url
    validateUrl(rule, value, callback) {
      if (!value) {
        callback(new Error(this.generatePoint("required")));
      } else {
        if (
          value.match(/http:\/\/.+/) != null ||
          value.match(/https:\/\/.+/) != null
        ) {
          callback();
        } else {
          callback(new Error(this.generatePoint("urlInvalid")));
        }
      }
    },
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getSystemAll(this.listQuery).then(function(res) {
        console.log("res -- >", res);
        _this.listLoading = false;
        _this.upList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    showAddUpView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    onChange(value) {
      this.updateTextareaLength(value); // 更新 textarea 可输入的值
    },
    updateTextareaLength(value) {
      this.textareaLength = this.textareaMaxLength - value.length;
    },
    // 添加数据
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.upForm.validate(valid => {
        console.log(" --- ", _this.upForm);
        _this.buttonLoading = false; // 清楚加载中
        if (valid) {
          addVersion(_this.upForm).then(function(res) {
            console.log("res --- ", res);
            _this.buttonLoading = false; // 清楚加载中
            _this.dialogFormVisible = false;
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
            _this.fetchData();
          });
        } else {
          _this.buttonLoading = false; // 清楚加载中
          return false;
        }
      });
    },
    // 修改数据
    updateData() {},
    // 关闭弹窗
    close() {
      this.dialogFormVisible = false; // 关闭弹窗
      this.$refs.upForm.resetFields();
      this.upForm = {
        showVer: "", // 版本号
        sysVer: "", // 升级号
        url: "", // 链接
        versionDesc: "" // 版本描述
      };
    }
  }
};
</script>