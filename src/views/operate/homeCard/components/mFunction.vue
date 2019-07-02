<template>
  <div class="mfunction">
    <el-form
      ref="mfunctionForm"
      :rules="rules"
      :model="mfunctionForm"
      label-position="right"
      label-width="100px"
      style="width: 600px; margin-left:50px;"
    >
      <!-- <el-form-item :label="$t('form.Cover')" prop="file">
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
      </el-form-item>-->
      <!-- <el-form-item :label="$t('form.title')" prop="title">
        <el-input v-model="mfunctionForm.title" :placeholder="$t('table.temp.title')"></el-input>
      </el-form-item>-->
      <el-form-item :label="$t('form.modular')" prop="url">
        <el-select v-model="mfunctionForm.url" :placeholder="$t('table.temp.modular')">
          <el-option v-for="item in modulars" :key="item.id" :label="item.title" :value="item.flag"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('form.cardAddress')" prop="location">
        <el-input-number v-model="mfunctionForm.location"></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('form.deliveryTime')" prop="pushDate">
        <el-date-picker
          v-model="mfunctionForm.pushDate"
          type="datetime"
          :placeholder="$t('table.temp.date')"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <!-- <el-form-item :label="$t('form.describe')" prop="memo">
        <el-input
          type="textarea"
          :placeholder="$t('placeholder.textarea')"
          :maxlength="textareaMaxLength"
          show-word-limit
          resize="none"
          v-model="mfunctionForm.memo"
          @input="onChange"
        ></el-input>
      </el-form-item> -->
      <!-- <el-form-item :label="$t('form.downtime')" prop="downtime">
        <el-date-picker
          v-model="mfunctionForm.downtime"
          type="datetime"
          :placeholder="$t('table.temp.date')"
        />
      </el-form-item>-->
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
.mfunction {
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
import { addCard, getModule } from "@/api/card";
import { generatePoint } from "@/utils/i18n";
import { overall } from "@/constant/index";
export default {
  data() {
    return {
      updateURL: overall.uploadUrl,
      fileList: [], // 上传图片回显列表
      buttonLoading: false, // 按钮加载请求
      pickerOptions: {
        disabledDate(time) {
          // 只可选择大于当前时间的日期
          return time.getTime() < Date.now();
        }
      },
      mfunctionForm: {
        cardType: 2, // 功能型
        location: 0, // 位置
        pushDate: "", // 上线时间
        // downtime: "", // 下线时间
        title: "",
        path: "", // 上传
        url: "",
        memo: ""
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
        // title: [
        //   {
        //     required: true,
        //     trigger: "change",
        //     message: this.generatePoint("title")
        //   }
        // ],
        file: [
          {
            validator: (rule, value, callback) => {
              console.log("验证");
              if (this.mfunctionForm.path == "") {
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
            message: this.generatePoint("required")
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
      modulars: [], // 模块
      uploadParams: {
        type: "card"
      },
      textareaMaxLength: 120, // textarea可输入的长度
      textareaLength: 120, // textarea 已经输入的长度
    };
  },
  created() {
    this.getModuleList();
  },
  methods: {
    generatePoint,
    // 获取模块
    getModuleList() {
      let _this = this;
      getModule().then(function(res) {
        console.log("模块", res);
        _this.modulars = res.data;
      });
    },
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.mfunctionForm.validate(valid => {
        if (valid) {
          console.log(" --- ", _this.modulars);
          // 取出用户选择的ICON
          _this.modulars.forEach(function(v, i) {
            if (v.flag == _this.mfunctionForm.url) {
              _this.mfunctionForm.memo = v.memo;
              _this.mfunctionForm.title = v.title;
              _this.mfunctionForm.path = v.icon;
            }
          });
          console.log("保存", _this.mfunctionForm);
          addCard(_this.mfunctionForm).then(function(res) {
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
    handleAvatarSuccess(res, file) {
      // console.log("handleAvatarSuccess --", res, file);
      this.mfunctionForm.path = res.data;
    },
     // 更新 textarea 可输入的值
    onChange(value) {
      this.updateTextareaLength(value);
    },
    updateTextareaLength(value) {
      this.textareaLength = this.textareaMaxLength - value.length;
    },
    beforeAvatarUpload(file) {
      // console.log("beforeAvatarUpload --", file);
      this.uploadParams.file = file;
    },
    close() {
      console.log("关闭");
      this.$emit("close");
      this.mfunctionForm = {
        cardType: 3, // 图文卡片
        location: 0, // 位置
        pushDate: "", // 上线时间
        // downtime: "", // 下线时间
        title: "",
        path: "", // 上传
        url: "",
        memo: ""
      };
      this.fileList = [];
      this.$refs.mfunctionForm.resetFields();
    }
  }
};
</script>