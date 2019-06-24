<template>
  <div class="find">
    <div class="cover-summary">
      <h3>{{ $t('form.CoverAndSummary') }}</h3>
      <div class="cover">
        <el-upload
          v-show="uploadIsShow"
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :limit="1"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :multiple="false"
          :file-list="fileList"
          :on-error="errorUpload"
          :on-exceed="exceedUpload"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div class="content">
        <el-input
          type="textarea"
          :placeholder="$t('placeholder.textarea')"
          :maxlength="textareaMaxLength"
          show-word-limit
          resize="none"
          v-model="textarea"
          @input="onChange"
        ></el-input>
        <div class="textarea-point">
          <p>{{ $t('other.remaining') }} {{textareaLength}} {{ $t('other.characters') }}</p>
        </div>
      </div>
    </div>
    <div class="create-date">
      <h3>{{ $t('form.PutIn') }}</h3>
      <div class="block">
        <span class="demonstration">{{ $t('form.putinTime') }}:</span>
        <el-date-picker
          v-model="putInTime"
          type="datetime"
          :placeholder="$t('placeholder.putinTime')"
        ></el-date-picker>
      </div>
    </div>
    <cared-list :careds="careds" ref="headerChild" @onPage="getPage" v-loading="loading"></cared-list>
    <div class="options-main">
      <el-button type="primary" size="medium" @click="onSvae">{{ $t('table.preserve') }}</el-button>
      <el-button type="primary" size="medium">{{ $t('table.preview') }}</el-button>
      <el-button type="primary" size="medium">{{ $t('table.preserveAndPutIn') }}</el-button>
    </div>
  </div>
</template>
<style lang="scss" >
@import "~@/styles/mixin.scss";
.find {
  margin: 20px;
  .cover-summary {
    @include clearfix;
    .cover {
      float: left;
      width: 30%;
      .el-upload-list__item {
        width: 156px !important;
        height: 156px !important;
      }
      .el-upload--picture-card {
        width: 156px;
        height: 156px;
      }
    }
    .content {
      float: left;
      width: 70%;
      height: 148px;
      position: relative;
      .el-textarea {
        height: 100%;
        textarea {
          height: 100%;
        }
      }

      .textarea-point {
        position: absolute;
        // bottom: -10px;
        bottom: 0px;
        right: 10px;
        text-align: right;
        p {
          font-size: 12px;
          color: #c0c0c0;
        }
      }
    }
  }
  .create-date {
    padding: 50px 0 50px 0;
    .demonstration {
      font-size: 14px;
    }
  }
  .options-main {
    text-align: center;
    padding: 50px;
    button {
      margin: 30px;
    }
  }
}
</style>
<script>
import { getCardList } from "./../../../api/card";
import { generatePoint } from "@/utils/i18n";
import caredList from "./components/caredList";
export default {
  data() {
    return {
      careds: null, // 卡片列表对象
      dialogImageUrl: "",
      dialogImgVisible: false,
      uploadIsShow: true,
      textareaMaxLength: 120, // textarea可输入的长度
      textareaLength: 120, // textarea 已经输入的长度
      showWordLimit: true,
      currentDate: new Date(),

      dialogVisible: false, // 是否显示dialog

      // 保存参数
      textarea: "", // 大文本
      fileList: [], // 上传图片回显列表
      putInTime: null, // 投放时间

      // 分页
      pageNum: 1, // 默认第一页面
      pageSize: 10, // 一页多少条
      loading: true, // 列表数据加载loading
    };
  },
  created() {
    this.getCardDatas(); // 获取卡片数据
  },
  components: {
    caredList // 卡片
  },
  methods: {
    generatePoint,
    getCardDatas() {
      let _this = this;
      // 获取数据
      getCardList({pageNum: _this.pageNum, pageSize: _this.pageSize}).then(function(res) {
        setTimeout(() => {
          _this.careds = res;
          _this.loading = false;
        }, 2000);
      });
    },
    // 删除上传列表文件时触发
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handlePictureCardPreview(file) {
      console.log(111, file);
      this.dialogImageUrl = file.url;
      this.dialogImgVisible = true;
    },
    // 上传错误时候触发
    errorUpload(err, file, fileList) {
      console.log(err);
      console.log(file);
      console.log(fileList);
      this.fileList.push(file); // 回显
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
    onChange(value) {
      this.updateTextareaLength(value); // 更新 textarea 可输入的值
    },
    updateTextareaLength(value) {
      this.textareaLength = this.textareaMaxLength - value.length;
    },
    // 保存
    onSvae() {
      let _this = this;
      var params = {
        textarea: _this.textarea,
        cities: _this.$refs.headerChild.cities, // 获取子组件中选中的卡片
        fileList: _this.fileList, // 上传图片回显列表
        putInTime: _this.putInTime // 投放时间
      };
      console.log("params --- >", params);
      this.$notify({
        title: this.generatePoint("notifySuccess.title"),
        message: this.generatePoint("notifySuccess.message"),
        type: "success"
      });
    },
    // 分页查询数据
    getPage() {
      let _this = this;
      _this.pageNum = this.pageNum + 1; // 更新分页数
      console.log("调用分页", this.pageNum + 1);
      _this.loading = true;
      // 获取数据
      getCardList({pageNum: _this.pageNum, pageSize: _this.pageSize}).then(function(res) {
        console.log("res.data --- ", res.data)
        setTimeout(() => {
          _this.careds.isNext = res.isNext;
          _this.careds.data = _this.careds.data.concat(res.data);
          console.log( _this.list)
          _this.loading = false;
        }, 2000);
      });
    }
  }
};
</script>
