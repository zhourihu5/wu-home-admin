<template>
  <div class="shop-user">
    <!-- search --->
    <div class="shop-user-container"></div>
    <!-- table --->
    <div class="shop-user-table">
      <el-table
        v-loading="listLoading"
        :data="businessList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">
            <el-radio
              v-model="userId"
              :label="scope.row.id"
              @change="userChange(scope.row)"
            >{{ scope.row.id }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column :label="$t('table.userName')" width="300" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.userName ? scope.row.userName : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.nickName')" width="317">
          <template
            slot-scope="scope"
          >{{ scope.row.nickName ? scope.row.nickName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.platform')" width="400" align="center">
          <template
            slot-scope="scope"
          >{{ scope.row.flag ? getFlagText(scope.row.flag) : $t('table.noTime')}}</template>
        </el-table-column>
        <!-- <el-table-column align="center" :label="$t('table.number')" width="300">
          <template slot-scope="scope">{{ scope.row.code ? scope.row.code : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.name')" width="300">
          <template slot-scope="scope">{{ scope.row.name ? scope.row.name : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.phone')" width="300">
          <template slot-scope="scope">{{ scope.row.phone ? scope.row.phone : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.joinTime')" width="300">
          <template
            slot-scope="scope"
          >{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.address')" width="530">
          <template
            slot-scope="scope"
          >{{ scope.row.address ? scope.row.address : $t('table.noTime')}}</template>
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
    </div>
  </div>
</template>
<script>
import { getShopUser } from "@/api/business";
import Pagination from "@/components/Pagination"; // 分页
import { overall } from "@/constant/index"; // 服务 常用常量
export default {
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      userId: "",
      businessList: [],
      queryDate: "",
      total: 0, // 分页
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      // 平台标示选择
      options: overall.user.options,
    };
  },
  props: {
    user: {
      type: Object
    }
  },
  created() {
    if (this.user) {
      this.listQuery.name = this.user.name;
      this.userId = this.user.id;
      this.queryBusiness();
    } else {
      this.fetchData();
    }
  },
  methods: {
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      // 获取数据
      getShopUser(this.listQuery).then(function(res) {
        console.log("res --- ", res);
        _this.listLoading = false;
        _this.businessList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 获取省市区数据 联动查询社区
    getProvinceVal(val, code) {
      let _this = this;
      getCommuntityByArea({ areaCode: val[2] }).then(function(res) {
        console.log("根据地区code 获取的社区数据 -- ", res);
        _this.communityOptions = res.data; // 列表中 社区
      });
    },
    // 搜索
    queryBusiness() {
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
    userChange(row) {
      this.$emit("transmitUser", row);
    }
  }
};
</script>