<template>
  <div class="find">
    <div class="cover-summary">
      <!-- <h3>{{ $t('form.Cover') }}</h3>
      <div class="cover">
        <el-upload
          :action="updateURL"
          list-type="picture-card"
          :limit="1"
          :multiple="false"
          :file-list="fileList"
          :on-exceed="exceedUpload"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :data="uploadParams"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>-->
    </div>
    <div class="service-list">
      <div class="myForm">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="my-tabs">
          <el-tab-pane :label="$t('form.applicationAll')" name="serviceAll"></el-tab-pane>
          <el-tab-pane :label="$t('form.UpperShelf')" name="upperShelf"></el-tab-pane>
        </el-tabs>
        <component :is="currentView" ref="component"></component>
      </div>
    </div>
    <div class="options-main">
      <el-button
        type="primary"
        size="medium"
        @click="createData"
      >{{ index == 0 ? $t('table.upperShelf') : $t('table.lowerShelf')}}</el-button>
      <!-- <el-button type="primary" size="medium">{{ $t('table.preview') }}</el-button>
      <el-button type="primary" size="medium">{{ $t('table.preserveAndPutIn') }}</el-button>-->
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
  .service-list {
    // margin-top: 20px;
    .myForm {
      // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      // padding: 10px;
      position: relative;
      height: 800px;
      overflow: auto;
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
    // padding: 50px;
    button {
      margin: 10px;
    }
  }
}
</style>
<script>
import { generatePoint } from "@/utils/i18n";
import { overall } from "@/constant/index";
import { getServiceAll, updateService } from "@/api/service";
import serviceAll from "./components/serviceAll"; // 全部应用
import upperShelf from "./components/recommend"; // 已经上架应用
export default {
  components: { serviceAll, upperShelf },
  data() {
    return {
      activeName: "serviceAll",
      index: 0,
      arr: ["serviceAll", "upperShelf"],
      updateURL: overall.uploadUrl,
      uploadParams: {
        type: "service"
      },
      fileList: [], // 上传图片回显列表
      loading: true, // 列表数据加载loading
      discoverForm: {
        cover: ""
      },
      listQuery: {
        // type: 1, // 发现type
        pageNum: 1,
        pageSize: 10
      },
      serviceList: []
    };
  },
  computed: {
    // 动态组件
    currentView() {
      return this.arr[this.index];
    }
  },
  methods: {
    generatePoint,
    // 页签切换
    handleClick(tab, event) {
      console.log("页签切换 ", tab.index);
      this.index = tab.index;
    },
    handleAvatarSuccess(res, file) {
      this.discoverForm.cover = res.data;
    },
    handleAvatarError(err, file, fileList) {
      console.log(err, file, fileList);
    },
    beforeAvatarUpload(file) {
      this.uploadParams.file = file;
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
    // 保存
    createData() {
      let msg = "";
      let flag = true; // 可以提交
      // 验证图片
      // if (this.discoverForm.cover == "") {
      //   flag = false;
      //   msg +=
      //     (msg == "" ? "1. " : "2. ") +
      //     this.generatePoint("notifyError.message") +
      //     (msg == "" ? "<br/> " : "");
      // }
      // 验证服务
      if (this.$refs.component.checkedCities.length == 0) {
        flag = false;
        msg +=
          (msg == "" ? "1. " : "2. ") +
          this.generatePoint("notifyError.message1") +
          (msg == "" ? "<br/> " : "");
      }

      if (flag) {
        let _this = this;
        // 修改
        updateService({
          type: _this.index == 0 ? 2 : null,
          service: this.$refs.component.checkedCities.join(",")
        }).then(function(res) {
          console.log("res --- ", res);
          if (res.message == "SUCCESS") {
            let msg =
              _this.index == 0
                ? _this.generatePoint("notifySuccess.message3")
                : _this.generatePoint("notifySuccess.message6");
            _this.$notify({
              title: _this.generatePoint("notifySuccess.title"),
              message: msg,
              type: "success"
            });
          } else {
            _this.$message.error(_this.generatePoint("system"));
          }
          _this.$refs.component.restDefault();
          _this.$refs.component.fetchData(); // 更新列表
        });
      } else {
        this.$notify({
          dangerouslyUseHTMLString: true,
          title: this.generatePoint("notifyWarning.title1"),
          message: msg,
          type: "warning"
        });
      }
    }
  }
};
</script>
