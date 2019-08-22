<template>
  <div class="business">
    <!-- search --->
    <div class="business-container">
      <!-- <province ref="provinceList" :params="myList" @getProvinceVal="getProvinceVal"></province>
      <el-cascader
        :props="communitypProps"
        :options="communityOptions"
        v-model="listQuery.communityCode"
        :placeholder="$t('table.temp.communityChoice')"
      ></el-cascader>-->
      <el-input
        v-model="listQuery.name"
        :placeholder="$t('table.temp.name')"
        style="width: 200px;"
        class="filter-item"
      />
      <!-- <el-date-picker
        v-model="queryDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd HH:mm:ss"
      ></el-date-picker>-->
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="queryBusiness"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="business-table">
      <el-table
        v-loading="listLoading"
        :data="businessList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.number')" width="300">
          <template slot-scope="scope">{{ scope.row.code ? scope.row.code : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.name')" width="300">
          <template slot-scope="scope">{{ scope.row.name ? scope.row.name : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.phone')" width="300">
          <template slot-scope="scope">{{ scope.row.phone ? scope.row.phone : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.joinTime')" width="300">
          <template
            slot-scope="scope"
          >{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.address')" width="530">
          <template
            slot-scope="scope"
          >{{ scope.row.address ? scope.row.address : $t('table.noTime')}}</template>
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
    <el-dialog
      :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
      :visible.sync="dialogFormVisible"
      @close="close"
    >
      <el-form
        ref="businessForm"
        :rules="rules"
        :model="businessForm"
        label-position="right"
        label-width="100px"
        style="width: 90%"
      >
        <el-form-item :label="$t('table.name')" prop="name">
          <el-input
            class="my-input"
            v-model="businessForm.name"
            :placeholder="$t('table.temp.title')"
          />
        </el-form-item>
        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input
            class="my-input"
            v-model="businessForm.phone"
            :placeholder="$t('table.temp.title')"
          />
        </el-form-item>
        <el-form-item :label="$t('table.address')" prop="address">
          <el-input
            class="my-input"
            v-model="businessForm.address"
            :placeholder="$t('table.temp.title')"
          />
        </el-form-item>
        <el-form-item :label="$t('form.relationUser')" prop="userId">
          <el-input
            :disabled="true"
            v-model="businessForm.nickName"
            :placeholder="$t('table.temp.user')"
            class="my-input"
            style="width: 80%;"
          />
          <el-button type="text" @click="onSubLevel(0)">{{ $t('form.relationUser') }}</el-button>
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
      <!-- 内部dialog -->
      <el-dialog width="65%" title="用户列表" :visible.sync="dialogCommodityVisible" append-to-body>
        <!-- 住戶列表-->
        <transition name="el-zoom-in-top">
          <!-- <commodity-List :commodity="buyingForm.commodity" @transmitUser="userChoiceCommodity"></commodity-List> -->
          <shop-user :user="businessForm.user" @transmitUser="userChoiceUser"></shop-user>
        </transition>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import Province from "@/components/Linkage/province"; // 省市区三级联动
import { getCommuntityByArea, findFamilyListByCode } from "@/api/community";
import { getBusinessList, addBusinessUser } from "@/api/business";
import Pagination from "@/components/Pagination"; // 分页
import { generatePoint } from "@/utils/i18n";
import ShopUser from "./components/user";
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
  components: { Pagination, Province, ShopUser },
  data() {
    return {
      // 时间快捷方式
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      myList: {
        code: "list",
        areaValue: [],
        communityValue: []
      },
      communitypProps: {
        label: "name",
        value: "code"
      },
      communityOptions: [], // 社区下拉列表数据
      listQuery: {
        name: "",
        pageNum: 1,
        pageSize: 10
      },
      queryDate: "",
      listLoading: false,
      buttonLoading: false, // 按钮加载请求
      businessList: [],
      total: 0, // 分页
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      sublevel: 1, // 控制子级dialog显示的列表
      businessForm: {
        id: 0,
        name: "",
        phone: "",
        userId: "", // 关联的用户
        address: "", // 地址
        nickName: "",
        user: null // 回显
      },
      rules: {
        name: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("mandatory")
          }
        ],
        phone: [
          {
            required: true,
            trigger: "change",
            validator: this.validatePhone
          }
        ],
        address: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("mandatory")
          }
        ],
        userId: [
          {
            required: true,
            trigger: "change",
            // message: this.generatePoint("mandatory")
            validator: (rule, value, callback) => {
              if (this.businessForm.userId == "") {
                callback(this.generatePoint("required"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogCommodityVisible: false // 是否展示商品集合dialog内容
    };
  },
  created() {
    this.fetchData(); // 查询数据
  },
  methods: {
    generatePoint,
    // 验证账号 手机格式
    validatePhone(rule, value, callback) {
      if (!isvalidPhone(value)) {
        callback(new Error(this.generatePoint("phone")));
      } else {
        callback();
      }
    },
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      // 获取数据
      getBusinessList(this.listQuery).then(function(res) {
        console.log("res --- ", res);
        _this.listLoading = false;
        _this.businessList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 获取省市区数据 联动查询社区
    getProvinceVal(val, code) {
      let _this = this;
      getCommuntityByArea({ areaCode: val[2] }).then(function(res) {
        console.log("根据地区code 获取的社区数据 -- ", res);
        _this.communityOptions = res.data; // 列表中 社区
      });
    },
    // 搜索
    queryBusiness() {
      this.fetchData();
    },
    // 显示添加页面
    showAddView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    onSubLevel(num) {
      this.sublevel = num;
      this.dialogCommodityVisible = true;
    },
    createData() {
      let _this = this;
      _this.$refs.businessForm.validate(valid => {
        _this.buttonLoading = true; // 按钮加载中
        if (valid) {
          try {
            console.log("_this  --- ", _this.businessForm);
            addBusinessUser({
              address: _this.businessForm.address,
              name: _this.businessForm.name,
              phone: _this.businessForm.phone,
              userId: _this.businessForm.userId
            }).then(function(res) {
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
            _this.buttonLoading = false; // 清空按钮加载状态
            _this.$message.error(_this.generatePoint("system"));
          }
        } else {
          _this.buttonLoading = false; // 清楚加载中
          return false;
        }
      });
    },
    updateData() {},
    userChoiceUser(user) {
      console.log("选择 用户", user);
      this.businessForm.userId = user.id; // 商品名称  回显
      this.businessForm.nickName = user.nickName;
      this.businessForm.user = user;
      this.dialogCommodityVisible = false;
    },
    close() {
      this.dialogFormVisible = false;
      this.businessForm = {
        id: 0,
        name: "",
        phone: "",
        userId: "", // 关联的用户
        address: "", // 地址
        nickName: "",
        user: null // 回显
      };
      this.$refs.businessForm.resetFields();
    }
  }
};
</script>
<style lang="scss" scope>
.business {
  padding: 20px;
  .business-container {
    margin-bottom: 20px;
    .el-cascader {
      margin-top: 5px;
    }
    .el-button--medium {
      margin-top: 5px;
    }
    .el-input--medium {
      margin-top: 5px;
    }
  }
}
</style>