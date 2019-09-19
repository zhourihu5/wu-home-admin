<template>
  <div class="coupon">
    <!-- search --->
    <div class="issued-container">
      <el-select v-model="listQuery.status" placeholder="请选择">
        <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="queryCoupon"
      >{{ $t('table.search') }}</el-button>
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
          <template slot-scope="scope">{{ scope.row.name ? scope.row.name : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.type')" width="200">
          <template
            slot-scope="scope"
          >{{ scope.row.type ? getTypeText(scope.row.type) : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.denomination')" width="200">
          <template slot-scope="scope">{{ scope.row.money ? scope.row.money : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.grantNum')" width="200">
          <template
            slot-scope="scope"
          >{{ scope.row.grantCount ? scope.row.grantCount : (scope.row.grantCount == 0 ? scope.row.grantCount : $t('table.noTime')) }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.amountUsed')" width="200">
          <template
            slot-scope="scope"
          >{{ scope.row.amountUsed ? scope.row.amountUsed : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.validDate')" width="350">
          <template
            slot-scope="scope"
          >{{ scope.row.startDate ? scope.row.startDate + ' - ' + scope.row.endDate : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="380">
          <template slot-scope="{row}">
            <el-button
              v-if="row.status == 1"
              size="mini"
              @click="showEditView(row, 'see')"
            >{{ $t('table.see') }}</el-button>
            <el-button
              v-if="row.status == 0"
              type="primary"
              size="mini"
              @click="showEditView(row, 'edit')"
            >{{ $t('table.edit') }}</el-button>
            <el-button
              v-if="row.status == 0"
              type="danger"
              size="mini"
              @click="deleteData(row)"
            >{{ $t('table.delete') }}</el-button>
            <el-button
              v-if="row.status == 0 && row.type == 1"
              type="success"
              :loading="buttonLoading"
              size="mini"
              @click="grantData(row)"
            >{{ $t('table.grant') }}</el-button>
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
      :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : textMap[dialogStatus] == 'Edit' ? $t('form.edit') :  $t('form.see') "
      :visible.sync="dialogFormVisible"
      @close="close"
    >
      <template v-if="textMap[dialogStatus] != 'See'">
        <el-form
          ref="issuedForm"
          :rules="rules"
          :model="issuedForm"
          label-position="right"
          label-width="100px"
          style="width: 80%"
        >
          <el-form-item :label="$t('table.type')" prop="communityId">
            <el-select
              v-if="issuedForm.id == ''"
              v-model="issuedForm.type"
              placeholder="请选择"
              @change="typeFormChange"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <div v-else>{{ getTypeText(issuedForm.type) }}</div>
          </el-form-item>
          <template v-if="issuedForm.type == 1">
            <el-form-item :label="$t('form.name')" prop="name">
              <el-input v-model="issuedForm.name" :placeholder="$t('table.temp.content')" />
            </el-form-item>
            <el-form-item :label="$t('form.denomination')" prop="money">
              <el-input v-model="issuedForm.money" :placeholder="$t('table.temp.content')" />
            </el-form-item>
            <el-form-item :label="$t('form.blacklist')" prop="blacklist">
              <upload-excel v-if="issuedForm.userNames.length == 0" @getExcel="getExcelData"></upload-excel>
              <el-card v-if="issuedForm.userNames.length > 0" class="box-card">
                <div slot="header" class="clearfix">
                  <span>黑名单列表</span>
                  <el-button
                    v-if="!inputDisabled"
                    style="float: right"
                    type="text"
                    @click="emptyBlacklist"
                  >清空</el-button>
                </div>
                <div v-for="o in issuedForm.userNames" :key="o" class="text item">{{'黑名单用户：' + o }}</div>
              </el-card>
            </el-form-item>
            <el-form-item :label="$t('form.everyoneNumber')" prop="everyoneNum">
              <el-input v-model="issuedForm.everyoneNum" :placeholder="$t('table.temp.content')" />
            </el-form-item>
            <el-form-item :label="$t('form.threshold')" prop="limitNum">
              <!-- <el-input v-model="issuedForm.limit" :placeholder="$t('table.temp.content')" /> -->
              <el-radio v-model="threshold" label="0">无限制</el-radio>
              <el-radio v-model="threshold" label="1">有限制</el-radio>
              <div class="rule" v-if="threshold == 1">
                <span class>满</span>
                <el-input v-model="issuedForm.limitNum" type="number" />
                <span class>元可用</span>
              </div>
            </el-form-item>
            <el-form-item :label="$t('form.validDate')" prop="validDate">
              <el-date-picker
                v-model="queryDate"
                type="datetimerange"
                range-separator="至"
                :start-placeholder="$t('form.startTime')"
                :end-placeholder="$t('form.endTime')"
              ></el-date-picker>
            </el-form-item>
            <!-- <el-form-item :label="$t('form.remarks')" prop="remark">
            <wangeditor ref="wangeditor"></wangeditor>
            </el-form-item>-->
          </template>
          <template v-if="issuedForm.type == 2">
            <el-form-item :label="$t('form.Cover')" prop="file">
              <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :limit="1"
                :multiple="false"
                :file-list="fileList"
                :on-exceed="exceedUpload"
                :on-success="handleAvatarSuccess"
                :data="uploadParams"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('form.name')" prop="name">
              <el-input v-model="issuedForm.name" :placeholder="$t('table.temp.content')" />
            </el-form-item>
            <el-form-item :label="$t('form.denomination')" prop="money">
              <el-input v-model="issuedForm.money" :placeholder="$t('table.temp.content')" />
            </el-form-item>
            <el-form-item :label="$t('form.grantCount')" prop="grantCount">
              <el-input v-model="issuedForm.grantCount" :placeholder="$t('table.temp.content')" />
            </el-form-item>
            <!-- <el-form-item :label="$t('form.everyoneNumber')" prop="everyoneNum">
              <el-input
                :disabled="inputDisabled"
                v-model="issuedForm.everyoneNum"
                :placeholder="$t('table.temp.content')"
              />
            </el-form-item>-->
            <el-form-item :label="$t('form.addActivity')" prop="activityId">
              <el-input
                :disabled="true"
                v-model="issuedForm.activityName"
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
          </template>
          <el-form-item :label="$t('form.remarks')" prop="remark">
            <wangeditor ref="wangeditor"></wangeditor>
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
          <!-- 活动列表-->
          <transition name="el-zoom-in-top">
            <activity-list @transmitUser="userChoiceActivity"></activity-list>
          </transition>
        </el-dialog>
      </template>
      <template v-else>
        <on-see :issuedForm="issuedForm" :typeOptions="typeOptions"></on-see>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination"; // 分页
import UploadExcel from "@/components/UploadExcel";
import wangeditor from "@/components/Wangeditor/index";
import activityList from "./components/activity";
import onSee from "./components/see";
import { generatePoint } from "@/utils/i18n";
import { overall } from "@/constant/index";
import {
  addCoupon,
  findCouponList,
  removeCoupon,
  updateStatus
} from "@/api/coupon";
export default {
  components: { Pagination, UploadExcel, wangeditor, activityList, onSee },
  data() {
    return {
      uploadUrl: overall.uploadUrl,
      fileList: [], // 上传图片回显列表
      uploadParams: {
        type: "activity"
      },
      listLoading: false, // 列表加载
      buttonLoading: false, // 按钮加载请求
      issuedList: [],
      total: 0,
      // 状态
      status: overall.coupon.status,
      threshold: "0", // 使用门槛 0无限制、1有限制
      listQuery: {
        status: "0", // 1已发送 0未发送
        pageNum: 1,
        pageSize: 10
      },
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create",
        see: "See"
      },
      issuedForm: {
        type: "1", // 优惠券类型
        name: "", // 优惠券名称
        money: "", // 面额
        blacklist: null, // 黑名单
        everyoneNum: "", // 每人人发放张数
        limitNum: "0", // 使用门槛 0无限制、其他的都是现在消费多少金融后可使用
        startDate: "",
        endDate: "",
        receive: 1, // 领取方式 1主动领取 2自动发放
        remark: "", // 备注
        grantCount: "", // 发放总数
        activityId: "0", // 0代表全场通用， 其他存活动ID
        activityName: "",
        activity: null, // 回显对象
        userNames: [], // 黑名单
        id: "",
        cover: "" // 封面
      },
      queryDate: [],
      rules: {
        file: [
          {
            validator: (rule, value, callback) => {
              if (this.issuedForm.cover == "") {
                callback(this.generatePoint("upload"));
              } else {
                callback();
              }
            }
          }
        ],
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
            // message: this.generatePoint("required")
            validator: (rule, value, callback) => {
              console.log("验证")
              if (this.issuedForm.money == "") {
                callback(this.generatePoint("required"));
              } else {
                let falg = true;
                let re = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
                if (!re.test(value) || value <= 0) {
                  falg = false;
                }
                if (falg) {
                  callback();
                } else {
                  callback(this.generatePoint("greater0"));
                }
              }
            }
          }
        ],
        everyoneNum: [
          {
            required: true,
            trigger: "change",
            // message: this.generatePoint("required")
            validator: (rule, value, callback) => {
              if (this.issuedForm.everyoneNum == "") {
                callback(this.generatePoint("required"));
              } else {
                let falg = true;
                let re = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
                if (!re.test(value)) {
                  falg = false;
                }
                if (falg) {
                  callback();
                } else {
                  callback(this.generatePoint("numOk"));
                }
              }
            }
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
        limitNum: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.threshold == 0) {
                callback();
              } else {
                if (/^[0-9]*[1-9][0-9]*$/.test(this.issuedForm.limitNum)) {
                  callback();
                } else {
                  callback(this.generatePoint("num"));
                }
              }
            }
          }
        ],
        validDate: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
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
      dialogCommodityVisible: false, // 是否展示商品集合dialog内容
      inputDisabled: false // 表单是否可以编辑
    };
  },
  created() {
    console.log("overall -- >", overall);
    this.fetchData();
  },
  watch: {
    queryDate: {
      handler: function(val, oldval) {
        console.log(val, oldval);
        this.issuedForm.startDate = val[0];
        this.issuedForm.endDate = val[1];
      }
    },
    "issuedForm.type": {
      handler: function(val, oldval) {
        this.$refs.issuedForm.resetFields();
      },
      deep: true
    }
  },
  methods: {
    generatePoint,
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      findCouponList(this.listQuery).then(function(res) {
        console.log("res -- >", res);
        _this.listLoading = false;
        _this.issuedList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 显示编辑页面
    showEditView(row, code) {
      let _this = this;
      console.log("row -- ", row);
      _this.issuedForm.id = row.id;
      _this.issuedForm.type = row.type;
      _this.issuedForm.name = row.name;
      _this.issuedForm.money = row.money;
      _this.issuedForm.everyoneNum = row.everyoneNum;
      _this.issuedForm.limitNum = row.limitNum;
      _this.issuedForm.receive = row.receive;
      _this.issuedForm.grantCount = row.grantCount;
      _this.issuedForm.startDate = new Date(row.startDate);
      _this.issuedForm.endDate = new Date(row.endDate);
      _this.queryDate.push(_this.issuedForm.startDate);
      _this.queryDate.push(_this.issuedForm.endDate);
      _this.issuedForm.remark = row.remark;
      _this.issuedForm.cover = row.cover;

      if (_this.issuedForm.cover) {
        _this.fileList.push({ url: _this.issuedForm.cover });
      }
      // 活动
      if (row.activity) {
        _this.issuedForm.activity = row.activity;
        _this.issuedForm.activityId = row.activityId;
        _this.issuedForm.activityName = row.activity.title;
      }
      // 黑名单
      if (row.userNames) {
        _this.issuedForm.userNames = row.userNames;
      }
      // 判断是编辑功能 还是查看功能
      if (code == "edit") {
        _this.dialogStatus = "update"; // 标示创建
        _this.dialogFormVisible = true; // 展示弹窗
        if (row.remark) {
          _this.$nextTick(() => {
            _this.$refs.wangeditor.setContent(_this.issuedForm.remark); // 设置富文本显示空
          });
        }
      } else {
        _this.dialogStatus = "see"; // 标示创建
        _this.dialogFormVisible = true; // 展示弹窗
      }
    },
    // 显示添加页面
    showAddView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 删除
    deleteData(row) {
      console.log("row --- >", row);
      let _this = this;
      this.$confirm(_this.generatePoint("delete"))
        .then(_ => {
          removeCoupon({ id: row.id }).then(function(res) {
            if (res.message == "SUCCESS") {
              _this.$notify({
                title: _this.generatePoint("notifySuccess.title"),
                message: _this.generatePoint("notifySuccess.message5"),
                type: "success"
              });
            } else {
              _this.$message.error(_this.generatePoint("system"));
            }
            _this.fetchData();
          });
        })
        .catch(_ => {});
    },
    // 发放数据
    grantData(row) {
      let _this = this;
      _this
        .$confirm(_this.generatePoint("grant"))
        .then(_ => {
          _this.buttonLoading = true;
          updateStatus({
            type: row.type,
            id: row.id,
            status: this.status[0].value,
            activityId: row.activityId
          }).then(function(res) {
            if (res.message == "SUCCESS") {
              _this.$notify({
                title: _this.generatePoint("notifySuccess.title"),
                message: _this.generatePoint("notifySuccess.message8"),
                type: "success"
              });
              _this.buttonLoading = false;
              _this.fetchData();
            } else {
              _this.buttonLoading = false;
              _this.$message.error(_this.generatePoint("system"));
            }
          });
        })
        .catch(_ => {});
      // console.log("row --- >", row);
      // let _this = this;
      // _this.buttonLoading = true;
      // console.log("啦啦啦啦啦 ---- ", {
      //   type: row.type,
      //   id: row.id,
      //   status: this.status[0].value,
      //   activityId: row.activityId
      // })
      // updateStatus({
      //   type: row.type,
      //   id: row.id,
      //   status: this.status[0].value,
      //   activityId: row.activityId
      // }).then(function(res) {
      //   if (res.message == "SUCCESS") {
      //     _this.$notify({
      //       title: _this.generatePoint("notifySuccess.title"),
      //       message: _this.generatePoint("notifySuccess.message8"),
      //       type: "success"
      //     });
      //     _this.buttonLoading = false;
      //     _this.fetchData();
      //   } else {
      //     _this.buttonLoading = false;
      //     _this.$message.error(_this.generatePoint("system"));
      //   }
      // });
    },
    // 查询
    queryCoupon() {
      console.log("_this.listQuery  ", this.listQuery);
      this.fetchData();
    },
    // 类型选择
    typeFormChange(id) {
      console.log("id", id);
    },
    // 获取Excel组件中的数据
    getExcelData(data) {
      for (let i = 0; i < data.length; i++) {
        this.issuedForm.userNames.push(data[i]["电话"]);
      }
      console.log(this.issuedForm.userNames);
    },
    createData() {
      // 平台优惠券
      let _this = this;
      let params =
        _this.issuedForm.type == 1
          ? _this.savePlatformParams()
          : _this.savePctivityParams();

      // 有ID的话则是修改
      if (_this.issuedForm.id) {
        params.id = _this.issuedForm.id;
      }
      console.log(
        "params --- >",
        _this.issuedForm.type == 1 ? "保存平台优惠券:" : "保存活动优惠券:",
        params
      );
      //   _this.buttonLoading = true;
      _this.$refs.issuedForm.validate(valid => {
        if (valid) {
          try {
            addCoupon(params).then(function(res) {
              console.log("res --- >", res);
              if (res.message == "SUCCESS") {
                _this.buttonLoading = false; // 清空按钮加载状态
                if (!params.id) {
                  // 保存成功
                  _this.$notify({
                    title: _this.generatePoint("notifySuccess.title"),
                    message: _this.generatePoint("notifySuccess.message"),
                    type: "success"
                  });
                } else {
                  // 修改成功
                  _this.$notify({
                    title: _this.generatePoint("notifySuccess.title"),
                    message: _this.generatePoint("notifySuccess.message1"),
                    type: "success"
                  });
                }
                _this.close(); // 关闭弹窗
                _this.fetchData();
              } else {
                _this.buttonLoading = false; // 清空按钮加载状态
                _this.$message.error(_this.generatePoint("system"));
              }
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
    // 保存平台优惠券保存参数
    savePlatformParams() {
      return {
        type: this.issuedForm.type, // 优惠券类型
        name: this.issuedForm.name, // 名称
        money: this.issuedForm.money, // 面额
        everyoneNum: this.issuedForm.everyoneNum, // 没人发放张数
        limitNum: this.issuedForm.limitNum, // 使用门槛 0无限制、其他的都是现在消费多少金融后可使用
        startDate: this.issuedForm.startDate,
        endDate: this.issuedForm.endDate,
        receive: 2, // 自动发放
        remark: this.$refs.wangeditor.getContentHtml(),
        userNames: this.issuedForm.userNames,
        status: "0"
      };
    },
    // 保存活动优惠券
    savePctivityParams() {
      return {
        cover: this.issuedForm.cover,
        type: this.issuedForm.type, // 优惠券类型
        name: this.issuedForm.name, // 名称
        money: this.issuedForm.money, // 面额
        grantCount: this.issuedForm.grantCount, // 发放总数
        // everyoneNum: this.issuedForm.everyoneNum, // 每人领取张数1
        everyoneNum: "1", // 每人领取张数
        limitNum: "0",
        startDate: this.issuedForm.startDate, // 开始时间
        endDate: this.issuedForm.endDate, // 结束时间
        receive: 1, // 领取
        remark: this.$refs.wangeditor.getContentHtml(),
        activityId: this.issuedForm.activityId, // 活动ID 0代表全场通用， 其他存活动ID
        status: "0"
      };
    },
    updateData() {
      this.createData();
    },
    onSubLevel(num) {
      this.dialogCommodityVisible = true;
    },
    getTypeText(type) {
      let text = "";
      this.typeOptions.forEach(function(v) {
        if (v.value == type) {
          text = v.label;
        }
      });
      return text;
    },
    userChoiceActivity(activity) {
      console.log("选择 商品", activity);
      this.issuedForm.activityName = activity.title; // 商品名称  回显
      this.issuedForm.activityId = activity.id;
      this.issuedForm.activity = activity;
      this.dialogCommodityVisible = false;
    },
    // 清空黑名单
    emptyBlacklist() {
      this.issuedForm.userNames = [];
    },
    // 超出文件上传个数时触发
    exceedUpload(file, fileList) {
      // this.$message.error("超过最大上传数量,目前只可上传1张");
      this.$notify({
        title: this.generatePoint("notifyWarning.title"),
        message: this.generatePoint("notifyWarning.message"),
        type: "warning"
      });
    },
    handleAvatarSuccess(res, file) {
      // console.log("handleAvatarSuccess --", res, file);
      this.issuedForm.cover = res.data;
    },
    close() {
      this.dialogFormVisible = false;
      this.issuedForm = {
        type: "1", // 优惠券类型
        name: "", // 优惠券名称
        money: "", // 面额
        blacklist: null, // 黑名单
        everyoneNum: "", // 每人人发放张数
        limitNum: "0", // 使用门槛 0无限制、其他的都是现在消费多少金融后可使用
        startDate: "",
        endDate: "",
        receive: 1, // 领取方式 1主动领取 2自动发放
        remark: "", // 备注
        grantCount: "", // 发放总数
        activityId: "0", // 0代表全场通用， 其他存活动ID
        activityName: "",
        activity: null, // 回显对象
        userNames: [], // 黑名单
        id: "",
        cover: "" // 封面
      };
      this.queryDate = [];
      this.fileList = [];
      if (this.dialogStatus != "see") {
        this.$refs.wangeditor.setContent(""); // 设置富文本显示空
        this.$refs.issuedForm.resetFields();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.coupon {
  margin: 20px;
  .issued-container {
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
  .rule {
    margin: 10px;
    animation: mymove 0.5s ease-in;
    -webkit-animation: mymove 0.5s ease-in; /*Safari and Chrome*/
    .el-input {
      width: 150px;
      margin-left: 10px;
      margin-right: 10px;
      padding: 20px;
    }
  }

  .black-list-box {
    border: 1px solid #ebebeb;
    max-height: 200px;
  }
}
</style>
<style lang="scss">
.coupon {
  .el-date-editor .el-range-separator {
    padding: 0 !important;
  }
  .box-card {
    animation: mymove 0.5s ease-in;
    -webkit-animation: mymove 0.5s ease-in; /*Safari and Chrome*/
  }
  .el-card__header {
    padding: 5px 15px;
  }
  .el-card__body {
    max-height: 200px;
    overflow: auto;
  }
}
</style>