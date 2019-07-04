<template>
  <div class="screen">
    <!-- search --->
    <div class="screen-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddScreenView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="screen-table">
      <el-table
        v-loading="listLoading"
        :data="screenList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column :label="$t('table.cover')" width="787" align="center">
          <template slot-scope="scope">
            <img v-if="scope.row.cover" :src="scope.row.cover" :alt="$t('table.icon')" class="icon">
            <p v-else>{{ $t('table.noTime') }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.jumpPath')" width="787" align="center">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="view_window">点击查看</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- dialog -->
    <el-dialog
      :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
      :visible.sync="dialogFormVisible"
      @close="close"
    >
      <el-form
        ref="screenForm"
        :rules="rules"
        :model="screenForm"
        label-position="right"
        label-width="100px"
        style="width: 60%"
      >
        <el-form-item :label="$t('form.Cover')" prop="file">
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :limit="1"
            :multiple="false"
            :file-list="fileList"
            :on-exceed="exceedUpload"
            :on-success="handleAvatarSuccess"
            :data="uploadParams"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('form.link')" prop="url">
          <el-input v-model="screenForm.url" :placeholder="$t('table.temp.url')"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="createData"
          :loading="buttonLoading"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.screen {
  padding: 20px;
  .screen-container {
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
  .screen-table {
    a {
      color: #409eff;
      &:hover {
        color: #3880ca;
      }
    }
    .icon {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
<script>
import { getScreemAll, addScreen } from "@/api/operate";
import { generatePoint } from "@/utils/i18n";
import { overall } from "@/constant/index";
export default {
  data() {
    return {
      uploadUrl: overall.uploadUrl,
      listLoading: true,
      buttonLoading: false, // 按钮加载请求
      screenList: [],
      fileList: [], // 上传图片回显列表
      uploadParams: {
        type: "screen"
      },
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      screenForm: {
        cover: "",
        url: ""
      },
      rules: {
        file: [
          {
            validator: (rule, value, callback) => {
              if (this.screenForm.cover == "") {
                callback(this.generatePoint("upload"));
              } else {
                callback();
              }
            }
          }
        ],
        url: [
          {
            required: true,
            trigger: "change",
            validator: this.validateUrl
          }
        ]
      },
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      total: 0
    };
  },
  components: {},
  created() {
    this.fetchData();
  },
  methods: {
    generatePoint,
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getScreemAll(this.listQuery).then(function(res) {
        _this.listLoading = false;
        _this.screenList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
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
    // 添加页面
    showAddScreenView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 超出文件上传个数时触发
    exceedUpload(file, fileList) {
      // this.$message.error("超过最大上传数量,目前只可上传1张");
      this.$notify({
        title: this.generatePoint("notifyWarning.title"),
        message: this.generatePoint("notifyWarning.message"),
        type: "warning"
      });
    },
    handleAvatarSuccess(res, file) {
      // console.log("handleAvatarSuccess --", res, file);
      this.screenForm.cover = res.data;
    },
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.screenForm.validate(valid => {
        if (valid) {
          addScreen(_this.screenForm).then(function(res) {
            _this.buttonLoading = false; // 清楚加载中
            if (res.message == "SUCCESS") {
              _this.dialogFormVisible = false;
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
    close() {
      console.log("关闭");
      this.screenForm = {
        cover: "",
        url: ""
      };
      this.$refs.screenForm.resetFields();
      this.fileList = [];
      this.dialogFormVisible = false;
    }
  }
};
</script>

