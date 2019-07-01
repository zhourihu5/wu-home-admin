<template>
  <div class="imagText">
    <el-form
      ref="imagTextForm"
      :rules="rules"
      :model="imagTextForm"
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
        <el-input v-model="imagTextForm.title" :placeholder="$t('table.temp.title')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.cardAddress')" prop="location">
        <el-input-number v-model="imagTextForm.location"></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('form.deliveryTime')" prop="pushDate">
        <el-date-picker
          v-model="imagTextForm.pushDate"
          type="datetime"
          :placeholder="$t('table.temp.date')"
        />
      </el-form-item>
      <!-- <el-form-item :label="$t('form.downtime')" prop="downtime">
        <el-date-picker
          v-model="imagTextForm.downtime"
          type="datetime"
          :placeholder="$t('table.temp.date')"
        />
      </el-form-item>-->
      <el-form-item :label="$t('form.describe')" prop="memo">
        <el-input
          type="textarea"
          :placeholder="$t('placeholder.textarea')"
          :maxlength="textareaMaxLength"
          show-word-limit
          resize="none"
          v-model="imagTextForm.memo"
          @input="onChange"
        ></el-input>
      </el-form-item>
       <el-form-item :label="$t('form.content')" prop="content">
        <el-input
          type="textarea"
          :placeholder="$t('placeholder.textarea')"
          :maxlength="textareaMaxLength"
          show-word-limit
          resize="none"
          v-model="imagTextForm.content"
          @input="onChange"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.addModule')" prop="addModule">
        <div class="add-plate">
          <div class="card" v-for="(item, index) in serviceList" :key="index">
            <div class="cover">
              <img :src="item.cover" :alt="item.title" class="image">
            </div>
            <p>{{item.title}}</p>
            <p class="delete" @click="deleteCard(item.id)">{{ $t('table.delete')}}</p>
          </div>
          <div class="add-service" @click="addPlate">
            <i class="el-icon-plus"></i>
          </div>
        </div>
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
    <!-- dialog -->
    <div class="community-dialog">
      <el-dialog
        :title="$t('form.serviceList')"
        width="80%"
        :visible.sync="dialogFormVisible"
        :modal="false"
        @close="serviceClose = true"
      >
        <!-- 服务列表-->
        <transition name="el-zoom-in-top">
          <service-list
            :deleteId="deleteId"
            :serviceClose="serviceClose"
            @selectService="selectService"
          ></service-list>
        </transition>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="scss">
@import "~@/styles/mixin.scss";
.imagText {
  animation: mymove 0.5s ease-in;
  -webkit-animation: mymove 0.5s ease-in; /*Safari and Chrome*/
  textarea {
    height: 100px;
  }
  .dialog-footer {
    text-align: right;
    margin: 10px;
  }
  @include clearfix;
  .card {
    float: left;
    width: 150px;
    height: 200px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;
    .delete {
      position: absolute;
      top: 2px;
      right: 5px;
      font-size: 14px;
      font-weight: bold;
      color: #ffffff;
      &:hover {
        color: #66b1ff;
        cursor: pointer;
      }
    }

    .cover {
      width: 150px;
      height: 150px;
      img {
        width: 150px;
        height: 150px;
        display: block;
      }
    }
    p {
      margin: 0;
      padding: 0 10px 0 10px;
      color: #303133;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .add-service {
    float: left;
    text-align: center;
    line-height: 200px;
    width: 150px;
    height: 200px;
    border: 1px dashed #c0ccda;
    i {
      font-size: 40px;
      color: #303133;
    }
    &:hover {
      border: 1px dashed #c0ccda;
      border-color: #409eff;
      i {
        color: #409eff;
      }
    }
  }
}
</style>
<script>
import serviceList from "./service";
import { generatePoint } from "@/utils/i18n";
import { addCard } from "@/api/card";
import { overall } from "@/constant/index";
export default {
  components: { serviceList },
  data() {
    return {
      updateURL: overall.uploadUrl,
      fileList: [], // 上传图片回显列表
      buttonLoading: false, // 按钮加载请求
      imagTextForm: {
        cardType: 3, // 图文卡片
        location: 0, // 位置
        pushDate: "", // 上线时间
        // downtime: "", // 下线时间
        memo: "", // 大文本
        title: "",
        path: "", // 上传
        services: "", // 選中的服務
        content: "", // 内容
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
        memo: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        content: [
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
              if (this.imagTextForm.path == "") {
                callback(this.generatePoint("upload"));
              } else {
                callback();
              }
            }
          }
        ],
        addModule: [
          {
            validator: (rule, value, callback) => {
              if (this.serviceList.length == 0) {
                callback(this.generatePoint("modular"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      uploadParams: {
        type: "card"
      },
      textareaMaxLength: 120, // textarea可输入的长度
      textareaLength: 120, // textarea 已经输入的长度
      dialogFormVisible: false, // 是否展示dialog内容
      serviceList: [], // 记录用户选中的服务
      deleteId: "", // 删除卡片的ID
      serviceClose: false //
    };
  },
  created() {
    console.log(process.env.VUE_APP_BASE_API + "/oss/upload", this.isClose);
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
  methods: {
    generatePoint,
    // 增加板块
    addPlate() {
      this.dialogFormVisible = true;
    },
    // 获取用户选中的服务
    selectService(selectList, dataList) {
      console.log("选中的  ", selectList);
      console.log("所有的  ", dataList);
      let _this = this;
      _this.serviceList = [];
      for (let j = 0; j < selectList.length; j++) {
        for (let i = 0; i < dataList.length; i++) {
          if (selectList[j] == dataList[i].id) {
            console.log(dataList[i].title);
            _this.serviceList.push(dataList[i]);
          }
        }
      }
      this.dialogFormVisible = false;
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
    // 更新 textarea 可输入的值
    onChange(value) {
      this.updateTextareaLength(value);
    },
    updateTextareaLength(value) {
      this.textareaLength = this.textareaMaxLength - value.length;
    },
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.imagTextForm.validate(valid => {
        if (valid) {
          _this.serviceList.forEach(function(v, i) {
            if (i == _this.serviceList.length - 1) {
              _this.imagTextForm.services += v.id;
            } else {
              _this.imagTextForm.services += v.id + ",";
            }
          });
          // console.log("保存", _this.imagTextForm)
          addCard(_this.imagTextForm).then(function(res) {
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
    // 删除卡片
    deleteCard(id) {
      let _this = this;
      for (let i = 0; i < _this.serviceList.length; i++) {
        if (id == _this.serviceList[i].id) {
          _this.serviceList.splice(i, 1);
          break;
        }
      }
      _this.deleteId = id + "";
    },
    close() {
      console.log("关闭");
      this.$emit("close");
      this.imagTextForm = {
        cardType: 3, // 图文卡片
        location: 0, // 位置
        pushDate: "", // 上线时间
        // downtime: "", // 下线时间
        memo: "", // 大文本
        title: "",
        path: "", // 上传
        service: "", // 選中的服務
        content: ""
      };
      this.serviceList = []; // 清空服务
      this.fileList = [];
      this.$refs.imagTextForm.resetFields();
    },
    handleAvatarSuccess(res, file) {
      // console.log("handleAvatarSuccess --", res, file);
      this.imagTextForm.path = res.data;
    },
    beforeAvatarUpload(file) {
      // console.log("beforeAvatarUpload --", file);
      this.uploadParams.file = file;
    }
  }
};
</script>