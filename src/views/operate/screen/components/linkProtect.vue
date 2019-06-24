<template>
  <div class="link-protect">
    <upload-text></upload-text>
    <add-url></add-url>
    <date-time></date-time>
    <number></number>
    <div class="options">
      <el-button type="primary">保存</el-button>
      <el-button type="primary">预览</el-button>
      <el-button type="primary">保存并投放</el-button>
    </div>
  </div>
</template>
<style lang="scss">
.link-protect {
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
import dateTime from "./dateTime";
import number from "./number";
import addUrl from "./../../../../components/operate/addUrl"
export default {
  data() {
    return {
      input1: ""
    };
  },
  components: {
    uploadText,
    dateTime,
    number,
    addUrl
  },
  methods: {}
};
</script>