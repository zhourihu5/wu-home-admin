<template>
  <div class="business">
    <!-- search --->
    <div class="business-container">
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
          <template slot-scope="scope">
            <el-radio
              v-model="userId"
              :label="scope.row.id"
              @change="userChange(scope.row)"
            >{{ scope.row.id }}</el-radio>
          </template>
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
  components: { Pagination },
  data() {
    return {
      communityOptions: [], // 社区下拉列表数据
      listQuery: {
        name: "",
        pageNum: 1,
        pageSize: 10
      },
      queryDate: "",
      listLoading: false,
      businessList: [],
      total: 0, // 分页
      userId: ""
    };
  },
  props: {
    user: {
      type: Object
    }
  },
  created() {
    if (this.user) {
      this.listQuery.name = this.user.name;
      this.userId = this.user.id;
      this.queryBusiness();
    } else {
      this.fetchData();
    }
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
    },
    userChange(row) {
      //   console.log(row);
      this.$emit("transmitUser", row);
    }
  }
};
</script>
<style lang="scss" scoped>
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