<template>
  <div class="userList">
    <!-- <h3 class="title">{{ $t('table.userList') }}</h3> -->
    <div class="app-container">
      <!-- query -->
      <div class="filter-container">
        <el-input
          v-model="listQuery.userName"
          :placeholder="$t('table.temp.userName')"
          style="width: 200px;"
          class="filter-item"
        />
        <el-input
          v-model="listQuery.nickName"
          :placeholder="$t('table.temp.nickName')"
          style="width: 200px;"
          class="filter-item"
        />
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="queryUser"
        >{{ $t('table.search') }}</el-button>
      </div>
      <!-- table --->
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <!-- <template slot-scope="scope">{{ scope.row.id }}</template> -->
          <template slot-scope="{row}">
            <el-radio v-model="userId" :label="row.id" @change="userChange(row)">{{row.id}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.nickName')" width="422">
          <template
            slot-scope="scope"
          >{{ scope.row.nickName ? scope.row.nickName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.userName')" width="422" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.userName ? scope.row.userName : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.platform')" width="420" align="center">
          <template
            slot-scope="scope"
          >{{ scope.row.flag ? getFlagText(scope.row.flag) : $t('table.noTime')}}</template>
        </el-table-column>
        <!-- <el-table-column :label="$t('table.community')" width="353" align="center">
          <template
            slot-scope="scope"
          >{{ scope.row.community ? scope.row.community : $t('table.noTime')}}</template>
        </el-table-column> -->
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
.userList {
  margin-left: 20px;
  margin-right: 20px;
  // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  .title {
    font-size: 14px;
    color: #606266;
    padding: 20px 20px 0 20px;
  }
  .app-container {
    padding: 0;
    .filter-container {
      margin-bottom: 10px;
    }
  }
}
</style>
<script>
import Pagination from "@/components/Pagination"; // 分页
import { getUserList } from "@/api/user";
import { overall } from "@/constant/index"; // 服务 常用常量
export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0, // 分页
      userId: "", // 单选
      // 查询参数
      listQuery: {
        nickName: "",
        userName: "",
        pageNum: 1,
        pageSize: 10
      },
      // 平台标示选择
      options: overall.user.options
    };
  },
  props: {
    user: {
      type: Object
    }
  },
  created() {
    console.log("用户列表 --- ", this.user);
    if (this.user) {
      this.listQuery.nickName = this.user.nickName;
      this.listQuery.userName = this.user.userName;
      this.userId = this.user.id;
      this.queryUser();
    }
    this.fetchData();
  },
  methods: {
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getUserList(this.listQuery).then(function(res) {
        _this.listLoading = false;
        _this.list = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
        console.log("res -- ", res);
      });
    },
    userChange(row) {
      console.log(row);
      this.$emit("transmitUser", row);
    },
    queryUser() {
      this.listQuery.pageNum = 1;
      this.fetchData();
    },
    getFlagText(flag) {
      let text = "";
      this.options.forEach(function(v) {
        if (v.value == flag) {
          text = v.label;
        }
      });
      return text;
    }
  }
};
</script>