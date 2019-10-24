<template>
  <div class="buying">
    <!-- search --->
    <div class="buying-container">
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
      <el-select v-model="listQuery.status" :placeholder="$t('table.temp.status')">
        <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input
        v-model="listQuery.title"
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
    <div class="buying-table">
      <el-table
        v-loading="listLoading"
        :data="buyingList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.title')" width="300">
          <template slot-scope="scope">{{ scope.row.title ? scope.row.title : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.businessTime')" width="770">
          <template
            slot-scope="scope"
          >{{ scope.row.startDate ? (scope.row.startDate + ' - ' + scope.row.endDate) : $t('table.noTime')}}</template>
        </el-table-column>
        <!-- <el-table-column align="center" :label="$t('table.createTime')" width="300">
          <template slot-scope="scope">{{ scope.row.name ? scope.row.name : $t('table.noTime')}}</template>
        </el-table-column>-->
        <el-table-column align="center" :label="$t('table.state')" width="300">
          <template
            slot-scope="scope"
          >{{ scope.row.status ? getStatusText(scope.row.status) : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="360">
          <template slot-scope="{row}">
            <el-button
              v-if="row.status != 3"
              type="primary"
              size="mini"
              @click="showEditView(row, 'add')"
            >{{ $t('table.edit') }}</el-button>
            <el-button
              v-if="row.isShow == 0 && row.status != 3"
              type="success"
              size="mini"
              @click="updateShow(row)"
            >{{ $t('table.upperShelf') }}</el-button>
            <el-button
              v-if="row.isShow == 1 && row.status != 3"
              type="danger"
              size="mini"
              @click="updateShow(row)"
            >{{ $t('table.lowerShelf') }}</el-button>
            <el-button
              v-if="row.status == 3"
              size="mini"
              @click="showEditView(row, 'see')"
            >{{ $t('table.see') }}</el-button>
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
      :closeOnClickModal="clickfalse"
      @close="close"
    >
      <el-form
        ref="buyingForm"
        :rules="rules"
        :model="buyingForm"
        label-position="right"
        label-width="110px"
        style="width: 90%"
        :disabled="fromDisabled"
      >
        <el-form-item :label="$t('table.community')" prop="communityId">
          <province ref="provinceForm" :params="myForm" @getProvinceVal="getProvinceVal"></province>
          <el-select v-model="buyingForm.communityId" placeholder="请选择">
            <el-option
              v-for="item in communityList"
              :key="item.code"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input
            class="my-input"
            v-model="buyingForm.title"
            :placeholder="$t('table.temp.title')"
          />
        </el-form-item>
        <el-form-item :label="$t('form.businessTime')" prop="validDate">
          <el-date-picker
            v-model="formDate"
            type="datetimerange"
            range-separator="至"
            :start-placeholder="$t('form.startTime')"
            :end-placeholder="$t('form.endTime')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('form.commodity')" prop="commodityName">
          <el-input
            :disabled="true"
            v-model="buyingForm.commodity.name"
            :placeholder="$t('table.temp.id')"
            class="my-input"
          />
          <el-button type="text" @click="addMerchandise('commodity')">{{ $t('form.addCommodity') }}</el-button>
        </el-form-item>
        <el-form-item :label="$t('form.giftGiving')" prop="giftName">
          <el-input
            :disabled="true"
            v-model="buyingForm.gift.name"
            :placeholder="$t('table.temp.id')"
            class="my-input"
          />
          <el-button type="text" @click="addMerchandise('gift')">{{ $t('form.addGift') }}</el-button>
        </el-form-item>
        <el-form-item :label="$t('form.groupBuying')" prop="price">
          <el-input
            class="my-input"
            v-model="buyingForm.price"
            :placeholder="$t('table.temp.groupBuying')"
          />
        </el-form-item>
        <el-form-item :label="$t('form.Cover')" prop="file">
          <el-upload
            :action="updateURL"
            list-type="picture-card"
            :limit="1"
            :multiple="false"
            :file-list="fileList"
            :on-exceed="exceedUpload"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :data="uploadParams"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <!-- 配送方式 -->
        <el-form-item :label="$t('form.deliveryType')" prop="deliveryType" class="delivery-time">
          <el-radio-group v-model="buyingForm.type" @change="radioChange">
            <el-radio :label="delivery[0].value">{{ $t('form.delivery') }}</el-radio>
            <el-radio :label="delivery[1].value">{{ $t('form.selfTaking') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 配送 -->
        <el-form-item
          v-if="buyingForm.type == delivery[0].value"
          :label="$t('form.deliveryTime')"
          prop="deliveryHour"
          class="delivery-time"
        >
          <el-input v-model="buyingForm.deliveryHour" :placeholder="$t('table.temp.groupBuying')" />
          <span>小时</span>
        </el-form-item>
        <!-- 自提 -->
        <el-form-item
          v-if="buyingForm.type == delivery[1].value"
          :label="$t('form.store')"
          prop="shopAddress"
        >
          <el-input
            class="my-input"
            v-model="buyingForm.shopAddress"
            :placeholder="$t('table.temp.content')"
          />
        </el-form-item>
        <el-form-item
          v-if="buyingForm.type == delivery[1].value"
          :label="$t('form.storeImg')"
          prop="shopImg"
        >
          <el-upload
            :action="updateURL"
            list-type="picture-card"
            :limit="5"
            :multiple="false"
            :file-list="shopImgList"
            :on-exceed="storeExceedUpload"
            :before-upload="beforeAvatarUpload"
            :on-success="handleShopImgSuccess"
            :data="uploadParams"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item :label="$t('form.activityExplain')" prop="remark">
          <wangeditor ref="wangeditor" :myDisabled="fromDisabled"></wangeditor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="operation == 'add'" @click="close">{{ $t('table.cancel') }}</el-button>
        <el-button
          v-if="operation == 'add'"
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
          :loading="buttonLoading"
        >{{ $t('table.confirm') }}</el-button>
      </div>
      <!-- 内部dialog -->
      <el-dialog width="65%" title="用户列表" :visible.sync="dialogCommodityVisible" append-to-body>
        <!-- 住戶列表-->
        <transition name="el-zoom-in-top">
          <commodity-List
            :type="subType"
            :commodity="subType == 'commodity' ? buyingForm.commodity : buyingForm.gift"
            @transmitUser="userChoiceCommodity"
          ></commodity-List>
        </transition>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.buying {
  padding: 20px;
  .my-input {
    width: 55%;
  }
  .buying-container {
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
.buying {
  .buying-container {
    .el-date-editor .el-range-separator {
      padding: 0 !important;
    }
  }
}
</style>

<script>
import Pagination from "@/components/Pagination"; // 分页
import Province from "@/components/Linkage/province"; // 省市区三级联动
import { getCommuntityByArea } from "@/api/community";
import { getActivityAll, saveActivity, modityIsShow } from "@/api/business";
import { overall } from "@/constant/index";
import { generatePoint } from "@/utils/i18n";
import commodityList from "./components/commodity";
import wangeditor from "@/components/Wangeditor/index";
export default {
  components: { Pagination, Province, commodityList, wangeditor },
  data() {
    return {
      clickfalse: false,
      fromDisabled: false,
      formDate: [],
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
      // 状态
      status: overall.buying.status,
      options: [
        {
          label: "元",
          value: "1"
        },
        {
          label: "折",
          value: "2"
        }
      ],
      queryDate: "",
      // 查询参数
      listQuery: {
        status: "", // 状态
        title: "",
        endDate: null, // 结束时间
        startDate: null, // 开始时间
        pageNum: 1,
        pageSize: 10
      },
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      dialogCommodityVisible: false, // 是否展示商品集合dialog内容
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      listLoading: false, // 列表加载
      buttonLoading: false, // 按钮加载请求
      buyingList: [], // 列表数据
      total: 0, // 列表分页
      buyingForm: {
        id: "",
        communityId: "", // 用户选择的社区
        commodityCode: "", // 社区code
        title: "", // 标题
        startDate: "", // 开始时间
        endDate: "", // 结束时间
        // commodityName: "", // 商品名称回显示

        // 商品
        commodity: {
          name: ""
        },

        // 赠品
        gift: {
          name: ""
        },
        cover: "", // 封面
        saleType: "1", // 满减类型
        saleRules: "", // 满减规则
        deliveryHour: "", // 配送时效
        price: "", // 金额
        area: "",
        city: "",
        province: "",
        remark: "", // 详情
        isShow: "",
        status: "", // 状态
        giftImg: "", // 团购赠品图片
        type: overall.delivery.types[0].value, // 记录用户选择的配送方式 配送 自取
        shopAddress: "", // 店面地址
        shopImg: [] // 店面图片
      },
      rules: {
        file: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.buyingForm.cover == "") {
                callback(this.generatePoint("upload"));
              } else {
                callback();
              }
            }
          }
        ],
        shopImg: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.buyingForm.shopImg.length == 0) {
                callback(this.generatePoint("upload"));
              } else {
                callback();
              }
            }
          }
        ],
        shopAddress: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        communityId: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("mandatory")
          }
        ],
        title: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("mandatory")
          }
        ],
        validDate: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.buyingForm.startDate && this.buyingForm.endDate) {
                callback();
              } else {
                callback(this.generatePoint("required"));
              }
            }
          }
        ],
        commodityName: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.buyingForm.commodity.name) {
                callback();
              } else {
                callback(this.generatePoint("mandatory"));
              }
            }
          }
        ],
        giftName: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.buyingForm.gift.name) {
                callback();
              } else {
                callback(this.generatePoint("mandatory"));
              }
            }
          }
        ],
        deliveryHour: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.buyingForm.deliveryHour == "") {
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
        price: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              console.log("dkkdkdk");
              if (this.buyingForm.price == "") {
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
      myForm: {
        code: "form",
        areaValue: [],
        communityValue: []
      },
      communityList: [], // 社区集合
      updateURL: overall.uploadUrl,
      fileList: [], // 上传图片回显列表
      giftList: [], // 上传团购赠礼回显示列表
      shopImgList: [], // 上传门店图片回显列表
      uploadParams: {
        type: "activity"
      },
      myRules: [], // 规则
      subType: "commodity",
      operation: "add",
      delivery: overall.delivery.types // 配送形式  自提  配送
    };
  },
  created() {
    this.fetchData(); // 查询数据
  },
  watch: {
    queryDate: {
      handler: function(val, oldval) {
        if (val.length > 0) {
          this.listQuery.startDate = val[0];
          this.listQuery.endDate = val[1];
        } else {
          this.listQuery.startDate = "";
          this.listQuery.endDate = "";
        }
      }
    },
    formDate: {
      handler: function(val, oldval) {
        if (val) {
          if (val.length > 0) {
            this.buyingForm.startDate = val[0];
            this.buyingForm.endDate = val[1];
          } else {
            this.buyingForm.startDate = "";
            this.buyingForm.endDate = "";
          }
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
      getActivityAll(this.listQuery).then(function(res) {
        console.log("res --- ", res);
        _this.listLoading = false;
        _this.buyingList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 用户选择配送方式
    radioChange(val) {
      console.log("val --- ", val);
      if (val == this.delivery[0].value) {
        this.buyingForm.shopImg = [];
        this.buyingForm.shopAddress = "";
      } else {
        this.buyingForm.deliveryHour = "";
      }
    },
    // 搜索
    queryBuying() {
      this.fetchData();
    },
    // 添加商品、赠品
    addMerchandise(type) {
      console.log("type --- >", type);
      this.subType = type;
      this.dialogCommodityVisible = true;
    },
    // 显示添加页面
    showAddView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 修改页面
    showEditView(row, code) {
      let _this = this;
      console.log("row --- >", row);
      _this.buyingForm.title = row.title;
      _this.fileList.push({ url: row.cover });
      _this.giftList.push({ url: row.giftImg });
      // 时间处理
      _this.buyingForm.startDate = new Date(row.startDate);
      _this.buyingForm.endDate = new Date(row.endDate);
      _this.formDate.push(_this.buyingForm.startDate);
      _this.formDate.push(_this.buyingForm.endDate);

      _this.buyingForm.price = row.price;
      // _this.buyingForm.saleType = row.saleType;
      _this.buyingForm.deliveryHour = row.deliveryHour;
      _this.buyingForm.communityId = row.communityId;
      _this.buyingForm.communityCode = row.communityCode;
      _this.buyingForm.id = row.id;
      _this.buyingForm.cover = row.cover;
      _this.buyingForm.giftImg = row.giftImg;
      _this.buyingForm.area = row.area;
      _this.buyingForm.city = row.city;
      _this.buyingForm.province = row.province;
      _this.buyingForm.commodity = row.commodity; // 商品
      if (row.gitCommodity) {
        _this.buyingForm.gift = row.gitCommodity; // 赠品
      }
      // _this.buyingForm.commodityName = row.commodity.name;
      _this.buyingForm.isShow = row.isShow;
      _this.buyingForm.status = row.status;
      _this.buyingForm.saleType = row.saleType;
      if (row.type) {
        _this.buyingForm.type = row.type;
      }
      _this.buyingForm.shopAddress = row.shopAddress;
      if (row.shopImg) {
        let imgs = row.shopImg.split(",");
        // _this.shopImgList = row.shopImg.split(",");
        imgs.forEach(function(v, i) {
          let obj = {
            url: v
          };
          _this.shopImgList.push(obj);
        });
      }

      if (row.remark) {
        _this.$nextTick(() => {
          _this.$refs.wangeditor.setContent(row.remark);
          if (code == "see") {
            _this.operation = "see";
            _this.$refs.wangeditor.onDisabled();
          } else {
            _this.operation = "add";
            _this.$refs.wangeditor.onEnable();
          }
        });
      }
      // 回显示 省市区
      _this.$nextTick(() => {
        _this.$refs.provinceForm.echoArea([
          parseInt(row.province),
          parseInt(row.city),
          parseInt(row.area)
        ]);
        getCommuntityByArea({ areaCode: row.area }).then(function(res) {
          _this.communityList = res.data;
          console.log(_this.buyingForm.communityId, _this.communityList);
        });
      });
      // 回显规则
      if (row.saleRules) {
        if (row.saleRules.indexOf(",") == -1) {
          // 不包含
          let item = row.saleRules.split("|");
          _this.myRules.push({ num: item[0], rmb: item[1] }); // 追加规则
        } else {
          // 包含
          let arr = row.saleRules.split(",");
          // 处理回显规则
          for (let i = 0; i < arr.length; i++) {
            let item = arr[i].split("|");
            console.log("item -- >", item);
            _this.myRules.push({ num: item[0], rmb: item[1] }); // 追加规则
          }
        }
      }
      // // 是否是查看功能
      // if (code == "see") {
      //   _this.fromDisabled = true;
      // } else {
      //   _this.fromDisabled = false;
      // }
      _this.dialogStatus = "update"; // 标示创建
      _this.dialogFormVisible = true; // 展示弹窗
    },

    // 商品模板回调
    userChoiceCommodity(commodity, type) {
      console.log("选择 商品", commodity, type);
      if (type === "commodity") {
        // 商品
        this.buyingForm.commodity = commodity;
      } else {
        // 赠品
        this.buyingForm.gift = commodity;
      }
      this.dialogCommodityVisible = false;
    },

    // 获取省市区数据
    getProvinceVal(val, code) {
      let _this = this;
      console.log("用户选择了 ", val, code);
      _this.buyingForm.province = val[0];
      _this.buyingForm.city = val[1];
      _this.buyingForm.area = val[2];
      // _this.buyingForm.area =
      getCommuntityByArea({ areaCode: val[2] }).then(function(res) {
        _this.communityList = res.data;
      });
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
    // 门店图片超出上传个数时触发
    storeExceedUpload(file, fileList) {
      this.$notify({
        title: this.generatePoint("notifyWarning.title"),
        message: this.generatePoint("notifyWarning.message5"),
        type: "warning"
      });
    },
    // 门点图片上传成功
    handleShopImgSuccess(res, file) {
      console.log("上传门点图片 -- ", res.data);
      this.buyingForm.shopImg.push(res.data);
    },
    beforeAvatarUpload(file) {
      console.log("file --- >", file.size, file.size / 1024 / 1024 < 5);
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.$notify({
          title: this.generatePoint("notifyWarning.title"),
          message: this.generatePoint("notifyWarning.message6"),
          type: "warning"
        });
        return false;
      } else {
        this.uploadParams.file = file;
      }
    },
    handleAvatarSuccess(res, file) {
      this.buyingForm.cover = res.data;
    },
    handleGiftImgSuccess(res, file) {
      this.buyingForm.giftImg = res.data;
    },

    // 添加数据
    createData() {
      let _this = this;
      // _this.buttonLoading = true;
      _this.$refs.buyingForm.validate(valid => {
        if (valid) {
          try {
            let params = _this.buildParmas(); // 构建参数
            console.log("params --- ", params);
            saveActivity(params).then(function(res) {
              console.log("res --- ", res);
              if (res.message == "SUCCESS") {
                _this.buttonLoading = false; // 清空按钮加载状态
                _this.$notify({
                  title: _this.generatePoint("notifySuccess.title"),
                  message: _this.generatePoint("notifySuccess.message"),
                  type: "success"
                });
                _this.dialogFormVisible = false; // 关闭弹窗
                _this.fetchData();
              } else {
                _this.buttonLoading = false; // 清空按钮加载状态
                _this.$message.error(_this.generatePoint("system"));
              }
            });
            // _this.buttonLoading = false;
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
      console.log("修改");
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.buyingForm.validate(valid => {
        if (valid) {
          try {
            let params = _this.buildParmas(); // 构建参数
            console.log("params --- ", params);
            saveActivity(params).then(function(res) {
              console.log("res --- ", res);
              if (res.message == "SUCCESS") {
                _this.buttonLoading = false; // 清空按钮加载状态
                _this.$notify({
                  title: _this.generatePoint("notifySuccess.title"),
                  message: _this.generatePoint("notifySuccess.message"),
                  type: "success"
                });
                _this.dialogFormVisible = false; // 关闭弹窗
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
    // 构架修改 添加params参数
    buildParmas() {
      let _this = this;
      // 添加规则
      if (_this.myRules.length > 0) {
        _this.myRules.forEach(function(v, i) {
          _this.buyingForm.saleRules += v.num + "|" + v.rmb;
          if (i + 1 < _this.myRules.length) {
            _this.buyingForm.saleRules += ",";
          }
        });
      }
      // 获取社区code
      if (_this.communityList.length > 0) {
        for (let i = 0; i < _this.communityList.length; i++) {
          if (_this.buyingForm.communityId == _this.communityList[i].id) {
            _this.buyingForm.communityCode = _this.communityList[i].code;
          }
        }
      }
      let params = {
        communityId: _this.buyingForm.communityId,
        communityCode: _this.buyingForm.communityCode,
        cover: _this.buyingForm.cover,
        giftImg: _this.buyingForm.gift.uploadImg.split(",")[0], // 赠品图片
        giftId: _this.buyingForm.gift.id,
        deliveryHour: _this.buyingForm.deliveryHour,
        endDate: _this.buyingForm.endDate,
        startDate: _this.buyingForm.startDate,
        title: _this.buyingForm.title,
        // saleRules: _this.buyingForm.saleRules,
        saleType: _this.buyingForm.saleType,
        price: _this.buyingForm.price,
        area: _this.buyingForm.area,
        city: _this.buyingForm.city,
        province: _this.buyingForm.province,
        remark: this.$refs.wangeditor.getContentHtml(),
        isShow: _this.buyingForm.isShow,
        type: _this.buyingForm.type, // 记录用户选择的配送方式 配送 自取
        shopAddress: _this.buyingForm.shopAddress, // 店面地址
        shopImg: _this.buyingForm.shopImg.join(",") // 店面图片
      };
      if (_this.buyingForm.id) {
        params.id = _this.buyingForm.id;
        params.status = _this.buyingForm.status;
      }

      if (_this.buyingForm.commodity) {
        params.commodityId = _this.buyingForm.commodity.id; // 商品ID
        params.commodityCode = _this.buyingForm.commodity.code; // 商品code
      }
      return params;
    },
    // 添加规则
    addRule() {
      this.myRules.push({ num: "", rmb: "" }); // 追加
      console.log(" myRules -- ", this.myRules);
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
    // 上下架
    updateShow(row) {
      console.log("row --- >", row.isShow);
      let _this = this;
      let timsg = ""; // 提示框title
      let comsg = ""; // 提示框msg
      let onShow = "";
      if (row.isShow == 1) {
        // 下架
        timsg = _this.generatePoint("lowerShelf");
        comsg = _this.generatePoint("notifySuccess.message6");
        onShow = 0;
      } else {
        // 上架
        timsg = _this.generatePoint("upperShelf");
        comsg = _this.generatePoint("notifySuccess.message3");
        onShow = 1;
      }
      _this
        .$confirm(timsg)
        .then(_ => {
          modityIsShow({ id: row.id, isShow: onShow }).then(function(res) {
            if (res.message == "SUCCESS") {
              _this.buttonLoading = false; // 清空按钮加载状态
              _this.$notify({
                title: _this.generatePoint("notifySuccess.title"),
                message: comsg,
                type: "success"
              });
              _this.dialogFormVisible = false; // 关闭弹窗
              _this.fetchData();
            } else {
              _this.buttonLoading = false; // 清空按钮加载状态
              _this.$message.error(_this.generatePoint("system"));
            }
          });
        })
        .catch(_ => {});
      //
      // modityIsShow({ id: row.id, isShow: onShow }).then(function(res) {
      //   console.log("res --- >", res);
      //   if (res.message == "SUCCESS") {
      //     _this.buttonLoading = false; // 清空按钮加载状态
      //     _this.$notify({
      //       title: _this.generatePoint("notifySuccess.title"),
      //       message: _this.generatePoint("notifySuccess.message4"),
      //       type: "success"
      //     });
      //     _this.dialogFormVisible = false; // 关闭弹窗
      //     _this.fetchData();
      //   } else {
      //     _this.buttonLoading = false; // 清空按钮加载状态
      //     _this.$message.error(_this.generatePoint("system"));
      //   }
      // });
    },
    close() {
      this.$refs.wangeditor.setContent(""); // 设置富文本显示空
      this.dialogFormVisible = false;
      this.buyingForm = {
        id: "",
        communityId: "", // 用户选择的社区
        commodityCode: "", // 社区code
        title: "", // 标题
        startDate: "", // 开始时间
        endDate: "", // 结束时间
        // commodityName: "", // 商品名称回显示

        // 商品
        commodity: {
          name: ""
        },

        // 赠品
        gift: {
          name: ""
        },
        cover: "", // 封面
        saleType: "1", // 满减类型
        saleRules: "", // 满减规则
        deliveryHour: "", // 配送时效
        price: "", // 金额
        area: "",
        city: "",
        province: "",
        remark: "", // 详情
        isShow: "",
        status: "", // 状态
        giftImg: "", // 团购赠品图片
        type: overall.delivery.types[0].value, // 记录用户选择的配送方式 配送 自取
        shopAddress: "", // 店面地址
        shopImg: [] // 店面图片
      };
      this.fileList = []; // 清空回显
      this.shopImgList = [];
      this.formDate = [];
      this.giftList = [];
      this.$refs.provinceForm.initialization(); // 重置省市区
      this.myRules = []; // 重置规则
      this.$refs.buyingForm.resetFields();
      this.fromDisabled = false;
    }
  }
};
</script>
