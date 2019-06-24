<template>
  <div class="floor">
    <!-- search --->
    <div class="floor-container">
      <el-cascader
        :props="areaProps"
        v-model="list.areaOptionsVal"
        :placeholder="$t('table.temp.area')"
        @change="handleAreaList"
      ></el-cascader>
      <el-tooltip class="item" effect="dark" :content="$t('point.addreCommunity')" placement="top">
        <el-cascader
          :props="communitypProps"
          :options="list.communityOptions"
          v-model="list.communityOptionsVal"
          :placeholder="$t('table.temp.community')"
        ></el-cascader>
      </el-tooltip>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="queryFloor"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddFloorView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="floor-table">
      <el-table
        v-loading="listLoading"
        :data="florrList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column :label="$t('table.floorName')" width="371" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name ? scope.row.name : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.belongToCommunity')" width="400">
          <template
            slot-scope="scope"
          >{{ scope.row.communtityName ? scope.row.communtityName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="created_at"
          :label="$t('table.createTime')"
          width="400"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="403">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="mini"
              @click="showEditFloorView(row)"
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
    <div class="floor-dialog">
      <el-dialog
        :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
        :visible.sync="dialogFormVisible"
      >
        <el-form
          ref="floorForm"
          :rules="rules"
          :model="floorForm"
          label-position="left"
          label-width="100px"
          style="width: 500px; margin-left:50px;"
        >
          <el-form-item
            v-if="dialogStatus==='create'"
            :label="$t('form.area')"
            prop="areaOptionsVal"
          >
            <el-cascader
              :props="areaProps"
              v-model="floorForm.areaOptionsVal"
              :placeholder="$t('table.temp.area')"
              @change="handleAreaForm"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            v-if="dialogStatus==='create'"
            :label="$t('form.community')"
            prop="communityFormOptionsVal"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('point.addreCommunity')"
              placement="top"
            >
              <el-cascader
                :props="communitypProps"
                :options="floorForm.communityOptions"
                v-model="floorForm.communityFormOptionsVal"
                :placeholder="$t('table.temp.area')"
              ></el-cascader>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('form.floorName')" prop="cname">
            <el-input v-model="floorForm.cname" :placeholder="$t('table.temp.floorName')"/>
          </el-form-item>
          <el-form-item></el-form-item>
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
.floor {
  padding: 20px;
  .floor-container {
    margin-bottom: 20px;
    .el-cascader {
      margin-top: 5px;
    }
    .el-button--medium {
      margin-top: 5px;
    }
  }
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
<script>
import Pagination from "@/components/Pagination"; // 分页
import { getAreas } from "@/api/area";
import { generatePoint } from "@/utils/i18n";
import { addFloor, getFloorAll } from "@/api/community";
import {
  addCommuntity,
  getCommuntityAll,
  getCommuntityByArea
} from "@/api/community";
export default {
  components: { Pagination },
  data() {
    return {
      communityFormOptions: [], // form表单中的区域
      listLoading: true,
      florrList: [], // 列表数据
      total: 0, // 分页
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
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
      communitypProps: {
        label: "name",
        value: "id"
      },
      // 查询条件
      listQuery: {
        communtityId: "", // 社区名称
        pageNum: 1,
        pageSize: 10
      },
      // 列表 多选项
      list: {
        // 列表省市区数据
        areaOptionsVal: [],
        // 列表区域数据
        communityOptions: [],
        communityOptionsVal: []
      },
      // 表单数据
      floorForm: {
        cname: "", // 社区名称
        id: "",
        // 列表省市区数据
        areaOptionsVal: [],
        // 列表区域数据
        communityOptions: [],
        communityOptionsVal: []
      },
      //表单验证规则
      rules: {
        cname: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("communityName")
          }
        ],
        areaOptionsVal: [
          {
            type: "array",
            required: true,
            trigger: "change",
            message: this.generatePoint("address")
          }
        ],
        communityFormOptionsVal: [
          {
            type: "array",
            required: true,
            trigger: "change",
            message: this.generatePoint("addre")
          }
        ]
      }
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
      getFloorAll(this.listQuery).then(function(res) {
        console.log("res --- ", res);
        _this.listLoading = false;
        _this.florrList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 监听区域查询社区 列表
    handleAreaList(val) {
      this.getCommuntity(0, val[2]); // 查询社区
    },
    // 监听区域查询社区 表单
    handleAreaForm(val) {
      this.getCommuntity(1, val[2]); // 查询社区
    },
    getCommuntity(code, val) {
      let _this = this;
      _this.list.communityOptions = [];
      _this.floorForm.communityOptions = [];
      _this.list.communityOptionsVal = "";
      getCommuntityByArea({ areaCode: val }).then(function(res) {
        switch (code) {
          case 0:
            _this.list.communityOptions = res.data; // 列表中 社区
            break;
          case 1:
            _this.floorForm.communityOptions = res.data; // 表单中 社区
            break;
          default:
        }
      });
    },
    // 查询楼
    queryFloor() {
      let _this = this;
      if (_this.list.communityOptionsVal.length > 0) {
        _this.listQuery.communtityId = _this.list.communityOptionsVal[0];
        _this.fetchData();
      } else {
        this.$notify({
          dangerouslyUseHTMLString: true,
          title: "提示",
          message: "1. " + _this.generatePoint("community"),
          type: "warning"
        });
      }
    },
    // 显示添加
    showAddFloorView() {
      console.log(this.floorForm);
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
      //   this.initTemp();
    },
    // 显示编辑页面
    showEditFloorView(row) {
      let _this = this;
      console.log(" row --- ", row);
      Promise.all([
        getAreas({ pid: row.province }),
        getAreas({ pid: row.city })
      ]).then(function(res) {
        _this.floorForm.cname = row.name;
        _this.floorForm.id = row.id;
        _this.floorForm.communityOptionsVal.push(row.communtityId);
        _this.dialogStatus = "update"; // 标示创建
        _this.dialogFormVisible = true; // 展示弹窗
      });
    },
    // 创建数据
    createData() {
      let _this = this;
      _this.$refs.floorForm.validate(valid => {
        if (valid) {
          console.log(_this.floorForm);
          // 构建参数
          addFloor({
            communtityId: _this.floorForm.communityFormOptionsVal[0],
            name: _this.floorForm.cname
          }).then(function(res) {
            console.log(res);
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
      _this.$refs.floorForm.validate(valid => {
        if (valid) {
          // 修改
          addFloor({
            communtityId: _this.floorForm.communityOptionsVal[0],
            id: _this.floorForm.id,
            name: _this.floorForm.cname
          }).then(function(res) {
            console.log(res);
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
      this.dialogFormVisible = false; // 关闭弹窗
      this.$refs.floorForm.resetFields();
      this.floorForm.areaOptionsVal = []; // 清空区域已选择
      this.floorForm.communityFormOptionsVal = []; // 清空社区已选择
      this.floorForm.cname = "";
    }
  }
};
</script>
