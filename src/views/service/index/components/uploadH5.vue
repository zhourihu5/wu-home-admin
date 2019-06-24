<template>
  <div class="uploadH5">
    <el-form
      ref="uploadH5Form"
      :rules="rules"
      :model="uploadH5Form"
      label-position="left"
      label-width="100px"
      style="width: 600px; margin-left:50px;"
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
      <el-form-item :label="$t('form.title')" prop="title">
        <el-input v-model="uploadH5Form.title" :placeholder="$t('table.temp.title')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.link')" prop="url">
        <el-input v-model="uploadH5Form.url" :placeholder="$t('table.temp.url')"/>
      </el-form-item>
      <el-form-item :label="$t('form.describe')" prop="memo">
        <el-input
          type="textarea"
          :placeholder="$t('placeholder.textarea')"
          :maxlength="textareaMaxLength"
          show-word-limit
          resize="none"
          v-model="uploadH5Form.memo"
          @input="onChange"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('form.uptime')" prop="createDate">
        <el-date-picker
          v-model="uploadH5Form.createDate"
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
.uploadH5 {
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
import { addService } from "@/api/service";
import { generatePoint } from "@/utils/i18n";
import { service } from "@/constant/service"; // 服务 常用常量
export default {
  data() {
    return {
      updateURL: overall.uploadUrl,
      uploadParams: {
        type: "service"
      },
      uploadH5Form: {
        title: "",
        url: "",
        cover: "",
        memo: "",
        // createDate: "",
        flag: service.flags[1].value,
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
              if (this.uploadH5Form.cover == "") {
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
        ]
      },
      textareaMaxLength: 120, // textarea可输入的长度
      textareaLength: 120 // textarea 已经输入的长度
    };
  },
  props: {
    isClose: {
      type: Boolean
    }
  },
  watch: {
    isClose: function(newVal) {
      if (!newVal) {
        this.close();
      }
    }
  },
  created() {},
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
      this.uploadH5Form.cover = res.data;

      console.log("this.uploadH5Form --- ", this.uploadH5Form.fileList);
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
      _this.$refs.uploadH5Form.validate(valid => {
        if (valid) {
          console.log(" --- ", this.uploadH5Form);
          addService(this.uploadH5Form).then(function(res) {
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
      _this.$refs.uploadH5Form.validate(valid => {
        if (valid) {
          addService(this.uploadH5Form).then(function(res) {
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
    // 回显数据
    parentData(row) {
      console.log("H5父组件传递过来的", row);
      this.dialogStatus = "update";
      if (row) {
        Object.assign(this.uploadH5Form, row);
        if (this.uploadH5Form.cover != "" && this.uploadH5Form.cover != null) {
          this.fileList.push({
            name: "9WXoJn.txt",
            url: this.uploadH5Form.cover
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
      this.uploadH5Form = {
        title: "",
        url: "",
        path: "",
        memo: "",
        pushDate: ""
      };
      this.fileList = [];
      this.$refs.uploadH5Form.resetFields();
    }
  }
};
</script>
