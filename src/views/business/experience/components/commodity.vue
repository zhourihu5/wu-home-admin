<template>
  <div class="commodity">
    <!-- search --->
    <div class="commodity-container">
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
        @click="queryCommodity"
      >{{ $t('table.search') }}</el-button>
    </div>
    <!-- table --->
    <div class="commodity-table">
      <el-table
        v-loading="listLoading"
        :data="communityList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">
            <el-checkbox
              v-model="labelStr"
              :label="scope.row.id"
              :key="scope.row.id"
              @change="checkboxChange"
            >{{scope.row.id}}</el-checkbox>
          </template>
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
            <i class="el-icon-time" />
            <span>{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="fetchData"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t('table.cancel') }}</el-button>
      <el-button type="primary" @click="addLabel" :loading="buttonLoading">{{ $t('table.confirm') }}</el-button>
    </div>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination"; // 分页
import { getCommuntityAll } from "@/api/community";
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {
        name: "",
        pageNum: 1,
        pageSize: 10
      },
      listLoading: false, // 列表加载
      communityList: [],
      total: 0, // 列表分页
      labelStr: [],
      labelName: [],
      buttonLoading: false, // 按钮加载请求
      checkboxItemArr: []
    };
  },
  //   props: {
  //     label: {
  //       type: String
  //     }
  //   },
  //   watch: {
  //     label: {
  //       handler: function(val, oldval) {
  //         console.log("jianting --- >", val, oldval, this.labelStr);
  //         if (val.indexOf(",") != -1) {
  //           let arr = val.split(",");
  //           for (let i = 0; i < arr.length; i++) {
  //             this.labelStr.push(arr[i]);
  //           }
  //         } else {
  //           this.labelStr.push(val);
  //         }
  //       }
  //     }
  //   },
  created() {
    // let _this = this;
    // console.log(" ---- >", this.label);
    // if (_this.label) {
    //   let labels = _this.label;
    //   for (let i = 0; i < labels.length; i++) {
    //     _this.labelStr.push(labels[i].id);
    //   }
    // } else {
    this.fetchData();
    // }
  },
  methods: {
    // 查询数据
    fetchData() {
      console.log("allala ", this.labelStr);
      let _this = this;
      _this.listLoading = true;
      // 查询
      getCommuntityAll(this.listQuery).then(function(res) {
        console.log("res --- >", res);
        _this.listLoading = false;
        _this.communityList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 查询
    queryCommodity() {
      this.fetchData();
    },
    checkboxChange(change) {
      if (!change) {
        this.labelName = [];
      }
      for (let j = 0; j < this.labelStr.length; j++) {
        for (let i = 0; i < this.communityList.length; i++) {
          if (this.labelStr[j] == this.communityList[i].id) {
            if (this.labelName.indexOf(this.communityList[i].name) < 0) {
              this.labelName.push(this.communityList[i].name);
              break;
            }
          }
        }
      }
    },
    // 添加
    addLabel() {
      console.log(this.labelStr, this.labelName);
      this.$emit(
        "transmitUser",
        this.labelStr.join(","),
        this.labelName.join("/")
      );
      this.close();
    },
    close() {
      this.$emit("close");
      this.labelStr = [];
      this.labelName = [];
    }
  }
};
</script>
<style lang="scss">
.commodity {
  padding: 20px;
  .dialog-footer {
    text-align: right;
  }
  .commodity-container {
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
    .el-date-editor .el-range-separator {
      padding: 0 !important;
    }
    .el-input {
      width: 70%;
    }
    .el-select > .el-input {
      width: 100% !important;
    }
  }
}
</style>