<template>
  <div class="not-audited">
    <!-- search --->
    <div class="not-audited-container">
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
      <el-input
        v-model="listQuery.userName"
        :placeholder="$t('table.temp.name')"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="queryData"
      >{{ $t('table.search') }}</el-button>
    </div>
    <!-- table --->
    <div class="order-table">
      <el-table
        v-loading="listLoading"
        :data="dataList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.name')" width="300">
          <template
            slot-scope="scope"
          >{{ scope.row.applyName ? scope.row.applyName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.phone')" width="300">
          <template slot-scope="scope">{{ scope.row.phone ? scope.row.phone : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.createTime')" width="200">
          <template
            slot-scope="scope"
          >{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('table.belongToCommunity') + $t('table.address')"
          width="530"
        >
          <template
            slot-scope="scope"
          >{{ scope.row.familyName ? scope.row.familyName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="360">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="onAdopt(row)">{{ $t('table.adopt') }}</el-button>
            <el-button type="danger" size="mini" @click="onReject(row)">{{ $t('table.reject') }}</el-button>
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
  </div>
</template>
<script>
import Pagination from "@/components/Pagination"; // 分页
import { getApplyAll, audit } from "@/api/examine";
import { overall } from "@/constant/index";
import { generatePoint } from "@/utils/i18n";
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
      listQuery: {
        userName: "", // 用户名称
        startDate: null,
        endDate: null,
        pageNum: 1,
        pageSize: 10,
        status: overall.examine.status[0].value // 待审核
      },
      listLoading: false, // 列表加载
      dataList: [],
      total: 0
    };
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
  created() {
    this.fetchData();
    console.log(1);
  },
  methods: {
    generatePoint,
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getApplyAll(this.listQuery).then(function(res) {
        console.log("res --- ", res);
        _this.listLoading = false;
        _this.dataList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 查询
    queryData() {
      console.log("_this.listQuery  ", this.listQuery);
      this.fetchData();
    },
    // 审核通过
    onAdopt(row) {
      console.log("row --- >", row);
      let _this = this;
      audit({
        id: row.id,
        status: overall.examine.status[1].value.toString(),
        address: row.familyName
      }).then(function(res) {
        console.log("res -- ", res);
        if (res.message == "SUCCESS") {
          _this.$notify({
            title: _this.generatePoint("notifySuccess.title"),
            message: _this.generatePoint("notifySuccess.message7"),
            type: "success"
          });
          _this.fetchData();
        } else {
          _this.$message.error(_this.generatePoint("system"));
        }
      });
    },
    // 审核驳回
    onReject(row) {
      let _this = this;
      _this
        .$prompt("驳回原因", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\S/,
          inputErrorMessage: "内容不能为空",
          inputType: "textarea"
        })
        .then(({ value }) => {
          audit({
            id: row.id,
            status: overall.examine.status[2].value.toString(),
            remark: value,
            address: row.familyName
          }).then(function(res) {
            console.log("res --- >", res);
            if (res.message == "SUCCESS") {
              _this.$notify({
                title: _this.generatePoint("notifySuccess.title"),
                message: _this.generatePoint("notifySuccess.message7"),
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
    deleteData() {}
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.not-audited {
  animation: mymove 0.5s ease-in;
  -webkit-animation: mymove 0.5s ease-in; /*Safari and Chrome*/
  padding: 20px;
  .not-audited-container {
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
<style lang="scss">
.not-audited-container {
  .el-date-editor .el-range-separator {
    padding: 0 !important;
  }
}
</style>