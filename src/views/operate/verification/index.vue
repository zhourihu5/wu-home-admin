<template>
  <div class="verification">
    <div class="verification-title">
      <h1>验证码管理</h1>
    </div>
    <div class="verification-form">
      <el-form
        ref="verificationForm"
        :rules="rules"
        :model="verificationForm"
        label-position="right"
        label-width="110px"
        style="width: 100%"
      >
        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input
            class="my-input"
            v-model="verificationForm.phone"
            :placeholder="$t('table.temp.content')"
          />
        </el-form-item>
        <el-form-item :label="$t('table.verificationCode')" prop="verificationCode">
          <el-input
            class="my-input"
            v-model="verificationForm.code"
            :placeholder="$t('table.temp.content')"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="empty">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="createData"
          :loading="buttonLoading"
        >{{ $t('table.preserve') }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { addPhoneCode } from "@/api/user";
import { generatePoint, generateI18n } from "@/utils/i18n";
// 验证手机号码
function isvalidPhone(value) {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(value)) {
    return false;
  } else {
    return true;
  }
}
export default {
  data() {
    return {
      buttonLoading: false,
      verificationForm: {
        phone: "",
        code: ""
      },
      rules: {
        phone: [
          {
            required: true,
            trigger: "change",
            validator: this.validatePhone
          }
        ]
      }
    };
  },
  methods: {
    generatePoint,
    generateI18n,
    // 验证账号 手机格式
    validatePhone(rule, value, callback) {
      let _this = this;
      if (!isvalidPhone(value)) {
        callback(new Error(this.generatePoint("phone")));
      } else {
        callback();
      }
    },
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.verificationForm.validate(valid => {
        if (valid) {
          try {
            // 发送验证码
            addPhoneCode({
              userName: _this.verificationForm.phone,
              code: _this.verificationForm.code
            }).then(function(res) {
              console.log("res --- >", res);
              if (res.message == "SUCCESS") {
                _this.buttonLoading = false; // 清空按钮加载状态
                let content =
                  res.data == "发送失败" ? res.data : "发送成功 : " + res.data;
                _this.$alert(
                  content,
                  _this.generatePoint("notifySuccess.tips"),
                  {
                    confirmButtonText: _this.generateI18n("table.confirm"),
                    callback: action => {}
                  }
                );
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
          _this.buttonLoading = false; // 清楚加载中
          return false;
        }
      });
    },
    empty() {
      this.verificationForm = {
        phone: "",
        code: ""
      };
      this.buttonLoading = false; // 清楚加载中
    }
  }
};
</script>
<style lang="scss" scoped>
.verification {
  .verification-title {
    text-align: center;
  }
  .verification-form {
    width: 30%;
    margin: 30px auto;
    .dialog-footer {
      text-align: center;
      padding-bottom: 50px;
    }
  }
}
</style>