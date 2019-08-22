<template>
  <div class="label">
    <!-- search --->
    <!-- table --->
    <div class="label-table">
      <el-table
        v-loading="listLoading"
        :data="labelList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">
            <el-checkbox
              v-model="labelStr"
              :label="scope.row.lablesName"
              :key="scope.row.id"
            >{{scope.row.id}}</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.name')" width="536">
          <template
            slot-scope="scope"
          >{{ scope.row.lablesName ? scope.row.lablesName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.uploadTime')" width="536">
          <template
            slot-scope="scope"
          >{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</template>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="addLabel"
          :loading="buttonLoading"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.label {
  padding: 20px;
  .label-container {
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
  }
  .label-table {
    .dialog-footer {
      text-align: right;
    }
  }
}
</style>
<script>
import Pagination from "@/components/Pagination"; // 分页
import { generatePoint } from "@/utils/i18n";
import { getLablesAll, addLables } from "@/api/business";
export default {
  components: { Pagination },
  data() {
    return {
      // 查询参数
      listQuery: {
        // lablesName: "",
        pageNum: 1,
        pageSize: 10
      },
      listLoading: false, // 列表加载
      labelList: [],
      total: 0, // 列表分页
      labelForm: {
        lablesName: "", // 标签名称
        id: ""
      },
      labelStr: [],
      buttonLoading: false // 按钮加载请求
    };
  },
  props: {
    label: {
      type: String
    }
  },
  watch: {
    label: {
      handler: function(val, oldval) {
        console.log("jianting --- >", val, oldval);
        if (val.indexOf("|") != -1) {
          let arr = val.split("|");
          for (let i = 0; i < arr.length; i++) {
            this.labelStr.push(arr[i]);
          }
        } else {
          this.labelStr.push(val);
        }
      }
    }
  },
  created() {
    let _this = this;
    console.log(" ---- >", this.label);
    if (_this.label) {
      let labels = _this.label;
      for (let i = 0; i < labels.length; i++) {
        _this.labelStr.push(labels[i].id);
      }
    } else {
      _this.fetchData();
    }
  },
  methods: {
    generatePoint,
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getLablesAll(this.listQuery).then(function(res) {
        console.log("res --- ", res);
        _this.listLoading = false;
        _this.labelList = res.data.content;
        _this.total = res.data.totalPages;
      });
    },
    // 查询
    queryTabel() {
      console.log(" --- ", this.listQuery);
      this.fetchData();
    },
    // 添加
    addLabel() {
      console.log(1);
      if (this.labelStr.length > 3) {
        this.$message({
          message: "最多只可以选三个标签",
          type: "warning"
        });
      } else {
        this.$emit("transmitUser", this.labelStr.join("|"));
        this.close();
      }
    },
    close() {
      this.labelForm = {
        lablesName: "", // 标签名称
        id: ""
      };
      this.$emit("close");
      this.labelStr = [];
    }
  }
};
</script>
