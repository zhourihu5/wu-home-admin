<template>
  <div class="service">
    <!-- search --->
    <div class="service-container">
      <el-input
        v-model="listQuery.name"
        :placeholder="$t('table.temp.community')"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="queryService"
      >{{ $t('table.search') }}</el-button>
    </div>
    <!-- table --->
    <div class="service-table">
      <el-checkbox-group v-model="selectList">
        <el-table
          v-loading="listLoading"
          :data="serviceList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" :label="$t('table.id')" width="95">
            <!-- <template slot-scope="scope">{{ scope.row.id }}</template> -->
            <template slot-scope="{row}">
              <el-checkbox :label="row.id">{{row.id}}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.category')" width="200">
            <template
              slot-scope="scope"
            >{{ scope.row.category ? scope.row.category : $t('table.noTime') }}</template>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.applyName')" width="258">
            <template
              slot-scope="scope"
            >{{ scope.row.title ? scope.row.title : $t('table.noTime') }}</template>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.serviceProvider')" width="200">
            <template
              slot-scope="scope"
            >{{ scope.row.title ? scope.row.title : $t('table.noTime') }}</template>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.product')" width="290">
            <template
              slot-scope="scope"
            >{{ scope.row.flag != null ? getFlagText(scope.row.flag) : $t('table.noTime') }}</template>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.uploadTime')" width="200">
            <template
              slot-scope="scope"
            >{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime') }}</template>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.state')" width="200">
            <template
              slot-scope="scope"
            >{{ scope.row.status != null ? getStatusText(scope.row.status) : $t('table.noTime') }}</template>
          </el-table-column>
        </el-table>
      </el-checkbox-group>

      <!-- 分页 -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="fetchData"
      />
    </div>
    <div class="options">
      <el-button type="primary" size="mini" @click="onSubmit" :loading="buttonLoading">{{ $t('table.confirm') }}</el-button>
    </div>
  </div>
</template>
<style lang="scss">
.service {
  padding: 20px;
  .service-container {
    margin-bottom: 20px;
  }
  .options {
    text-align: right;
  }
}
</style>
<script>
import Pagination from "@/components/Pagination"; // 分页
import { getServiceAll } from "@/api/service";
import { overall } from "@/constant/index"; // 服务 常用常量
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {
        name: ""
      },
      listLoading: true,
      buttonLoading: false, // 按钮加载请求
      serviceList: [], // 列表数据
      total: 0,
      flags: overall.service.flags,
      status: overall.service.status,
      selectList: [] // 用户选中的
    };
  },
  props: {
    deleteId: {
      type: String
    },
    serviceClose: {
        type: Boolean
    }
  },
  watch: {
    deleteId: function(newVal) {
      let _this = this;
      for (let i = 0; i < _this.selectList.length; i++) {
        if (_this.selectList[i] == newVal) {
          _this.selectList.splice(i, 1);
          break;
        }
      }
      console.log("删除  ", newVal, this.selectList);
    },
    serviceClose: function(newVal) {
        if(newVal) {
            this.onSubmit();
        }
    }
  },
  created() {
    console.log("列表页 -- ", this.deleteId);
    this.fetchData();
  },
  methods: {
    // 列表数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getServiceAll(this.listQuery).then(function(res) {
        console.log("res --- ", res);
        _this.listLoading = false;
        _this.serviceList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 查询
    queryService() {},
    // 获取flag text文字
    getFlagText(flag) {
      let text = "";
      this.flags.forEach(function(v) {
        if(v.value == flag) {
          text = v.label;
        }
      })
      return text;
    },
    // 获取status text文字
    getStatusText(status) {
      console.log("status -- ", status)
      let text = "";
      this.status.forEach(function(v) {
        if(v.value == status) {
          text = v.label;
        }
      })
      return text;
    },
    // 提交
    onSubmit() {
      this.$emit("selectService", this.selectList, this.serviceList); // 发送事件给父组件
    }
  }
};
</script>