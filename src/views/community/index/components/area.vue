<template>
  <div class="add-area" v-loading="pageLoading">
    <!-- form --->
    <h3>{{ $t('steps.area') }}</h3>
    <div class="area-form">
      <el-form
        ref="areaForm"
        :rules="rules"
        :model="areaForm"
        label-position="right"
        label-width="100px"
        style="width: 60%"
        class="my-form"
      >
        <el-form-item v-if="stageList.length > 0" :label="$t('form.stage')" prop="issueCode">
          <el-select v-model="areaForm.issueCode" placeholder="请选择">
            <el-option
              v-for="item in stageList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('form.name')" prop="name">
          <el-input
            style="width: 60%;"
            v-model="areaForm.name"
            :placeholder="$t('table.temp.name')"
            :clearable="true"
            @clear="inputClear"
            @keyup.enter.native="createData"
          />
          <el-button
            :loading="buttonLoading"
            @click="createData"
          >{{ dialogStatus==='create' ? $t('table.add'):$t('table.update')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="area-table">
      <div class="my-list" v-loading="listLoading">
        <div v-if="listTags.length == 0" class="not-date">
          <p>{{ $t('table.noData') }}</p>
        </div>
        <div v-else>
          <el-button
            v-for="(item, index) in listTags"
            :key="index"
            type="primary"
            size="medium"
            @click="updateItem(item)"
          >{{item.name}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.add-area {
  padding: 10px 50px 10px 50px;
  h3 {
    text-align: center;
    margin-bottom: 30px;
  }
  .area-form {
    .my-form {
      margin: 0 auto;
    }
  }
  .area-table {
    h3 {
      color: #409eff;
      font-size: 15px;
      text-align: center;
    }
    .my-list {
      max-height: 175px;
      overflow: auto;
      margin: 0 30px 0 30px;
      .el-button--medium {
        margin: 10px !important;
      }
      .not-date {
        font-size: 14px;
        text-align: center;
        margin-top: 150px;
        color: #909399;
      }
    }
  }
}
</style>
<script>
import { generatePoint } from "@/utils/i18n";
import {
  getDistrictByCommuntity,
  getStageByCommuntity,
  addArea,
  getCommuntityById
} from "@/api/community";
export default {
  data() {
    return {
      listTags: [],
      listLoading: false,
      buttonLoading: false,
      stageList: [], // 期列表
      community: null, // 社区对象
      pageLoading: true,
      areaForm: {
        id: "",
        name: "",
        code: "",
        issueCode: ""
      },
      rules: {
        name: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        issueCode: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("mandatory")
          }
        ]
      },
      dialogStatus: "create" // 标示当前操作是添加、还是修改
    };
  },
  created() {
    console.log("添加区页面接收到的社区ID --- >--- ", this.communityId);
    let _this = this;
    if (_this.communityId) {
      // 查询社区
      getCommuntityById({ id: this.communityId }).then(function(res) {
        _this.community = res.data;
        if (res.data.flag != null) {
          let flag = _this.conversionFlag(res.data.flag);
          if (flag == "期") {
            _this.fetchStage();
          }
        } else {
          _this.pageLoading = false; // 清空页面加载loading
        }
        _this.fetchData(); // 查询数据
      });
    }
  },
  props: {
    communityId: String
  },
  watch: {
    "areaForm.issueCode": {
      handler: function(val, oldVal) {
        this.fetchData();
      },
      deep: true,
      immediate: false
    }
  },
  methods: {
    generatePoint,
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      let params = {
        commCode: _this.community.code
      };
      if (_this.areaForm.issueCode != "" && _this.areaForm.issueCode != 0) {
        params.issuCode = _this.areaForm.issueCode;
      }
      // 查询所有的区
      getDistrictByCommuntity(params).then(function(res) {
        console.log("区页面查询区");
        _this.listLoading = false;
        _this.listTags = res.data; // 列表数据
      });
    },
    createData() {
      let _this = this;
      console.log("添加社区前的社区 --- ", this.community);
      _this.$refs.areaForm.validate(valid => {
        if (valid) {
          try {
            _this.buttonLoading = true; // 按钮加载中
            // 参数
            let params = {
              communtityId: _this.community.id,
              name: _this.areaForm.name
            };
            if (_this.stageList.length > 0) {
              for (let i = 0; i < _this.stageList.length; i++) {
                if (_this.stageList[i].code == _this.areaForm.issueCode) {
                  params.issueId = _this.stageList[i].id;
                  break;
                }
              }
            }
            // 修改
            if (this.dialogStatus == "update") {
              params.id = _this.areaForm.id;
              params.code = _this.areaForm.code;
            }
            addArea(params).then(function(res) {
              if (res.message == "SUCCESS") {
                _this.$notify({
                  title: _this.generatePoint("notifySuccess.title"),
                  message: _this.generatePoint("notifySuccess.message"),
                  type: "success"
                });
                _this.fetchData(); // 刷新列表
              } else {
                _this.$message.error(_this.generatePoint("system"));
              }
              _this.buttonLoading = false; // 清楚加载中
            });
          } catch (err) {
            console.error("err --- ", err); // 控制台打印异常
            _this.buttonLoading = false; // 清楚加载中
            _this.$message.error(_this.generatePoint("system"));
          }
        } else {
          _this.$emit("initButtonLoading"); // 清楚加载中
          return false;
        }
      });
    },
    fetchStage() {
      let _this = this;
      // 查询期
      getStageByCommuntity({ commCode: _this.community.code }).then(function(
        res
      ) {
        // res.data.unshift({ code: "0", id: "", name: "全部" });
        _this.stageList = res.data;
        _this.pageLoading = false; // 清空页面加载loading
      });
    },
    conversionFlag(flagStr) {
      if (flagStr.indexOf("-") == -1) {
        return flagStr;
      } else {
        return flagStr.split("-")[0];
      }
    },
    // 修改
    updateItem(item) {
      console.log("item --- ", item);
      let _this = this;
      this.dialogStatus = "update";
      this.areaForm.name = item.name;
      this.areaForm.id = item.id;
      this.areaForm.code = item.code;
      this.stageList.forEach(function(v, i) {
        if (v.id == item.issueId) {
          _this.areaForm.issueCode = v.code;
        }
      });
    },
    // 回复添加
    inputClear() {
      this.dialogStatus = "create";
      this.areaForm.name = "";
      this.areaForm.id = "";
      this.areaForm.code = "";
      this.areaForm.issueId = "";
      this.$refs.areaForm.resetFields(); // 重置表单
    },
    // 恢复初始化数据F
    initialization() {
      this.areaForm = {
        id: "",
        name: "",
        code: "",
        issueId: ""
      };
      this.listTags = [];
      this.stageList = [];
      this.inputAdd = false; // 是否显示添加INPUT
      this.inputUpdate = false;
      this.addInputName = "";
    }
  }
};
</script>
