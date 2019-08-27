<template>
  <div class="issued">
    <!-- search --->
    <div class="issued-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="showAddView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="issued-table">
      <el-table
        v-loading="listLoading"
        :data="issuedList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.name')" width="200">
          <template
            slot-scope="scope"
          >{{ scope.row.applyName ? scope.row.applyName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.type')" width="200">
          <template slot-scope="scope">{{ scope.row.type ? scope.row.type : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.denomination')" width="200">
          <template
            slot-scope="scope"
          >{{ scope.row.denomination ? scope.row.denomination : $t('table.noTime')}}</template>
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
        <el-table-column align="center" :label="$t('table.validDate')" width="350">
          <template
            slot-scope="scope"
          >{{ scope.row.validDate ? scope.row.validDate : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="330">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="showEditView(row)">{{ $t('table.edit') }}</el-button>
            <el-button type="danger" size="mini" @click="deleteData(row)">{{ $t('table.delete') }}</el-button>
            <el-button type="danger" size="mini" @click="grantData(row)">{{ $t('table.grant') }}</el-button>
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
      @close="close"
    >
      <el-form
        ref="issuedForm"
        :rules="rules"
        :model="issuedForm"
        label-position="right"
        label-width="100px"
        style="width: 80%"
      >
        <el-form-item :label="$t('table.type')" prop="communityId">
          <el-select v-model="issuedForm.type" placeholder="请选择" @change="typeFormChange">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <template v-if="issuedForm.type == 1">
          <el-form-item :label="$t('form.name')" prop="name">
            <el-input v-model="issuedForm.name" :placeholder="$t('table.temp.content')" />
          </el-form-item>
          <el-form-item :label="$t('form.denomination')" prop="money">
            <el-input v-model="issuedForm.money" :placeholder="$t('table.temp.content')" />
          </el-form-item>
          <el-form-item :label="$t('form.blacklist')" prop="blacklist">
            <upload-excel @getExcel="getExcelData"></upload-excel>
          </el-form-item>
          <el-form-item :label="$t('form.everyoneNumber')" prop="everyoneNum">
            <el-input v-model="issuedForm.everyoneNum" :placeholder="$t('table.temp.content')" />
          </el-form-item>
          <el-form-item :label="$t('form.threshold')" prop="everyoneNum">
            <!-- <el-input v-model="issuedForm.limit" :placeholder="$t('table.temp.content')" /> -->
            <el-radio v-model="issuedForm.limit" label="1">无限制</el-radio>
            <el-radio v-model="issuedForm.limit" label="2">有限制</el-radio>
          </el-form-item>
          <el-form-item :label="$t('form.validDate')" prop="everyoneNum">
            <el-date-picker
              v-model="queryDate"
              type="daterange"
              range-separator="至"
              :start-placeholder="$t('form.startTime')"
              :end-placeholder="$t('form.endTime')"
            ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item :label="$t('form.AvailableGoods')" prop="everyoneNum">
            <el-input v-model="issuedForm.activityId" :placeholder="$t('table.temp.content')" />
          </el-form-item>-->
        </template>
        <template v-if="issuedForm.type == 2">活动优惠券菜单</template>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination"; // 分页
import UploadExcel from "@/components/UploadExcel";
export default {
  components: { Pagination, UploadExcel },
  data() {
    return {
      listLoading: false, // 列表加载
      issuedList: [],
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      issuedForm: {
        type: "", // 优惠券类型
        name: "", // 优惠券名称
        money: "", // 面额
        blacklist: null, // 黑名单
        everyoneNum: "", // 没人发放张数
        limit: "", // 使用门槛 0无限制、其他的都是现在消费多少金融后可使用
        startDate: "",
        endDate: ""
      },
      queryDate: "",
      rules: {},
      typeOptions: [
        {
          value: "1",
          label: "平台优惠券"
        },
        {
          value: "2",
          label: "活动优惠券"
        }
      ],
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false // 是否展示dialog内容
    };
  },
  watch: {
    queryDate: {
      handler: function(val, oldval) {
        console.log(val, oldval);
        this.listQuery.startDate = val[0];
        this.listQuery.endDate = val[1];
      }
    }
  },
  methods: {
    // 查询数据
    fetchData() {},
    // 显示编辑页面
    showEditView() {},
    // 显示添加页面
    showAddView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 删除
    deleteData() {},
    // 发放数据
    grantData() {},
    // 查询
    queryData() {
      console.log("_this.listQuery  ", this.listQuery);
      this.fetchData();
    },
    // 类型选择
    typeFormChange(id) {
      console.log("id", id);
    },
    // 获取Excel组件中的数据
    getExcelData(data) {
      console.log("data --- >", data);
      // for(let i = 0; )
    },
    close() {
      this.dialogFormVisible = false;
      this.issuedForm = {};
      //   this.$refs.issuedForm.resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.issued {
  animation: mymove 0.5s ease-in;
  -webkit-animation: mymove 0.5s ease-in; /*Safari and Chrome*/
  padding: 20px;
  .issued-container {
    margin-bottom: 20px;
    text-align: right;
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