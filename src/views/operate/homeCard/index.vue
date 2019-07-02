<template>
  <div class="homeCard">
    <!-- search --->
    <div class="homeCard-container">
      <el-select v-model="listQuery.type" :placeholder="$t('table.temp.type')">
        <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="listQuery.status" :placeholder="$t('table.temp.status')">
        <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="queryhomeCard"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddhomeCardView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="homeCard-table">
      <el-table
        v-loading="listLoading"
        :data="homeCardList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.title')" width="200">
          <template slot-scope="scope">{{ scope.row.title ? scope.row.title : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.describe')" width="350">
          <template slot-scope="scope">{{ scope.row.memo ? scope.row.memo : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.icon')" width="244">
          <template slot-scope="scope">
            <img v-if="scope.row.icon" :src="scope.row.icon" :alt="$t('table.icon')" class="icon">
            <p v-else>{{ $t('table.noTime') }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.type')" width="150">
          <template slot-scope="scope">{{ scope.row.type ? scope.row.type : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.deliveryTime')" width="280">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.pushDate ? scope.row.pushDate : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.state')" width="150">
          <template
            slot-scope="scope"
          >{{ scope.row.status != null ? getStatusText(scope.row.status) : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="200">
          <template slot-scope="{row}">
            <el-button
              size="mini"
              @click="stopPushing(row)"
            >{{ $t('table.stopPushing') }}</el-button>
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
    <div class="homeCard-dialog">
      <el-dialog
        :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
        :visible.sync="dialogFormVisible"
        @close="close"
      >
        <div class="myForm">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="$t('form.imageText')" name="imageText"></el-tab-pane>
            <el-tab-pane :label="$t('form.olink')" name="mlink"></el-tab-pane>
            <el-tab-pane :label="$t('form.ofunction')" name="mFunction"></el-tab-pane>
          </el-tabs>
          <component
            :is="currentView"
            :isClose="dialogFormVisible"
            @close="close"
            @fetchData="fetchData"
          ></component>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="scss">
.homeCard {
  padding: 20px;
  .homeCard-container {
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
  .connect {
    color: #337ab7;
    &:hover {
      color: #20a0ff;
    }
  }
  .icon {
    width: 80px;
    height: 80px;
  }
  // .homeCard-dialog {
  //   .myForm {
  //     // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  //     // padding: 10px;
  //   }
  // }
}
</style>
<script>
import { getHomeCardAll } from "@/api/card";
import Pagination from "@/components/Pagination"; // 分页
import imageText from "./components/imageText";
import mlink from "./components/link";
import mFunction from "./components/mFunction";
import { card } from "@/constant/card"; // 分页
import { removePush } from "@/api/card";
import { generatePoint } from "@/utils/i18n";
export default {
  components: { Pagination, imageText, mlink, mFunction },
  data() {
    return {
      activeName: "imageText",
      index: 0,
      arr: ["imageText", "mlink", "mFunction"],
      listLoading: true,
      homeCardList: [], // 列表
      total: 0,
      types: card.types,
      status: card.status,
      listQuery: {
        name: "",
        type: "", // 类型
        status: "", // 状态
        pageNo: "",
        pageSize: 10
      },
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false // 是否展示dialog内容
    };
  },
  computed: {
    // 动态组件
    currentView() {
      return this.arr[this.index];
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    generatePoint,
    // 列表数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;

      getHomeCardAll(this.listQuery).then(function(res) {
        console.log("列表 -- ", res);
        _this.listLoading = false;
        _this.homeCardList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 查询
    queryhomeCard() {
      this.fetchData();
    },
    // 显示添加页面
    showAddhomeCardView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 获取状态文字
    getStatusText(status) {
      console.log(status);
      let text = "";
      this.status.forEach(function(v) {
        if (v.value == status) {
          text = v.label;
        }
      });
      return text;
    },
    // 停止推送
    stopPushing(row) {
      let _this = this;
      removePush({ id: row.id }).then(function(res) {
        console.log("res --- >", res);
        if (res.message == "SUCCESS") {
          _this.$notify({
            title: _this.generatePoint("notifySuccess.title"),
            message: _this.generatePoint("notifySuccess.message4"),
            type: "success"
          });
        } else {
          _this.$message.error(_this.generatePoint("system"));
        }
        _this.fetchData(); // 刷新列表
      });
    },
    // 页签切换
    handleClick(tab, event) {
      this.index = tab.index;
    },
    close() {
      this.dialogFormVisible = false;
    }
  }
};
</script>
