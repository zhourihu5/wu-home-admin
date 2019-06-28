<template>
  <div class="service-index">
    <!-- search --->
    <div class="service-index-container">
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
        @click="queryServiceIndex"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddServiceView"
      >{{ $t('table.add') }}</el-button>
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="uploadH5"
      >{{ $t('table.uploadH5') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="uploadApk"
      >{{ $t('table.uploadApk') }}</el-button>-->
    </div>
    <!-- table --->
    <div class="service-index-table">
      <el-table
        v-loading="listLoading"
        :data="serviceList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.category')" width="105">
          <template
            slot-scope="scope"
          >{{ scope.row.category ? scope.row.category : $t('table.noTime') }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.applyName')" width="255">
          <template slot-scope="scope">{{ scope.row.title ? scope.row.title : $t('table.noTime') }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.serviceProvider')" width="200">
          <template slot-scope="scope">{{ scope.row.providerName ? scope.row.providerName : $t('table.noTime') }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.product')" width="254">
          <template
            slot-scope="scope"
          >{{ scope.row.flag ? getFlagText(scope.row.flag) : $t('table.noTime') }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.createTime')" width="255">
          <template
            slot-scope="scope"
          >{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime') }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.state')" width="255">
          <template
            slot-scope="scope"
          >{{ scope.row.status ? getStatusText(scope.row.status) : $t('table.noTime') }}</template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="250">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="mini"
              @click="showEditServiceView(row)"
            >{{ $t('table.edit') }}</el-button>
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
    <!-- dialog -->
    <div class="service-index-dialog">
      <el-dialog
        :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
        :visible.sync="dialogFormVisible"
        @close="close"
        @opened="opened"
      >
        <div class="myForm">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="H5" name="uploadH5" :disabled="tabDisabled == 1"></el-tab-pane>
            <el-tab-pane label="APK" name="uploadApk" :disabled="tabDisabled == 2"></el-tab-pane>
          </el-tabs>
          <component
            :is="currentView"
            :isClose="dialogFormVisible"
            @close="close"
            @fetchData="fetchData"
            ref="child"
          ></component>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="scss">
.service-index {
  padding: 20px;
  .service-index-container {
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
  .service-index-dialog {
    .myForm {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      padding: 10px;
    }
  }
}
</style>
<script>
import { getServiceAll } from "@/api/service";
import Pagination from "@/components/Pagination"; // 分页
import { service } from "@/constant/service"; // 服务 常用常量
import uploadH5 from "./components/uploadH5";
import uploadApk from "./components/uploadApk";
export default {
  components: { Pagination, uploadH5, uploadApk },
  data() {
    return {
      activeName: "uploadH5",
      index: 0,
      arr: ["uploadH5", "uploadApk"],
      listLoading: true,
      serviceList: [], // 列表数据
      total: 0,
      listQuery: {
        title: "",
        pageNum: 1,
        pageSize: 10
      },
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      flags: service.flags,
      status: service.status,
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      tabDisabled: 0, // 没有禁用的
      item: null // 回显用
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    // 动态组件
    currentView() {
      return this.arr[this.index];
    }
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
    // 获取flag text文字
    getFlagText(flag) {
      return this.flags.filter(function(v) {
        return v.value == flag;
      })[0].label;
    },
    // 获取status text文字
    getStatusText(status) {
      return this.status.filter(function(v) {
        return v.value == status;
      })[0].label;
    },
    uploadH5() {},
    uploadApk() {},
    // 添加页面
    showAddServiceView() {
      this.dialogStatus = "create"; // 标示创建
      this.tabDisabled = 0; // 不禁用
      this.index = 0; // 切换页面
      this.activeName = "uploadH5";
      this.dialogFormVisible = true; // 展示弹窗
      this.item = null; // 清空回显数据
    },
    // 编辑
    showEditServiceView(row) {
      let _this = this;
      _this.dialogStatus = "update"; // 标示创建
      if (row.flag == service.flags[0].value) {
        // app
        _this.activeName = "uploadApk";
        _this.index = 1; // 切换页面
        _this.tabDisabled = 1; // 禁用 uploadH5
      } else {
        // 链接
        _this.activeName = "uploadH5";
        _this.index = 0; // 切换页面
        _this.tabDisabled = 2; // 禁用 uploadApk
      }
      _this.dialogFormVisible = true; // 展示弹窗
      _this.item = row;
    },
    // 查询
    queryServiceIndex() {},
    // 页签切换
    handleClick(tab, event) {
      console.log("页签切换 ", tab.index);
      this.index = tab.index;
    },
    opened() {
      this.$refs.child.parentData(this.item);
    },
    close() {
      this.dialogFormVisible = false;
    }
  }
};
</script>
