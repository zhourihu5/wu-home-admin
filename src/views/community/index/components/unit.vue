<template>
  <div class="add-unit" v-loading="pageLoading">
    <!-- form --->
    <h3>{{ $t('steps.unit') }}</h3>
    <div class="my-tips">
      <transition name="el-fade-in-linear">
        <el-alert v-if="msg.length > 0 " title="错误提示" type="error" :description="msg" show-icon></el-alert>
      </transition>
    </div>
    <div class="unit-form">
      <el-form
        ref="unitForm"
        :rules="rules"
        :model="unitForm"
        label-position="right"
        label-width="100px"
        style="width: 60%"
        class="my-Form"
      >
        <!-- 期 --->
        <el-form-item
          ref="stage"
          v-if="stageList.length > 0"
          :label="$t('form.stage')"
          prop="issueId"
        >
          <el-select v-model="unitForm.issueId" placeholder="请选择" @change="issueChange">
            <el-option
              v-for="item in stageList"
              :key="item.code"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 区 --->
        <el-form-item
          ref="district"
          v-if="areaList.length > 0"
          :label="$t('form.myArea')"
          prop="districtId"
        >
          <el-select
            v-model="unitForm.districtId"
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
        <!-- 楼 --->
        <el-form-item
          ref="floor"
          v-if="floorList.length > 0"
          :label="$t('form.floor')"
          prop="floorId"
        >
          <el-select
            v-model="unitForm.floorId"
            placeholder="请选择"
            :disabled="floorDisable"
            @change="floorChange"
          >
            <el-option
              v-for="item in floorList"
              :key="item.code"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="isEcho" ref="name" :label="$t('form.name')" prop="name">
          <el-input
            style="width: 60%;"
            v-model="unitForm.name"
            :placeholder="$t('table.temp.name')"
          />
        </el-form-item>
        <el-form-item v-show="isEcho" ref="storey" :label="$t('form.layerNum')" prop="storey">
          <el-input
            style="width: 60%;"
            v-model="unitForm.storey"
            :placeholder="$t('table.temp.num')"
            @keyup.enter.native="createData"
          />
          <el-button
            :disabled="buttonDisabled"
            :loading="buttonLoading"
            @click="createData"
          >{{ dialogStatus==='create' ? $t('table.add'):$t('table.update')}}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="unit-table">
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
          >{{item.unitNo}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.add-unit {
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
  .my-Form {
    margin: 0 auto;
  }
  .unit-table {
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
  getCommuntityById,
  getFloorByCommuntity,
  getUnitByFloor,
  addUnit
} from "@/api/community";
export default {
  radio: "",
  data() {
    return {
      msg: "",
      listTags: [],
      listLoading: false,
      buttonLoading: false,
      pageLoading: true,
      dynamic: 0,
      stageList: [], // 期列表
      areaList: [], // 区列表
      floorList: [], // 楼列表
      buttonDisabled: false,
      districtDisable: false, // 是否禁用区下拉
      floorDisable: false, // 是否禁用楼下拉
      community: null, // 社区对象
      dialogStatus: "update", // 标示当前操作是添加、还是修改
      unitForm: {
        name: "", // 单元名称
        id: "",
        code: "",
        issueId: "", // 用户选中的期
        districtId: "", // 用户选中的区
        floorId: "", // 用户选中的楼
        issueCode: "",
        districtCode: "",
        floorCode: "",
        storey: "", // 层
        code: ""
      },
      isEcho: false,
      rules: {
        name: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        storey: [
          {
            required: true,
            trigger: "change",
            // message: this.generatePoint("required")
            validator: (rule, value, callback) => {
              console.log("验证");
              var r = /^[0-9]*[1-9][0-9]*$/;
              if (value === "" || value === null) {
                callback(this.generatePoint("required"));
              } else if (r.test(value)) {
                callback();
              } else {
                callback(this.generatePoint("num"));
              }
            }
          }
        ],
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
        floorId: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("mandatory")
          }
        ]
      }
    };
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
    },
    floorList: {
      handler: function(val, oldval) {
        if (val.length > 0) {
          this.dynamic--;
        }
      }
    }
  },
  created() {
    console.log("添加单元页面接受到的社区ID ---", this.communityId);
    let _this = this;
    if (_this.communityId) {
      // 查询社区
      getCommuntityById({ id: this.communityId }).then(function(res) {
        _this.community = res.data;
        if (res.data.flag != null) {
          if (res.data.flag.indexOf("-") == -1) {
            if (res.data.flag == "期") {
              _this.fetchStage();
              _this.districtDisable = true; // 禁用区
              _this.floorDisable = true; // 禁用楼
            }
            if (res.data.flag == "区") {
              _this.fetchArea();
              _this.floorDisable = true; // 禁用楼
            }
            if (res.data.flag == "楼") {
              _this.fetchFloor();
            }
          } else {
            let flags = res.data.flag.split("-");
            for (let i = 0; i < flags.length; i++) {
              if (flags[i] == "期") {
                _this.fetchStage();
                _this.districtDisable = true; // 禁用区
                _this.floorDisable = true; // 禁用楼
              }
              if (flags[i] == "区") {
                _this.fetchArea();
                _this.floorDisable = true; // 禁用楼
              }
              if (flags[i] == "楼") {
                _this.fetchFloor();
              }
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
  methods: {
    generatePoint,
    // 查询数据
    fetchData() {
      console.log("params -- ", this.unitForm);
      let _this = this;
      _this.listLoading = true;
      let pareams = {
        commCode: _this.community.code
      };
      if (_this.unitForm.issueCode) {
        pareams.issuCode = _this.unitForm.issueCode;
      }
      if (_this.unitForm.districtCode) {
        pareams.disCode = _this.unitForm.districtCode;
      }
      if (_this.unitForm.floorCode) {
        pareams.floorCode = _this.unitForm.floorCode;
      }
      getUnitByFloor(pareams).then(function(res) {
        _this.listLoading = false;
        _this.listTags = res.data; // 列表数据
      });
    },
    // 创建数据
    createData() {
      console.log("添加单元", this.unitForm);
      let _this = this;
      _this.$refs.unitForm.validate(valid => {
        if (valid) {
          try {
            _this.buttonLoading = true; // 按钮加载中
            // 参数
            let params = {
              // communtityId: _this.community.id,
              name: _this.unitForm.name,
              id: _this.unitForm.id,
              code: _this.unitForm.code,
              storey: _this.unitForm.storey,
              floorId: _this.unitForm.floorId
            };
            console.log("params -- ", params);
            addUnit(params).then(function(res) {
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
    // 期下拉监听
    issueChange(val) {
      console.log("val --- >", val);
      let _this = this;
      _this.stageList.forEach(function(v, i) {
        if (v.id == val) {
          _this.unitForm.issueCode = v.code;
        }
      });
      _this.fetchArea();
      _this.districtDisable = false;
      _this.unitForm.districtId = "";
      _this.unitForm.floorId = "";
      if (_this.isEcho) {
        _this.$refs.name.resetField();
        _this.$refs.storey.resetField();
      }
      _this.unitForm.id = "";
      _this.unitForm.code = "";
      _this.isEcho = false;
      if (_this.areaList.length > 0) {
        _this.$refs.district.resetField(); // 重置区表单item
      }
      if (_this.floorList.length > 0) {
        _this.$refs.floor.resetField(); // 重置区表单item
      }
      _this.fetchData();
    },
    // 区下拉监听
    districtChange(val) {
      let _this = this;
      _this.areaList.forEach(function(v, i) {
        if (v.id == val) {
          _this.unitForm.districtCode = v.code;
        }
      });
      if (_this.isEcho) {
        _this.$refs.name.resetField();
        _this.$refs.storey.resetField();
      }
      _this.unitForm.id = "";
      _this.unitForm.code = "";
      _this.floorDisable = false;
      _this.unitForm.floorId = "";
      _this.isEcho = false;
      // _this.$refs.floor.resetField(); // 重置区表单item
      _this.fetchFloor();
      _this.fetchData();
    },
    // 楼下拉监听
    floorChange(val) {
      let _this = this;
      if (_this.isEcho) {
        _this.$refs.name.resetField();
        _this.$refs.storey.resetField();
      }
      _this.unitForm.id = "";
      _this.unitForm.code = "";
      _this.isEcho = false;
      _this.floorList.forEach(function(v, i) {
        if (v.id == val) {
          _this.unitForm.floorCode = v.code;
        }
      });
      _this.fetchData();
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
      if (_this.unitForm.issueCode) {
        params.issuCode = _this.unitForm.issueCode;
      }
      // 查询区
      getDistrictByCommuntity(params).then(function(res) {
        // 如果没有咋清空下一级
        if (res.data.length == 0) {
          _this.areaList = [];
          _this.floorList = [];
          _this.msg =
            "因为该期下没有区,不能执行单元页操作,请前往上一页完成之前项目的录入操作后,在回到本页操作";
          _this.buttonDisabled = true;
        } else {
          _this.areaList = res.data;
          _this.msg = "";
          _this.buttonDisabled = false;
          _this.fetchFloor();
        }
      });
    },
    // 获取楼
    fetchFloor(stageCode) {
      let _this = this;
      _this.dynamic++;
      let params = {
        commCode: _this.community.code
      };
      // 期
      if (_this.unitForm.issueCode) {
        params.issuCode = _this.unitForm.issueCode;
      }
      // 区
      if (_this.unitForm.districtCode) {
        params.disCode = _this.unitForm.districtCode;
      }
      getFloorByCommuntity(params).then(function(res) {
        if (res.data.length == 0) {
          _this.floorList = [];
          _this.msg =
            "因为该区下没有楼,不能执行单元页操作,请前往上一页完成之前项目的录入操作后,在回到本页操作";
          _this.buttonDisabled = true;
        } else {
          _this.floorList = res.data;
          _this.msg = "";
          _this.buttonDisabled = false;
        }
      });
    },
    // 修改
    updateItem(item) {
      console.log("item -- >", item);
      this.unitForm.id = item.id;
      this.unitForm.storey = item.storey;
      this.unitForm.code = item.code;
      this.unitForm.name = item.unitNo;
      this.unitForm.issueId = item.issueId; // 用户选中的期
      this.unitForm.districtId = item.districtId; // 用户选中的区
      this.unitForm.floorId = item.floorId; // 用户选中的楼
      this.districtDisable = false; // 重置区表单item
      this.floorDisable = false; // 重置区表单item
      this.isEcho = true;
      this.dialogStatus = "update";
    },
    onUpdateItem() {
      // this.unitForm = {
      //   name: "", // 单元名称
      //   id: "",
      //   code: ""
      // };
    },
    initialization() {
      this.unitForm = {
        name: "", // 单元名称
        id: "",
        code: "",
        issueId: "", // 用户选中的期
        districtId: "", // 用户选中的区
        floorId: "", // 用户选中的楼
        issueCode: "",
        districtCode: "",
        floorCode: "",
        storey: "", // 层
        code: ""
      };
      this.listTags = [];
      this.$refs.stageForm.resetFields(); // 重置表单
    }
  }
};
</script>

