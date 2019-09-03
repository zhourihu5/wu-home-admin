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
          <template slot-scope="scope">
            <el-radio
              v-model="activityId"
              :label="scope.row.id"
              @change="userChange(scope.row)"
            >{{ scope.row.id }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.title')" width="300">
          <template slot-scope="scope">{{ scope.row.title ? scope.row.title : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.businessTime')" width="472">
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
import Pagination from "@/components/Pagination"; // 分页
import { getActivityAll } from "@/api/business";
export default {
  components: { Pagination },
  data() {
    return {
      queryDate: "",
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
      // 查询参数
      listQuery: {
        status: "", // 状态
        title: "",
        endDate: null, // 结束时间
        startDate: null, // 开始时间
        pageNum: 1,
        pageSize: 10
      },
      // 状态
      status: overall.buying.status,
      listLoading: false, // 列表加载
      buyingList: [],
      total: 0,
      activityId: ""
    };
  },
  props: {
    activity: {
      type: Object
    }
  },
  created() {
    console.log("activity --- ", this.activity);
    if (this.activity) {
      this.listQuery.title = this.activity.title;
      this.activityId = this.activity.id;
      this.queryBuying();
    } else {
      this.fetchData();
    }
  },
  watch: {
    queryDate: {
      handler: function(val, oldval) {
        console.log(val[0] instanceof Date);
        this.listQuery.startDate = val[0];
        this.listQuery.endDate = val[1];
      }
    }
  },
  methods: {
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
    // 搜索
    queryBuying() {
      this.fetchData();
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
    userChange(row) {
      console.log(row);
      this.$emit("transmitUser", row);
    }
  }
};
</script>
<style lang="scss">
.buying {
  padding: 20px;
  .buying-container {
    margin-bottom: 20px;
  }
}
</style>