<template>
  <div class="experience">
    <!-- search --->
    <div class="experience-container">
      <el-date-picker
        v-model="queryDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        :start-placeholder="$t('form.startTime')"
        :end-placeholder="$t('form.endTime')"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd HH:mm:ss"
      ></el-date-picker>
      <el-select v-model="listQuery.status" placeholder="请选择">
        <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input
        v-model="listQuery.name"
        :placeholder="$t('table.temp.name')"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="queryBuying"
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
    <div class="experience-table">
      <el-table
        v-loading="listLoading"
        :data="experienceList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.title')" width="300">
          <template slot-scope="scope">{{ scope.row.name ? scope.row.name : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.businessTime')" width="300">
          <template
            slot-scope="scope"
          >{{ scope.row.startDate ? (scope.row.startDate + ' - ' + scope.row.endDate) : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.createTime')" width="330">
          <template
            slot-scope="scope"
          >{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.grantNum')" width="200">
          <template slot-scope="scope">{{ scope.row.count ? scope.row.count : $t('table.noTime')}}</template>
        </el-table-column>
        <!-- <el-table-column align="center" :label="$t('table.amountUsed')" width="200">
          <template
            slot-scope="scope"
          >{{ scope.row.amountUsed ? scope.row.amountUsed : $t('table.noTime')}}</template>
        </el-table-column>-->
        <el-table-column align="center" :label="$t('table.state')" width="300">
          <template
            slot-scope="scope"
          >{{ scope.row.status ? getStatusText(scope.row.status) : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="300">
          <template slot-scope="{row}">
            <el-button size="mini" @click="showEditView(row, 'see')">{{ $t('table.see') }}</el-button>
            <el-button
              v-if="row.status == 1 && row.isShow != 1"
              type="primary"
              size="mini"
              @click="showEditView(row, 'edit')"
            >{{ $t('table.edit') }}</el-button>
            <el-button
              v-if="row.status == 1 && row.isShow == 0"
              type="success"
              size="mini"
              @click="upperData(row)"
            >{{ $t('table.upperShelf') }}</el-button>
            <el-button
              v-if="row.status == 2 || row.isShow == 1"
              type="danger"
              size="mini"
              @click="upperData(row)"
            >{{ $t('table.lowerShelf') }}</el-button>
            <el-button
              v-if="row.status == 1"
              type="danger"
              size="mini"
              @click="deleteData(row)"
            >{{ $t('table.delete') }}</el-button>
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
          ref="experienceForm"
          :rules="rules"
          :model="experienceForm"
          label-position="right"
          label-width="100px"
          style="width: 80%"
        >
          <el-form-item :label="$t('form.community')" prop="communityName">
            <el-input
              :disabled="true"
              v-model="experienceForm.communityNames"
              :placeholder="$t('table.temp.community')"
              class="my-input"
              style="width: 80%;"
            />
            <el-button type="text" @click="onSubLevel(0)">{{ $t('form.addCommunity') }}</el-button>
          </el-form-item>
          <el-form-item :label="$t('form.name')" prop="name">
            <el-input v-model="experienceForm.name" :placeholder="$t('table.temp.content')" />
          </el-form-item>
          <el-form-item :label="$t('form.storeAddress')" prop="limitAddress">
            <el-input
              v-model="experienceForm.limitAddress"
              :placeholder="$t('table.temp.content')"
            />
          </el-form-item>
          <el-form-item :label="$t('form.validDate')" prop="validDate">
            <el-date-picker
              v-model="formDate"
              type="datetimerange"
              range-separator="至"
              :start-placeholder="$t('form.startTime')"
              :end-placeholder="$t('form.endTime')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('form.banner')" prop="bannerFile">
            <el-upload
              :action="updateURL"
              list-type="picture-card"
              :limit="1"
              :multiple="false"
              :file-list="bannerFileList"
              :on-exceed="exceedUpload"
              :before-upload="beforeAvatarUpload"
              :on-success="handleBannerSuccess"
              :data="uploadParams"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('form.detailsImg')" prop="detailsFile">
            <el-upload
              :action="updateURL"
              list-type="picture-card"
              :limit="1"
              :multiple="false"
              :file-list="detailsFileList"
              :on-exceed="exceedUpload"
              :before-upload="beforeAvatarUpload"
              :on-success="handleDetailsSuccess"
              :data="uploadParams"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <!-- <el-form-item :label="$t('form.experienceImg')" prop="experienceFile">
            <el-upload
              :action="updateURL"
              list-type="picture-card"
              :limit="4"
              :multiple="false"
              :file-list="experienceFileList"
              :on-exceed="exceedUpload"
              :before-upload="beforeAvatarUpload"
              :on-success="handleExperienceSuccess"
              :data="uploadParams"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>-->
          <el-form-item :label="$t('form.everyoneNumber')" prop="limitNum">
            <el-input v-model="experienceForm.limitNum" :placeholder="$t('table.temp.content')" />
          </el-form-item>
          <!-- <el-form-item :label="$t('form.experienceNum')" prop="count">
            <el-input v-model="experienceForm.count" :placeholder="$t('table.temp.content')" />
          </el-form-item>-->
          <el-form-item :label="$t('form.experienceCode')" prop="experienceCode">
            <upload-excel
              v-if="experienceForm.experienceCodes.length == 0"
              @getExcel="getExcelData"
            ></upload-excel>
            <el-card v-if="experienceForm.experienceCodes.length > 0" class="box-card">
              <div slot="header" class="clearfix">
                <span>活动体验卷code码</span>
                <el-button
                  v-if="experienceForm.dian != 1"
                  style="float: right"
                  type="text"
                  @click="emptyBlacklist"
                >清空</el-button>
                <span
                  v-else
                  style="margin-left: 10px;font-size: 12px; color: #C0C4CC;"
                >该活动已上架过,体验卷code码已生成(不可重新编辑此项)</span>
              </div>
              <div
                v-for="(o, index) in experienceForm.experienceCodes"
                :key="index"
                class="text item"
              >{{'code：' + o }}</div>
            </el-card>
          </el-form-item>
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
        <el-dialog width="65%" title="社区列表" :visible.sync="dialogCommodityVisible" append-to-body>
          <!-- 活动列表-->
          <transition name="el-zoom-in-top">
            <commodity-list
              :label="experienceForm.communitys"
              @transmitUser="commodityChoiceUser"
              @close="dialogCommodityVisible = false"
            ></commodity-list>
          </transition>
        </el-dialog>
      </template>
      <template v-else>
        <on-see ref="mySee" :experienceForm="experienceForm"></on-see>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { overall } from "@/constant/index";
import Province from "@/components/Linkage/province"; // 省市区三级联动
import Pagination from "@/components/Pagination"; // 分页
import CommodityList from "./components/commodity";
import { generatePoint } from "@/utils/i18n";
import UploadExcel from "@/components/UploadExcel";
import wangeditor from "@/components/Wangeditor/index";
import onSee from "./components/see";
import {
  addExperoemce,
  findExperoemce,
  removeExperoemce,
  updateIsShow
} from "@/api/experoemce/";
export default {
  components: {
    Pagination,
    Province,
    CommodityList,
    UploadExcel,
    wangeditor,
    onSee
  },
  data() {
    return {
      updateURL: overall.uploadUrl,
      uploadParams: {
        type: "activity"
      },
      bannerFileList: [],
      detailsFileList: [],
      experienceFileList: [],
      // 状态
      status: overall.experience.status,
      queryDate: [],
      formDate: [],
      listLoading: false,
      buttonLoading: false, // 按钮加载请求
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
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
      listQuery: {
        name: "",
        status: "1",
        startDate: "",
        endDate: "",
        pageNum: 1,
        pageSize: 10
      },
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create",
        see: "See"
      },
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      dialogCommodityVisible: false, // 是否展示商品集合dialog内容
      experienceList: [], // 列表数据
      total: 0,
      // 表单数据
      experienceForm: {
        name: "",
        communityNames: "", // 回显示社区名称
        communitys: "", // 传递给后台的社区id集合
        startDate: "",
        endDate: "",
        banner: "", // banner
        cover: "", // 详情图片
        limitNum: "",
        experienceImgs: [], // 临时存储体验图 提交时要赋值给img1-img4
        count: "", // 体验卷总数
        experienceCodes: [], // 导入code
        rule: "", // 规则
        id: "",
        status: overall.experience.status[0].value,
        isShow: overall.experience.show[0].value,
        limitAddress: "", // 地址
        dian: "" // 用户是否点击后上架
      },
      myForm: {
        code: "form",
        areaValue: [],
        communityValue: []
      },
      rules: {
        communityName: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.experienceForm.communitys) {
                callback();
              } else {
                callback(this.generatePoint("required"));
              }
            }
          }
        ],
        limitAddress: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        name: [
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
            // message: this.generatePoint("required")
            validator: (rule, value, callback) => {
              if (this.experienceForm.limitNum == "") {
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
        count: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        validDate: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (
                this.experienceForm.startDate &&
                this.experienceForm.endDate
              ) {
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
        ],
        bannerFile: [
          {
            validator: (rule, value, callback) => {
              if (this.experienceForm.banner == "") {
                callback(this.generatePoint("upload"));
              } else {
                callback();
              }
            }
          }
        ],
        detailsFile: [
          {
            validator: (rule, value, callback) => {
              if (this.experienceForm.cover == "") {
                callback(this.generatePoint("upload"));
              } else {
                callback();
              }
            }
          }
        ],
        experienceFile: [
          {
            validator: (rule, value, callback) => {
              console.log("多个");
              if (this.experienceForm.experienceImgs.length == 0) {
                callback(this.generatePoint("upload"));
              } else {
                callback();
              }
            }
          }
        ],
        experienceCode: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              console.log("导入体验卷");
              if (this.experienceForm.experienceCodes.length == 0) {
                callback(this.generatePoint("import"));
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
    this.fetchData(); // 查询数据
  },
  watch: {
    queryDate: {
      handler: function(val, oldval) {
        this.listQuery.startDate = val[0];
        this.listQuery.endDate = val[1];
      }
    },
    formDate: {
      handler: function(val, oldval) {
        // console.log(val, oldval);
        // this.experienceForm.startDate = val[0];
        // this.experienceForm.endDate = val[1];
        if (val.length > 0) {
          this.experienceForm.startDate = val[0];
          this.experienceForm.endDate = val[1];
        } else {
          this.experienceForm.startDate = "";
          this.experienceForm.endDate = "";
        }
      }
    }
  },
  methods: {
    generatePoint,
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      findExperoemce(this.listQuery).then(function(res) {
        console.log("res -- >", res);
        _this.listLoading = false;
        _this.experienceList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 搜索
    queryBuying() {
      this.fetchData();
    },
    // 显示添加页面
    showAddView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 显示编辑页面
    showEditView(row, code) {
      let _this = this;
      console.log("row --- >", row);
      _this.experienceForm.name = row.name;
      _this.experienceForm.banner = row.banner;
      _this.experienceForm.cover = row.cover;
      _this.experienceForm.limitNum = row.limitNum;
      _this.experienceForm.count = row.count;

      _this.experienceForm.startDate = new Date(row.startDate);
      _this.experienceForm.endDate = new Date(row.endDate);
      _this.formDate.push(_this.experienceForm.startDate);
      _this.formDate.push(_this.experienceForm.endDate);

      _this.experienceForm.communityNames = row.communityNames;
      _this.experienceForm.communitys = row.communitys;
      _this.experienceForm.status = row.status;
      _this.bannerFileList.push({ url: _this.experienceForm.banner });
      _this.detailsFileList.push({ url: _this.experienceForm.cover });
      _this.experienceForm.rule = row.rule;
      _this.experienceForm.isShow = row.isShow;
      _this.experienceForm.limitAddress = row.limitAddress;
      _this.experienceForm.dian = row.dian;
      // for (let i = 0; i < 5; i++) {
      //   if (row["img" + (i + 1)]) {
      //     _this.experienceFileList.push({ url: row["img" + (i + 1)] });
      //     _this.experienceForm.experienceImgs.push(row["img" + (i + 1)]);
      //   }
      // }

      // 体验码
      if (row.experienceCodes.length > 0) {
        _this.experienceForm.experienceCodes = row.experienceCodes;
      }
      if (row.id) {
        _this.experienceForm.id = row.id;
      }
      // 判断是编辑功能 还是查看功能
      if (code == "edit") {
        _this.dialogStatus = "update"; // 标示创建
        _this.dialogFormVisible = true; // 展示弹窗
        if (row.rule) {
          _this.$nextTick(() => {
            _this.$refs.wangeditor.setContent(row.rule);
          });
        }
      } else {
        _this.dialogStatus = "see"; // 标示创建
        _this.dialogFormVisible = true; // 展示弹窗
      }
      console.log("_this ---- >", this.experienceForm);
    },
    onSubLevel() {
      this.dialogCommodityVisible = true;
    },
    commodityChoiceUser(commodityIds, commodityNames) {
      console.log("选择 社区", commodityIds, commodityNames);
      this.experienceForm.communitys = commodityIds; // 选中的社区ID
      this.experienceForm.communityNames = commodityNames; // 回显的社区名称
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
    // 长传前准备
    beforeAvatarUpload(file) {
      this.uploadParams.file = file;
    },
    // banner
    handleBannerSuccess(res, file) {
      this.experienceForm.banner = res.data;
    },
    // 详情
    handleDetailsSuccess(res, file) {
      this.experienceForm.cover = res.data;
    },
    // 体验卷图片
    handleExperienceSuccess(res, file) {
      console.log(" --- 体验卷图片", res, file);
      this.experienceForm.experienceImgs.push(res.data);
    },
    // 清空体验码
    emptyBlacklist() {
      this.experienceForm.experienceCodes = [];
    },
    // 获取Excel组件中的数据
    getExcelData(data) {
      console.log("data --- >", data);
      for (let i = 0; i < data.length; i++) {
        this.experienceForm.experienceCodes.push(data[i]["团购码"]);
      }
      this.experienceForm.count = data.length; // 体验卷总数
      // console.log(this.experienceForm.experienceCodes);
    },
    // 获取状态中文
    getStatusText(status) {
      for (let i = 0; i < this.status.length; i++) {
        // console.log(this.status[i]);
        if (this.status[i].value == status) {
          return this.status[i].label;
        }
      }
    },
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 清空按钮加载状态
      _this.$refs.experienceForm.validate(valid => {
        if (valid) {
          try {
            let params = this.bulidParams();
            console.log("params -- >", params);
            addExperoemce(params).then(function(res) {
              if (res.message == "SUCCESS") {
                _this.buttonLoading = false; // 清空按钮加载状态
                if (params.id) {
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
              console.log("res -- >", res);
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
      //   _this.bulidParams()
    },
    bulidParams() {
      console.log("--- >", this.experienceForm);
      let params = {
        banner: this.experienceForm.banner,
        cover: this.experienceForm.cover,
        startDate: this.experienceForm.startDate,
        endDate: this.experienceForm.endDate,
        limitNum: this.experienceForm.limitNum,
        name: this.experienceForm.name,
        count: this.experienceForm.count,
        experienceCodes: this.experienceForm.experienceCodes,
        communityNames: this.experienceForm.communityNames,
        communitys: this.experienceForm.communitys,
        rule: this.$refs.wangeditor.getContentHtml(),
        status: this.experienceForm.status,
        isShow: this.experienceForm.isShow,
        limitAddress: this.experienceForm.limitAddress
      };
      // if (this.experienceForm.experienceImgs.length > 0) {
      //   for (let i = 0; i < this.experienceForm.experienceImgs.length; i++) {
      //     params["img" + (i + 1)] = this.experienceForm.experienceImgs[i];
      //   }
      // }
      if (this.experienceForm.id) {
        params.id = this.experienceForm.id;
      }
      return params;
    },
    updateData() {
      this.createData();
    },
    // 删除
    deleteData(row) {
      console.log("row --- >", row);
      let _this = this;
      this.$confirm(_this.generatePoint("delete"))
        .then(_ => {
          removeExperoemce({ id: row.id }).then(function(res) {
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
    // 上架 、下架
    upperData(row) {
      let _this = this;
      let params = {};
      let content = {};
      let timsg = ""; // 提示框title
      let comsg = ""; // 提示框msg
      // 默认上架
      params.id = row.id;
      params.isShow = overall.experience.show[1].value;
      content.title = _this.generatePoint("notifySuccess.title");
      content.message = _this.generatePoint("notifySuccess.message3");
      content.type = "success";
      // 如果已经上架 则 执行下架
      if (row.isShow == overall.experience.show[1].value) {
        params.isShow = overall.experience.show[0].value;
        content.message = _this.generatePoint("notifySuccess.message6");
        timsg = _this.generatePoint("lowerShelf");
        comsg = _this.generatePoint("notifySuccess.message6");
      } else {
        timsg = _this.generatePoint("upperShelf");
        comsg = _this.generatePoint("notifySuccess.message3");
      }
      _this.$confirm(timsg)
        .then(_ => {
          updateIsShow(params).then(function(res) {
            if (res.message == "SUCCESS") {
              _this.$notify(content);
            } else {
              _this.$message.error(_this.generatePoint("system"));
            }
            _this.fetchData();
          });
        })
        .catch(_ => {});
    },
    close() {
      console.log("关闭");
      this.dialogFormVisible = false;
      this.experienceForm = {
        name: "",
        communityNames: "", // 回显示社区名称
        communitys: "", // 传递给后台的社区id集合
        startDate: "",
        endDate: "",
        banner: "", // banner
        cover: "", // 详情图片
        limitNum: "",
        experienceImgs: [], // 临时存储体验图 提交时要赋值给img1-img4
        count: "", // 体验卷总数
        experienceCodes: [], // 导入code
        rule: "", // 规则
        id: "",
        status: overall.experience.status[0].value,
        isShow: overall.experience.show[0].value,
        limitAddress: "", // 地址
        dian: ""
      };
      this.queryDate = [];
      this.formDate = [];
      this.bannerFileList = [];
      this.detailsFileList = [];
      this.experienceFileList = [];
      if (this.dialogStatus != "see") {
        this.$refs.experienceForm.resetFields();
        this.$refs.wangeditor.initContent(); // 清空富文本
      } else {
        this.$refs.mySee.emptySeeData();
      }
    }
  }
};
</script>
<style lang="scss">
.experience {
  padding: 20px;
  .my-input {
    width: 55%;
  }
  .experience-container {
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
    .el-input {
      width: 80px;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
  .delivery-time {
    .el-input {
      width: 200px;
    }
  }
}
</style>
<style lang="scss">
.experience {
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
<style lang="scss">
.experience {
  .el-date-editor .el-range-separator {
    padding: 0 !important;
  }
}
</style>