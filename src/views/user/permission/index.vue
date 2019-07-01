<template>
  <div class="user">
    <div class="app-container">
      <!-- query -->
      <div class="filter-container">
        <el-input
          v-model="listQuery.roleName"
          :placeholder="$t('table.temp.roleName')"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />

        <el-button class="filter-item" type="primary" icon="el-icon-search">{{ $t('table.search') }}</el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
          @click="showAddUserView"
        >{{ $t('table.add') }}</el-button>
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
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column :label="$t('table.permissionName')" align="center" width="310">
          <template slot-scope="scope">{{ generateTitle(scope.row.meta.title) }}</template>
        </el-table-column>
        <el-table-column :label="$t('table.permissionUrl')" width="310" align="center">
          <template slot-scope="scope">{{ scope.row.path }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="created_at"
          :label="$t('table.createTime')"
          width="400"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="313">
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
        @pagination="fetchData"
      />

      <!-- dialog -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="100px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item :label="$t('table.permissionName')" prop="userName">
            <el-input v-model="temp.userName"/>
          </el-form-item>
          <el-form-item :label="$t('table.permissionUrl')" prop="userName">
            <el-input v-model="temp.userName"/>
          </el-form-item>
          <el-form-item :label="$t('table.createTime')" prop="timestamp">
            <el-date-picker
              v-model="temp.createTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请输入到期日期"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="dialogStatus==='create'?createData():updateData()"
            :loading="buttonLoading"
          >{{ $t('table.confirm') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style>
.filter-container {
  margin-bottom: 10px;
}
</style>

<script>
import { getPermission } from "@/api/user";
import { generateTitle } from "@/utils/i18n";
import { formatRoutes, deepCopy} from '@/utils/base'
import Pagination from "@/components/Pagination"; // 分页
export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      tree: null, // 树结构数据
      listLoading: true,
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      total: 12, // 分页
      buttonLoading: false, // 按钮加载请求
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      // 查询参数
      listQuery: {
        nickName: null,
        userName: null,
        pageNum: 1,
        pageSize: 10
      },
      // 表单数据
      temp: {
        userName: "",
        userId: "",
        password: "",
        email: "",
        radioName: "",
        phone: "",
        rolesValue: "",
        dictionaryNameList: [], // 地区
        expireTime: ""
      },
      // 表单验证
      rules: {},
      pickerOptions: {
        // 时间插件控制
        disabledDate(time) {
          // 只可选择大于当前时间的日期
          return time.getTime() < Date.now();
        }
      }
    };
  },
  created() {
    this.fetchData();
  },

  methods: {
    generateTitle,
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getPermission().then(function(data) {
        _this.listLoading = false;
        _this.list = data.data;
        _this.tree = formatRoutes(deepCopy(data.data)); // 对象深copy构建树结构数据
      });
    },
    handleFilter() {},
    // 显示添加页面
    showAddUserView() {
      let _this = this;
      _this.dialogStatus = "create"; // 标示创建
      _this.dialogFormVisible = true; // 展示弹窗
    },
    // 显示编辑页面
    showEditUserView() {
      let _this = this;
      _this.dialogStatus = "update"; // 标示创建
      _this.dialogFormVisible = true; // 展示弹窗
    },
    // 创建数据
    createData() {
      console.log("创建");
    },
    // 修改数据
    updateData() {
      console.log("修改");
    },
    // 删除数据
    deleteData() {
      console.log("删除");
    }
  }
};
</script>
