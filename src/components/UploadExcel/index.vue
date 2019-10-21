<template>
  <div>
    <input
      id="upload"
      type="file"
      @change="importfxx(this)"
      ref="excel-upload-input"
      class="excel-upload-input"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
    />
    <!-- <input type="file" @change="importf(this)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/> -->
    <el-button
      v-if="buttomType === 'text'"
      type="text"
      @click="handleUpload"
      :loading="buttonLoading"
    >{{ $t('form.onImport') }}</el-button>
    <el-button
      v-if="buttomType === 'primary'"
      type="primary"
      @click="handleUpload"
      :loading="buttonLoading"
    >{{ $t('form.onImport') }}</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      da: "",
      buttonLoading: false
    };
  },
  props: {
    buttomType: {
      type: String,
      default: "text"
    }
  },
  methods: {
    handleUpload() {
      this.$refs["excel-upload-input"].click();
    },
    // 结束按钮loading
    endLoading() {
      this.buttonLoading = false;
    },
    // excel
    importfxx(obj) {
      console.log(1111);
      let _this = this;
      _this.buttonLoading = true; // 导入按钮加载中防止多次点击
      _this.$emit("showLoading", true); // 返回loading效果  true为启动loading false为结束loading
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据
      this.file = event.currentTarget.files[0];
      var rABS = false; //是否将文件读取为二进制字符串
      var f = this.file;
      var reader = new FileReader();
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var pt = this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        event.currentTarget.value = ""; // 清空file
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require("xlsx");
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化
              type: "base64"
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary"
            });
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
          this.da = [...outdata];
          _this.$emit("getExcel", this.da); // 返回结果给父组件
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
</style>