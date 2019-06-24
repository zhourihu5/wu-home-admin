<template>
  <div class="advert-bottom">
    <h3>平板弹窗广告</h3>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" :label="$t('table.id')" width="100">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.advertTitle')" width="459">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column :label="$t('table.advertType')" width="210" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.viewAdvert')" width="300" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.view" target="view_window">点击查看</a>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.jumpPath')" width="300" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="view_window">点击查看</a>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" width="300">
        <el-button type="primary" size="mini" @click="showEditUserView">{{ $t('table.edit') }}</el-button>
        <el-button type="danger" size="mini" @click="deleteData">{{ $t('table.delete') }}</el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getDatas"
    />
  </div>
</template>
<style lang="scss">
.advert-bottom {
  h3 {
    margin-bottom: 30px;
  }
  a {
    color: #409eff;
    &:hover {
      color: #3880ca;
    }
  }
}
</style>

<script>
import { getAdvertList } from "./../../../../api/advert";
import Pagination from "@/components/Pagination"; // 分页
export default {
  data() {
    return {
      list: [],
      listLoading: true,
      dialogStatus: "",
      dialogFormVisible: false,
      total: 12, // 分页
      listQuery: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getDatas();
  },
  components: {
      Pagination
  },
  methods: {
    getDatas() {
      let _this = this;
      getAdvertList().then(function(data) {
        console.log("data --- >", data);
        setTimeout(() => {
          _this.list = data.data;
          _this.listLoading = false;
        }, 2000);
      });
    },
    // 显示编辑页面
    showEditUserView() {
      let _this = this;
      _this.dialogStatus = "update"; // 标示创建
      _this.dialogFormVisible = true; // 展示弹窗
    },
    // 删除数据
    deleteData() {
      console.log("删除");
    }
  }
};
</script>