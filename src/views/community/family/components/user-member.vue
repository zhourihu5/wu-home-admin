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
    </div>
    <!-- table --->
    <div class="filter-table">
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
          <template slot-scope="scope">
            <!-- <el-radio v-model="userId" :label="row.id" @change="userChange(row)">{{row.id}}</el-radio> -->
            <el-checkbox
              v-model="userIds"
              :label="scope.row.id"
              :key="scope.row.id"
              @change="checkboxChange"
            >{{scope.row.id}}</el-checkbox>
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
        </el-table-column>-->
      </el-table>
      <!-- 分页 -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="fetchData"
      />
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="close">{{ $t('table.cancel') }}</el-button> -->
        <el-button
          type="primary"
          @click="addUsers"
          :loading="buttonLoading"
        >{{ $t('table.confirm') }}</el-button>
      </div>
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
  .filter-table {
    .dialog-footer {
      text-align: right;
    }
  }
}
</style>
<script>
import Pagination from "@/components/Pagination"; // 分页
import { getUserList } from "@/api/user";
import { overall } from "@/constant/index"; // 服务 常用常量
import { Message } from "element-ui";
export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0, // 分页
      userId: "", // 户主ID 用来验证用户选择的住户里是否重复存在户主
      userIds: [], // 多选
      userNames: [],
      // 查询参数
      listQuery: {
        nickName: "",
        userName: "",
        pageNum: 1,
        pageSize: 10
      },
      // 平台标示选择
      options: overall.user.options,
      buttonLoading: false // 按钮加载请求
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
      //   this.listQuery.nickName = this.user.nickName;
      //   this.listQuery.userName = this.user.userName;
      this.userId = this.user.id;
      this.queryUser();
    } else {
      this.fetchData();
    }
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
    },
    checkboxChange(change) {
      if (!change) {
        this.userNames = [];
      }
      // 判断用户选择的住户里是否重复包含户主
      for (let j = 0; j < this.userIds.length; j++) {
        if (this.userIds[j] == this.userId) {
          this.userIds.splice(j, 1);
          Message({
            message: "你勾选的用户已经是户主了",
            type: "error",
            duration: 2 * 1000
          });
        }
        for (let i = 0; i < this.list.length; i++) {
          if (this.userIds[j] == this.list[i].id) {
            if (this.userNames.indexOf(this.list[i].nickName) < 0) {
              this.userNames.push(this.list[i].nickName);
              break;
            }
          }
        }
      }
    },
    // 添加家庭成员
    addUsers() {
      this.$emit("transmitUsers", this.userIds, this.userNames);
      this.close();
    },
    close() {
      this.$emit("close");
      this.userIds = [];
      this.userNames = [];
    }
  }
};
</script>