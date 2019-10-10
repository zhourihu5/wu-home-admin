<template>
  <div class="role">
    <!-- search --->
    <div class="role-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="role-table">
      <el-table
        v-loading="listLoading"
        :data="roleList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.role')" width="250">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.addUser')" width="250">
          <template slot-scope="scope">{{ scope.row.creater }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.state')" width="350">
          <template slot-scope="scope">{{ getStatusText(scope.row.status) }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.createTime')" width="350">
          <template slot-scope="scope">{{ scope.row.createDate }}</template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="374">
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
    </div>
    <!-- dialog -->
    <el-dialog
      :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
      :visible.sync="dialogFormVisible"
      @close="close"
    >
      <el-form
        ref="roleForm"
        :rules="rules"
        :model="roleForm"
        label-position="right"
        label-width="100px"
        style="width: 80%"
      >
        <el-form-item :label="$t('form.name')" prop="name">
          <el-input v-model="roleForm.name" :placeholder="$t('table.temp.name')" />
        </el-form-item>
        <el-form-item :label="$t('form.roleMark')" prop="flag">
          <el-select v-if="dialogStatus != 'update'" v-model="roleForm.flag" placeholder="请选择">
            <el-option
              v-for="item in roleMark"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
          <template v-else>{{ getFlagText(roleForm.flag) }}</template>
        </el-form-item>
        <el-form-item :label="$t('form.state')" prop="state">
          <el-tooltip
            :content="roleForm.enable == 0 ? $t('form.enable') : $t('form.prohibit')"
            placement="top"
          >
            <el-switch
              v-model="roleForm.enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="0"
              inactive-value="1"
              @change="switchChange"
            ></el-switch>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="$t('form.menu')" prop="menu">
          <el-tree ref="tree" :data="roleMenu" show-checkbox node-key="id" :props="defaultProps"></el-tree>
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
</template>
<script>
import {
  authorityFindAll,
  saveRoleAuthority,
  findRloeList
} from "@/api/permission";
import { overall } from "@/constant/index";
import { buildMenus } from "./../../../utils/base";
import { generateTitle, generateI18n } from "@/utils/i18n";
import { generatePoint } from "@/utils/i18n";
export default {
  data() {
    return {
      roleList: [],
      total: 0, // 列表分页
      roleMark: overall.role.mark, // 平台标示
      roleForm: {
        roleId: "",
        name: "",
        enable: "0", // 启用状态  0启用 1禁用
        flag: ""
      },
      roleMenu: [], // 菜单树
      defaultProps: {
        children: "children",
        label: "zhName"
      },
      listLoading: false, // 列表加载
      buttonLoading: false, // 按钮加载请求
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      rules: {
        name: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("mandatory")
          }
        ],
        flag: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("mandatory")
          }
        ],
        menu: [
          {
            validator: (rule, value, callback) => {
              if (this.$refs.tree.getCheckedKeys().length == 0) {
                callback(this.generatePoint("mandatory"));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    generateTitle,
    generateI18n,
    generatePoint,
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      findRloeList().then(function(res) {
        console.log("res --- ", res);
        _this.listLoading = false;
        _this.roleList = res.data; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 显示添加页面
    showAddView() {
      let _this = this;
      _this.findMenu(function() {
        _this.dialogStatus = "create"; // 标示创建
        _this.dialogFormVisible = true; // 展示弹窗
        _this.$refs.tree.setCheckedKeys([]);
      });
    },
    // 查询菜单
    findMenu(callback) {
      let _this = this;
      // 查询菜单、组建菜单树
      authorityFindAll().then(function(res) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].zhName = _this.generateTitle(res.data[i].title);
        }
        console.log(" --- >", res.data);
        _this.roleMenu = buildMenus(res.data); // 构建树菜单
        callback();
      });
    },
    // 编辑
    showEditUserView(row) {
      console.log(row);
      let _this = this;
      _this.roleForm.roleId = row.id;
      _this.roleForm.name = row.name;
      _this.roleForm.enable = row.status;
      _this.roleForm.flag = row.flag;
      _this.findMenu(function() {
        _this.dialogStatus = "update"; // 标示创建
        _this.dialogFormVisible = true; // 展示弹窗
        _this.$nextTick(() => {
          _this.$refs.tree.setCheckedKeys(row.auths.split(","));
        });
      });
    },
    getStatusText(status) {
      console.log("status -- >", status);
      if (status == 0) {
        return this.generateI18n("form.enable");
      } else {
        return this.generateI18n("form.prohibit");
      }
    },
    getFlagText(flag) {
      let text = "";
      this.roleMark.forEach(function(v) {
        if(v.label == flag) {
          text = v.label + " (" + v.name + ")";
        }
      })
      return text;
    },
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.roleForm.validate(valid => {
        if (valid) {
          try {
            let params = {};
            params.name = _this.roleForm.name;
            params.status = _this.roleForm.enable;
            params.authId = _this.$refs.tree.getCheckedKeys().join(",");
            params.flag = _this.roleForm.flag;
            if (_this.roleForm.roleId) {
              params.roleId = _this.roleForm.roleId;
            }
            console.log("params --- >", params);
            saveRoleAuthority(params).then(function(res) {
              _this.buttonLoading = false; // 清楚加载中
              if (res.message == "SUCCESS") {
                if (!params.roleId) {
                  _this.$notify({
                    title: _this.generatePoint("notifySuccess.title"),
                    message: _this.generatePoint("notifySuccess.message"),
                    type: "success"
                  });
                } else {
                  _this.$notify({
                    title: _this.generatePoint("notifySuccess.title"),
                    message: _this.generatePoint("notifySuccess.message1"),
                    type: "success"
                  });
                }
              } else {
                _this.$message.error(_this.generatePoint("system"));
              }
              _this.close();
              _this.fetchData(); // 更新列表
            });
          } catch (err) {
            console.error("err --- ", err); // 控制台打印异常
            _this.buttonLoading = false; // 清空按钮加载状态
            _this.$message.error(_this.generatePoint("system"));
          }
        } else {
          _this.buttonLoading = false; // 清楚加载中
          return false;
        }
      });
    },
    updateData() {
      this.createData();
    },
    // 是否禁用
    switchChange(val) {
      this.roleForm.enable = val;
      console.log(" --- >", this.roleForm.enable);
    },
    // 关闭
    close() {
      this.dialogFormVisible = false;
      this.roleForm = {
        roleId: "",
        name: "",
        enable: "0", // 启用状态  0启用 1禁用
        flag: "",
      };
      this.$refs.roleForm.resetFields();
    }
  }
};
</script>
<style lang="scss">
.role {
  padding: 20px;
  .role-container {
    margin-bottom: 20px;
  }
}
</style>