<template>
  <div class="affair">
    <el-button
      class="filter-item"
      style="margin-left: 10px;"
      type="primary"
      icon="el-icon-edit"
      @click="showAddUserView"
    >{{ $t('table.add') }}</el-button>
    <cared-list :careds="careds" ref="headerChild" @onPage="getPage" v-loading="loading"></cared-list>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:20px;"
      >
        <el-form-item :label="$t('form.icon')" prop="userName">
          <!-- <el-input v-model="temp.userName"/> -->
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
        </el-form-item>
        <el-form-item :label="$t('form.mainTitle')" prop="userName">
          <el-input v-model="temp.mainTitle"/>
        </el-form-item>
        <el-form-item :label="$t('form.subheading')" prop="userName">
          <el-input v-model="temp.subheading"/>
        </el-form-item>
        <el-form-item :label="$t('form.link')" prop="userName">
          <el-input v-model="temp.link"/>
        </el-form-item>
        <el-form-item :label="$t('form.PutIn')" prop="userName">
          <el-date-picker
            v-model="temp.putInTime"
            type="datetime"
            :placeholder="$t('placeholder.putinTime')"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >{{ dialogStatus==='create' ? $t('table.preserve') : $t('table.update') }}</el-button>
        <el-button type="primary" @click="preview()">{{ $t('table.preview') }}</el-button>
        <el-button type="primary" @click="preserveAndPutIn()">{{ $t('table.preserveAndPutIn') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.affair {
  margin: 20px;
  .el-dialog__body {
    text-align: left;
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
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示表单dialog内容
      // 表单验证
      rules: {},
      // 表单数据
      temp: {
        theme: "", // 主标题
        subheading: "", // 副标题
        link: "", // 链接
        putInTime: null // 投放时间
        // userName: "",
        // userId: "",
        // password: "",
        // email: "",
        // radioName: "",
        // phone: "",
        // rolesValue: "",
        // dictionaryNameList: [], // 地区
        // expireTime: ""
      },
      fileList: [], // 上传图片回显列表
      dialogImageUrl: "",
      dialogImgVisible: false,
      uploadIsShow: true,

      pageNum: 1, // 默认第一页面
      pageSize: 10, // 一页多少条
      loading: true,
    };
  },
  created() {
    this.getCardDatas(); // 获取卡片数据
  },
  components: {
    caredList
  },
  methods: {
    generatePoint,
    // 获取卡片数据
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

    // 显示添加/修改窗口
    showAddUserView() {
      let _this = this;
      _this.dialogStatus = "create"; // 标示创建
      _this.dialogFormVisible = true; // 展示弹窗
    },

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
    // 保存
    createData() {
      console.log("createData");
      this.dialogFormVisible = false; // 关闭弹窗
      this.$notify({
        title: this.generatePoint("notifySuccess.title"),
        message: this.generatePoint("notifySuccess.message"),
        type: "success"
      });
    },
    // 修改
    updateData() {
      console.log("updateData");
      this.dialogFormVisible = false; // 关闭弹窗
      this.$notify({
        title: this.generatePoint("notifySuccess.title"),
        message: this.generatePoint("notifySuccess.message1"),
        type: "success"
      });
    },
    // 预览
    preview() {
      console.log("preview");
      this.dialogFormVisible = false; // 关闭弹窗
    },
    // 保存并投放
    preserveAndPutIn() {
      console.log("preserveAndPutIn");
      this.dialogFormVisible = false; // 关闭弹窗
      this.$notify({
        title: this.generatePoint("notifySuccess.title"),
        message: this.generatePoint("notifySuccess.message2"),
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
