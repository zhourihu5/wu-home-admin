<template>
  <div class="issued">
    <!-- search --->
    <div class="issued-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="showAddView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="issued-table">
      <el-table
        v-loading="listLoading"
        :data="issuedList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.name')" width="200">
          <template
            slot-scope="scope"
          >{{ scope.row.applyName ? scope.row.applyName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.type')" width="200">
          <template slot-scope="scope">{{ scope.row.type ? scope.row.type : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.denomination')" width="200">
          <template
            slot-scope="scope"
          >{{ scope.row.denomination ? scope.row.denomination : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.grantNum')" width="200">
          <template
            slot-scope="scope"
          >{{ scope.row.grantNum ? scope.row.grantNum : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.amountUsed')" width="200">
          <template
            slot-scope="scope"
          >{{ scope.row.amountUsed ? scope.row.amountUsed : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.validDate')" width="350">
          <template
            slot-scope="scope"
          >{{ scope.row.validDate ? scope.row.validDate : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="330">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="showEditView(row)">{{ $t('table.edit') }}</el-button>
            <el-button type="danger" size="mini" @click="deleteData(row)">{{ $t('table.delete') }}</el-button>
            <el-button type="danger" size="mini" @click="grantData(row)">{{ $t('table.grant') }}</el-button>
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
        ref="issuedForm"
        :rules="rules"
        :model="issuedForm"
        label-position="right"
        label-width="100px"
        style="width: 80%"
      >
        <el-form-item :label="$t('table.type')" prop="communityId">
          <el-select v-model="issuedForm.type" placeholder="请选择" @change="typeFormChange">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <template v-if="issuedForm.type == 1">
          <el-form-item :label="$t('form.name')" prop="name">
            <el-input v-model="issuedForm.name" :placeholder="$t('table.temp.content')" />
          </el-form-item>
          <el-form-item :label="$t('form.denomination')" prop="money">
            <el-input v-model="issuedForm.money" type="number" :placeholder="$t('table.temp.content')" />
          </el-form-item>
          <el-form-item :label="$t('form.blacklist')" prop="blacklist">
            <upload-excel @getExcel="getExcelData"></upload-excel>
          </el-form-item>
          <el-form-item :label="$t('form.everyoneNumber')" prop="everyoneNum">
            <el-input v-model="issuedForm.everyoneNum" :placeholder="$t('table.temp.content')" />
          </el-form-item>
          <el-form-item :label="$t('form.threshold')" prop="limit">
            <!-- <el-input v-model="issuedForm.limit" :placeholder="$t('table.temp.content')" /> -->
            <el-radio v-model="threshold" label="0">无限制</el-radio>
            <el-radio v-model="threshold" label="1">有限制</el-radio>
            <div class="rule" v-if="threshold == 1">
              <span class>满</span>
              <el-input v-model="issuedForm.limit" type="number" />
              <span class>元可用</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('form.validDate')" prop="validDate">
            <el-date-picker
              v-model="queryDate"
              type="daterange"
              range-separator="至"
              :start-placeholder="$t('form.startTime')"
              :end-placeholder="$t('form.endTime')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('form.remarks')" prop="remark">
            <wangeditor ref="wangeditor"></wangeditor>
          </el-form-item>
        </template>
        <template v-if="issuedForm.type == 2">
          <el-form-item :label="$t('form.name')" prop="name">
            <el-input v-model="issuedForm.name" :placeholder="$t('table.temp.content')" />
          </el-form-item>
          <el-form-item :label="$t('form.denomination')" prop="money">
            <el-input v-model="issuedForm.money" type="number" :placeholder="$t('table.temp.content')" />
          </el-form-item>
          <el-form-item :label="$t('form.grantCount')" prop="grantCount">
            <el-input v-model="issuedForm.grantCount" :placeholder="$t('table.temp.content')" />
          </el-form-item>
          <el-form-item :label="$t('form.everyoneNumber')" prop="everyoneNum">
            <el-input v-model="issuedForm.everyoneNum" :placeholder="$t('table.temp.content')" />
          </el-form-item>
          <el-form-item :label="$t('form.addActivity')" prop="activityId">
            <el-input
              v-model="issuedForm.activityName"
              :disabled="true"
              :placeholder="$t('table.temp.content')"
              style="width: 80%;"
            />
            <el-button type="text" @click="onSubLevel()">{{ $t('form.addActivity') }}</el-button>
          </el-form-item>
          <el-form-item :label="$t('form.validDate')" prop="validDate">
            <el-date-picker
              v-model="queryDate"
              type="daterange"
              range-separator="至"
              :start-placeholder="$t('form.startTime')"
              :end-placeholder="$t('form.endTime')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('form.remarks')" prop="remark">
            <wangeditor ref="wangeditor"></wangeditor>
          </el-form-item>
        </template>
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
        <!-- 活动列表-->
        <transition name="el-zoom-in-top">
          <activity-list :activity="issuedForm.activity" @transmitUser="userChoiceActivity"></activity-list>
        </transition>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination"; // 分页
import UploadExcel from "@/components/UploadExcel";
import wangeditor from "@/components/Wangeditor/index";
import activityList from "./activity";
import { generatePoint } from "@/utils/i18n";
export default {
  components: { Pagination, UploadExcel, wangeditor, activityList },
  data() {
    return {
      listLoading: false, // 列表加载
      buttonLoading: false, // 按钮加载请求
      issuedList: [],
      total: 0,
      threshold: "0", // 使用门槛 0无限制、1有限制
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      issuedForm: {
        type: "", // 优惠券类型
        name: "", // 优惠券名称
        money: "", // 面额
        blacklist: null, // 黑名单
        everyoneNum: "", // 没人发放张数
        limit: "", // 使用门槛 0无限制、其他的都是现在消费多少金融后可使用
        startDate: "",
        endDate: "",
        receive: 1, // 领取方式 1主动领取 2自动发放
        remark: "", // 备注
        grantCount: "", // 发放总数
        activityId: "", // 0代表全场通用， 其他存活动ID
        activityName: "",
        activity: null // 回显对象
      },
      queryDate: "",
      rules: {
        name: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        money: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        everyoneNum: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        grantCount: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        activityId: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        limit: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.threshold) {
                callback();
              } else {
                callback(this.generatePoint("required"));
              }
            }
          }
        ],
        validDate: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              console.log("xxx --- >");
              if (this.issuedForm.startDate && this.issuedForm.endDate) {
                callback();
              } else {
                callback(this.generatePoint("required"));
              }
            }
          }
        ],
        remark: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.$refs.wangeditor.getContentHtml() == "<p><br></p>") {
                callback(this.generatePoint("required"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      typeOptions: [
        {
          value: "1",
          label: "平台优惠券"
        },
        {
          value: "2",
          label: "活动优惠券"
        }
      ],
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      dialogCommodityVisible: false // 是否展示商品集合dialog内容
    };
  },
  watch: {
    queryDate: {
      handler: function(val, oldval) {
        console.log(val, oldval);
        this.issuedForm.startDate = val[0];
        this.issuedForm.endDate = val[1];
      }
    }
  },
  methods: {
    generatePoint,
    // 查询数据
    fetchData() {},
    // 显示编辑页面
    showEditView() {},
    // 显示添加页面
    showAddView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 删除
    deleteData() {},
    // 发放数据
    grantData() {},
    // 查询
    queryData() {
      console.log("_this.listQuery  ", this.listQuery);
      this.fetchData();
    },
    // 类型选择
    typeFormChange(id) {
      console.log("id", id);
    },
    // 获取Excel组件中的数据
    getExcelData(data) {
      console.log("data --- >", data);
      // for(let i = 0; )
    },
    createData() {
      console.log(" --- >", this.issuedForm.type);
      // 平台优惠券
      if (this.issuedForm.type == 1) {
        this.savePlatform();
      }
      // 活动优惠券
      if (this.issuedForm.type == 2) {
        this.savePctivity();
      }
    },
    // 保存平台优惠券
    savePlatform() {
      console.log("平台优惠券");
      let _this = this;
      _this.$refs.issuedForm.validate(valid => {
        if (valid) {
          try {
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
    // 保存活动优惠券
    savePctivity() {
      console.log("活动优惠券");
      let _this = this;
      _this.$refs.issuedForm.validate(valid => {
        if (valid) {
          try {
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
    onSubLevel(num) {
      this.dialogCommodityVisible = true;
    },
    userChoiceActivity(activity) {
      console.log("选择 商品", activity);
      this.issuedForm.activityName = activity.title; // 商品名称  回显
      this.issuedForm.activityId = activity.id;
      this.issuedForm.activity = activity;
      this.dialogCommodityVisible = false;
    },
    close() {
      this.dialogFormVisible = false;
      this.issuedForm = {};
      //   this.$refs.issuedForm.resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.issued {
  animation: mymove 0.5s ease-in;
  -webkit-animation: mymove 0.5s ease-in; /*Safari and Chrome*/
  padding: 20px;
  .issued-container {
    margin-bottom: 20px;
    text-align: right;
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
  .rule {
    margin: 10px;
    animation: mymove 0.5s ease-in;
    -webkit-animation: mymove 0.5s ease-in; /*Safari and Chrome*/
    .el-input {
      width: 80px;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
}
</style>