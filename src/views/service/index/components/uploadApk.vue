<template>
  <div class="uploadApk">
    <el-form
      ref="uploadApkForm"
      :rules="rules"
      :model="uploadApkForm"
      label-position="right"
      label-width="100px"
      style="width: 60%"
    >
      <el-form-item :label="$t('form.Cover')" prop="cover">
        <el-upload
          :action="updateURL"
          list-type="picture-card"
          :limit="1"
          :multiple="false"
          :file-list="coverList"
          :on-exceed="exceedCoverUpload"
          :before-upload="beforeAvatarCoverUpload"
          :on-success="handleAvatarCoverSuccess"
          :data="uploadCoverParams"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t('form.apk')" prop="file">
        <el-upload
          class="upload-demo"
          drag
          :action="updateURL"
          :data="uploadParams"
          :on-success="handleAvatarSuccess"
          :on-exceed="exceedUpload"
          :limit="1"
          :file-list="fileList"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t('form.title')" prop="title">
        <el-input v-model="uploadApkForm.title" :placeholder="$t('table.temp.title')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.serviceProviderName')" prop="providerName">
        <el-input v-model="uploadApkForm.providerName" :placeholder="$t('table.temp.title')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.packageName')" prop="packageName">
        <el-input v-model="uploadApkForm.packageName" :placeholder="$t('table.temp.packageName')"></el-input>
      </el-form-item>

      <!-- <el-form-item :label="$t('form.link')" prop="url">
        <el-input v-model="uploadApkForm.url" :placeholder="$t('table.temp.url')"/>
      </el-form-item>-->
      <el-form-item :label="$t('form.describe')" prop="memo">
        <el-input
          type="textarea"
          :placeholder="$t('placeholder.textarea')"
          :maxlength="textareaMaxLength"
          show-word-limit
          resize="none"
          v-model="uploadApkForm.memo"
          @input="onChange"
          rows=5
        ></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('form.uptime')" prop="createDate">
        <el-date-picker
          v-model="uploadApkForm.createDate"
          type="datetime"
          :placeholder="$t('table.temp.date')"
        />
      </el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t('table.cancel') }}</el-button>
      <el-button
        type="primary"
        @click="dialogStatus==='create'?createData():updateData()"
        :loading="buttonLoading"
      >{{ $t('table.confirm') }}</el-button>
    </div>
  </div>
</template>
<style lang="scss">
@import "~@/styles/mixin.scss";
.uploadApk {
  animation: mymove 0.5s ease-in;
  -webkit-animation: mymove 0.5s ease-in; /*Safari and Chrome*/
  .el-textarea {
    height: 100%;
    width: 150%;
    textarea {
      height: 100%;
    }
  }
  .dialog-footer {
    text-align: right;
    margin: 10px;
  }
}
</style>
<script>
import { overall } from "@/constant/index";
import { generatePoint } from "@/utils/i18n";
import { addService } from "@/api/service";
import { service } from "@/constant/service"; // 服务 常用常量
export default {
  data() {
    return {
      buttonLoading: false, // 按钮加载请求
      updateURL: overall.uploadUrl,
      uploadParams: {
        type: "apk"
      },
      uploadCoverParams: {
        type: "service"
      },
      uploadApkForm: {
        title: "",
        url: "",
        packageName: "",
        memo: "",
        // createDate: "",
        flag: service.flags[0].value,
        providerName: "",
        id: "",
        cover: ""
      },
      fileList: [], // 上传图片回显列表
      coverList: [], // 封面
      rules: {
        title: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("title")
          }
        ],
        packageName: [
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
        cover: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              console.log("验证头像");
              if (this.uploadApkForm.cover == "") {
                callback(this.generatePoint("upload"));
              } else {
                callback();
              }
            }
          }
        ],
        file: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              console.log("验证");
              if (this.uploadApkForm.url == "") {
                callback(this.generatePoint("upload"));
              } else {
                callback();
              }
            }
          }
        ],
        memo: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        providerName: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ]
      },
      textareaMaxLength: 120, // textarea可输入的长度
      textareaLength: 120, // textarea 已经输入的长度
      dialogStatus: "create" // 默认是添加
    };
  },
  props: {
    isClose: {
      type: Boolean
    },
    item: {
      type: Object
    }
  },
  watch: {
    isClose: function(newVal) {
      if (!newVal) {
        this.close();
      }
    }
  },
  methods: {
    generatePoint,
    // 验证url
    validateUrl(rule, value, callback) {
      if (!value) {
        callback(new Error(this.generatePoint("required")));
      } else {
        if (value.match(/http:\/\/.+/) == null) {
          callback(new Error(this.generatePoint("urlInvalid")));
        } else {
          callback();
        }
      }
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
    // 图片上传
    exceedCoverUpload(file, fileList) {
      // this.$message.error("超过最大上传数量,目前只可上传1张");
      this.$notify({
        title: this.generatePoint("notifyWarning.title"),
        message: this.generatePoint("notifyWarning.message"),
        type: "warning"
      });
    },
    // 图片上传
    beforeAvatarCoverUpload(file) {
      this.uploadCoverParams.file = file;
    },
    // 图片上传
    handleAvatarCoverSuccess(res, file) {
      this.uploadApkForm.cover = res.data;
    },
    // apk
    beforeAvatarUpload(file) {
      this.uploadParams.file = file;
    },
    // apk
    handleAvatarSuccess(res, file) {
      console.log("上传成功 --- ", file);
      this.uploadApkForm.url = res.data;
    },
    onChange(value) {
      this.updateTextareaLength(value); // 更新 textarea 可输入的值
    },
    updateTextareaLength(value) {
      this.textareaLength = this.textareaMaxLength - value.length;
    },
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.uploadApkForm.validate(valid => {
        if (valid) {
          console.log(" --- ", this.uploadApkForm);
          addService(this.uploadApkForm).then(function(res) {
            console.log("res --- ", res);
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
            _this.$emit("fetchData");
          });
        } else {
          _this.buttonLoading = false; // 清楚加载中
          return false;
        }
      });
    },
    updateData() {
      console.log("修改");
      let _this = this;
      _this.$refs.uploadApkForm.validate(valid => {
        _this.buttonLoading = true; // 按钮加载中
        if (valid) {
          addService(this.uploadApkForm).then(function(res) {
            if (res.message == "SUCCESS") {
              _this.buttonLoading = false; // 清楚加载中
              _this.close(); // 关闭弹窗
              _this.$notify({
                title: _this.generatePoint("notifySuccess.title"),
                message: _this.generatePoint("notifySuccess.message1"),
                type: "success"
              });
            } else {
              _this.$message.error(_this.generatePoint("system"));
            }
            _this.$emit("fetchData");
          });
        } else {
          _this.buttonLoading = false; // 清楚加载中
          return false;
        }
      });
    },
    parentData(row) {
      console.log("APK父组件传递过来的", row);
      this.dialogStatus = "update";
      if (row) {
        Object.assign(this.uploadApkForm, row);
        if (
          this.uploadApkForm.packageName != "" &&
          this.uploadApkForm.packageName != null
        ) {
          this.fileList.push({
            name: "9WXoJn.txt",
            url: this.uploadApkForm.packageName
          });
        }
      } else {
        this.dialogStatus = "create";
      }
    },
    // 图片
    close() {
      console.log("关闭");
      this.$emit("close");
      this.uploadApkForm = {
        title: "",
        url: "",
        path: "",
        memo: "",
        pushDate: "",
        providerName: "",
        cover: ""
      };
      this.fileList = [];
      this.coverList = [];
      this.$refs.uploadApkForm.resetFields();
    }
  }
};
</script>
