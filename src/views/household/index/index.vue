<template>
  <div class="household">
    <!-- search --->
    <div class="household-container">
      <!-- 社区 --->
      <el-select
        v-model="communityCode"
        filterable
        :placeholder="$t('table.temp.pleaseChoose')"
        @change="communityChange"
      >
        <el-option
          v-for="item in communityList"
          :key="item.id"
          :label="item.name"
          :value="item.code"
        ></el-option>
      </el-select>
      <!-- 期 --->
      <el-select
        v-show="issuShow"
        v-model="issuCode"
        :placeholder="$t('table.temp.pleaseChoose')"
        @change="issuChange"
      >
        <el-option v-for="item in issuList" :key="item.id" :label="item.name" :value="item.code"></el-option>
      </el-select>
      <!-- 区 --->
      <el-select
        v-show="disShow"
        v-model="disCode"
        :placeholder="$t('table.temp.pleaseChoose')"
        @change="disChange"
      >
        <el-option v-for="item in disList" :key="item.id" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </div>
    <div class="household-content">
      <el-row type="flex">
        <el-col :span="3">
          <div class="item-box" v-loading="floorLoading">
            <h3>{{ $t('form.floor') }}</h3>
            <ul v-if="floorList.length > 0" class="list-data">
              <li
                v-for="(item, index) in floorList"
                :key="index"
                :class="{'list-item': true, active: index == floorCurrent}"
                @click="selectionFloor(index, item, $event)"
              >{{item.name}}</li>
            </ul>
            <div v-else class="not-data">暂无数据</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="item-box" v-loading="unitLoading">
            <h3>{{ $t('form.unit') }}</h3>
            <ul v-if="unitList.length > 0" class="list-data">
              <li
                v-for="(item, index) in unitList"
                :key="index"
                :class="{'list-item': true, active: index == unitCurrent}"
                @click="selectionUnit(index, item, $event)"
              >{{item.unitNo}}</li>
            </ul>
            <div v-else class="not-data">暂无数据</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="item-box" v-loading="layerLoading">
            <h3>{{ $t('form.layer') }}</h3>
            <ul v-if="layerList.length > 0" class="list-data">
              <li
                v-for="(item, index) in layerList"
                :key="index"
                :class="{'list-item': true, active: index == layerCurrent}"
                @click="selectionLayer(index, item, $event)"
              >{{item.name}}</li>
            </ul>
            <div v-else class="not-data">暂无数据</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="item-box" v-loading="familyLoading">
            <h3>{{ $t('form.family') }}</h3>
            <ul v-if="familyList.length > 0" class="list-data">
              <li
                v-for="(item, index) in familyList"
                :key="index"
                :class="{'list-item': true, active: index == familyCurrent}"
                @click="selectionFamily(index, item, $event)"
              >{{item.name}}</li>
            </ul>
            <div v-else class="not-data">暂无数据</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item-box" v-loading="regionLoading">
            <h3>{{ $t('table.addMember') }}</h3>
            <div class="item-form">
              <h2 style="text-align: center">{{ $t('table.familyMemList') }}</h2>
              <el-form
                ref="bindForm"
                :rules="rules"
                :model="bindForm"
                label-position="left"
                label-width="100px"
                style="width: 50%; margin: 0 auto;"
              >
                <el-form-item :label="$t('table.name')" prop="name">
                  <el-input
                    class="my-input"
                    v-model="bindForm.name"
                    :placeholder="$t('table.temp.content')"
                  />
                </el-form-item>
                <el-form-item :label="$t('table.phone')" prop="phone">
                  <el-input
                    class="my-input"
                    v-model="bindForm.phone"
                    :placeholder="$t('table.temp.content')"
                    :disabled="disabledPhone"
                  />
                </el-form-item>
                <el-form-item :label="$t('table.identityCard')" prop="identityCard">
                  <el-input
                    class="my-input"
                    v-model="bindForm.identityCard"
                    :placeholder="$t('table.temp.content')"
                  />
                </el-form-item>
                <el-form-item :label="$t('table.identity')" prop="identity">
                  <el-select
                    v-model="bindForm.identity"
                    @change="identityChange"
                    :placeholder="$t('table.temp.type')"
                  >
                    <el-option
                      v-for="item in identityTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <template v-if="isBinding">
                  <el-form-item :label="$t('table.ipad')" prop="paidCode">
                    <el-input
                      class="my-input"
                      v-model="bindForm.paidCode"
                      :placeholder="$t('table.temp.content')"
                    />
                  </el-form-item>
                  <!-- <el-form-item :label="$t('table.base')" prop="baseCode">
                    <el-input
                      class="my-input"
                      v-model="bindForm.baseCode"
                      :placeholder="$t('table.temp.content')"
                    />
                  </el-form-item>-->
                </template>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="empty">{{ $t('table.cancel') }}</el-button>
                <el-button
                  type="primary"
                  @click="dialogStatus==='create'?createData():updateData()"
                  :loading="buttonLoading"
                  :disabled="bindForm.familyId == ''"
                >{{ dialogStatus==='create' ? $t('table.preserve') : dialogStatus==='update' ? $t('table.update') : $t('table.verifyPhone') }}</el-button>
              </div>
            </div>
            <div class="item-table">
              <el-table
                v-loading="listLoading"
                :data="identityList"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row
              >
                <el-table-column align="center" :label="$t('table.id')" width="80">
                  <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column :label="$t('table.name')" width="100" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.nickName ? scope.row.nickName : $t('table.noTime')}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" :label="$t('table.phone')" width="170">
                  <template
                    slot-scope="scope"
                  >{{ scope.row.userName ? scope.row.userName : $t('table.noTime')}}</template>
                </el-table-column>
                <el-table-column align="center" :label="$t('table.identityCard')" width="200">
                  <template
                    slot-scope="scope"
                  >{{ scope.row.identityCard ? scope.row.identityCard : $t('table.noTime')}}</template>
                </el-table-column>
                <el-table-column align="center" :label="$t('table.identity')" width="100">
                  <template
                    slot-scope="scope"
                  >{{ scope.row.identity !== null && scope.row.identity !== "" ? getIdentityText(scope.row.identity) : $t('table.noTime')}}</template>
                </el-table-column>
                <el-table-column :label="$t('table.operation')" align="center" width="203">
                  <template slot-scope="{row}">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="editIdentity(row)"
                    >{{ $t('table.edit') }}</el-button>
                    <el-button
                      type="danger"
                      size="mini"
                      @click="deleteData(row)"
                    >{{ $t('table.delete') }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  getAllByFlag,
  getStageByCommuntity,
  getDistrictByCommuntity,
  getFloorByCommuntity,
  getUnitByFloor,
  getLayerByCommuntity,
  getFamilyByStoreyCode,
  addUserAndFamilyNew,
  findFamilyUser,
  updateUserAndFamilyNew,
  delUserAndFamily
} from "@/api/community";
import { getUserByUserName } from "@/api/user";
import { overall } from "@/constant/index";
import { generatePoint } from "@/utils/i18n";
// 验证手机号码
function isvalidPhone(value) {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(value)) {
    return false;
  } else {
    return true;
  }
}
export default {
  data() {
    return {
      colSpan: 0,
      block: 0,
      regionLoading: false,
      communityList: [], // 社区集合
      communityCode: "", // 用户选中的社区
      communityflag: "", // 标示
      communityId: "", // 社区ID
      disList: [], // 期集合
      disCode: "", // 用户选中的期
      disShow: false, // 是否显示选择期
      issuList: [], // 区集合
      issuCode: "", // 用户选中的区
      issuShow: false, // 是否显示选择区
      floorCurrent: 0,
      floorList: [], // 楼集合
      floorLoading: false, // 楼加载效果
      unitCurrent: 0,
      unitList: [], // 单元集合
      unitLoading: false, // 单元加载效果
      layerCurrent: 0,
      layerList: [], // 层集合
      layerLoading: false, // 层加载效果
      familyCurrent: 0,
      familyList: [], // 家庭列表
      familyLoading: false, // 家庭加载效果
      disabledPhone: false,
      rules: {
        name: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        phone: [
          {
            required: true,
            trigger: "change",
            validator: this.validatePhone
          }
        ],
        // identityCard: [
        //   {
        //     required: true,
        //     trigger: "change",
        //     validator: this.validateIdentityCard
        //   }
        // ],
        identity: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (
                this.bindForm.identity === "" ||
                this.bindForm.identity === null
              ) {
                callback(this.generatePoint("mandatory"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      bindForm: {
        name: "",
        phone: "",
        identityCard: "",
        identity: "",
        familyId: "",
        id: "",
        paidCode: "" // 门口机code
        // baseCode: "" // 底座code
      },
      identityList: [], // 成员集合数据
      buttonLoading: false,
      listLoading: false,
      dialogStatus: "create", // 标示当前操作是添加、还是修改
      identityTypes: overall.identity.types,
      roleMark: overall.role.mark, // 角色标示
      isBinding: false // 是否显示绑定门口机、底座输入框
    };
  },
  created() {
    let _this = this;
    getAllByFlag().then(function(res) {
      console.log("res ---- >", res);
      if (res.data.length > 0) {
        _this.communityList = res.data; // 社区集合
        _this.communityflag = res.data[0].flag; // 社区标示
        _this.communityCode = res.data[0].code; // 默认选择第一个社区
        _this.communityId = res.data[0].id;
        if (res.data[0].flag) {
          // 该社区下包含 期与区
          if (
            res.data[0].flag.indexOf("期") > -1 &&
            res.data[0].flag.indexOf("区") > -1
          ) {
            // 查询期
            getStageByCommuntity({ commCode: _this.communityCode })
              .then(function(stage) {
                console.log("stage -- ", stage);
                _this.issuList = stage.data; // 期集合
                _this.issuCode =
                  _this.issuList.length > 0 ? _this.issuList[0].code : ""; // 默认选择第一个期
                _this.issuShow = true;
                return getDistrictByCommuntity({ issuCode: _this.issuCode }); // 查询区
              })
              .then(function(issu) {
                console.log("issu --- >", issu);
                _this.disList = issu.data; // 区集合
                _this.disCode =
                  _this.disList.length > 0 ? _this.disList[0].code : ""; // 用户选中的区
                _this.disShow = true; // 是否显示选择区
                _this.getOrganize(); // 查询楼
              });
          } else if (
            res.data[0].flag.indexOf("期") > -1 &&
            res.data[0].flag.indexOf("区") == -1
          ) {
            _this.disCode = "";
            _this.disList = [];
            _this.disShow = false;
            // 该社区包含期
            getStageByCommuntity({ commCode: _this.communityCode }).then(
              function(stage) {
                console.log("stage -- ", stage);
                _this.issuList = stage.data; // 期集合
                _this.issuCode =
                  _this.issuList.length > 0 ? _this.issuList[0].code : ""; // 默认选择第一个期
                _this.issuShow = true;
                _this.getOrganize(); // 查询楼
              }
            );
          } else if (
            res.data[0].flag.indexOf("期") == -1 &&
            res.data[0].flag.indexOf("区") > -1
          ) {
            _this.issuCode = "";
            _this.issuList = []; // 期集合
            _this.issuShow = false;
            // 该社区包含区
            getDistrictByCommuntity({ issuCode: _this.issuCode }).then(function(
              issu
            ) {
              console.log("issu --- >", issu);
              _this.disList = issu.data; // 区集合
              _this.disCode =
                _this.disList.length > 0 ? _this.disList[0].code : ""; // 用户选中的区
              _this.disShow = true; // 是否显示选择区
              _this.getOrganize(); // 查询楼
            });
            console.log("该社区包含区");
          } else {
            // 不包含期 区
            _this.issuShow = false;
            _this.issuList = [];
            _this.issuCode = "";
            _this.disShow = false;
            _this.disList = [];
            _this.disCode = "";
            _this.getOrganize(); // 查询楼
          }
        } else {
          _this.issuShow = false;
          _this.issuList = [];
          _this.issuCode = "";
          _this.disShow = false;
          _this.disList = [];
          _this.disCode = "";
          _this.floorList = [];
          _this.unitList = [];
          _this.layerList = [];
          _this.familyList = [];
          _this.identityList = [];
        }
      }
    });
  },
  watch: {
    "bindForm.phone": {
      handler: function(val, oldval) {
        // console.log("val --- >", val);
        let _this = this;
        if (isvalidPhone(val) && _this.disabledPhone == false) {
          _this.buttonLoading = true;
          _this.dialogStatus = "phone";
          getUserByUserName({ userName: val }).then(function(res) {
            console.log("res --- >", res);
            if (res.data) {
              _this.disabledPhone = true; // 禁止修改手机号码
              const h = _this.$createElement;
              _this
                .$msgbox({
                  title: "系统检测到",
                  message: h("div", null, [
                    h(
                      "div",
                      { style: "font-weight: bold" },
                      val + " 的用户已是本平台住户,是否加载提出该用户？"
                    ),
                    h(
                      "div",
                      { style: "margin-top: 15px; font-size: 12px;" },
                      "该住户信息如下："
                    ),
                    h(
                      "div",
                      {
                        style: "color: teal; margin-top: 15px; font-size: 12px;"
                      },
                      "姓名: " + res.data.nickName
                    ),
                    h(
                      "div",
                      {
                        style: "color: teal; margin-top: 10px; font-size: 12px;"
                      },
                      "手机号: " + res.data.userName
                    ),
                    h(
                      "div",
                      {
                        style: "color: teal; margin-top: 10px; font-size: 12px;"
                      },
                      "身份证: " + res.data.identityCard
                    )
                  ]),
                  showCancelButton: true,
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                      instance.confirmButtonLoading = true;
                      instance.confirmButtonText = "执行中...";
                      _this.bindForm.name = res.data.nickName;
                      _this.bindForm.phone = res.data.userName;
                      _this.bindForm.identityCard = res.data.identityCard;
                      _this.bindForm.id = res.data.id;
                      _this.bindForm.identity = res.data.identity;
                      _this.buttonLoading = false;
                      _this.dialogStatus = "create";
                      instance.confirmButtonLoading = false;
                      done();
                    } else {
                      _this.buttonLoading = false;
                      _this.dialogStatus = "create";
                      _this.empty();
                      done();
                    }
                  }
                })
                .then(action => {
                  _this.$notify({
                    title: _this.generatePoint("notifySuccess.title"),
                    message: _this.generatePoint("notifySuccess.message9"),
                    type: "success"
                  });
                });
            } else {
              _this.buttonLoading = false;
              _this.dialogStatus = "create";
            }
          });
        }
      },
      deep: true,
      immediate: false
    }
  },
  methods: {
    generatePoint,
    // 身份选择
    identityChange(val) {
      console.log("val --- ", val, this.identityTypes[1].value);
      // 如果是业主 则验证身份显示编码
      if (val == this.identityTypes[1].value) {
        var user = JSON.parse(localStorage.getItem("user"));
        // 根据登录用户的角色 来决定是否显示绑定门口机编码
        if (user.roleFlag == this.roleMark[0].label) {
          this.isBinding = true;
        }
      } else {
        this.isBinding = false;
      }
    },
    // 验证账号 手机格式
    validatePhone(rule, value, callback) {
      let _this = this;
      if (!isvalidPhone(value)) {
        callback(new Error(this.generatePoint("phone")));
      } else {
        callback();
      }
    },
    // 验证身份证格式
    validateIdentityCard(rule, value, callback) {
      if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
        callback();
      } else {
        callback(new Error(this.generatePoint("identityCard")));
      }
    },
    // 查询  从楼开始查询到家庭
    getOrganize() {
      let _this = this;
      let params = {};
      if (_this.disCode) {
        params.disCode = _this.disCode; // 按区查
      } else if (_this.issuCode) {
        params.issuCode = _this.issuCode; // 按期查
      } else if (_this.communityCode) {
        params.commCode = _this.communityCode;
      }
      _this.floorLoading = true;
      // 查询楼
      getFloorByCommuntity(params)
        .then(function(floor) {
          _this.floorLoading = false;
          _this.unitLoading = true;
          if (floor) {
            _this.floorList = floor.data;
            _this.floorCurrent = 0;
            if (floor.data.length > 0) {
              return getUnitByFloor({ floorCode: floor.data[0].code }); // 查询单元
            }
          } else {
            _this.floorList = [];
          }
        })
        .then(function(unit) {
          console.log("unit --- >", unit);
          _this.unitLoading = false;
          _this.layerLoading = true;
          if (unit) {
            _this.unitList = unit.data;
            _this.unitCurrent = 0;
            if (unit.data.length > 0) {
              return getLayerByCommuntity({ unitCode: unit.data[0].code }); // 查询层
            }
          } else {
            _this.unitList = [];
          }
        })
        .then(function(layer) {
          console.log("Layer --- ", layer);
          _this.layerLoading = false;
          _this.familyLoading = true;
          if (layer) {
            _this.layerList = layer.data;
            _this.layerCurrent = 0;
            if (layer.data.length > 0) {
              return getFamilyByStoreyCode({ storeyCode: layer.data[0].code }); // 查询家庭
            }
          } else {
            _this.layerList = [];
          }
        })
        .then(function(family) {
          console.log("family ---", family);
          _this.familyLoading = false;
          if (family) {
            _this.familyList = family.data;
            _this.familyCurrent = 0;
            _this.bindForm.familyId =
              family.data.length > 0 ? family.data[0].id : "";
            if (_this.bindForm.familyId !== "") {
              _this.fetchData();
            } else {
              _this.identityList = [];
            }
          } else {
            _this.familyList = [];
            _this.identityList = [];
            _this.bindForm.familyId = "";
          }
        });
    },
    // 选择社区
    communityChange(val) {
      let _this = this;
      let item = null;
      for (let i = 0; i < _this.communityList.length; i++) {
        if (val == _this.communityList[i].code) {
          item = _this.communityList[i];
        }
      }
      console.log("item --- ", item);
      _this.communityflag = item.flag;
      _this.communityCode = item.code; // 默认选择第一个社区
      _this.communityId = item.id;
      // 如果
      // if(!item.flag) {
      //   item.flag = "";
      // }
      if (item.flag) {
        // 包含期与区
        if (item.flag.indexOf("期") > -1 && item.flag.indexOf("区") > -1) {
          // 查询期
          getStageByCommuntity({ commCode: item.code })
            .then(function(stage) {
              console.log("stage --- >", stage);
              _this.issuList = stage.data; // 期集合
              _this.issuShow = true;
              _this.issuCode =
                _this.issuList.length > 0 ? _this.issuList[0].code : ""; // 默认选择第一个期
              return getDistrictByCommuntity({ issuCode: _this.issuCode }); // 查询区
            })
            .then(function(issu) {
              console.log("issu --- >", issu);
              _this.disList = issu.data; // 区集合
              _this.disCode =
                _this.disList.length > 0 ? _this.disList[0].code : ""; // 用户选中的区
              _this.disShow = true; // 是否显示选择区
              _this.getOrganize(); // 查询楼
            });
        } else if (
          item.flag.indexOf("期") > -1 &&
          item.flag.indexOf("区") == -1
        ) {
          _this.disCode = "";
          _this.disList = [];
          _this.disShow = false;
          // 该社区包含期
          getStageByCommuntity({ commCode: item.code }).then(function(stage) {
            console.log("stage --- >", stage);
            _this.issuList = stage.data; // 期集合
            _this.issuShow = true;
            _this.issuCode =
              _this.issuList.length > 0 ? _this.issuList[0].code : ""; // 默认选择第一个期
            _this.getOrganize(); // 查询楼
          });
        } else if (
          item.flag.indexOf("期") == -1 &&
          item.flag.indexOf("区") > -1
        ) {
          _this.issuCode = "";
          _this.issuList = []; // 期集合
          _this.issuShow = false;
          // 该社区包含区
          getDistrictByCommuntity({ issuCode: _this.issuCode }).then(function(
            issu
          ) {
            console.log("issu --- >", issu);
            _this.disList = issu.data; // 区集合
            _this.disCode =
              _this.disList.length > 0 ? _this.disList[0].code : ""; // 用户选中的区
            _this.disShow = true; // 是否显示选择区
            _this.getOrganize(); // 查询楼
          });
        } else {
          // 不包含期 区
          _this.issuShow = false;
          _this.issuList = [];
          _this.issuCode = "";
          _this.disShow = false;
          _this.disList = [];
          _this.disCode = "";
          _this.getOrganize(); // 查询楼
        }
      } else {
        _this.issuShow = false;
        _this.issuList = [];
        _this.issuCode = "";
        _this.disShow = false;
        _this.disList = [];
        _this.disCode = "";
        _this.floorList = [];
        _this.unitList = [];
        _this.layerList = [];
        _this.familyList = [];
        _this.identityList = [];
      }
    },
    // 查询家庭成员列表
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      findFamilyUser({ familyId: _this.bindForm.familyId }).then(function(res) {
        console.log("家庭成员  --- >", res);
        _this.listLoading = false;
        _this.identityList = res.data; // 列表数据
      });
    },
    // 选择楼
    selectionFloor(index, item, event) {
      let _this = this;
      _this.floorCurrent = index;
      _this.unitLoading = true;
      // 查询单元
      getUnitByFloor({ floorCode: item.code })
        .then(function(unit) {
          _this.unitLoading = false;
          _this.layerLoading = true;
          if (unit) {
            console.log("unit --- ", unit);
            _this.unitList = unit.data;
            if (unit.data.length > 0) {
              return getLayerByCommuntity({ unitCode: unit.data[0].code }); // 查询层
            }
          } else {
            _this.unitList = [];
          }
        })
        .then(function(layer) {
          _this.layerLoading = false;
          _this.familyLoading = true;
          if (layer) {
            _this.layerList = layer.data;
            if (layer.data.length > 0) {
              return getFamilyByStoreyCode({ storeyCode: layer.data[0].code }); // 查询家庭
            }
          } else {
            _this.layerList = [];
          }
        })
        .then(function(family) {
          _this.familyLoading = false;
          if (family) {
            console.log("family ---", family);
            _this.familyList = family.data;
            _this.bindForm.familyId =
              family.data.length > 0 ? family.data[0].id : "";
            if (_this.bindForm.familyId !== "") {
              _this.fetchData();
            } else {
              _this.identityList = [];
            }
          } else {
            _this.familyList = [];
            _this.identityList = [];
            _this.bindForm.familyId = "";
          }
        });
    },
    // 选择单元
    selectionUnit(index, item, event) {
      let _this = this;
      _this.unitCurrent = index;
      _this.layerLoading = true;
      getLayerByCommuntity({ unitCode: item.code })
        .then(function(layer) {
          _this.layerLoading = false;
          _this.familyLoading = true;
          if (layer) {
            _this.layerList = layer.data;
            if (layer.data.length > 0) {
              return getFamilyByStoreyCode({ storeyCode: layer.data[0].code }); // 查询家庭
            }
          } else {
            _this.layerList = [];
          }
        })
        .then(function(family) {
          _this.familyLoading = false;
          if (family) {
            console.log("family ---", family);
            _this.familyList = family.data;
            _this.bindForm.familyId =
              family.data.length > 0 ? family.data[0].id : "";
            if (_this.bindForm.familyId !== "") {
              _this.fetchData();
            }
          } else {
            _this.familyList = [];
            _this.identityList = [];
            _this.bindForm.familyId = "";
          }
        });
    },
    // 选择层
    selectionLayer(index, item, event) {
      let _this = this;
      _this.layerCurrent = index;
      _this.familyLoading = true;
      getFamilyByStoreyCode({ storeyCode: item.code }).then(function(family) {
        _this.familyLoading = false;
        if (family) {
          console.log("family ---", family);
          _this.familyList = family.data;
          _this.bindForm.familyId =
            family.data.length > 0 ? family.data[0].id : "";
          if (_this.bindForm.familyId !== "") {
            _this.fetchData();
          } else {
            _this.identityList = [];
          }
        } else {
          _this.familyList = [];
          _this.identityList = [];
          _this.bindForm.familyId = "";
        }
      });
    },
    // 选择家庭
    selectionFamily(index, item, event) {
      let _this = this;
      _this.familyCurrent = index;
      _this.bindForm.familyId = item.id; // 记录用户选择的家庭
      console.log("binForm  --- ", _this.bindForm);
      _this.fetchData();
    },
    // 选择期
    issuChange(val) {
      let _this = this;
      let item = null;
      if (_this.communityflag.indexOf("区") > -1) {
        // 查询区
        getDistrictByCommuntity({ issuCode: val }).then(function(issu) {
          _this.disList = issu.data; // 区集合
          _this.disCode = _this.disList.length > 0 ? _this.disList[0].code : ""; // 用户选中的区
          _this.disShow = true; // 是否显示选择区
          _this.getOrganize(); // 查询楼
        });
      } else {
        _this.disShow = false;
        _this.disList = [];
        _this.disCode = "";
        _this.getOrganize(); // 查询楼
      }
    },
    // 选择区
    disChange(val) {
      let _this = this;
      console.log("val ---- ", val);
      _this.getOrganize(); // 查询楼
    },
    // 获取身份名称
    getIdentityText(identity) {
      let text = "";
      this.identityTypes.forEach(function(v) {
        if (v.value == identity) {
          text = v.label;
        }
      });
      return text;
    },
    // 编辑
    editIdentity(row) {
      console.log("row --- >", row);
      this.disabledPhone = true;
      this.dialogStatus = "update";
      this.bindForm.name = row.nickName;
      this.bindForm.phone = row.userName;
      this.bindForm.identityCard = row.identityCard;
      this.bindForm.id = row.id;
      this.bindForm.identity = row.identity.toString();
      // 如果是业主 则验证身份显示编码
      if (this.bindForm.identity == this.identityTypes[1].value) {
        var user = JSON.parse(localStorage.getItem("user"));
        // 根据登录用户的角色 来决定是否显示绑定门口机编码
        if (user.roleFlag == this.roleMark[0].label) {
          this.isBinding = true;
        }
      } else {
        this.isBinding = false;
      }
      this.bindForm.paidCode = row.deviceKey ? row.deviceKey : ""; // 门口机设备编码
      console.log("_this.binfForm --- ", this.bindForm);
    },
    // 创建
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.bindForm.validate(valid => {
        if (valid) {
          try {
            console.log("_this. --- ", _this.dialogStatus);
            let params = {};
            params.communityId = _this.communityId;
            params.communityCode = _this.communityCode;
            params.familyId = _this.bindForm.familyId;
            params.identity = _this.bindForm.identity;
            params.identityCard = _this.bindForm.identityCard;
            params.nickName = _this.bindForm.name;
            params.userName = _this.bindForm.phone;
            // 如果页面显示出门口机code输入框 则携带参数
            if (_this.isBinding) {
              params.deviceKey = _this.bindForm.paidCode;
              params.deviceFlag = overall.equipment.flag[1].value;
              params.deviceType = overall.equipment.types[0].value;
              params.deviceButtonKey = "01";
            }
            console.log("params ---- >", params);
            addUserAndFamilyNew(params).then(function(res) {
              console.log("res --- >", res);
              if (res.message == "SUCCESS") {
                _this.buttonLoading = false; // 清空按钮加载状态
                _this.disabledPhone = false; // 解除 禁止修改手机号码
                _this.$notify({
                  title: _this.generatePoint("notifySuccess.title"),
                  message: _this.generatePoint("notifySuccess.message"),
                  type: "success"
                });
                _this.fetchData(); // 查询列表
                _this.empty();
              } else {
                _this.buttonLoading = false; // 清空按钮加载状态
                _this.disabledPhone = false; // 解除 禁止修改手机号码
                _this.$message.error(_this.generatePoint("system"));
              }
            });
          } catch (err) {
            console.error("err --- ", err); // 控制台打印异常
            _this.buttonLoading = false; // 清空按钮加载状态
            _this.disabledPhone = false; // 解除 禁止修改手机号码
            _this.$message.error(_this.generatePoint("system"));
          }
        } else {
          _this.buttonLoading = false; // 清楚加载中
          _this.disabledPhone = false; // 解除 禁止修改手机号码
          return false;
        }
      });
    },
    // 修改
    updateData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.bindForm.validate(valid => {
        if (valid) {
          try {
            let params = {};
            params.communityId = _this.communityId;
            params.communityCode = _this.communityCode;
            params.familyId = _this.bindForm.familyId;
            params.identity = _this.bindForm.identity;
            params.identityCard = _this.bindForm.identityCard;
            params.nickName = _this.bindForm.name;
            params.userName = _this.bindForm.phone;
            params.userId = _this.bindForm.id;
            // 如果页面显示出门口机code输入框 则携带参数
            if (_this.isBinding) {
              params.deviceKey = _this.bindForm.paidCode;
              params.deviceFlag = overall.equipment.flag[1].value;
              params.deviceType = overall.equipment.types[0].value;
              params.deviceButtonKey = "01";
            }
            console.log("params --- ", params);
            updateUserAndFamilyNew(params).then(function(res) {
              console.log("res --- >", res);
              if (res.message == "SUCCESS") {
                _this.buttonLoading = false; // 清空按钮加载状态
                _this.disabledPhone = false; // 解除 禁止修改手机号码
                _this.$notify({
                  title: _this.generatePoint("notifySuccess.title"),
                  message: _this.generatePoint("notifySuccess.message1"),
                  type: "success"
                });
                _this.fetchData(); // 查询列表
                _this.empty();
              } else {
                _this.buttonLoading = false; // 清空按钮加载状态
                _this.disabledPhone = false; // 解除 禁止修改手机号码
                _this.$message.error(_this.generatePoint("system"));
              }
            });
          } catch (err) {
            console.error("err --- ", err); // 控制台打印异常
            _this.buttonLoading = false; // 清空按钮加载状态
            _this.disabledPhone = false; // 解除 禁止修改手机号码
            _this.$message.error(_this.generatePoint("system"));
          }
        } else {
          _this.buttonLoading = false; // 清楚加载中
          _this.disabledPhone = false; // 解除 禁止修改手机号码
          return false;
        }
      });
    },
    // 删除
    deleteData(row) {
      console.log("row --- >", row);
      let _this = this;
      this.$confirm("此操作将永久解除绑定, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {};
          params.familyId = _this.bindForm.familyId;
          params.userId = row.id;
          console.log("params --- >", params);
          delUserAndFamily(params).then(function(res) {
            console.log("res --- >", res);
            if (res.message == "SUCCESS") {
              _this.$notify({
                title: _this.generatePoint("notifySuccess.title"),
                message: _this.generatePoint("notifySuccess.message7"),
                type: "success"
              });
              _this.fetchData(); // 查询列表
            } else {
              _this.$message.error(_this.generatePoint("system"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消解绑"
          });
        });
    },
    // 清空
    empty() {
      this.bindForm.name = "";
      this.bindForm.phone = "";
      this.bindForm.identityCard = "";
      this.bindForm.identity = "";
      this.bindForm.id = "";
      this.$refs.bindForm.resetFields(); // 重置省市区
      this.disabledPhone = false; // 解除 禁止修改手机号码
      this.dialogStatus = "create"; // 标示当前操作是添加、还是修改
      this.isBinding = false; // 不显示门口机编码
      this.bindForm.paidCode = ""; // 清空paidcode
    }
  }
};
</script>
<style lang="scss" scoped>
.household {
  padding: 20px;
  min-height: calc(100vh - 50px);
  .household-container {
    margin-bottom: 20px;
  }
  .household-content {
    min-height: calc(100vh - 150px);
    .item-box {
      min-height: calc(100vh - 150px);
      margin: 5px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #ebeef5;
      border-radius: 10px;
      color: #303133;
      background-color: #fff;
      h3 {
        width: 100%;
        background-color: #4cb2ff;
        margin: 0;
        padding: 10px;
        color: #ffffff;
        font-size: 15px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        text-align: center;
      }
      .item-form {
        .dialog-footer {
          text-align: center;
          padding-bottom: 50px;
        }
      }
      .item-table {
        padding: 20px;
      }
      .list-data {
        padding: 0;
        margin: 0;
        max-height: calc(100vh - 200px);
        overflow-y: auto;
        .list-item {
          list-style-type: none;
          padding: 10px;
          cursor: pointer;
          font-size: 12px;
          color: #a2a2a2;
          text-align: center;
        }
        .active {
          color: #409eff;
        }
      }
      .not-data {
        font-size: 14px;
        color: #a2a2a2;
        text-align: center;
        margin-top: 20px;
      }
    }
  }
}
</style>