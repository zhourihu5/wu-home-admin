<template>
  <div class="community">
    <!-- search --->
    <div class="community-index-container">
      <province ref="provinceList" :params="myList" @getProvinceVal="getProvinceVal"></province>
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
        @click="queryCommunity"
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
    <div class="community-table">
      <el-table
        v-loading="listLoading"
        :data="communityList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.communityName')" width="300">
          <template slot-scope="scope">{{ scope.row.name ? scope.row.name : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.areaName')" width="300" align="center">
          <template slot-scope="scope">
            <span>{{ (scope.row.provinceName + '/' + scope.row.cityName + '/' + scope.row.areaName) ? (scope.row.provinceName + '/' + scope.row.cityName + '/' + scope.row.areaName) : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.address')" width="480" align="center">
          <template
            slot-scope="scope"
          >{{ scope.row.address ? scope.row.address : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="created_at"
          :label="$t('table.createTime')"
          width="300"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="350">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="mini"
              @click="showEditView(row)"
            >{{ $t('table.edit') }}</el-button>
            <!-- <el-button type="danger" size="mini" @click="deleteData(row)">{{ $t('table.delete') }}</el-button> -->
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
    <div class="community-dialog">
      <el-dialog
        :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
        :visible.sync="dialogFormVisible"
        width="90%"
        @close="close"
        :close-on-click-modal="false"
      >
        <save-communtity ref="savaCommuntity" @close="close" :cid="cid" @fetchData="fetchData"></save-communtity>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="scss">
.community {
  padding: 20px;
  .community-index-container {
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
  // .community-dialog {
  //   .el-dialog {
  //     max-height: 780px;
  //   }
  // }
}
</style>
<script>
import { addCommuntity, getCommuntityAll } from "@/api/community";
import Pagination from "@/components/Pagination"; // 分页
import Province from "@/components/Linkage/province"; // 省市区三级联动
import saveCommuntity from "./components/add";
export default {
  components: { Province, Pagination, saveCommuntity },
  data() {
    return {
      cid: "",
      myList: {
        code: "list",
        areaValue: [],
        communityValue: []
      },
      myForm: {
        code: "form",
        areaValue: [],
        communityValue: []
      },
      listQuery: {
        name: "",
        areaCode: "",
        pageNum: 1,
        pageSize: 10
      },
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      listLoading: false, // 列表加载
      communityList: [], // 列表数据
      total: 0, // 列表分页
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false // 是否展示dialog内容
    };
  },
  created() {
    this.fetchData(); // 获取列表数据
  },
  methods: {
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getCommuntityAll(_this.listQuery).then(function(res) {
        console.log("res ---- ", res);
        _this.listLoading = false;
        _this.communityList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 获取省市区数据
    getProvinceVal(val, code) {
      if (code == "list") {
        this.myList.areaValue = val;
        this.listQuery.areaCode = val[2];
      } else {
        this.myForm.areaValue = val;
      }
    },
    // 搜索
    queryCommunity() {
      this.fetchData();
    },
    showAddView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    showEditView(row) {
      console.log("row --- >", row);
      this.cid = row.id.toString();
      this.dialogStatus = "update"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    close() {
      console.log("关闭")
      this.$refs.savaCommuntity.initialization();
      this.cid = "";
      this.dialogFormVisible = false; // 关闭弹窗
    }
  }
};
</script>
