<template>
  <div class="order">
    <!-- search --->
    <div class="order-container">
      <el-date-picker
        v-model="queryDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        :start-placeholder="$t('form.startTime')"
        :end-placeholder="$t('form.endTime')"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
      <el-select v-model="listQuery.status" :placeholder="$t('table.temp.status')">
        <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input
        v-model="listQuery.activityName"
        :placeholder="$t('table.temp.name')"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="queryOrder"
      >{{ $t('table.search') }}</el-button>
    </div>
    <!-- table --->
    <div class="order-export">
      <el-button type="primary" @click="outExe">导出</el-button>
    </div>
    <div class="order-table">
      <el-table
        v-loading="listLoading"
        :data="orderList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.orderNumber')" width="300">
          <template slot-scope="scope">{{ scope.row.code ? scope.row.code : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.orderTime')" width="200">
          <template
            slot-scope="scope"
          >{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.name')" width="300">
          <template
            slot-scope="scope"
          >{{ scope.row.activityName ? scope.row.activityName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.originalPrice')" width="150">
          <template slot-scope="scope">{{ scope.row.price ? scope.row.price : $t('table.noTime')}}</template>
        </el-table-column>
        <!-- <el-table-column align="center" :label="$t('table.presentPrice')" width="150">
          <template slot-scope="scope">{{scope.row.favPrice }}</template>
        </el-table-column>-->
        <el-table-column align="center" :label="$t('table.state')" width="150">
          <template
            slot-scope="scope"
          >{{ scope.row.status ? getStatusText(scope.row.status) : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.consignee')" width="180">
          <template
            slot-scope="scope"
          >{{ scope.row.deliveryUname ? scope.row.deliveryUname : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.phone')" width="145">
          <template
            slot-scope="scope"
          >{{ scope.row.deliveryUphone ? scope.row.deliveryUphone : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.payment')" width="145">
          <template
            slot-scope="scope"
          >{{ scope.row.payType ? getTypesText(scope.row.payType) : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.orderMoney')" width="145">
          <template
            slot-scope="scope"
          >{{ scope.row.realPrice ? scope.row.realPrice : $t('table.noTime')}}</template>
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
  </div>
</template>

<script>
import { overall } from "@/constant/index";
import { getOrderAll } from "@/api/business";
import Pagination from "@/components/Pagination"; // 分页
export default {
  components: { Pagination },
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
      queryDate: "", // 列表搜索
      // 查询参数
      listQuery: {
        status: "", // 状态
        activityName: "", // 活动名称
        endDate: null, // 结束时间
        startDate: null, // 开始时间
        pageNum: 1,
        pageSize: 10
      },
      listLoading: false, // 列表加载
      orderList: [],
      total: 0,
      status: overall.order.status,
      types: overall.order.types,
      excelData: [] // 导出的数据
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    queryDate: {
      handler: function(val, oldval) {
        console.log(val, oldval);
        this.listQuery.startDate = val[0];
        this.listQuery.endDate = val[1];
      }
    }
  },
  methods: {
    // 查询数据
    fetchData() {
      let _this = this;
      let params = {
        pageNum: _this.listQuery.pageNum,
        pageSize: _this.listQuery.pageSize
      };
      if(_this.listQuery.status != "" && _this.listQuery.status != 0) {
        params.status = _this.listQuery.status;
      }
      _this.listLoading = true;
      getOrderAll(params).then(function(res) {
        console.log("res --- ", res);
        _this.listLoading = false;
        _this.orderList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 查询
    queryOrder() {
      this.fetchData();
    },
    // 获取状态中文
    getStatusText(status) {
      let text = "";
      this.status.forEach(function(v) {
        if (v.value == status) {
          text = v.label;
        }
      });
      return text;
    },
    // 获取状态中文
    getTypesText(types) {
      for (let i = 0; i < this.types.length; i++) {
        // console.log(this.status[i]);
        if (this.types[i].value == types) {
          return this.types[i].label;
        }
      }
    },
    outExe() {
      this.$confirm("此操作将导出excel文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let _this = this;
          // 构建导入数据
          console.log(" --- >", _this.orderList);
          // _this.experienceList.forEach(function(v, i) {
          //   console.log("i", i, v);
          //   v.experienceId = _this.experienceForm.id;
          //   v.experienceName = _this.experienceForm.name;
          // });
          _this.excelData = _this.orderList;
          _this.export2Excel();
        })
        .catch(() => {});
    },
    export2Excel() {
      var that = this;
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("./../../../excel/Export2Excel"); //这里必须使用绝对路径
        const tHeader = [
          "订单ID",
          "订单编码",
          "下单时间",
          "活动名称",
          "商品现价",
          "收货人姓名",
          "收货人手机号",
          "订单金额"
        ];
        const filterVal = [
          "id",
          "code",
          "createDate",
          "activityName",
          "price",
          "deliveryUname",
          "deliveryUphone",
          "realPrice"
        ]; // 导出的表头名
        const list = that.excelData;
        const data = that.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, `订单excel`); // 导出的表格名称，根据需要自己命名
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};
</script>

<style lang="scss" scoped>
.order {
  padding: 20px;
  .order-container {
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
  .order-export {
    margin: 10px;
    text-align: right;
  }
}
</style>
<style lang="scss">
.order-container {
  .el-date-editor .el-range-separator {
    padding: 0 !important;
  }
}
</style>
