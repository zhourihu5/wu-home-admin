<template>
  <div class="commodity">
    <!-- search --->
    <div class="commodity-container">
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
        @click="queryCommodity"
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
    <div class="commodity-table">
      <el-table
        v-loading="listLoading"
        :data="commodityList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.name')" width="600">
          <template slot-scope="scope">{{ scope.row.name ? scope.row.name : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.addTime')" width="600">
          <template
            slot-scope="scope"
          >{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="515">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="showEditView(row)">{{ $t('table.edit') }}</el-button>
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
    </div>
    <!-- dialog -->
    <el-dialog
      :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
      :visible.sync="dialogFormVisible"
      @close="close"
    >
      <el-form
        ref="commodityForm"
        :rules="rules"
        :model="commodityForm"
        label-position="right"
        label-width="100px"
        style="width: 80%"
      >
        <el-form-item :label="$t('form.Cover')" prop="file">
          <el-upload
            :action="updateURL"
            list-type="picture-card"
            :limit="5"
            :multiple="false"
            :file-list="fileList"
            :on-exceed="exceedUpload"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :on-remove="onRemove"
            :data="uploadParams"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('form.name')" prop="name">
          <el-input v-model="commodityForm.name" :placeholder="$t('table.temp.name')" />
        </el-form-item>
        <el-form-item :label="$t('form.commodityLabel')" prop="labelsName">
          <el-input
            :disabled="true"
            v-model="commodityForm.labelsName"
            :placeholder="$t('table.temp.labels')"
            class="my-input"
          />
          <el-button
            type="text"
            @click="dialogCommodityVisible = true"
          >{{ $t('form.addCommodityLabel') }}</el-button>
        </el-form-item>
        <el-form-item :label="$t('form.initPrice')" prop="initPrice">
          <el-input v-model="commodityForm.initPrice" :placeholder="$t('table.temp.price')" />
        </el-form-item>
        <el-form-item :label="$t('form.price')" prop="price">
          <el-input v-model="commodityForm.price" :placeholder="$t('table.temp.price')" />
        </el-form-item>
        <el-form-item :label="$t('form.stock')" prop="repertoryNum">
          <el-input v-model="commodityForm.repertoryNum" :placeholder="$t('table.temp.stock')" />
        </el-form-item>
        <el-form-item :label="$t('form.origin')" prop="origin">
          <el-input v-model="commodityForm.origin" :placeholder="$t('table.temp.content')" />
        </el-form-item>
        <el-form-item :label="$t('form.specifications')" prop="specifications">
          <el-input v-model="commodityForm.specifications" :placeholder="$t('table.temp.content')" />
        </el-form-item>
        <el-form-item :label="$t('form.weight')" prop="weight">
          <el-input v-model="commodityForm.weight" :placeholder="$t('table.temp.content')" />
        </el-form-item>
        <el-form-item :label="$t('form.packing')" prop="packing">
          <el-input v-model="commodityForm.packing" :placeholder="$t('table.temp.content')" />
        </el-form-item>
        <el-form-item :label="$t('form.guarantee')" prop="guarantee">
          <el-input v-model="commodityForm.guarantee" :placeholder="$t('table.temp.content')" />
        </el-form-item>
        <el-form-item :label="$t('form.storageMode')" prop="storageMode">
          <el-input v-model="commodityForm.storageMode" :placeholder="$t('table.temp.content')" />
        </el-form-item>
        <el-form-item :label="$t('form.details')" prop="infos">
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
        <!-- 住戶列表-->
        <transition name="el-zoom-in-top">
          <label-List :label="commodityForm.labelsName" @transmitUser="userChoiceCommodity" @close="dialogCommodityVisible = false"></label-List>
        </transition>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.commodity {
  padding: 20px;
  .commodity-container {
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
    .el-date-editor .el-range-separator {
      padding: 0 !important;
    }
    .el-input {
      width: 70%;
    }
    .el-select > .el-input {
      width: 100% !important;
    }
  }
}
</style>
<script>
import wangeditor from "@/components/Wangeditor/index";
import { generatePoint } from "@/utils/i18n";
import { overall } from "@/constant/index";
import { addCommodity, getCommodityAll } from "@/api/business";
import Pagination from "@/components/Pagination"; // 分页
import labelList from "./components/label";
export default {
  components: { wangeditor, Pagination, labelList },
  data() {
    return {
      updateURL: overall.uploadUrl,
      fileList: [], // 上传图片回显列表
      listQuery: {
        name: "",
        pageNum: 1,
        pageSize: 10
      },
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      dialogCommodityVisible: false, // 是否展示商品标签dialog内容
      listLoading: false, // 列表加载
      buttonLoading: false, // 按钮加载请求
      commodityList: [],
      uploadParams: {
        type: "commodity"
      },
      total: 0, // 列表分页
      commodityForm: {
        id: "",
        code: "", // 商品code
        origin: "", // 产地
        weight: "", // 重量
        packing: "", // 包装
        guarantee: "", // 保质期
        storageMode: "", // 存储方式
        uploadImg: [], // 商品图片
        repertoryNum: "", // 库存
        name: "", // 商品名称
        labelsName: "", // 商品标签名称
        labelsIds: "",
        infos: "", // 商品详情
        initPrice: "", // 商品上货价格
        price: "", // 商品价格
        specifications: "", // 规格
        formatVal: "", // 产地|规格|重量|包装|保质期|储存方式
        salesNum: "", // 已经卖出数量
        labe: "", // 回显实体
      },
      rules: {
        file: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              console.log("验证");
              if (this.commodityForm.uploadImg.length == 0) {
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
            message: this.generatePoint("mandatory")
          }
        ],
        initPrice: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        price: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        repertoryNum: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        origin: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        specifications: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        weight: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        packing: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        guarantee: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        storageMode: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        infos: [
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
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
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
      // 查询
      getCommodityAll(this.listQuery).then(function(res) {
        console.log("res --- >", res);
        _this.listLoading = false;
        _this.commodityList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 查询
    queryCommodity() {
      this.fetchData();
    },
    userChoiceCommodity(labelStr) {
      console.log("选择 商品标签", labelStr);
      this.commodityForm.labelsName = labelStr;
    },
    // 显示添加页面
    showAddView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 修改页面
    showEditView(row) {
      let _this = this;
      console.log("row --- >", row);
      _this.dialogStatus = "update"; // 标示创建
      _this.dialogFormVisible = true; // 展示弹窗
      _this.commodityForm.id = row.id;
      _this.commodityForm.code = row.code;
      _this.commodityForm.name = row.name;
      _this.commodityForm.initPrice = row.initPrice;
      _this.commodityForm.price = row.price;
      _this.commodityForm.repertoryNum = row.repertoryNum;
      _this.commodityForm.salesNum = row.salesNum;
      // 设置富文本显示
      if (row.infos) {
        _this.$nextTick(() => {
          _this.$refs.wangeditor.setContent(row.infos);
        });
      }
      // 设置图片回显
      if (row.attaInfos.length > 0) {
        //  _this.fileList.push({ url: row.cover });
        for (let i = 0; i < row.attaInfos.length; i++) {
          _this.fileList.push({ url: row.attaInfos[i].attaAddr });
          _this.commodityForm.uploadImg.push(row.attaInfos[i].attaAddr);
        }
      }
      // console.log("_this.fileList --- ", _this.fileList);
      // console.log(
      //   "_this.commodityForm.uploadImg --- ",
      //   _this.commodityForm.uploadImg
      // );
      // 回显规格 产地|规格|重量|包装|保质期|储存方式
      if (row.formatVal) {
        let arr = row.formatVal.split("|");
        _this.commodityForm.origin = arr[0];
        _this.commodityForm.specifications = arr[1];
        _this.commodityForm.weight = arr[2];
        _this.commodityForm.packing = arr[3];
        _this.commodityForm.guarantee = arr[4];
        _this.commodityForm.storageMode = arr[5];
      }
    },
    // 添加数据
    createData() {
      let _this = this;
      _this.buttonLoading = true;
      _this.$refs.commodityForm.validate(valid => {
        if (valid) {
          try {
            let params = _this.buildParams(); // 构建参数
            console.log("params --- 》", params);
            // addCommodity(params).then(function(res) {
            //   console.log("res --- >", res);
            //   if (res.message == "SUCCESS") {
            //     _this.buttonLoading = false; // 清空按钮加载状态
            //     _this.$notify({
            //       title: _this.generatePoint("notifySuccess.title"),
            //       message: _this.generatePoint("notifySuccess.message"),
            //       type: "success"
            //     });
            //     _this.dialogFormVisible = false; // 关闭弹窗
            //     _this.fetchData();
            //   } else {
            //     _this.buttonLoading = false; // 清空按钮加载状态
            //     _this.$message.error(_this.generatePoint("system"));
            //   }
            // });
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
    buildParams() {
      let formatVal =
        this.commodityForm.origin +
        "|" +
        this.commodityForm.specifications +
        "|" +
        this.commodityForm.weight +
        "|" +
        this.commodityForm.packing +
        "|" +
        this.commodityForm.guarantee +
        "|" +
        this.commodityForm.storageMode;
      // 构建详情数据
      let params = {
        uploadImg: this.commodityForm.uploadImg.join(","),
        infos: this.$refs.wangeditor.getContentHtml(),
        initPrice: this.commodityForm.initPrice,
        price: this.commodityForm.price,
        name: this.commodityForm.name,
        repertoryNum: this.commodityForm.repertoryNum,
        formatVal: formatVal,
        labelsName: this.commodityForm.labelsName,
      };
      if (this.commodityForm.id) {
        params.id = this.commodityForm.id;
        params.code = this.commodityForm.code;
        params.salesNum = this.commodityForm.salesNum
      }
      return params;
    },
    // 修改数据
    updateData() {
      let _this = this;
      // _this.buttonLoading = true;
      _this.$refs.commodityForm.validate(valid => {
        if (valid) {
          try {
            let params = _this.buildParams(); // 构建参数
            console.log("params --- ", params.uploadImg.split(","));
            addCommodity(params).then(function(res) {
              console.log("res --- >", res);
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
      this.commodityForm.uploadImg.push(res.data);
    },
    beforeAvatarUpload(file) {
      // console.log("beforeAvatarUpload --", file);
      this.uploadParams.file = file;
    },
    onRemove(res, files) {
      this.fileList = files;
      // console.log("daelte --- res", res);
      let delItem = "";
      if (res.hasOwnProperty("response")) {
        delItem = res.response.data;
      } else {
        delItem = res.url;
      }
      if (this.commodityForm.uploadImg.length > 0) {
        for (let i = 0; i < this.commodityForm.uploadImg.length; i++) {
          if (this.commodityForm.uploadImg[i] == delItem) {
            this.commodityForm.uploadImg.splice(i, 1);
          }
        }
      }
      // console.log("delete --- ", this.commodityForm.uploadImg);
    },
    close() {
      this.dialogFormVisible = false;
      this.commodityForm = {
        id: "",
        code: "",
        origin: "", // 产地
        weight: "", // 重量
        packing: "", // 包装
        guarantee: "", // 保质期
        storageMode: "", // 存储方式
        uploadImg: [], // 商品图片
        repertoryNum: "", // 库存
        name: "", // 商品名称
        labelsName: "", // 商品标签名称
        infos: "", // 商品详情
        initPrice: "", // 商品上货价格
        price: "", // 商品价格
        specifications: "", // 规格
        formatVal: "" // 产地|规格|重量|包装|保质期|储存方式
      };
      this.fileList = [];
      this.labe = [];
      this.$refs.commodityForm.resetFields();
    }
  }
};
</script>