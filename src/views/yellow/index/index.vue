<template>
  <div class="yellow">
    <!-- search --->
    <div class="yellow-container">
      <province ref="provinceList" :params="myList" @getProvinceVal="getProvinceVal"></province>
      <el-cascader
        :props="communitypProps"
        :options="myList.communityOptions"
        @change="communityListChange"
        :placeholder="$t('table.temp.communityChoice')"
      ></el-cascader>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="queryYellow"
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
    <div class="yellow-table" v-loading="listLoading">
      <el-table
        v-loading="listLoading"
        :data="yellowList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.name')" width="450">
          <template slot-scope="scope">{{ scope.row.name ? scope.row.name : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.phone')" width="450">
          <template slot-scope="scope">{{ scope.row.phone ? scope.row.phone : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.address')" width="450">
          <template slot-scope="scope">{{ scope.row.address ? scope.row.address : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="380">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="showEditView(row)">{{ $t('table.edit') }}</el-button>
            <el-button type="danger" size="mini" @click="deleteData(row)">{{ $t('table.delete') }}</el-button>
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
    <el-dialog
      :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
      :visible.sync="dialogFormVisible"
      @close="close"
    >
      <el-form
        ref="yellowForm"
        :rules="rules"
        :model="yellowForm"
        label-position="right"
        label-width="100px"
        style="width: 80%"
      >
        <el-form-item :label="$t('table.community')" prop="communityId">
          <province ref="provinceForm" :params="myForm" @getProvinceVal="getProvinceVal"></province>
          <el-select
            v-model="yellowForm.communityId"
            placeholder="请选择"
            @change="communityFormChange"
          >
            <el-option
              v-for="item in myForm.communityOptions"
              :key="item.code"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('form.name')" prop="name">
          <el-input v-model="yellowForm.name" :placeholder="$t('table.temp.name')" />
        </el-form-item>
        <el-form-item :label="$t('form.phone')" prop="phone">
          <el-input v-model="yellowForm.phone" :placeholder="$t('table.temp.price')" />
        </el-form-item>
        <el-form-item :label="$t('form.address')" prop="address">
          <el-input v-model="yellowForm.address" :placeholder="$t('table.temp.price')" />
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
import Province from "@/components/Linkage/province"; // 省市区三级联动
import {
  getCommuntityByArea,
  findFamilyListByCode,
  deleteCommondityInfo,
  addCommondityInfo,
  getComInfoList
} from "@/api/community";
import Pagination from "@/components/Pagination"; // 分页
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
  components: { Province, Pagination },
  data() {
    return {
      communitypProps: {
        label: "name",
        value: "code"
      },
      myList: {
        code: "list",
        areaValue: [],
        communityOptions: []
      },
      myForm: {
        code: "form",
        areaValue: [],
        communityOptions: []
      },
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      // communityOptions: [], // 社区下拉列表数据
      yellowList: [],
      total: 0,
      listLoading: false, // 列表加载
      buttonLoading: false, // 按钮加载请求
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      listQuery: {
        code: "",
        pageNum: 1,
        pageSize: 10
      },
      yellowForm: {
        communityId: "", // 社区ID
        communityCode: "", // 社区CODE
        name: "", // 名称
        phone: "", // 手机号
        address: "", // 详细地址
        area: "", // 区
        city: "", // 市
        province: "" // 省
      },
      rules: {
        communityId: [
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
            message: this.generatePoint("required")
          }
        ]
      }
    };
  },
  created() {
    this.fetchData();
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
      getComInfoList(this.listQuery).then(function(res) {
        _this.listLoading = false;
        _this.yellowList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
        console.log("res -- ", res);
      });
    },
    // 查询
    queryYellow() {
      this.fetchData();
    },
    // 显示添加页面
    showAddView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 显示编辑页面
    showEditView(row) {
      let _this = this;
      _this.yellowForm.id = row.id;
      _this.yellowForm.name = row.name;
      _this.yellowForm.phone = row.phone;
      _this.yellowForm.address = row.address;
      _this.yellowForm.communityCode = row.communityCode;
      _this.yellowForm.communityId = parseInt(row.communityId);
      _this.yellowForm.province = row.province;
      _this.yellowForm.area = row.area;
      _this.yellowForm.city = row.city;
      console.log("row --- >", row);
      // 回显示 省市区
      _this.$nextTick(() => {
        _this.$refs.provinceForm.echoArea([
          parseInt(row.province),
          parseInt(row.city),
          parseInt(row.area)
        ]);
        getCommuntityByArea({ areaCode: row.area }).then(function(res) {
          _this.myForm.communityOptions = res.data;
          console.log(_this.yellowForm.communityId);
        });
      });
      _this.dialogStatus = "update"; // 标示创建
      _this.dialogFormVisible = true; // 展示弹窗
    },
    deleteData(row) {
      let _this = this;
      console.log("row --- >", row);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCommondityInfo({ id: row.id }).then(function(res) {
            console.log("res --- >", res);
            if (res.message == "SUCCESS") {
              _this.dialogFormVisible = false; // 关闭弹窗
              // 提示
              _this.$notify({
                title: _this.generatePoint("notifySuccess.title"),
                message: _this.generatePoint("notifySuccess.message5"),
                type: "success"
              });
              _this.fetchData();
            } else {
              _this.$message.error(_this.generatePoint("system"));
            }
          });
        })
        .catch(() => {});
    },
    // 获取省市区数据 联动查询社区
    getProvinceVal(val, code) {
      let _this = this;
      console.log("code --- ", code);
      getCommuntityByArea({ areaCode: val[2] }).then(function(res) {
        console.log("根据地区code 获取的社区数据 -- ", res);
        _this.yellowForm.province = val[0];
        _this.yellowForm.city = val[1];
        _this.yellowForm.area = val[2];

        if (code == "list") {
          _this.myList.areaValue = val;
          _this.myList.communityOptions = res.data;
        } else {
          _this.myForm.areaValue = val;
          _this.myForm.communityOptions = res.data;
        }
      });
    },
    // 添加页用户选中的社区
    communityFormChange(id) {
      console.log("item --- ", id, this.yellowForm.communityId);
      let _this = this;
      for (let i = 0; i < _this.myForm.communityOptions.length; i++) {
        if (_this.myForm.communityOptions[i].id == id) {
          _this.yellowForm.communityCode =
            _this.myForm.communityOptions[i].code;
          return;
        }
      }
    },
    // 列表页面童虎选中的社区
    communityListChange(code) {
      this.listQuery.code = code[0];
    },
    // 添加数据
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.yellowForm.validate(valid => {
        if (valid) {
          try {
            let params = _this.buildParmas();
            console.log(" ---- ", params);
            addCommondityInfo(params).then(function(res) {
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
              _this.fetchData();
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
    // 修改数据
    updateData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.yellowForm.validate(valid => {
        if (valid) {
          try {
            let params = _this.buildParmas();
            console.log(" ---- ", params);
            addCommondityInfo(params).then(function(res) {
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
              _this.fetchData();
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
    // 构建参数
    buildParmas() {
      let _this = this;
      let params = {
        communityId: _this.yellowForm.communityId,
        communityCode: _this.yellowForm.communityCode,
        name: _this.yellowForm.name,
        phone: _this.yellowForm.phone,
        address: _this.yellowForm.address,
        area: _this.yellowForm.area,
        city: _this.yellowForm.city,
        province: _this.yellowForm.province
      };
      if (_this.yellowForm.id) {
        params.id = _this.yellowForm.id;
      }
      return params;
    },
    close() {
      this.dialogFormVisible = false;
      this.yellowForm = {
        communityId: "", // 社区ID
        communityCode: "", // 社区CODE
        name: "", // 名称
        phone: "", // 手机号
        address: "", // 详细地址
        area: "", // 区
        city: "", // 市
        province: "" // 省
      };
      this.$refs.provinceForm.initialization(); // 重置省市区
      this.$refs.yellowForm.resetFields();
    }
  }
};
</script>

<style lang="scss">
.yellow {
  padding: 20px;
  .yellow-container {
    margin-bottom: 20px;
    .el-cascader {
      margin-top: 5px;
    }
    .el-button--medium {
      margin-top: 5px;
    }
  }
  .yellow-table {
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
}
</style>


