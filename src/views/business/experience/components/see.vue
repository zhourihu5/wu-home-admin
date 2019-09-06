<template>
  <div class="experience-see">
    <el-form
      ref="experienceForm"
      label-position="left"
      label-width="100px"
      style="width: 100%;margin: 0 auto;"
    >
      <el-form-item :label="$t('form.community')" prop="communityName">
        <div>{{ experienceForm.communityNames }}</div>
      </el-form-item>
      <el-form-item :label="$t('form.name')" prop="name">
        <div>{{ experienceForm.name }}</div>
      </el-form-item>
      <el-form-item :label="$t('form.validDate')" prop="validDate">
        <div>{{ dateFtt("yyyy-MM-dd hh:mm:ss", experienceForm.startDate) }} - {{ dateFtt("yyyy-MM-dd hh:mm:ss", experienceForm.endDate) }}</div>
      </el-form-item>
      <el-form-item :label="$t('form.banner')" prop="bannerFile">
        <div>
          <img class="my-img" :src="experienceForm.banner" alt="banner" />
        </div>
      </el-form-item>
      <el-form-item :label="$t('form.detailsImg')" prop="bannerFile">
        <div>
          <img class="my-img" :src="experienceForm.cover" alt="cover" />
        </div>
      </el-form-item>
      <!-- <el-form-item :label="$t('form.experienceImg')" prop="bannerFile">
        <img
          class="my-img"
          v-for="(itme, index) in experienceForm.experienceImgs"
          :key="index"
          :src="itme"
          alt="体验卷图"
        />
      </el-form-item>-->
      <el-form-item :label="$t('form.everyoneNumber')" prop="limitNum">
        <div>{{ experienceForm.limitNum }}</div>
      </el-form-item>
      <el-form-item :label="$t('form.experienceNum')" prop="count">
        <div>{{ experienceForm.count }}</div>
      </el-form-item>
      <el-form-item :label="$t('form.experienceCode')" prop="experienceCode">
        <el-card v-if="experienceForm.experienceCodes.length > 0" class="box-card">
          <div slot="header" class="clearfix">
            <span>活动体验卷code码</span>
          </div>
          <div
            v-for="(o, index) in experienceForm.experienceCodes"
            :key="index"
            class="text item"
          >{{'code：' + o }}</div>
        </el-card>
      </el-form-item>
      <el-form-item :label="$t('form.remarks')" prop="remark">
        <div
          v-html="experienceForm.rule"
          style="padding: 5px;border: 1px solid #dcdfe6;max-height: 300px;height: 300px;overflow: auto;"
        ></div>
      </el-form-item>
    </el-form>
    <!-- table -->
    <div class="experience-see-table">
      <div class="experience-see-title">
        <h3>领卷人列表</h3>
      </div>
      <div class="experience-see-optins">
        <el-button type="primary" @click="outExe">导出</el-button>
      </div>
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
        <el-table-column align="center" :label="$t('table.name')" width="245">
          <template>{{ experienceForm.name ? experienceForm.name : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.nameOfRecipient')" width="250">
          <template
            slot-scope="scope"
          >{{ scope.row.nickName ? scope.row.nickName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.phone')" width="250">
          <template
            slot-scope="scope"
          >{{ scope.row.userName ? scope.row.userName : $t('table.noTime')}}</template>
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
  </div>
</template>
<script>
import { dateFtt } from "@/utils/index"; // 分页
import { receiveUserList } from "@/api/experoemce/";
import Pagination from "@/components/Pagination"; // 分页
export default {
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      listQuery: {
        experienceId: "",
        pageNum: 1,
        pageSize: 10
      },
      experienceList: [],
      total: 0,
      excelData: [] // 导出的数据
    };
  },
  props: {
    experienceForm: {
      type: Object
    }
  },
  created() {
    if (this.experienceForm) {
      this.listQuery.experienceId = this.experienceForm.id;
      this.fetchData();
    } else {
      this.fetchData();
    }
  },
  watch: {
    "experienceForm.id": {
      handler: function(val, oldval) {
        if (val != "") {
          this.listQuery.experienceId = val;
          this.fetchData();
        }
      },
      deep: true
    }
  },
  methods: {
    dateFtt,
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      receiveUserList(this.listQuery).then(function(res) {
        console.log("查询体验卷领取人列表 === ", res);
        _this.listLoading = false;
        _this.experienceList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数Î
      });
    },
    getTypeText(type) {
      let text = "";
      this.typeOptions.forEach(function(v) {
        if (v.value == type) {
          text = v.label;
        }
      });
      return text;
    },
    emptySeeData() {
      console.log("清空查看页面");
      this.listQuery = {
        experienceId: "",
        pageNum: 1,
        pageSize: 10
      };
      this.experienceList = [];
      this.total = 0;
      this.excelData = []; // 导出的数据
    },
    outExe() {
      this.$confirm("此操作将导出excel文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let _this = this;
          // 构建导入数据
          _this.experienceList.forEach(function(v, i) {
            console.log("i", i, v)
            v.experienceId = _this.experienceForm.id;
            v.experienceName = _this.experienceForm.name;
          })
          _this.excelData =  _this.experienceList;
          _this.export2Excel();
        })
        .catch(() => {});
    },
    export2Excel() {
      var that = this;
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("./../../../../excel/Export2Excel"); //这里必须使用绝对路径
        const tHeader = ["体验卷ID", "体验卷名称", "优惠券code码", "领取人ID", "领取人昵称", "领取人联系方式", "创建时间", "完成时间", "最后修改时间"];
        const filterVal = ["experienceId", "experienceName", "experienceCode", "id", "nickName", "userName", "createDate", "finishDate", "updateDate"]; // 导出的表头名
        const list = that.excelData;
        const data = that.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, `提现管理excel`); // 导出的表格名称，根据需要自己命名
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};
</script>
<style lang="scss">
.experience-see {
  padding: 15px;
  border: 1px solid #dcdfe6;
  .experience-see-table {
    padding: 20px;
    .experience-see-title {
      display: inline-block;
      width: 49%;
    }
    .experience-see-optins {
      text-align: right;
      display: inline-block;
      width: 49%;
    }
  }
  .my-img {
    width: 146px;
    height: 146px;
  }
}
</style>