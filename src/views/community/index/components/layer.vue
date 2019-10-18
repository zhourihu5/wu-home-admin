<template>
  <div class="add-layer" v-loading="pageLoading">
    <!-- form --->
    <h3>{{ $t('steps.layer') }}</h3>
    <div class="my-tips">
      <transition name="el-fade-in-linear">
        <el-alert v-if="msg.length > 0 " title="错误提示" type="error" :description="msg" show-icon></el-alert>
      </transition>
    </div>
    <div class="layer-form">
      <el-form
        ref="layerForm"
        :rules="rules"
        :model="layerForm"
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
          <el-select v-model="layerForm.issueId" placeholder="请选择" @change="issueChange">
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
            v-model="layerForm.districtId"
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
            v-model="layerForm.floorId"
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
        <!-- 单元 --->
        <el-form-item ref="unit" v-if="unitList.length > 0" :label="$t('form.unit')" prop="floorId">
          <el-select
            v-model="layerForm.unitId"
            placeholder="请选择"
            :disabled="unitDisable"
            @change="unitChange"
          >
            <el-option
              v-for="item in unitList"
              :key="item.code"
              :label="item.unitNo"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="isEcho" ref="name" :label="$t('form.name')" prop="name">
          <el-input
            style="width: 60%;"
            v-model="layerForm.name"
            :placeholder="$t('table.temp.name')"
          />
        </el-form-item>
        <el-form-item v-show="isEcho" ref="storey" :label="$t('form.familyNum')" prop="familyCount">
          <el-input
            style="width: 60%;"
            v-model="layerForm.familyCount"
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
    <div class="layer-table">
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
<style lang="scss">
.add-layer {
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
  .layer-table {
    .my-list {
      max-height: 175px;
      overflow: auto;
      margin: 0 30px 0 30px;
      .el-button--medium {
        margin: 10px !important;
      }
      .not-date {
        text-align: center;
        margin-top: 150px;
      }
    }
  }
}
</style>
<script>
import {
  getDistrictByCommuntity,
  getStageByCommuntity,
  getCommuntityById,
  getFloorByCommuntity,
  getUnitByFloor,
  getLayerByCommuntity,
  addStorey,
  getStoreyAll
} from "@/api/community";
import { generatePoint } from "@/utils/i18n";
export default {
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
      unitList: [], // 单元列表
      buttonDisabled: false,
      districtDisable: false, // 是否禁用区下拉
      floorDisable: false, // 是否禁用楼下拉
      unitDisable: false,
      community: null, // 社区对象
      dialogStatus: "update", // 标示当前操作是添加、还是修改
      layerForm: {
        name: "", // 社区名称
        id: "",
        code: "",
        issueId: "",
        districtId: "",
        floorId: "",
        unitId: "",
        issueCode: "",
        districtCode: "",
        floorCode: "",
        unitCode: "",
        familyCount: "" // 层
      },
      isEcho: false,
      rules: {
        issueId: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        districtId: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        floorId: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        unitId: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        name: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        familyCount: [
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
        ]
      }
    };
  },
  created() {
    console.log("添加层页面接受到的社区ID ---", this.communityId);
    let _this = this;
    if (_this.communityId) {
      // 查询社区
      getCommuntityById({ id: this.communityId }).then(function(res) {
        _this.community = res.data;
        if (res.data.flag != null) {
          if (res.data.flag.indexOf("-") == -1) {
            if (flag == "期") {
              _this.fetchStage();
              _this.districtDisable = true; // 禁用区
              _this.floorDisable = true; // 禁用楼
            }
            if (flag == "区") {
              _this.fetchArea();
              _this.floorDisable = true; // 禁用楼
            }
            if (flag == "楼") {
              _this.fetchFloor();
              _this.unitDisable = true; // 禁用楼
            }
            if (flag == "单") {
              _this.fetchUnit();
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
                _this.unitDisable = true; // 禁用楼
              }
              if (flags[i] == "单") {
                _this.fetchUnit();
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
    },
    unitList: {
      handler: function(val, oldval) {
        if (val.length > 0) {
          this.dynamic--;
        }
      }
    }
  },
  methods: {
    generatePoint,
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      let pareams = {
        commCode: _this.community.code
      };
      if (_this.layerForm.issueCode) {
        pareams.issuCode = _this.layerForm.issueCode;
      }
      if (_this.layerForm.districtCode) {
        pareams.disCode = _this.layerForm.districtCode;
      }
      if (_this.layerForm.floorCode) {
        pareams.floorCode = _this.layerForm.floorCode;
      }
      if (_this.layerForm.unitCode) {
        pareams.unitCode = _this.layerForm.unitCode;
      }

      getLayerByCommuntity(pareams).then(function(res) {
        console.log("res 获取单元--- >", res);
        _this.listLoading = false;
        _this.listTags = res.data; // 列表数据
      });
    },
    // 创建数据
    createData() {
      console.log("添加层");
      let _this = this;
      _this.$refs.layerForm.validate(valid => {
        if (valid) {
          _this.buttonLoading = true; // 按钮加载中
          try {
            // 参数
            let params = {
              unitId: _this.layerForm.unitId,
              code: _this.layerForm.code,
              name: _this.layerForm.name,
              familyCount: _this.layerForm.familyCount,
              id: _this.layerForm.id,
              issueId: _this.layerForm.issueId,
              districeId: _this.layerForm.districeId
            };
            addStorey(params).then(function(res) {
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
          _this.layerForm.issueCode = v.code;
        }
      });
      _this.fetchArea();
      _this.districtDisable = false;
      _this.layerForm.districtId = "";
      _this.layerForm.floorId = "";
      _this.layerForm.unitId = "";
      if (_this.isEcho) {
        _this.$refs.name.resetField();
        _this.$refs.storey.resetField();
      }
      _this.layerForm.id = "";
      _this.layerForm.code = "";
      _this.isEcho = false;
      if (_this.areaList.length > 0) {
        _this.$refs.district.resetField(); // 重置区表单item
      }
      if (_this.floorList.length > 0) {
        _this.$refs.floor.resetField(); // 重置区表单item
      }
      if (_this.unitList.length > 0) {
        _this.$refs.unit.resetField(); // 重置区表单item
      }
      _this.fetchData();
    },
    // 区下拉
    districtChange(val) {
      console.log("val --- >", val);
      let _this = this;
      _this.areaList.forEach(function(v, i) {
        if (v.id == val) {
          _this.layerForm.districtCode = v.code;
        }
      });
      if (_this.isEcho) {
        _this.$refs.name.resetField();
        _this.$refs.storey.resetField();
      }
      _this.layerForm.id = "";
      _this.layerForm.code = "";
      _this.floorDisable = false;
      _this.layerForm.floorId = "";
      _this.layerForm.unitId = "";
      _this.isEcho = false;
      // _this.$refs.floor.resetField(); // 重置区表单item
      _this.fetchFloor();
      _this.fetchData();
    },
    // 楼下拉监听
    floorChange(val) {
      console.log("val --- >", val);
      let _this = this;
      if (_this.isEcho) {
        _this.$refs.name.resetField();
        _this.$refs.storey.resetField();
      }
      _this.layerForm.id = "";
      _this.layerForm.code = "";
      _this.isEcho = false;
      _this.layerForm.unitId = "";
      _this.floorList.forEach(function(v, i) {
        if (v.id == val) {
          _this.layerForm.floorCode = v.code;
        }
      });
      _this.fetchData();
    },
    unitChange(val) {
      console.log("val --- ", val);
      let _this = this;
      getStoreyAll({ unitId: val}).then(function(res) {
        console.log("res --- >", res);
      })
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
      if (_this.layerForm.issueCode) {
        params.issuCode = _this.layerForm.issueCode;
      }
      // 查询区
      getDistrictByCommuntity(params).then(function(res) {
        // 如果没有咋清空下一级
        if (res.data.length == 0) {
          _this.areaList = [];
          _this.floorList = [];
          _this.unitList = [];
          _this.msg =
            "因为该期下没有区,不能执行层页操作,请前往上一页完成之前项目的录入操作后,在回到本页操作";
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
    fetchFloor() {
      let _this = this;
      _this.dynamic++;
      let params = {
        commCode: _this.community.code
      };
      // 期
      if (_this.layerForm.issueCode) {
        params.issuCode = _this.layerForm.issueCode;
      }
      // 区
      if (_this.layerForm.districtCode) {
        params.disCode = _this.layerForm.districtCode;
      }
      getFloorByCommuntity(params).then(function(res) {
        if (res.data.length == 0) {
          _this.floorList = [];
          _this.unitList = [];
          _this.msg =
            "因为该区下没有楼,不能执行层页操作,请前往上一页完成之前项目的录入操作后,在回到本页操作";
          _this.buttonDisabled = true;
        } else {
          _this.floorList = res.data;
          _this.msg = "";
          _this.buttonDisabled = false;
          _this.fetchUnit();
        }
      });
    },
    // 获取单元
    fetchUnit() {
      let _this = this;
      _this.dynamic++;
      let pareams = {
        commCode: _this.community.code
      };
      if (_this.layerForm.issueCode) {
        pareams.issuCode = _this.layerForm.issueCode;
      }
      if (_this.layerForm.districtCode) {
        pareams.disCode = _this.layerForm.districtCode;
      }
      if (_this.layerForm.floorCode) {
        pareams.floorCode = _this.layerForm.floorCode;
      }
      getUnitByFloor(pareams).then(function(res) {
        if (res.data.length == 0) {
          _this.unitList = [];
          _this.msg =
            "因为该楼下没有单元,不能执行层页操作,请前往上一页完成之前项目的录入操作后,在回到本页操作";
          _this.buttonDisabled = true;
        } else {
          _this.unitList = res.data;
          _this.msg = "";
          _this.buttonDisabled = false;
        }
        console.log("单元--- ", _this.unitList);
      });
    },
    // 修改
    updateItem(item) {
      console.log("item -- >", item);
      this.layerForm.id = item.id;
      this.layerForm.storey = item.storey;
      this.layerForm.code = item.code;
      this.layerForm.name = item.name;
      this.layerForm.issueId = item.issueId; // 用户选中的期
      this.layerForm.districtId = item.districtId; // 用户选中的区
      this.layerForm.floorId = item.floorId; // 用户选中的楼
      this.layerForm.unitId = item.unitId;
      this.layerForm.familyCount = item.familyCount;
      this.districtDisable = false; // 重置区表单item
      this.floorDisable = false; // 重置区表单item
      this.unitDisable = false;
      this.isEcho = true;
      this.dialogStatus = "update";
    },
    initialization() {
      this.layerForm = {
        name: "", // 社区名称
        id: "",
        code: "",
        issueId: "",
        districtId: "",
        floorId: "",
        unitId: "",
        issueCode: "",
        districtCode: "",
        floorCode: "",
        unitCode: "",
        familyCount: "" // 层
      };
      this.listTags = [];
      (this.stageList = []), // 期列表
        (this.areaList = []), // 区列表
        (this.floorList = []), // 楼列表
        (this.unitList = []), // 单元列表
        this.$refs.layerForm.resetFields(); // 重置表单
    }
  }
};
</script>
