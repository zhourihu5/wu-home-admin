<template>
  <div class="family">
    <!-- search --->
    <div class="family-container">
      <province ref="provinceList" :params="myList" @getProvinceVal="getProvinceVal"></province>
      <el-cascader
        :props="communitypProps"
        :options="communityOptions"
        @change="getFamilyList"
        :placeholder="$t('table.temp.communityChoice')"
      ></el-cascader>
    </div>
    <!-- table --->
    <div class="family-table" v-loading="listLoading">
      <div v-if="familyList.length == 0">
        <div v-if="myTips" class="my-tips">
          <el-alert :title="$t('point.notifyWarning.title1')" type="info" :description="$t('point.notifyWarning.message1')" show-icon></el-alert>
        </div>
        <div v-if="!myTips" class="not-date">
          <p>{{ $t('table.noData') }}</p>
        </div>
      </div>
      <el-collapse v-else class="switch" v-model="activeNames">
        <el-collapse-item
          v-for="(item, index) in familyList"
          :key="index"
          :title="item.name"
          :name="item.id"
        >
          <el-button
            v-for="(it, index) in item.list"
            :key="index"
            type="primary"
            size="medium"
            @click="bindingUser(item, it)"
          >{{it.num}}</el-button>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- dialog -->
    <div class="family--dialog">
      <el-dialog
        :title="$t('form.addHousehold') + ' - ' + familyForm.flagStr"
        :visible.sync="dialogFormVisible"
        width="75%"
        @close="close"
      >
        <el-form
          ref="familyForm"
          :rules="rules"
          :model="familyForm"
          label-position="right"
          label-width="100px"
          style="width: 60%"
          class="my-form"
        >
          <el-form-item :label="$t('table.ipad')" prop="paidCode">
            <el-input v-model="familyForm.paidCode" :placeholder="$t('table.temp.userName')"/>
          </el-form-item>
          <el-form-item :label="$t('table.base')" prop="baseCode">
            <el-input v-model="familyForm.baseCode" :placeholder="$t('table.temp.userName')"/>
          </el-form-item>
          <el-form-item :label="$t('table.household')" prop="householdName">
            <el-input
              v-model="familyForm.householdName"
              :placeholder="$t('table.temp.userName')"
              disabled
            />
            <el-button type="text" @click="dialogInnerVisible = true">{{ $t('table.addHousehold')}}</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close">{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="createData()"
            :loading="buttonLoading"
          >{{ $t('table.confirm') }}</el-button>
        </div>
        <!-- 内部dialog -->
        <el-dialog width="65%" title="用户列表" :visible.sync="dialogInnerVisible" append-to-body>
          <!-- 住戶列表-->
          <transition v-if="dialogStatus==='update'" name="el-zoom-in-top">
            <user-List :user="familyForm.user" @transmitUser="userChoiceHousehold"></user-List>
          </transition>
        </el-dialog>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.family {
  padding: 20px;
  .family-container {
    margin-bottom: 20px;
    .el-cascader {
      margin-top: 5px;
    }
    .el-button--medium {
      margin-top: 5px;
    }
  }
  .family-table {
    .my-tips {
      width: 50%;
      margin: 15% auto;
    }
    .not-date {
      font-size: 14px;
      text-align: center;
      margin-top: 150px;
      color: #909399;
    }
    .switch {
      animation: mymove 0.5s ease-in;
      -webkit-animation: mymove 0.5s ease-in; /*Safari and Chrome*/
    }
  }
  .family--dialog {
    .my-form {
      margin: 0 auto;
      margin-top: 20px;
      .el-input {
        width: 60% !important;
      }
    }
  }
}
</style>
<script>
import Province from "@/components/Linkage/province"; // 省市区三级联动
import { getCommuntityByArea, findFamilyListByCode } from "@/api/community";
import userList from "./components/user";
import { generatePoint } from "@/utils/i18n";
import { addDevice } from "@/api/equipment";
import { addUserAndFamily, findBindInfo } from "@/api/community";
import { overall } from "@/constant/index";
import { Promise } from "q";
export default {
  components: { Province, userList },
  data() {
    return {
      communitypProps: {
        label: "name",
        value: "code"
      },
      myList: {
        code: "list",
        areaValue: [],
        communityValue: []
      },
      //   // 查询参数
      listQuery: {
        communtityCode: ""
      },
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      listLoading: false,
      communityOptions: [], // 社区下拉列表数据
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      dialogInnerVisible: false, // 内层dialog
      buttonLoading: false, // 按钮加载请求
      activeNames: [],
      familyList: [],
      familyForm: {
        flagStr: "",
        familyId: "", // 家庭ID
        paidCode: "", // 设备编码
        paidId: "", // 绑定ipad的ID
        baseCode: "", // 底座编码
        baseId: "", // 绑定底座的ID
        userId: "", // 业主ID
        userAndFamilyId: "", // 绑定业主家庭ID
        householdName: "",
        user: null // 回显实体
      },
      rules: {
        paidCode: {
          required: true,
          trigger: "change",
          message: this.generatePoint("required")
        },
        baseCode: {
          required: true,
          trigger: "change",
          message: this.generatePoint("required")
        },
        householdName: {
          required: true,
          trigger: "change",
          message: this.generatePoint("mandatory")
        }
      },
      myTips: false, // 操作提示
    };
  },
  created() {
    this.myTips = true;
  },
  methods: {
    generatePoint,
    // 获取省市区数据 联动查询社区
    getProvinceVal(val, code) {
      let _this = this;
      getCommuntityByArea({ areaCode: val[2] }).then(function(res) {
        console.log("根据地区code 获取的社区数据 -- ", res);
        _this.communityOptions = res.data; // 列表中 社区
      });
    },
    // 根据社区code 获取家庭
    getFamilyList(val) {
      let _this = this;
      _this.listLoading = true;
      findFamilyListByCode({ communtityCode: val[0] }).then(function(res) {
        console.log("查询家庭结果 --- ", res);
        _this.familyList = res.data;
        _this.listLoading = false;
        _this.myTips = false;
      });
    },
    // 绑定用户与设备
    bindingUser(item, it) {
      console.log("item -- ", item, it);
      let _this = this;
      _this.dialogStatus = "update";
      _this.familyForm.flagStr = item.name + it.num;
      _this.familyForm.familyId = it.id;
      // 查询家庭绑定信息
      findBindInfo({ familyId: _this.familyForm.familyId }).then(function(res) {
        console.log("res --- ", res);
        // ipad
        if (res.data.padDevice) {
          _this.familyForm.paidCode = res.data.padDevice.deviceKey;
          // _this.familyForm.paidId = res.data.padDevice.id;
        }
        // 底座
        if (res.data.pedestalDevice) {
          _this.familyForm.baseCode = res.data.pedestalDevice.deviceKey;
          // _this.familyForm.baseId = res.data.pedestalDevice.id;
        }
        // 业主
        if (res.data.user) {
          _this.familyForm.householdName = res.data.user.nickName
            ? res.data.user.nickName
            : res.data.user.userName;
          _this.familyForm.user = res.data.user;
        }
        _this.dialogFormVisible = true;
      });
    },
    // 获取用户选择的业主
    userChoiceHousehold(user) {
      console.log("user --- ", user);
      this.familyForm.householdName = user.nickName
        ? user.nickName
        : user.userName;
      this.familyForm.ueser = user;
      this.dialogInnerVisible = false;
    },
    // 创建数据
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.familyForm.validate(valid => {
        if (valid) {
          console.log(" --- ", this.familyForm, this.user);
          let ipadParams = {
            deviceKey: _this.familyForm.paidCode,
            familyId: _this.familyForm.familyId,
            flag: overall.equipment.flag[1].value, // 底座
            status: overall.equipment.status[1].value, // 已安装
            type: overall.equipment.types[0].value // 主机
          };
          // if(_this.familyForm.paidId) ipadParams.id = _this.familyForm.paidId;
          let boasParams = {
            deviceKey: _this.familyForm.baseCode,
            familyId: _this.familyForm.familyId,
            flag: overall.equipment.flag[0].value, // 底座
            status: overall.equipment.status[1].value, // 已安装
            type: overall.equipment.types[0].value // 主机
          };
          // if(_this.familyForm.baseId) boasParams.id = _this.familyForm.baseId;
          let userParams = {
            identity: 1,
            userFamily: {
              familyId: _this.familyForm.familyId,
              userId: _this.familyForm.user.id
            }
          };
          // if(_this.familyForm.userAndFamilyId) userParams.id = _this.familyForm.userAndFamilyId;
          console.log(ipadParams, boasParams, userParams);
          // 绑定ipad、底座、用户与家庭
          Promise.all([
            addDevice(ipadParams),
            addDevice(boasParams),
            addUserAndFamily(userParams)
          ])
            .then(result => {
              if (
                result[0].message == "SUCCESS" &&
                result[1].message == "SUCCESS" &&
                result[2].message == "SUCCESS"
              ) {
                _this.buttonLoading = false; // 清楚加载中
                _this.$notify({
                  title: _this.generatePoint("notifySuccess.title"),
                  message: _this.generatePoint("notifySuccess.message"),
                  type: "success"
                });
              } else {
                _this.$message.error(_this.generatePoint("system"));
              }
            })
            .catch(error => {
              _this.buttonLoading = false; // 清楚加载中
              console.log(error);
            });
        } else {
          _this.buttonLoading = false; // 清楚加载中
          return false;
        }
      });
    },
    close() {
      this.familyForm = {
        flagStr: "",
        familyId: "", // 家庭ID
        paidCode: "", // 设备编码
        paidId: "", // 绑定ipad的ID
        baseCode: "", // 底座编码
        baseId: "", // 绑定底座的ID
        userId: "", // 业主ID
        userAndFamilyId: "", // 绑定业主家庭ID
        householdName: "",
        user: null // 回显实体
      };
      this.dialogFormVisible = false;
      this.$refs.familyForm.resetFields();
    }
  }
};
</script>