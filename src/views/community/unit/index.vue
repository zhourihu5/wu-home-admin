<template>
  <div class="unit">
    <!-- search --->
    <div class="unit-container">
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
          @change="handleCommunityList"
          v-model="list.communityOptionsVal"
          :placeholder="$t('table.temp.communityChoice')"
        ></el-cascader>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="$t('point.communityFloor')" placement="top">
        <el-cascader
          :props="floorProps"
          :options="list.floorOptions"
          v-model="list.floorOptionsVal"
          :placeholder="$t('table.temp.floorName')"
        ></el-cascader>
      </el-tooltip>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="queryUnit"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddUnitView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="floor-table">
      <el-table
        v-loading="listLoading"
        :data="unitList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column :label="$t('table.unitName')" width="355" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.num ? scope.row.num : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.belongToFloor')" width="355">
          <template
            slot-scope="scope"
          >{{ scope.row.floorName ? scope.row.floorName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.belongToCommunity')" width="355">
          <template
            slot-scope="scope"
          >{{ scope.row.communtityName ? scope.row.communtityName : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="created_at"
          :label="$t('table.createTime')"
          width="355"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="310">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="mini"
              @click="showEditUnitView(row)"
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
          ref="unitForm"
          :rules="rules"
          :model="unitForm"
          label-position="right"
          label-width="100px"
          style="width: 60%"
        >
          <el-form-item
            v-if="dialogStatus==='create'"
            :label="$t('form.area')"
            prop="areaOptionsVal"
          >
            <el-cascader
              :props="areaProps"
              @change="handleAreaForm"
              v-model="unitForm.areaOptionsVal"
              :placeholder="$t('table.temp.area')"
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
                :options="unitForm.communityOptions"
                v-model="unitForm.communityFormOptionsVal"
                @change="handleCommunityForm"
                :placeholder="$t('table.temp.area')"
              ></el-cascader>
            </el-tooltip>
          </el-form-item>
          <el-form-item
            v-if="dialogStatus==='create'"
            :label="$t('form.floor')"
            prop="floorOptionsVal"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('point.communityFloor')"
              placement="top"
            >
              <el-cascader
                :props="floorProps"
                :options="unitForm.floorOptions"
                v-model="unitForm.floorOptionsVal"
                :placeholder="$t('table.temp.floorName')"
              ></el-cascader>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('form.unitName')" prop="cname">
            <el-input v-model="unitForm.cname" :placeholder="$t('table.temp.unitName')"/>
          </el-form-item>
          <el-form-item></el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close">{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="dialogStatus==='create'?createData():updateData()"
            :loading="buttonLoading"
          >{{ $t('table.confirm') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="scss">
.unit {
  padding: 20px;
  .unit-container {
    margin-bottom: 20px;
    .el-cascader {
      margin-top: 5px;
    }
    .el-button--medium {
      margin-top: 5px;
    }
  }
}
</style>

<script>
import Pagination from "@/components/Pagination"; // 分页
import { getAreas } from "@/api/area";
import { getFloorByCommuntity, addUnit, getUnitAll } from "@/api/community";
import { generatePoint } from "@/utils/i18n";
import {
  addCommuntity,
  getCommuntityAll,
  getCommuntityByArea
} from "@/api/community";
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
      communitypProps: {
        label: "name",
        value: "id"
      },
      floorProps: {
        label: "name",
        value: "id"
      },
      listLoading: true,
      buttonLoading: false, // 按钮加载请求
      unitList: [], // 单元列表数据
      total: 0, // 分页
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      // 查询条件
      listQuery: {
        floorId: "", // 社区名称
        pageNum: 1,
        pageSize: 10
      },
      // 列表 多选项
      list: {
        // 列表省市区数据
        areaOptionsVal: [], // 省市区 选中的
        // 列表区域数据
        communityOptions: [],
        communityOptionsVal: [],
        // 楼宇数据
        floorOptions: [],
        floorOptionsVal: []
      },
      // 表单数据
      unitForm: {
        cname: "", // 社区名称
        id: "",
        floorId: "",
        // 表单区域数据
        communityOptions: [],
        // 楼宇数据
        floorOptions: []
      },
      //表单验证规则
      rules: {
        cname: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("unitName")
          }
        ],
        areaOptionsVal: [
          {
            type: "array",
            required: true,
            trigger: "change",
            message: this.generatePoint("addre")
          }
        ],
        communityFormOptionsVal: [
          {
            type: "array",
            required: true,
            trigger: "change",
            message: this.generatePoint("community")
          }
        ],
        floorOptionsVal: [
          {
            type: "array",
            required: true,
            trigger: "change",
            message: this.generatePoint("floor")
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
      getUnitAll(this.listQuery).then(function(res) {
        console.log("res -- >", res);
        _this.listLoading = false;
        _this.unitList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
        console.log(_this.total);
      });
    },
    // 查询单元
    queryUnit() {
      let _this = this;
      if (
        _this.list.communityOptionsVal.length > 0 &&
        _this.list.floorOptionsVal.length > 0
      ) {
        _this.listQuery.floorId = _this.list.floorOptionsVal[0];
        _this.fetchData();
      } else {
        this.$notify({
          dangerouslyUseHTMLString: true,
          title: "提示",
          message:
            "1. " +
            _this.generatePoint("retrieval") +
            _this.generatePoint("community") +
            "<br/>" +
            "2. " +
            _this.generatePoint("retrieval") +
            _this.generatePoint("floor"),
          type: "warning"
        });
      }
    },
    // 显示添加 页面
    showAddUnitView() {
      console.log(this.unitForm);
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 显示编辑页面
    showEditUnitView(row) {
      let _this = this;
      console.log(row);
      _this.unitForm.cname = row.num;
      _this.unitForm.id = row.id;
      _this.unitForm.floorId = row.floorId;
      _this.dialogStatus = "update"; // 标示创建
      _this.dialogFormVisible = true; // 展示弹窗
    },
    // 监听区域查询社区 列表
    handleAreaList(val) {
      this.getCommuntity(0, val[2]); // 查询社区
    },
    // 监听社区查询楼宇 列表
    handleCommunityList(val) {
      this.getFloor(0, val[0]); // 查询楼宇
    },
    // 监听区域查询社区 表单
    handleAreaForm(val) {
      this.getCommuntity(1, val[2]); // 查询社区
    },
    // 监听社区查询楼宇 表单
    handleCommunityForm(val) {
      this.getFloor(1, val[0]); // 查询楼宇
    },
    // 更新社区
    getCommuntity(code, val) {
      let _this = this;
      console.log(2);
      _this.list.communityOptions = [];
      _this.unitForm.communityOptions = [];
      _this.list.floorOptions = [];
      _this.unitForm.floorOptions = [];
      _this.list.communityOptionsVal = "";
      _this.list.floorOptionsVal = "";
      getCommuntityByArea({ areaCode: val }).then(function(res) {
        switch (code) {
          case 0:
            _this.list.communityOptions = res.data; // 列表中 社区
            break;
          case 1:
            _this.unitForm.communityOptions = res.data; // 表单中 社区
            break;
          default:
        }
      });
    },
    // 更新楼
    getFloor(code, val) {
      let _this = this;
      _this.list.floorOptions = [];
      _this.unitForm.floorOptions = [];
      getFloorByCommuntity({ communtityId: val }).then(function(res) {
        console.log("res --- >", res);
        switch (code) {
          case 0:
            _this.list.floorOptions = res.data; // 列表中 社区
            break;
          case 1:
            _this.unitForm.floorOptions = res.data; // 表单中 社区
            break;
          default:
        }
      });
    },
    // 创建数据
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.unitForm.validate(valid => {
        if (valid) {
          addUnit({
            floorId: _this.unitForm.floorOptionsVal[0],
            num: _this.unitForm.cname
          }).then(function(res) {
            console.log("res --- >", res);
             _this.buttonLoading = false; // 清楚加载中
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
           _this.buttonLoading = false; // 清楚加载中
          return false;
        }
      });
    },
    // 修改数据
    updateData() {
      let _this = this;
       _this.buttonLoading = true; // 按钮加载中
      _this.$refs.unitForm.validate(valid => {
        if (valid) {
          console.log(_this.floorForm);
          // 构建参数
          addUnit({
            id: _this.unitForm.id,
            num: _this.unitForm.cname,
            floorId: _this.unitForm.floorId
          }).then(function(res) {
             _this.buttonLoading = false; // 清楚加载中
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
           _this.buttonLoading = false; // 清楚加载中
          return false;
        }
      });
    },
    // 关闭弹窗
    close() {
      this.dialogFormVisible = false; // 关闭弹窗
      this.$refs.unitForm.resetFields();
      this.unitForm.areaOptionsVal = []; // 清空区域已选择
      //   this.unitForm.communityFormOptionsVal = []; // 清空社区已选择
      this.unitForm.num = "";
      this.unitForm.floorId = "";
      this.unitForm.id = "";
    }
  }
};
</script>
