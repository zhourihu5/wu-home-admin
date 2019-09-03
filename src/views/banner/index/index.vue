<template>
  <div class="banner">
    <!-- search --->
    <div class="banner-container">
      <el-select v-model="listQuery.type" :placeholder="$t('table.temp.type')">
        <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="queryBanners"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddBannerView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="banner-table">
      <el-table
        v-loading="listLoading"
        :data="bannerList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.bannerImg')" width="300">
          <template slot-scope="scope">
            <img v-if="scope.row.cover" :src="scope.row.cover" :alt="$t('table.icon')" class="icon">
            <p v-else>{{ $t('table.noTime') }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.position')" width="560">
          <template
            slot-scope="scope"
          >{{ (scope.row.moduleType !=null && scope.row.moduleType != '') ? getModuleType(scope.row.moduleType) : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.url')" width="565">
          <template slot-scope="scope">{{ scope.row.url ? scope.row.url : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="304">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="mini"
              @click="showEditBannerView(row)"
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
    <div class="family--dialog">
      <el-dialog
        :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
        :visible.sync="dialogFormVisible"
        width="75%"
        @close="close"
      >
        <el-form
          ref="bannerForm"
          :rules="rules"
          :model="bannerForm"
          label-position="right"
          label-width="100px"
          style="width: 60%"
        >
          <el-form-item :label="$t('form.Cover')" prop="file">
            <el-upload
              :action="updateURL"
              list-type="picture-card"
              :limit="1"
              :multiple="false"
              :file-list="fileList"
              :on-exceed="exceedUpload"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :data="uploadParams"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('form.link')" prop="url">
            <el-input v-model="bannerForm.url" :placeholder="$t('table.temp.url')"/>
          </el-form-item>
          <el-form-item :label="$t('form.type')" prop="type">
            <el-select v-model="bannerForm.moduleType" :placeholder="$t('table.temp.type')">
              <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
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
.banner {
  padding: 20px;
  .banner-container {
    margin-bottom: 20px;
    .el-cascader {
      margin-top: 5px;
    }
    .el-button--medium {
      margin-top: 5px;
    }
  }
  .banner-table {
    .icon {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
<script>
import { getBannerType, getBannerAll, addBanner } from "@/api/banner";
import Pagination from "@/components/Pagination"; // 分页
import { overall } from "@/constant/index";
import { generatePoint } from "@/utils/i18n";
export default {
  components: { Pagination },
  data() {
    return {
      updateURL: overall.uploadUrl,
      fileList: [], // 上传图片回显列表
      listLoading: true,
      buttonLoading: false, // 按钮加载请求
      bannerList: [],
      total: 0,
      type: [], // 类型
      listQuery: {
        type: "",
        pageNum: 1,
        pageSize: 10
      },
      bannerForm: {
        moduleType: "",
        cover: "",
        url: "",
        id: ""
      },
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      rules: {
        file: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              console.log("验证");
              if (this.bannerForm.cover == "") {
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
            // message: this.generatePoint("required")
            validator: this.validateUrl
          }
        ],
        type: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              console.log("验证");
              if (this.bannerForm.moduleType == "") {
                callback(this.generatePoint("required"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      uploadParams: {
        type: "banner"
      }
    };
  },
  created() {
    // 获取轮播图类型
    let _this = this;
    getBannerType().then(function(res) {
      console.log("轮播 -- types", res.data);
      _this.type = res.data;
      // _this.bannerForm.type = res.data[0]; // 默认选中的
      _this.listQuery.type = res.data[0].id;
      _this.fetchData(); // 查询数据
    });
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
      getBannerAll(this.listQuery).then(function(res) {
        console.log("res -- >", res);
        _this.listLoading = false;
        _this.bannerList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 查询
    queryBanners() {
      this.fetchData(); // 查询数据
    },
    // 显示添加页面
    showAddBannerView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 编辑页面
    showEditBannerView(row) {
      let _this = this;
      console.log("row --- >", row);
      _this.bannerForm.moduleType = row.moduleType;
      _this.bannerForm.moduleType = row.moduleType;
      _this.bannerForm.cover = row.cover;
      _this.bannerForm.url = row.url;
      _this.bannerForm.id = row.id;
      _this.fileList.push({ url: row.cover });
      console.log("  fileList ", _this.fileList);
      _this.dialogStatus = "update"; // 标示创建
      _this.dialogFormVisible = true; // 展示弹窗
    },
    // 获取类型文字
    getModuleType(id) {
      let text = "";
      this.type.forEach(function(v) {
        if (v.id == id) {
          text = v.name;
        }
      });
      return text;
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
    beforeAvatarUpload(file) {
      // console.log("beforeAvatarUpload --", file);
      this.uploadParams.file = file;
    },
    handleAvatarSuccess(res, file) {
      // console.log("handleAvatarSuccess --", res, file);
      this.bannerForm.cover = res.data;
    },
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      console.log("- ---- ", _this.bannerForm);
      _this.$refs.bannerForm.validate(valid => {
        if (valid) {
          console.log("- ---- ", _this.bannerForm);
          addBanner(_this.bannerForm).then(function(res) {
            _this.buttonLoading = false; // 清楚加载中
            console.log("res --- ", res);
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
    // 修改数据
    updateData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.bannerForm.validate(valid => {
        if (valid) {
          addBanner(_this.bannerForm).then(function(res) {
            _this.buttonLoading = false; // 清楚加载中
            console.log("res --- ", res);
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
      this.$refs.bannerForm.resetFields();
      this.bannerForm = {
        type: "",
        cover: "",
        url: "",
        id: ""
      };
      this.fileList = [];
    }
  }
};
</script>
