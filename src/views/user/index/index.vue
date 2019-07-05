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
            <el-input v-model="userForm.userName" :placeholder="$t('table.temp.userName')"/>
          </el-form-item>
          <el-form-item :label="$t('table.nickName')" prop="nickName">
            <el-input v-model="userForm.nickName" :placeholder="$t('table.temp.nickName')"/>
          </el-form-item>
          <el-form-item :label="$t('login.password')" prop="password">
            <el-input
              type="password"
              v-model="userForm.password"
              :placeholder="$t('table.temp.password')"
            />
          </el-form-item>
          <el-form-item :label="$t('table.platform')" prop="flag">
            <el-select v-model="userForm.flag" :placeholder="$t('table.temp.platform')">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
import { getUserList, addUser, removeUser } from "@/api/user";
import Pagination from "@/components/Pagination"; // 分页
import { generatePoint } from "@/utils/i18n";
import { overall } from "@/constant/index"; // 服务 常用常量
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
  components: { Pagination },
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
        id: ""
      },
      // 平台标示选择
      options: overall.user.options,

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
          { required: true, trigger: "change" },
          { validator: this.validatePlatform }
        ]
      },
      pickerOptions: {
        // 时间插件控制
        disabledDate(time) {
          // 只可选择大于当前时间的日期
          return time.getTime() < Date.now();
        }
      }
    };
  },
  created() {
    this.fetchData();
  },

  methods: {
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
      console.log(row);
      _this.dialogStatus = "update"; // 标示创建
      _this.dialogFormVisible = true; // 展示弹窗
      console.log("_this.userForm -- ", _this.userForm);
      console.log("row-- ", row);
      // Object.assign(_this.userForm, row);
      for (let key in _this.userForm) {
        for (let key1 in row) {
          if (key == key1) {
            _this.userForm[key] = row[key1];
          }
        }
      }
    },
    // 创建数据
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.userForm.validate(valid => {
        if (valid) {
          console.log("创建", _this.temp);
          addUser(_this.userForm).then(function(res) {
            console.log("res --- >", res);
            _this.buttonLoading = false; // 清楚加载中
            if (res.message == "SUCCESS") {
              _this.dialogFormVisible = false; // 关闭弹窗
              // _this.$refs.userForm.resetFields(); // 重置表单
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
      console.log("修改");
      _this.buttonLoading = true; // 按钮加载中
      let _this = this;
      _this.$refs.userForm.validate(valid => {
        console.log("res --- >", _this.userForm);
        if (valid) {
          addUser(_this.userForm).then(function(res) {
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
      if (!isvalidPhone(value)) {
        callback(new Error(this.generatePoint("phone")));
      } else {
        callback();
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
    getFlagText(flag) {
      let text = "";
      this.options.forEach(function(v) {
        if (v.value == flag) {
          text = v.label;
        }
      });
      return text;
    },
    close() {
      this.dialogFormVisible = false;
      this.userForm = {
        userName: "",
        flag: "",
        userId: "",
        password: "",
        nickName: "",
        id: ""
      };
      this.$refs.userForm.resetFields();
    }
  }
};
</script>
