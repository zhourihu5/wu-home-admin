<template>
  <div class="user">
    <div class="app-container">
      <!-- query -->
      <div class="filter-container">
        <el-input
          v-model="listQuery.userName"
          :placeholder="$t('table.temp.userName')"
          style="width: 200px;"
          class="filter-item"
        />
        <el-input
          v-model="listQuery.nickName"
          :placeholder="$t('table.temp.nickName')"
          style="width: 200px;"
          class="filter-item"
        />
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="queryUser"
        >{{ $t('table.search') }}</el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
          @click="showAddUserView"
        >{{ $t('table.add') }}</el-button>
      </div>

      <!-- table --->
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column :label="$t('table.userName')" width="470" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.userName ? scope.row.userName : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.nickName')" width="500">
          <template
            slot-scope="scope"
          >{{ scope.row.nickName ? scope.row.nickName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.platform')" width="400" align="center">
          <template
            slot-scope="scope"
          >{{ scope.row.flag ? getFlagText(scope.row.flag) : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="360">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="mini"
              @click="showEditUserView(row)"
            >{{ $t('table.edit') }}</el-button>
            <!-- <el-button type="danger" size="mini" @click="deleteData(row)">{{ $t('table.delete') }}</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="fetchData"
      />

      <!-- dialog -->
      <el-dialog
        :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
        :visible.sync="dialogFormVisible"
        @close="close"
      >
        <el-form
          ref="userForm"
          :rules="rules"
          :model="userForm"
          label-position="right"
          label-width="100px"
          style="width: 60%"
        >
          <el-form-item :label="$t('table.userName')" prop="userName">
            <el-input v-model="userForm.userName" :placeholder="$t('table.temp.userName')" />
          </el-form-item>
          <el-form-item :label="$t('table.nickName')" prop="nickName">
            <el-input v-model="userForm.nickName" :placeholder="$t('table.temp.nickName')" />
          </el-form-item>
          <el-form-item :label="$t('table.identityCard')" prop="identityCard">
            <el-input v-model="userForm.identityCard" :placeholder="$t('table.temp.identityCard')" />
          </el-form-item>
          <el-form-item :label="$t('login.password')" prop="password">
            <el-input
              type="password"
              v-model="userForm.password"
              :placeholder="$t('table.temp.password')"
            />
          </el-form-item>
          <el-form-item :label="$t('table.platform')" prop="flag">
            <el-select
              v-model="userForm.flag"
              :placeholder="$t('table.temp.platform')"
              @change="selectChange"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 角色 -->
          <el-form-item v-show="showRole" :label="$t('table.role')" prop="role">
            <el-select
              v-model="userForm.roleId"
              :placeholder="$t('table.temp.role')"
              @change="roleChange"
            >
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 社区-->
          <el-form-item v-show="showCommunity" :label="$t('table.community')" prop="community">
            <province ref="provinceForm" :params="myForm" @getProvinceVal="getProvinceVal"></province>
            <el-select v-model="userForm.communityIds" placeholder="请选择" multiple>
              <el-option
                v-for="item in communityList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close">{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="dialogStatus==='create'?createData():updateData()"
            :loading="buttonLoading"
          >{{ $t('table.confirm') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style>
.filter-container {
  margin-bottom: 10px;
}
</style>

<script>
import Province from "@/components/Linkage/province"; // 省市区三级联动
import { getUserList, addUser, removeUser } from "@/api/user";
import Pagination from "@/components/Pagination"; // 分页
import { generatePoint } from "@/utils/i18n";
import { overall } from "@/constant/index"; // 服务 常用常量
import { findRloeList } from "@/api/permission";
import { getCommuntityByArea } from "@/api/community";
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
  components: { Pagination, Province },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      buttonLoading: false, // 按钮加载请求
      total: 0, // 分页
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      // 查询参数
      listQuery: {
        nickName: "",
        userName: "",
        pageNum: 1,
        pageSize: 10
      },
      // 表单数据
      userForm: {
        userName: "",
        flag: "",
        userId: "",
        password: "",
        nickName: "",
        id: "",
        identityCard: "", // 身份证号
        roleId: "", // 角色ID
        communityIds: [], // 社区ID集合
        cityCode: "", // 省市区code
        // province: "",
        // city: "",
        // area: ""
        row: null // 编辑时候的缓存对象
      },
      // 平台标示选择
      options: overall.user.options,
      roleMark: overall.role.mark, // 角色标示
      // 表单验证
      rules: {
        userName: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("userName")
          },
          { validator: this.validateUserName }
        ],
        nickName: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("nickName")
          }
        ],
        password: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("password")
          }
        ],
        flag: [
          {
            required: true,
            trigger: "change",
            validator: this.validatePlatform
          }
        ],
        role: [
          {
            validator: (rule, value, callback) => {
              if (this.showRole) {
                if (this.userForm.roleId) {
                  callback();
                } else {
                  callback(this.generatePoint("mandatory"));
                }
              } else {
                callback();
              }
            }
          }
        ],
        community: [
          {
            validator: (rule, value, callback) => {
              if (this.showCommunity) {
                console.log(" ---- > 123123");
                if (this.userForm.communityIds.length > 0) {
                  callback();
                } else {
                  callback(this.generatePoint("mandatory"));
                }
              } else {
                callback();
              }
            }
          }
        ],
        identityCard: [
          {
            validator: this.validateIdentityCard
          }
        ]
      },
      pickerOptions: {
        // 时间插件控制
        disabledDate(time) {
          // 只可选择大于当前时间的日期
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      roleList: [], // 角色集合
      communityList: [], // 社区集合
      myForm: {
        code: "form",
        areaValue: [],
        communityValue: []
      },
      showCommunity: false, // 是否显示选择社区
      showRole: false // 是否显示角色
    };
  },
  created() {
    this.fetchData();
  },

  methods: {
    aChange() {
      console.log(" ----- >", this.value5);
    },
    generatePoint,
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getUserList(this.listQuery).then(function(res) {
        _this.listLoading = false;
        _this.list = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
        console.log("res -- ", res);
      });
    },
    // 查询
    queryUser() {
      this.listQuery.pageNum = 1;
      this.fetchData();
    },
    // 显示添加页面
    showAddUserView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 显示编辑页面
    showEditUserView(row) {
      let _this = this;
      _this.row = row;
      console.log("row-- ", row);
      _this.userForm.id = row.id;
      _this.userForm.userName = row.userName;
      _this.userForm.userId = row.userId;
      _this.userForm.password = row.password;
      _this.userForm.nickName = row.nickName;
      _this.userForm.identityCard = row.identityCard;
      _this.userForm.roleId = row.roleId;
      _this.userForm.flag = row.flag;
      _this.userForm.cityCode = row.cityCode; // 省市区
      // 社区赋值
      if (row.communityIds) {
        _this.userForm.communityIds = row.communityIds.split(",");
      }
      console.log("_this.userForm --- ", _this.userForm);

      // 处理物业与后台用户权限回显
      if (row.flag == 1) {
        _this.buttonLoading = true;
        _this.getRloeList(function() {
          _this.showRole = true; // 显示权限
          if (row.communityIds) {
            _this.showCommunity = true; // 显示选择社区
          }
          _this.buttonLoading = false;
        });
      } else {
        _this.showRole = false;
        _this.showCommunity = false; // 显示选择社区
      }

      // 回显示 省市区 社区
      _this.$nextTick(() => {
        if (_this.userForm.cityCode) {
          let arr = _this.userForm.cityCode.split(",");
          _this.$refs.provinceForm.echoArea([
            parseInt(arr[0]),
            parseInt(arr[1]),
            parseInt(arr[2])
          ]);
          getCommuntityByArea({ areaCode: arr[2] }).then(function(res) {
            _this.communityList = res.data;
            if (_this.userForm.communityIds.length > 0) {
              for (let i = 0; i < _this.userForm.communityIds.length; i++) {
                _this.userForm.communityIds[i] = parseInt(
                  _this.userForm.communityIds[i]
                );
              }
            }
          });
        }
      });
      _this.dialogStatus = "update"; // 标示创建
      _this.dialogFormVisible = true; // 展示弹窗
    },
    // 创建数据
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.userForm.validate(valid => {
        if (valid) {
          let params = {
            userName: _this.userForm.userName,
            nickName: _this.userForm.nickName,
            flag: _this.userForm.flag,
            password: _this.userForm.password,
            identityCard: _this.userForm.identityCard,
            roleId: _this.userForm.roleId,
            cityCode: _this.userForm.cityCode
          };
          if (_this.userForm.communityIds.length > 0) {
            params.communityIds = _this.userForm.communityIds.join(",");
          }
          console.log("创建用户:", params);
          addUser(params).then(function(res) {
            console.log("res --- >", res);
            _this.buttonLoading = false; // 清楚加载中
            if (res.message == "SUCCESS") {
              _this.dialogFormVisible = false; // 关闭弹窗
              // 提示
              _this.$notify({
                title: _this.generatePoint("notifySuccess.title"),
                message: _this.generatePoint("notifySuccess.message"),
                type: "success"
              });
            } else {
              _this.$message.error(_this.generatePoint("system"));
            }
            _this.fetchData(); // 更新列表
          });
        } else {
          _this.buttonLoading = false; // 清楚加载中
          return false;
        }
      });
    },
    // 修改数据
    updateData() {
      let _this = this;
      // _this.buttonLoading = true; // 按钮加载中
      _this.$refs.userForm.validate(valid => {
        if (valid) {
          let params = {
            userName: _this.userForm.userName,
            nickName: _this.userForm.nickName,
            flag: _this.userForm.flag,
            password: _this.userForm.password,
            identityCard: _this.userForm.identityCard,
            roleId: _this.userForm.roleId,
            // communityIds: _this.userForm.communityIds.join(","),
            cityCode: _this.userForm.cityCode,
            id: _this.userForm.id,
            createDate: _this.row.createDate,
            wxOpenId: _this.row.wxOpenId,
            realName: _this.row.realName,
            birthday: _this.row.birthday,
            sex: _this.row.sex,
            wxCover: _this.row.wxCover,
            wxNickName: _this.row.wxNickName,
            communityCode: _this.row.communityCode,
            communityIds: _this.row.communityIds,
            cityCode: _this.row.cityCode
          };
          if (_this.userForm.communityIds.length > 0) {
            params.communityIds = _this.userForm.communityIds.join(",");
          }
          console.log("params --- >", params, this.row);
          addUser(params).then(function(res) {
            console.log("res --- >", res);
            _this.buttonLoading = false; // 清楚加载中
            if (res.message == "SUCCESS") {
              _this.dialogFormVisible = false; // 关闭弹窗
              // 提示
              _this.$notify({
                title: _this.generatePoint("notifySuccess.title"),
                message: _this.generatePoint("notifySuccess.message1"),
                type: "success"
              });
            } else {
              _this.$message.error(_this.generatePoint("system"));
            }
            _this.fetchData(); // 更新列表
          });
        } else {
          _this.buttonLoading = false; // 清楚加载中
          return false;
        }
      });
    },
    // 删除数据
    deleteData(row) {
      console.log("删除", row);
      removeUser({ id: row.id }).then(function(res) {
        console.log("res -- ", res);
        if (res.message == "SUCCESS") {
          // 提示
          _this.$notify({
            title: _this.generatePoint("notifySuccess.title"),
            message: _this.generatePoint("notifySuccess.message5"),
            type: "success"
          });
        } else {
          _this.$message.error(_this.generatePoint("system"));
        }
      });
    },
    // 验证账号 手机格式
    validateUserName(rule, value, callback) {
      if (value == "admin") {
        callback();
      } else {
        if (!isvalidPhone(value)) {
          callback(new Error(this.generatePoint("phone")));
        } else {
          callback();
        }
      }
    },
    // 验证账号 是否重复
    validateIsRepeat(rule, value, callback) {},
    // 验证平台
    validatePlatform(rule, value, callback) {
      if (!value) {
        callback(new Error(this.generatePoint("platform")));
      } else {
        callback();
      }
    },
    // 验证身份证格式
    validateIdentityCard(rule, value, callback) {
      if (value) {
        if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
          callback();
        } else {
          callback(new Error(this.generatePoint("identityCard")));
        }
      } else {
        callback();
      }
    },
    getFlagText(flag) {
      let text = "";
      // console.log("options --- ", this.options);
      this.options.forEach(function(v) {
        if (v.value == flag) {
          text = v.label;
        }
      });
      return text;
    },
    // 查询角色集合
    getRloeList(callback) {
      let _this = this;
      findRloeList().then(function(res) {
        console.log("获取角色列表 --- ", res);
        _this.roleList = res.data; // 列表数据
        typeof callback == "function" ? callback() : "";
      });
    },
    selectChange(val) {
      let _this = this;
      console.log("val --- ", val, this.userForm.roleId);
      // 后台用户
      if (val == 1) {
        _this.buttonLoading = true;
        _this.getRloeList(function() {
          _this.showRole = true; // 显示权限
          _this.buttonLoading = false;
        });
      } else {
        _this.showRole = false;
      }
    },
    roleChange(val) {
      console.log("val --- >", val, this.roleList);
      let roleMark = "";
      this.buttonLoading = true;
      this.roleList.forEach(function(v) {
        if (v.id == val) {
          roleMark = v.flag;
        }
      });
      // 如果是物业的话 显示社区
      if (roleMark == this.roleMark[1].label) {
        this.showCommunity = true; // 显示选择社区
      } else {
        this.showCommunity = false; // 显示选择社区
      }
      this.buttonLoading = false;

      console.log("roleMark --- >", roleMark, this.roleMark[1].label);
    },
    // 获取省市区数据
    getProvinceVal(val, code) {
      let _this = this;
      // console.log("用户选择了 ", val, code);
      _this.userForm.cityCode = val.join(","); // 省市区
      getCommuntityByArea({ areaCode: val[2] }).then(function(res) {
        console.log("res --- >", res);
        _this.communityList = res.data;
      });
    },
    close() {
      this.dialogFormVisible = false;
      this.userForm = {
        userName: "",
        flag: "",
        userId: "",
        password: "",
        nickName: "",
        id: "",
        identityCard: "", // 身份证号
        roleId: "",
        communityIds: "",
        cityCode: "" // 省市区code
      };
      this.$refs.userForm.resetFields();
      this.showCommunity = false;
      this.showRole = false;
      this.roleList = [];
      this.communityList = [];
      this.row = null;
    }
  }
};
</script>
