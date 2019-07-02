<template>
  <div class="link">
    <el-form
      ref="linkForm"
      :rules="rules"
      :model="linkForm"
      label-position="right"
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
        <el-input v-model="linkForm.title" :placeholder="$t('table.temp.title')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.cardAddress')" prop="location">
        <el-input-number v-model="linkForm.location"></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('form.deliveryTime')" prop="pushDate">
        <el-date-picker
          v-model="linkForm.pushDate"
          type="datetime"
          :placeholder="$t('table.temp.date')"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <!-- <el-form-item :label="$t('form.downtime')" prop="downtime">
        <el-date-picker
          v-model="linkForm.downtime"
          type="datetime"
          :placeholder="$t('table.temp.date')"
        />
      </el-form-item>-->
      <el-form-item :label="$t('form.link')" prop="url">
        <el-input v-model="linkForm.url" :placeholder="$t('table.temp.url')"/>
      </el-form-item>
      <el-form-item :label="$t('form.describe')" prop="memo">
        <el-input
          type="textarea"
          :placeholder="$t('placeholder.textarea')"
          :maxlength="textareaMaxLength"
          show-word-limit
          resize="none"
          v-model="linkForm.memo"
          @input="onChange"
        ></el-input>
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
  </div>
</template>
<style lang="scss">
@import "~@/styles/mixin.scss";
.link {
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
import { generatePoint } from "@/utils/i18n";
import { addCard } from "@/api/card";
import { overall } from "@/constant/index";
export default {
  data() {
    return {
      updateURL: overall.uploadUrl,
      fileList: [], // 上传图片回显列表
      buttonLoading: false, // 按钮加载请求
      textareaMaxLength: 120, // textarea可输入的长度
      textareaLength: 120, // textarea 已经输入的长度
      pickerOptions: {
        disabledDate(time) {
          // 只可选择大于当前时间的日期
          return time.getTime() < Date.now();
        }
      },
      linkForm: {
        cardType: 1, // 图文卡片
        location: 0, // 位置
        pushDate: "", // 上线时间
        title: "",
        path: "", // 上传
        // downtime: "", // 下线时间
        url: "", // 链接
        memo: ""
      },
      uploadParams: {
        type: "card"
      },
      // 验证规则
      rules: {
        pushDate: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("unitName")
          }
        ],
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
            validator: this.validateUrl
          }
        ],
        file: [
          {
            validator: (rule, value, callback) => {
              console.log("验证");
              if (this.linkForm.path == "") {
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
      }
    };
  },
  created() {
    console.log("上传连接 --- ", overall, this.updateURL);
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
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.linkForm.validate(valid => {
        if (valid) {
          console.log(" -- ", _this.linkForm);
          addCard(_this.linkForm).then(function(res) {
            console.log("res --- >", res);
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
      this.linkForm.path = res.data;
    },
     // 更新 textarea 可输入的值
    onChange(value) {
      this.updateTextareaLength(value);
    },
    updateTextareaLength(value) {
      this.textareaLength = this.textareaMaxLength - value.length;
    },
    // 图片
    close() {
      console.log("关闭");
      this.$emit("close");
      this.linkForm = {
        cardType: 3, // 图文卡片
        location: 0, // 位置
        pushDate: "", // 上线时间
        title: "",
        path: "", // 上传
        // downtime: "", // 下线时间
        url: "", // 链接
        memo: ""
      };
      this.fileList = [];
      this.$refs.linkForm.resetFields();
    }
  }
};
</script>s