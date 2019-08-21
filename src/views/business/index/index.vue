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
  </div>
</template>
<script>
import Province from "@/components/Linkage/province"; // 省市区三级联动
import { getCommuntityByArea, findFamilyListByCode } from "@/api/community";
import { getBusinessList } from "@/api/business";
import Pagination from "@/components/Pagination"; // 分页
export default {
  components: { Pagination, Province },
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
      businessList: [],
      total: 0 // 分页
    };
  },
  created() {
    this.fetchData(); // 查询数据
  },
  methods: {
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