<template>
  <div class="up">
    <!-- search --->
    <div class="up-container">
      <!-- <el-input
        v-model="listQuery.title"
        :placeholder="$t('table.temp.community')"
        style="width: 200px;"
        class="filter-item"
      />-->
    </div>
    <!-- table --->
    <div class="up-table">
      <el-table
        v-loading="listLoading"
        :data="upList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.version')" width="200">
          <template slot-scope="scope">{{ scope.row.showVer }}</template>
        </el-table-column>
         <el-table-column align="center" :label="$t('table.version')" width="200">
          <template slot-scope="scope">{{ scope.row.sysVer }}</template>
        </el-table-column>
         <el-table-column align="center" :label="$t('table.content')" width="200">
          <template slot-scope="scope">{{ scope.row.versionDesc }}</template>
        </el-table-column>
         <el-table-column align="center" :label="$t('table.uptime')" width="200">
          <template slot-scope="scope">{{ scope.row.createDate }}</template>
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
.up {
  padding: 20px;
  .up-container {
    margin-bottom: 20px;
    .el-cascader {
      margin-top: 5px;
    }
    .el-button--medium {
      margin-top: 5px;
    }
  }
}
</style>
<script>
import Pagination from "@/components/Pagination"; // 分页
import { getSystemAll } from "@/api/system";
export default {
  components: { Pagination },
  data() {
    return {
      listLoading: true,
      upList: [],
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getSystemAll(this.listQuery).then(function(res) {
        console.log("res -- >", res);
        _this.listLoading = false;
        _this.upList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    }
  }
};
</script>