export function importfxx(_this) {
    console.log("11111");
    let inputDOM = _this.$refs.inputer;
    // 通过DOM取文件数据
    _this.file = event.currentTarget.files[0];
    var rABS = false; //是否将文件读取为二进制字符串
    var f = _this.file;
    var reader = new FileReader();
    FileReader.prototype.readAsBinaryString = function (f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var pt = _this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function (e) {
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
            event.target.value = "";
            return this.da;

            // _this.buttonLoading = false;
            // _this.$emit("showLoading", false); // 返回loading效果  true为启动loading false为结束loading
            // _this.$emit("getExcel", this.da); // 返回结果给父组件
        };
        reader.readAsArrayBuffer(f);
    };
    if (rABS) {
        reader.readAsArrayBuffer(f);
    } else {
        reader.readAsBinaryString(f);
    }

}