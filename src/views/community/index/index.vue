<template>
  <div class="community-index">
    <!-- search --->
    <div class="community-index-container">
      <el-cascader
        :props="areaProps"
        v-model="list.areaOptionsVal"
        :placeholder="$t('table.temp.area')"
      ></el-cascader>
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
        @click="queryCommunityIndex"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddIndexView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="community-table">
      <el-table
        v-loading="listLoading"
        :data="indexList"
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
        <el-table-column :label="$t('table.address')" width="360" align="center">
          <template
            slot-scope="scope"
          >{{ scope.row.address ? scope.row.address : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="created_at"
          :label="$t('table.createTime')"
          width="264"
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
              @click="showEditUserView(row)"
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
        @close="close"
      >
        <el-form
          ref="communityForm"
          :rules="rules"
          :model="communityForm"
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item :label="$t('form.area')" prop="areaOptionsVal">
            <el-cascader
              :props="areaProps"
              v-model="communityForm.areaOptionsVal"
              :options="options"
              :placeholder="$t('table.temp.area')"
            ></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('form.communityName')" prop="cname">
            <el-input v-model="communityForm.cname" :placeholder="$t('table.temp.community')"/>
          </el-form-item>
          <el-form-item :label="$t('form.address')" prop="address">
            <el-input v-model="communityForm.address" :placeholder="$t('table.temp.address')"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close">{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="dialogStatus==='create'?createData():updateData()"
          >{{ $t('table.confirm') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="scss">
.community-index {
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
}
</style>
<script>
import Pagination from "@/components/Pagination"; // 分页
import { getAreas } from "@/api/area";
import { generatePoint } from "@/utils/i18n";
import { addCommuntity, getCommuntityAll } from "@/api/community";
export default {
  components: { Pagination },
  data() {
    return {
      // 省市区
      areaProps: {
        label: "areaName",
        value: "id",
        children: "children",
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          switch (level) {
            case 0:
              getAreas().then(function(res) {
                resolve(res.data);
              });
              break;
            case 1:
              getAreas({ pid: node.value }).then(function(res) {
                resolve(res.data);
              });
              break;
            case 2:
              getAreas({ pid: node.value }).then(function(res) {
                for (let i = 0; i < res.data.length; i++) {
                  res.data[i].leaf = true;
                }
                resolve(res.data);
              });
              break;
          }
        }
      },
      areaProps1: {
        label: "areaName",
        value: "id",
        children: "children"
      },
      listQuery: {
        name: "",
        areaCode: "",
        pageNum: 1,
        pageSize: 10
      },
      list: {
        areaOptionsVal: []
      },
      communityForm: {
        cname: "", // 社区名称
        address: "", // 详细地址
        id: "",
        areaOptionsVal: []
      },
      indexList: [], // 列表数据
      total: 0,
      listLoading: true,
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      rules: {},
      options: [] // 用于数据回显
    };
  },
  created() {
    this.fetchData(); // 获取列表数据
  },
  methods: {
    generatePoint,
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getCommuntityAll(this.listQuery).then(function(res) {
        _this.listLoading = false;
        _this.indexList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 添加页面
    showAddIndexView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    showEditUserView(row) {
      let _this = this;
      console.log(row);
      // 回显数据
      Promise.all([
        getAreas(),
        getAreas({ pid: row.province }),
        getAreas({ pid: row.city })
      ]).then(function(res) {
        for (let i = 0; i < res[0].data.length; i++) {
          if (res[0].data[i].id == row.province) {
            res[0].data[i].children = [];
            for (let j = 0; j < res[1].data.length; j++) {
              if (res[1].data[j].id == row.city) {
                res[1].data[j].children = [];
                for (let k = 0; k < res[2].data.length; k++) {
                  res[2].data[k].leaf = true;
                  if (res[2].data[k].id == row.area) {
                    res[1].data[j].children = res[2].data;
                    res[0].data[i].children = res[1].data;
                    console.log(res[0].data[i]);
                  }
                }
              }
            }
          }
        }
        _this.options = res[0].data;
        _this.dialogFormVisible = true; // 展示弹窗
        _this.communityForm.cname = row.name;
        _this.communityForm.address = row.address;
        _this.communityForm.optionsVal = [];
        _this.communityForm.id = row.id;
        _this.communityForm.areaOptionsVal.push(row.province);
        _this.communityForm.areaOptionsVal.push(row.city);
        _this.communityForm.areaOptionsVal.push(row.area);
        _this.dialogStatus = "update"; // 标示创建
      });
    },
    // 查询
    queryCommunityIndex() {
      this.listQuery.areaCode = this.list.areaOptionsVal[2];
      console.log(this.listQuery);
      this.fetchData();
    },
    // 创建数据
    createData() {
      let _this = this;
      _this.$refs.communityForm.validate(valid => {
        if (valid) {
          // 保存
          addCommuntity({
            address: _this.communityForm.address,
            province: _this.communityForm.areaOptionsVal[0],
            city: _this.communityForm.areaOptionsVal[1],
            area: _this.communityForm.areaOptionsVal[2],
            name: _this.communityForm.cname
          }).then(function(res) {
            console.log("res--- >", res);
            if (res.message == "SUCCESS") {
              _this.dialogFormVisible = false; // 关闭弹窗
              _this.$notify({
                title: _this.generatePoint("notifySuccess.title"),
                message: _this.generatePoint("notifySuccess.message"),
                type: "success"
              });
            } else {
              _this.$message.error(_this.generatePoint("system"));
            }
            _this.fetchData(); // 更新列表
          });
        } else {
          return false;
        }
      });
    },
    updateData() {
      let _this = this;
      _this.$refs.communityForm.validate(valid => {
        if (valid) {
          console.log("_this.communityForm - ", _this.communityForm);
          console.log({
            address: _this.communityForm.address,
            province: _this.communityForm.areaOptionsVal[0],
            city: _this.communityForm.areaOptionsVal[1],
            area: _this.communityForm.areaOptionsVal[2],
            name: _this.communityForm.cname,
            id: _this.communityForm.id
          });
          // 修改
          addCommuntity({
            address: _this.communityForm.address,
            province: _this.communityForm.areaOptionsVal[0],
            city: _this.communityForm.areaOptionsVal[1],
            area: _this.communityForm.areaOptionsVal[2],
            name: _this.communityForm.cname,
            id: _this.communityForm.id
          }).then(function(res) {
            console.log("res--- >", res);
            if (res.message == "SUCCESS") {
              _this.dialogFormVisible = false; // 关闭弹窗
              _this.$notify({
                title: _this.generatePoint("notifySuccess.title"),
                message: _this.generatePoint("notifySuccess.message1"),
                type: "success"
              });
            } else {
              _this.$message.error(_this.generatePoint("system"));
            }
            _this.fetchData(); // 更新列表
          });
        } else {
          return false;
        }
      });
    },
    // 关闭弹窗
    close() {
      console.log(this.$refs, this.temp);
      this.dialogFormVisible = false; // 关闭弹窗
      this.$refs.communityForm.resetFields(); // 重置表单
      this.communityForm.cname = "";
      this.communityForm.address = "";
      this.communityForm.optionsVal = [];
    }
  }
};
</script>