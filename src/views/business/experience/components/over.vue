<template>
  <div class="over">
    <!-- search --->
    <div class="over-container">
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
        @click="queryBuying"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="over-table">
      <el-table
        v-loading="listLoading"
        :data="experienceList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.title')" width="300">
          <template slot-scope="scope">{{ scope.row.title ? scope.row.title : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.createTime')" width="330">
          <template
            slot-scope="scope"
          >{{ scope.row.startDate ? (scope.row.startDate + ' - ' + scope.row.endDate) : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.grantNum')" width="200">
          <template
            slot-scope="scope"
          >{{ scope.row.grantNum ? scope.row.grantNum : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.amountUsed')" width="200">
          <template
            slot-scope="scope"
          >{{ scope.row.amountUsed ? scope.row.amountUsed : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.state')" width="300">
          <template
            slot-scope="scope"
          >{{ scope.row.status ? getStatusText(scope.row.status) : $t('table.noTime')}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryDate: "",
      listLoading: false,
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
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
      listQuery: {
        name: ""
      },
      experienceList: []
    };
  },
  methods: {
    // 查询数据
    fetchData() {
      let _this = this;
      //   _this.listLoading = true;
    },
    // 搜索
    queryBuying() {
      this.fetchData();
    },
    // 显示添加页面
    showAddView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    }
  }
};
</script>
<style lang="scss">
.over {
  padding: 20px;
  .my-input {
    width: 55%;
  }
  .over-container {
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
  .rule {
    margin: 10px;
    .el-input {
      width: 80px;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
  .delivery-time {
    .el-input {
      width: 200px;
    }
  }
}
</style>