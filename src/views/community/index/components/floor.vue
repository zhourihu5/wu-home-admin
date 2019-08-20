<template>
  <div class="add-floor" v-loading="pageLoading">
    <!-- form --->
    <h3>{{ $t('steps.floor') }}</h3>
    <div class="my-tips">
      <transition name="el-fade-in-linear">
        <el-alert v-if="msg.length > 0 " title="错误提示" type="error" :description="msg" show-icon></el-alert>
      </transition>
    </div>
    <div class="floor-form">
      <el-form
        ref="floorForm"
        :rules="rules"
        :model="floorForm"
        label-position="right"
        label-width="100px"
        style="width: 60%"
        class="my-form"
      >
        <el-form-item v-if="stageList.length > 0" :label="$t('form.stage')" prop="issueId">
          <el-select v-model="floorForm.issueId" placeholder="请选择" @change="issueChange">
            <el-option
              v-for="item in stageList"
              :key="item.code"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          ref="district"
          v-if="areaList.length > 0"
          :label="$t('form.myArea')"
          prop="districtId"
        >
          <el-select
            v-model="floorForm.districtId"
            placeholder="请选择"
            :disabled="districtDisable"
            @change="districtChange"
          >
            <el-option
              v-for="item in areaList"
              :key="item.code"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item ref="name" :label="$t('form.name')" prop="name">
          <el-input
            style="width: 60%;"
            v-model="floorForm.name"
            :placeholder="$t('table.temp.name')"
          />
        </el-form-item>
        <el-form-item ref="unitNum" :label="$t('form.unitNum')" prop="unitNum">
          <el-input
            style="width: 60%;"
            v-model="floorForm.unitNum"
            :placeholder="$t('table.temp.num')"
            @keyup.enter.native="createData"
          />
          <el-button
            :loading="buttonLoading"
            @click="createData"
            :disabled="buttonDisabled"
          >{{ dialogStatus==='create' ? $t('table.add'):$t('table.update')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="floor-table">
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
@import "~@/styles/mixin.scss";
.add-floor {
  padding: 20px 10px 20px 10px;
  h3 {
    text-align: center;
    margin-bottom: 30px;
  }
  .my-tips {
    margin-left: 50px;
    margin-right: 50px;
    margin-bottom: 30px;
  }
  .floor-form {
    .my-form {
      margin: 0 auto;
    }
  }
  .floor-table {
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
import {
  getDistrictByCommuntity,
  getStageByCommuntity,
  addFloor,
  getCommuntityById,
  getFloorByCommuntity
} from "@/api/community";
import { generatePoint } from "@/utils/i18n";
export default {
  data() {
    return {
      listTags: [],
      msg: "", // 错误提示
      listLoading: false,
      buttonLoading: false,
      pageLoading: true,
      dynamic: 0,
      stageList: [], // 期列表
      areaList: [], // 区列表
      districtDisable: false, // 是否急用区选择
      community: null, // 社区对象
      dialogStatus: "create", // 标示当前操作是添加、还是修改
      buttonDisabled: false,
      floorForm: {
        name: "", // 楼名称
        id: "",
        code: "",
        unitNum: "",
        issueId: "", // 用户选中的期
        districtId: "", // 用户选中的区
        issueCode: ""
      },
      rules: {
        issueId: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("mandatory")
          }
        ],
        districtId: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("mandatory")
          }
        ],
        name: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        unitNum: [
          {
            required: true,
            trigger: "change",
            // message: this.generatePoint("required"),
            validator: (rule, value, callback) => {
              console.log("验证");
              var r = /^[0-9]*[1-9][0-9]*$/;
              if (!value) {
                callback(this.generatePoint("required"));
              } else if (r.test(value)) {
                callback();
              } else {
                callback(this.generatePoint("num"));
              }
            }
          }
        ]
      }
    };
  },
  created() {
    console.log("添加楼接收到的社区ID --- >--- ", this.communityId);
    let _this = this;
    if (_this.communityId) {
      // 查询社区
      getCommuntityById({ id: this.communityId }).then(function(res) {
        _this.community = res.data;
        console.log("添加楼宇获取的 社区 --- ", _this.community.code);
        if (res.data.flag != null) {
          if (res.data.flag.indexOf("-") == -1) {
            if (res.data.flag == "期") {
              _this.fetchStage();
              _this.districtDisable = true; // 禁用区
            }
            if (res.data.flag == "区") {
              _this.fetchArea();
            }
          } else {
            let flags = res.data.flag.split("-");
            if (flags[0] == "期") {
              _this.fetchStage();
              _this.districtDisable = true; // 禁用区
            }
            if (flags[0] == "区") {
              _this.fetchArea();
            }
            if (flags[1] == "区") {
              _this.fetchArea();
            }
          }
        }
        _this.fetchData(); // 查询数据
      });
    }
  },
  props: {
    communityId: String
  },
  watch: {
    dynamic: {
      handler: function(val, oldval) {
        if (val == 0) {
          this.pageLoading = false;
        }
      }
    },
    stageList: {
      handler: function(val, oldval) {
        if (val.length > 0) {
          this.dynamic--;
        }
      }
    },
    areaList: {
      handler: function(val, oldval) {
        if (val.length > 0) {
          this.dynamic--;
        }
      }
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
      // 区
      if (_this.floorForm.districtId) {
        let areaCode = "";
        this.areaList.forEach(function(v, i) {
          if (v.id == _this.floorForm.districtId) {
            areaCode = v.code;
          }
        });
        params.disCode = areaCode;
      }
      // 期
      if (_this.floorForm.issueId) {
        let stageCode = "";
        this.stageList.forEach(function(v, i) {
          if (v.id == _this.floorForm.issueId) {
            stageCode = v.code;
          }
        });
        params.issuCode = stageCode;
      }
      getFloorByCommuntity(params).then(function(res) {
        console.log("res 查詢的嘍--- >", res);
        if(_this.dynamic == 0) _this.pageLoading = false;
        _this.listLoading = false;
        _this.listTags = res.data; // 列表数据
      });
    },
    // 创建数据
    createData() {
      let _this = this;
      console.log(" ---- >", _this.floorForm);
      _this.$refs.floorForm.validate(valid => {
        if (valid) {
          try {
            _this.buttonLoading = true; // 清空按钮加载状态
            let params = {
              communtityId: _this.community.id,
              name: _this.floorForm.name,
              unit: _this.floorForm.unitNum // 单元数
            };
            // 区
            if (_this.floorForm.districtId) {
              params.districtId = _this.floorForm.districtId;
            }
            // 期
            if (_this.floorForm.issueId) {
              params.issueId = _this.floorForm.issueId;
            }
            // 修改
            if (_this.floorForm.id) {
              params.id = _this.floorForm.id;
              params.code = _this.floorForm.code;
            }
            addFloor(params).then(function(res) {
              console.log("res--- >", res);
              if (res.message == "SUCCESS") {
                _this.buttonLoading = false; // 清空按钮加载状态
                _this.$notify({
                  title: _this.generatePoint("notifySuccess.title"),
                  message: _this.generatePoint("notifySuccess.message"),
                  type: "success"
                });
                // _this.$refs.floorForm.resetFields(); // 重置表单
                _this.fetchData();
              } else {
                _this.buttonLoading = false; // 清空按钮加载状态
                _this.$message.error(_this.generatePoint("system"));
              }
            });
          } catch (err) {
            console.error("err --- ", err); // 控制台打印异常
            _this.buttonLoading = false; // 清空按钮加载状态
            _this.$message.error(_this.generatePoint("system"));
          }
        } else {
          _this.$emit("initButtonLoading"); // 清楚加载中
          return false;
        }
      });
    },
    issueChange(val) {
      console.log("val --- >", val);
      let _this = this;
      _this.stageList.forEach(function(v, i) {
        if (v.id == val) {
          _this.floorForm.issueCode = v.code;
        }
      });
      _this.districtDisable = false;
      _this.floorForm.districtId = "";
      if (_this.areaList.length > 0) {
        _this.$refs.district.resetField(); // 重置区表单item
      }
      _this.$refs.name.resetField();
      _this.$refs.unitNum.resetField();
      _this.floorForm.id = "";
      _this.floorForm.code = "";
      _this.dialogStatus = "create";
      _this.fetchArea();
      _this.fetchData();
    },
    districtChange(val) {
      this.$refs.name.resetField();
      this.$refs.unitNum.resetField();
      this.floorForm.id = "";
      this.floorForm.code = "";
      this.dialogStatus = "create";
      this.fetchData();
    },
    // 获取期
    fetchStage() {
      let _this = this;
      _this.dynamic++;
      // 查询期
      getStageByCommuntity({ commCode: _this.community.code }).then(function(
        res
      ) {
        _this.stageList = res.data;
      });
    },
    // 获取区
    fetchArea() {
      let _this = this;
      _this.dynamic++;
      let params = {
        commCode: _this.community.code
      };
      if (_this.floorForm.issueCode) {
        params.issuCode = _this.floorForm.issueCode;
      }
      // 查询区
      getDistrictByCommuntity(params).then(function(res) {
        _this.areaList = res.data;
      });
    },
    conversionFlag(flagStr) {
      if (flagStr.indexOf("-") == -1) {
        return flagStr;
      } else {
        return flagStr.split("-")[1];
      }
    },
    // 修改
    updateItem(item) {
      console.log("item -- ", item);
      this.dialogStatus = "update";
      this.floorForm.name = item.name;
      this.floorForm.id = item.id;
      this.floorForm.issueId = item.issueId;
      this.floorForm.districtId = item.districtId;
      this.floorForm.unitNum = item.unit;
      this.floorForm.code = item.code;
      this.districtDisable = false;
    },
    initialization() {
      this.floorForm = {
        name: "", // 楼名称
        id: "",
        code: "",
        unitNum: "",
        issueId: "", // 用户选中的期
        districtId: "", // 用户选中的区
        issueCode: ""
      };
      this.listTags = [];
      this.$refs.floorForm.resetFields(); // 重置表单
    }
  }
};
</script>

