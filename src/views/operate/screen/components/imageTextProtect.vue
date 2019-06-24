<template>
  <div class="image-text">
    <upload-text ref="myUpload"></upload-text>
    <date-time></date-time>
    <number></number>
    <div class="add-plate">
      <span class="add-box">
        <span class="add-button">
          <i class="el-icon-plus"></i>
        </span>
        <p class="title">增加功能板块</p>
      </span>
      <span class="add-box">
        <span class="add-button">
          <i class="el-icon-plus"></i>
        </span>
        <p class="title">增加链接板块</p>
      </span>
    </div>
    <wangeditor></wangeditor>
    <div class="options">
      <el-button type="primary" @click="onSave">保存</el-button>
      <el-button type="primary">预览</el-button>
      <el-button type="primary">保存并投放</el-button>
    </div>
  </div>
</template>
<style lang="scss">
.image-text {
  .add-plate {
      margin: 50px 0 50px 0;
    .add-box {
      display: inline-block;
      width: 100px;
      height: 100px;
      margin-right: 30px;
      .title {
        color: #909399;
        text-align: center;
      }
      .add-button {
        display: inline-block;
        width: 100%;
        height: 100%;
        border: 1px dashed #c0ccda;
        text-align: center;
        line-height: 100px;
        background-color: #fbfdff;
        i {
          font-weight: bold;
          font-size: 28px;
          color: #8c939d;
        }
        &:hover {
          border-color: #409eff;
          color: #409eff;
        }
      }
    }
  }
  .options {
    margin-bottom: 30px;
    text-align: center;
    button {
      margin-right: 50px;
    }
  }
}
</style>
<script>
import uploadText from "./../../../../components/operate/uploadText";
import wangeditor from "./../../../../components/Wangeditor/index";
import number from "./number";
import dateTime from "./dateTime";
export default {
  data() {
    return {};
  },
  components: {
    uploadText,
    wangeditor,
    number,
    dateTime
  },
  methods: {
    onSave() {
      console.log(this.$refs.myUpload)
    }
  }
};
</script>

