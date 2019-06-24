<template>
  <div class="uploadApk">
    <el-form
      ref="uploadApkForm"
      :rules="rules"
      :model="uploadApkForm"
      label-position="left"
      label-width="100px"
      style="width: 600px; margin-left:50px;"
    >
      <el-form-item :label="$t('form.Cover')" prop="file">
        <!-- <el-upload
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
        </el-upload>-->
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
      <el-form-item :label="$t('form.link')" prop="url">
        <el-input v-model="uploadApkForm.url" :placeholder="$t('table.temp.url')"/>
      </el-form-item>
      <el-form-item :label="$t('form.describe')" prop="memo">
        <el-input
          type="textarea"
          :placeholder="$t('placeholder.textarea')"
          :maxlength="textareaMaxLength"
          show-word-limit
          resize="none"
          v-model="uploadApkForm.memo"
          @input="onChange"
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
      >{{ $t('table.confirm') }}</el-button>
    </div>
  </div>
</template>
<style lang="scss">
@import "~@/styles/mixin.scss";
.uploadApk {
  animation: mymove 0.5s ease-in;
  -webkit-animation: mymove 0.5s ease-in; /*Safari and Chrome*/
  textarea {
    height: 100px;
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
      updateURL: overall.uploadUrl,
      uploadParams: {
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
        id: ""
      },
      fileList: [], // 上传图片回显列表
      rules: {
        // createDate: [
        //   {
        //     required: true,
        //     trigger: "change",
        //     message: this.generatePoint("unitName")
        //   }
        // ],
        title: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("title")
          }
        ],
        url: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        file: [
          {
            validator: (rule, value, callback) => {
              console.log("验证");
              if (this.uploadApkForm.providerName == "") {
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
      console.log("上传成功 --- ", file);
      this.uploadApkForm.packageName = res.data;
    },
    beforeAvatarUpload(file) {
      this.uploadParams.file = file;
    },
    onChange(value) {
      this.updateTextareaLength(value); // 更新 textarea 可输入的值
    },
    updateTextareaLength(value) {
      this.textareaLength = this.textareaMaxLength - value.length;
    },
    createData() {
      let _this = this;
      _this.$refs.uploadApkForm.validate(valid => {
        if (valid) {
          console.log(" --- ", this.uploadApkForm);
          addService(this.uploadApkForm).then(function(res) {
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
            _this.$emit("fetchData");
          });
        } else {
          return false;
        }
      });
    },
    updateData() {
      console.log("修改");
      let _this = this;
      _this.$refs.uploadApkForm.validate(valid => {
        if (valid) {
          addService(this.uploadApkForm).then(function(res) {
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
            _this.$emit("fetchData");
          });
        } else {
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
        providerName: ""
      };
      this.fileList = [];
      this.$refs.uploadApkForm.resetFields();
    }
  }
};
</script>
