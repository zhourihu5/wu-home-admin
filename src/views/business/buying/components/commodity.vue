<template>
  <div class="commodity-list">
    <!-- search --->
    <div class="commodity-list-container">
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
          <template slot-scope="scope">
            <el-radio
              v-model="commodityId"
              :label="scope.row.id"
              @change="userChange(scope.row)"
            >{{ scope.row.id }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.name')" width="600">
          <template slot-scope="scope">{{ scope.row.name ? scope.row.name : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.addTime')" width="600">
          <template
            slot-scope="scope"
          >{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</template>
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
<style lang="scss">
.commodity-list {
  padding: 20px;
  .commodity-list-container {
    margin-bottom: 20px;
  }
}
</style>
<script>
import Pagination from "@/components/Pagination"; // 分页
import { getCommodityAll } from "@/api/business";
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {
        name: "",
        pageNum: 1,
        pageSize: 10
      },
      listLoading: false,
      commodityList: [],
      total: 0,
      commodityId: ""
    };
  },
  props: {
    commodity: {
      type: Object
    },
    type: {
      type: String
    }
  },
  created() {
    console.log("this.type --- >", this.commodity, this.type);
    if (this.commodity) {
      // this.listQuery.name = this.commodity.name;
      this.commodityId = this.commodity.id;
      this.queryCommodity();
    } else {
      this.fetchData();
    }
  },
  watch: {
    commodity: {
      handler: function(val, oldval) {
        this.commodityId = val.id;
      }
    },
  },
  methods: {
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
    userChange(row) {
      console.log(row, this.type);
      this.$emit("transmitUser", row, this.type);
    }
  }
};
</script>
