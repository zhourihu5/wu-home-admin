<template>
  <div class="upload-text">
    <h3>{{ $t('form.CoverAndSummary') }}</h3>
    <div class="cover">
      <el-upload
        v-show="uploadIsShow"
        :auto-upload="false"
        action=""
        list-type="picture-card"
        :limit="1"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :multiple="false"
        :file-list="fileList"
        :on-error="errorUpload"
        :on-exceed="exceedUpload"
        :on-change="onUpload"
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
</template>
<style lang="scss">
@import "~@/styles/mixin.scss";
.upload-text {
  @include clearfix;
  // margin: 50px 0 50px 0;
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
</style>
<script>
export default {
  data() {
    return {
      uploadIsShow: true,
      fileList: [], // 上传图片回显列表
      textarea: "", // 大文本
      textareaMaxLength: 120, // textarea可输入的长度
      textareaLength: 120 // textarea 已经输入的长度
    };
  },
  methods: {
    handlePictureCardPreview(file) {
      console.log(111, file);
      this.dialogImageUrl = file.url;
      this.dialogImgVisible = true;
    },
    // 删除上传列表文件时触发
    handleRemove(file, fileList) {
      this.fileList = fileList;
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
    onUpload(file, fileList) {
      console.log("---- ", file, fileList)
    }
  }
};
</script>
