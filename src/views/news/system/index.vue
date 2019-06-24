<template>
  <div class="system">
    <!-- search --->
    <div class="system-container">
      <el-input
        v-model="listQuery.title"
        :placeholder="$t('table.temp.community')"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="querySystemNews"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddSystemView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="system-table">
      <el-table
        v-loading="listLoading"
        :data="systemNewsList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.title')" width="500">
          <template slot-scope="scope">{{ scope.row.title ? scope.row.title : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.type')" width="500">
          <template
            slot-scope="scope"
          >{{ scope.row.type ? getTypeText(scope.row.type) : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.deliveryTime')" width="574">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</span>
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
    <el-dialog
      :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
      :visible.sync="dialogFormVisible"
      :fullscreen="true"
      @close="close"
    >
      <el-form
        ref="systemForm"
        :rules="rules"
        :model="systemForm"
        label-position="left"
        label-width="100px"
        style="width: 800px; margin-left:50px;"
      >
        <el-form-item :label="$t('form.title')" prop="title">
          <el-input v-model="systemForm.title" :placeholder="$t('table.temp.title')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.type')" prop="url">
          <el-select v-model="systemForm.type" :placeholder="$t('table.temp.modular')">
            <el-option
              v-for="item in type"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('form.type')" prop="url">
          <wangeditor></wangeditor>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.system {
  padding: 20px;
  .system-container {
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
<script>
import Pagination from "@/components/Pagination"; // 分页
import { getMessageAll } from "@/api/message";
import { generatePoint } from "@/utils/i18n";
import { overall } from "@/constant/index";
import wangeditor from "@/components/Wangeditor/index";
export default {
  components: { Pagination, wangeditor},
  data() {
    return {
      listLoading: true,
      systemNewsList: [], // 列表数据
      total: 0,
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      listQuery: {
        title: ""
      },
      systemForm: {
          title: "",
          type: ""
      },
      rules: {},
      type: overall.message.type
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    generatePoint,
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getMessageAll(this.listQuery).then(function(res) {
        console.log("列表  -", res);
        _this.listLoading = false;
        _this.systemNewsList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 获取类型 type 文本
    getTypeText(flag) {
      return this.type.filter(function(v) {
        return v.value == flag;
      })[0].label;
    },
    querySystemNews() {},
    showAddSystemView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    close() {
      console.log("关闭");
      this.systemForm = {
        title: "",
        url: "",
        path: "",
        memo: "",
        pushDate: ""
      };
      this.$refs.systemForm.resetFields();
    }
  }
};
</script>
