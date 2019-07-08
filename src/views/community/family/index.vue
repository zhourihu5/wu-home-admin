<template>
  <div class="family">
    <!-- search --->
    <div class="family-container">
      <el-cascader
        :props="areaProps"
        v-model="list.areaOptionsVal"
        :placeholder="$t('table.temp.area')"
        @change="handleAreaList"
      ></el-cascader>
      <el-tooltip class="item" effect="dark" :content="$t('point.addreCommunity')" placement="top">
        <el-cascader
          :props="communitypProps"
          :options="list.communityOptions"
          @change="handleCommunityList"
          v-model="list.communityOptionsVal"
          :placeholder="$t('table.temp.communityChoice')"
        ></el-cascader>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="$t('point.communityFloor')" placement="top">
        <el-cascader
          :props="floorProps"
          :options="list.floorOptions"
          v-model="list.floorOptionsVal"
          @change="handleFloorList"
          :placeholder="$t('table.temp.floorChoice')"
        ></el-cascader>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="$t('point.floorUnit')" placement="top">
        <el-cascader
          :props="unitProps"
          :options="list.unitOptions"
          v-model="list.unitOptionsVal"
          :placeholder="$t('table.temp.unitChoice')"
        ></el-cascader>
      </el-tooltip>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="queryFamily"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddFamilyView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="family-table">
      <el-table
        v-loading="listLoading"
        :data="familyList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.belongToCommunity')" width="300">
          <template
            slot-scope="scope"
          >{{ scope.row.communtityName ? scope.row.communtityName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.belongToFloor')" width="200">
          <template
            slot-scope="scope"
          >{{ scope.row.floorName ? scope.row.floorName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.belongToUnit')" width="210">
          <template
            slot-scope="scope"
          >{{ scope.row.unitName ? scope.row.unitName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.familyName')" width="210" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.num ? scope.row.num : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.phone')" width="200" align="center">
          <template
            slot-scope="scope"
          >{{ scope.row.userInfo? scope.row.userInfo.userName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.household')" width="300" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.userInfo ? scope.row.userInfo.nickName : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="created_at"
          :label="$t('table.createTime')"
          width="310"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('table.operation')" align="center" width="300">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="mini"
              @click="showEditFamilyView(row)"
            >{{ $t('table.addHousehold') }}</el-button>
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
    </div>
    <!-- dialog -->
    <div class="family--dialog">
      <el-dialog
        :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
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
        >
          <el-form-item
            v-if="dialogStatus==='create'"
            :label="$t('form.area')"
            prop="areaOptionsVal"
          >
            <el-cascader
              :props="areaProps"
              @change="handleAreaForm"
              v-model="familyForm.areaOptionsVal"
              :placeholder="$t('table.temp.area')"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            v-if="dialogStatus==='create'"
            :label="$t('form.community')"
            prop="communityFormOptionsVal"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('point.addreCommunity')"
              placement="right"
            >
              <el-cascader
                :props="communitypProps"
                :options="familyForm.communityOptions"
                v-model="familyForm.communityFormOptionsVal"
                @change="handleCommunityForm"
                :placeholder="$t('table.temp.area')"
              ></el-cascader>
            </el-tooltip>
          </el-form-item>
          <el-form-item
            v-if="dialogStatus==='create'"
            :label="$t('form.floor')"
            prop="floorOptionsVal"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('point.communityFloor')"
              placement="right"
            >
              <el-cascader
                :props="floorProps"
                :options="familyForm.floorOptions"
                v-model="familyForm.floorOptionsVal"
                @change="handleFloorForm"
                :placeholder="$t('table.temp.floorName')"
              ></el-cascader>
            </el-tooltip>
          </el-form-item>
          <el-form-item
            v-if="dialogStatus==='create'"
            :label="$t('form.unit')"
            prop="unitOptionsVal"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('point.floorUnit')"
              placement="right"
            >
              <el-cascader
                :props="unitProps"
                :options="familyForm.unitOptions"
                v-model="familyForm.unitOptionsVal"
                :placeholder="$t('table.temp.unitChoice')"
              ></el-cascader>
            </el-tooltip>
          </el-form-item>
          <el-form-item v-if="dialogStatus==='create'" :label="$t('form.familyName')" prop="cname">
            <el-input
              style="width: 60%;"
              v-model="familyForm.cname"
              :placeholder="$t('table.temp.familyName')"
            />
          </el-form-item>
          <el-form-item
            v-if="dialogStatus==='update'"
            :label="$t('form.household')"
            prop="household"
          >
            <el-input
              v-model="familyForm.user.householdName"
              :disabled="true"
              :placeholder="$t('table.temp.addHousehold')"
            />
          </el-form-item>
        </el-form>
        <!-- 住戶列表-->
        <transition v-if="dialogStatus==='update'" name="el-zoom-in-top">
          <user-List :user="familyForm.user" @transmitUser="userChoiceHousehold"></user-List>
        </transition>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close">{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="dialogStatus==='create'?createData():addHousehold()"
            :loading="buttonLoading"
          >{{ $t('table.confirm') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="scss">
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
}
</style>
<script>
import Pagination from "@/components/Pagination"; // 分页
import { getAreas } from "@/api/area";
import {
  getCommuntityByArea,
  getFamilyAll,
  addUserAndFamily,
  findFamilyUser,
  delUserAndFamily,
  getFloorByCommuntity,
  getUnitByFloor,
  addFamily
} from "@/api/community";
import { generatePoint } from "@/utils/i18n";
import userList from "./components/user";
import { Promise } from "q";
export default {
  components: { Pagination, userList },
  data() {
    return {
      isHousehold: 0, // 是否添加户主
      // 省市区
      areaProps: {
        label: "areaName",
        value: "id",
        children: "children",
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          switch (level) {
            case 0:
              getAreas().then(function(res) {
                resolve(res.data);
              });
              break;
            case 1:
              getAreas({ pid: node.value }).then(function(res) {
                resolve(res.data);
              });
              break;
            case 2:
              getAreas({ pid: node.value }).then(function(res) {
                for (let i = 0; i < res.data.length; i++) {
                  res.data[i].leaf = true;
                }
                resolve(res.data);
              });
              break;
          }
        }
      },
      communitypProps: {
        label: "name",
        value: "id"
      },
      floorProps: {
        label: "name",
        value: "id"
      },
      unitProps: {
        label: "num",
        value: "id"
      },
      // 查询条件
      listQuery: {
        unitId: "", // 单元名称
        pageNum: 1,
        pageSize: 10
      },
      // 列表 多选项
      list: {
        // 列表省市区数据
        areaOptionsVal: [], // 省市区 选中的
        // 列表区域数据
        communityOptions: [],
        communityOptionsVal: [],
        // 楼宇数据
        floorOptions: [],
        floorOptionsVal: [],
        // 单元数据
        unitOptions: [],
        unitOptionsVal: []
      },
      // 表单数据
      familyForm: {
        cname: "", // 社区名称
        id: "",
        floorId: "",
        areaOptionsVal: [],
        // 表单区域数据
        communityOptions: [],
        communityFormOptionsVal: [],
        // 楼宇数据
        floorOptions: [],
        floorOptionsVal: [],
        // 单元数据
        unitOptions: [],
        unitOptionsVal: [],
        // householdId: "", // 户主ID
        // householdName: "" // 户主名称
        user: {
          id: "",
          nickName: "",
          userName: "",
          householdName: ""
        }
      },
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      familyList: [], // 列表数据
      listLoading: true,
      buttonLoading: false,
      total: 0,
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      rules: {
        cname: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("unitName")
          }
        ],
        areaOptionsVal: [
          {
            type: "array",
            required: true,
            trigger: "change",
            message: this.generatePoint("addre")
          }
        ],
        communityFormOptionsVal: [
          {
            type: "array",
            required: true,
            trigger: "change",
            message: this.generatePoint("community")
          }
        ],
        floorOptionsVal: [
          {
            type: "array",
            required: true,
            trigger: "change",
            message: this.generatePoint("floor")
          }
        ],
        unitOptionsVal: [
          {
            type: "array",
            required: true,
            trigger: "change",
            message: this.generatePoint("unit")
          }
        ]
      }
    };
  },
  created() {
    this.fetchData(); // 获取列表数据
  },
  methods: {
    generatePoint,
    // 获取用户选择的业主
    userChoiceHousehold(user) {
      console.log("user --- ", user);
      this.familyForm.user = user;
      this.familyForm.user.householdName = user.nickName
        ? user.nickName
        : user.userName;
    },
    // 是否添加住户
    whetherHousehold() {
      if (this.isHousehold == 0) {
        if (this.dialogStatus == "create") {
          this.familyForm.user = {
            id: "",
            nickName: "",
            userName: "",
            householdName: ""
          };
        }
      }
    },
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getFamilyAll(this.listQuery).then(function(res) {
        console.log("res -- >", res);
        _this.listLoading = false;
        _this.familyList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 添加页面
    showAddFamilyView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 修改页面
    showEditFamilyView(row) {
      let _this = this;
      _this.dialogStatus = "update"; // 标示创建
      _this.dialogFormVisible = true; // 展示弹窗
      _this.familyForm.id = row.id;
    },
    // 查询家庭
    queryFamily() {
      let _this = this;
      if (
        _this.list.communityOptionsVal.length > 0 &&
        _this.list.floorOptionsVal.length > 0 &&
        _this.list.unitOptionsVal.length > 0
      ) {
        _this.listQuery.unitId = _this.list.unitOptionsVal[0];
        _this.fetchData();
      } else {
        this.$notify({
          dangerouslyUseHTMLString: true,
          title: this.generatePoint("notifyWarning.title1"),
          message:
            "1. " +
            _this.generatePoint("retrieval") +
            _this.generatePoint("community") +
            "<br/>" +
            "2. " +
            _this.generatePoint("retrieval") +
            _this.generatePoint("floor") +
            "<br/>" +
            "3. " +
            _this.generatePoint("retrieval") +
            _this.generatePoint("unit"),
          type: "warning"
        });
      }
    },
    // 监听区域查询社区 列表
    handleAreaList(val) {
      this.getCommuntity(0, val[2]); // 查询社区
    },
    // 监听区域查询社区 表单
    handleAreaForm(val) {
      this.getCommuntity(1, val[2]); // 查询社区
    },
    // 监听社区查询楼宇 列表
    handleCommunityList(val) {
      this.getFloor(0, val[0]); // 查询楼宇
    },
    // 监听社区查询楼宇 表单
    handleCommunityForm(val) {
      this.getFloor(1, val[0]); // 查询楼宇
    },
    // 监听楼宇查询单元 列表
    handleFloorList(val) {
      this.getUnit(0, val[0]); // 查询单元
    },
    // 监听楼宇查询单元 列表
    handleFloorForm(val) {
      console.log("1111");
      this.getUnit(1, val[0]); // 查询单元
    },
    // 更新社区
    getCommuntity(code, val) {
      let _this = this;
      console.log(2);
      _this.list.communityOptions = [];
      _this.familyForm.communityOptions = [];
      _this.list.floorOptions = [];
      _this.familyForm.floorOptions = [];
      _this.list.communityOptionsVal = "";
      _this.list.floorOptionsVal = "";
      getCommuntityByArea({ areaCode: val }).then(function(res) {
        switch (code) {
          case 0:
            _this.list.communityOptions = res.data; // 列表中 社区
            break;
          case 1:
            _this.familyForm.communityOptions = res.data; // 表单中 社区
            break;
        }
      });
    },
    // 更新楼宇
    getFloor(code, val) {
      let _this = this;
      _this.list.floorOptions = [];
      _this.familyForm.floorOptions = [];
      getFloorByCommuntity({ communtityId: val }).then(function(res) {
        console.log("res --- >", res);
        switch (code) {
          case 0:
            _this.list.floorOptions = res.data; // 列表中 社区
            break;
          case 1:
            _this.familyForm.floorOptions = res.data; // 表单中 社区
            break;
        }
      });
    },
    // 更新单元
    getUnit(code, val) {
      let _this = this;
      _this.list.unitOptions = [];
      _this.familyForm.unitOptions = [];
      getUnitByFloor({ floorId: val }).then(function(res) {
        console.log("res --- >", res);
        switch (code) {
          case 0:
            _this.list.unitOptions = res.data; // 列表中 社区
            break;
          case 1:
            _this.familyForm.unitOptions = res.data; // 表单中 社区
            break;
        }
      });
    },
    // 创建数据
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.familyForm.validate(valid => {
        if (valid) {
          addFamily({
            num: _this.familyForm.cname,
            unitId: _this.familyForm.unitOptionsVal[0],
            communtityId: _this.familyForm.communityFormOptionsVal[0]
          }).then(function(res) {
            _this.buttonLoading = false; // 清楚加载中
            if (res.message == "SUCCESS") {
              _this.dialogFormVisible = false; // 关闭弹窗
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
    addHousehold() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      // console.log("添加业主 --- ", _this.familyForm);
      addUserAndFamily({
        identity: 1,
        userFamily: {
          familyId: _this.familyForm.id,
          userId: _this.familyForm.user.id
        }
      }).then(function(res) {
        _this.buttonLoading = false; // 清楚加载中
        if (res.message == "SUCCESS") {
          _this.dialogFormVisible = false; // 关闭弹窗
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
    },
    // 关闭弹窗
    close() {
      this.dialogFormVisible = false; // 关闭弹窗
      this.$refs.familyForm.resetFields();
      this.familyForm.areaOptionsVal = []; // 清空区域已选择
      this.familyForm.communityFormOptionsVal = [];
      this.familyForm.floorOptionsVal = [];
      this.familyForm.unitOptionsVal = [];
      this.familyForm.communityOptions = [];
      this.familyForm.floorOptions = [];
      this.familyForm.unitOptions = [];
      //   this.unitForm.communityFormOptionsVal = []; // 清空社区已选择
      this.familyForm.cname = "";
      this.familyForm.floorId = "";
      this.familyForm.id = "";
      this.isHousehold = 0;
      this.familyForm.user = {};
    }
  }
};
</script>