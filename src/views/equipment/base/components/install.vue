<template>
  <div class="install">
    <!-- search --->
    <div class="base-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddFamilyView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="base-table">
      <el-table
        v-loading="listLoading"
        :data="installList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.equipmentCoding')" width="315">
          <template
            slot-scope="scope"
          >{{ scope.row.deviceKey ? scope.row.deviceKey : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.installDate')" width="315">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.installDate ? scope.row.installDate : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.installer')" width="300">
          <template
            slot-scope="scope"
          >{{ scope.row.operator ? scope.row.operator : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.installaddres')" width="800">
          <template
            slot-scope="scope"
          >{{ scope.row.address ? scope.row.address : $t('table.noTime')}}</template>
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
    <div class="base--dialog">
      <el-dialog
        :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
        :visible.sync="dialogFormVisible"
        width="75%"
        @close="close"
      >
        <el-form
          ref="installForm"
          :rules="rules"
          :model="installForm"
          label-position="right"
          label-width="100px"
          style="width: 80%"
        >
          <el-form-item
            v-if="dialogStatus==='create'"
            :label="$t('form.installaddres')"
            prop="familyOptionsVal"
          >
            <el-cascader
              :props="areaProps"
              @change="handleAreaForm"
              v-model="installForm.areaOptionsVal"
              :placeholder="$t('table.temp.area')"
            ></el-cascader>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('point.addreCommunity')"
              placement="top"
            >
              <el-cascader
                :props="communitypProps"
                :options="installForm.communityOptions"
                v-model="installForm.communityFormOptionsVal"
                @change="handleCommunityForm"
                :placeholder="$t('table.temp.area')"
              ></el-cascader>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('point.communityFloor')"
              placement="top"
            >
              <el-cascader
                :props="floorProps"
                :options="installForm.floorOptions"
                v-model="installForm.floorOptionsVal"
                @change="handleFloorForm"
                :placeholder="$t('table.temp.floorName')"
              ></el-cascader>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('point.floorUnit')" placement="top">
              <el-cascader
                :props="unitProps"
                :options="installForm.unitOptions"
                v-model="installForm.unitOptionsVal"
                @change="handleUnitForm"
                :placeholder="$t('table.temp.unitChoice')"
              ></el-cascader>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('point.familyUnit')"
              placement="top"
            >
              <el-cascader
                :props="familyProps"
                :options="installForm.familyOptions"
                v-model="installForm.familyOptionsVal"
                :placeholder="$t('table.temp.familyChoice')"
              ></el-cascader>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('form.extensionCoding')" prop="buttonKey">
            <el-input
              class="my-input"
              v-model="installForm.buttonKey"
              :placeholder="$t('table.temp.equipmentCoding')"
            />
          </el-form-item>
          <el-form-item :label="$t('form.equipmentCoding')" prop="deviceKey">
            <el-input
              class="my-input"
              v-model="installForm.deviceKey"
              :placeholder="$t('table.temp.equipmentCoding')"
            />
          </el-form-item>
          <el-form-item :label="$t('form.installer')" prop="operator">
            <el-input
              class="my-input"
              v-model="installForm.operator"
              :placeholder="$t('table.temp.installer')"
            />
          </el-form-item>
          <el-form-item :label="$t('form.installDate')" prop="installDate">
            <el-date-picker
              v-model="installForm.installDate"
              type="datetime"
              :placeholder="$t('table.temp.date')"
            />
          </el-form-item>
          <el-form-item :label="$t('form.outDate')" prop="outDate">
            <el-date-picker
              v-model="installForm.outDate"
              type="datetime"
              :placeholder="$t('table.temp.date')"
            />
          </el-form-item>
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
.install {
  .base-container {
    margin-bottom: 20px;
    .el-cascader {
      margin-top: 5px;
    }
    .el-button--medium {
      margin-top: 5px;
    }
  }
  .base--dialog {
    .el-cascader {
      margin-top: 5px;
    }
    .el-button--medium {
      margin-top: 5px;
    }
    .my-input {
      width: 300px;
    }
  }
}
</style>
<script>
import { overall } from "@/constant/index";
import Pagination from "@/components/Pagination"; // 分页
import { getAreas } from "@/api/area";
import { generatePoint } from "@/utils/i18n";
import { addDevice, findDevice } from "@/api/equipment";
import {
  getCommuntityByArea,
  getFloorByCommuntity,
  getUnitByFloor,
  getFamilyAll
} from "@/api/community";
export default {
  components: { Pagination },
  data() {
    return {
      listLoading: true,
      buttonLoading: false, // 按钮加载请求
      installList: [],
      total: 0,
      type: overall.equipment.types, // 类型
      status: overall.equipment.status, // 状态
      flag: overall.equipment.flag, // 标识
      listQuery: {
        flag: overall.equipment.flag[0].value, // 底座
        status: overall.equipment.status[1].value, // 已安装
        pageNum: 1,
        pageSize: 10
      },
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      list: {},
      installForm: {
        buttonKey: "", // 分机编号
        deviceKey: "", // 设备编码
        familyId: 0, // 家庭
        id: 0,
        installDate: "", // 安装时间
        outDate: "", // 出库时间
        flag: overall.equipment.flag[0].value, // 底座
        status: overall.equipment.status[1].value, // 已安装
        type: overall.equipment.types[0].value, // 主机
        operator: "",
        areaOptionsVal: [],
        // 表单区域数据
        communityOptions: [],
        communityFormOptionsVal: [],
        // 楼宇数据
        floorOptions: [],
        floorOptionsVal: [],
        // 单元数据
        unitOptions: [],
        unitOptionsVal: [],
        // 家庭数据
        familyOptions: [],
        familyOptionsVal: []
      },
      rules: {
        familyOptionsVal: [
          {
            type: "array",
            required: true,
            trigger: "change",
            message: this.generatePoint("family")
          }
        ],
        deviceKey: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        operator: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        installDate: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        outDate: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ]
      },
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
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
      unitProps: {
        label: "num",
        value: "id"
      },
      familyProps: {
        label: "num",
        value: "id"
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    generatePoint,
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      findDevice(this.listQuery).then(function(res) {
        console.log("res -- >", res);
        _this.listLoading = false;
        _this.installList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 添加页面
    showAddFamilyView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 修改页面
    showEditFamilyView(row) {
      let _this = this;
      console.log(" row --- ", row);
    },
    // 监听区域查询社区 表单
    handleAreaForm(val) {
      this.getCommuntity(1, val[2]); // 查询社区
    },
    // 监听社区查询楼宇 表单
    handleCommunityForm(val) {
      this.getFloor(1, val[0]); // 查询楼宇
    },
    // 监听楼宇查询单元 表单
    handleFloorForm(val) {
      this.getUnit(1, val[0]); // 查询单元
    },
    // 监听单元查询家庭 表单
    handleUnitForm(val) {
      this.getFamily(1, val[0]); // 查询单元
    },
    // 更新社区
    getCommuntity(code, val) {
      let _this = this;
      console.log(2);
      _this.installForm.communityOptions = [];
      _this.installForm.floorOptions = [];
      getCommuntityByArea({ areaCode: val }).then(function(res) {
        switch (code) {
          case 0:
            _this.list.communityOptions = res.data; // 列表中 社区
            break;
          case 1:
            _this.installForm.communityOptions = res.data; // 表单中 社区
            break;
        }
      });
    },
    // 更新楼宇
    getFloor(code, val) {
      let _this = this;
      _this.installForm.floorOptions = [];
      getFloorByCommuntity({ communtityId: val }).then(function(res) {
        console.log("res --- >", res);
        switch (code) {
          case 0:
            _this.list.floorOptions = res.data; // 列表中 社区
            break;
          case 1:
            _this.installForm.floorOptions = res.data; // 表单中 社区
            break;
        }
      });
    },
    // 更新单元
    getUnit(code, val) {
      let _this = this;
      _this.installForm.unitOptions = [];
      getUnitByFloor({ floorId: val }).then(function(res) {
        console.log("res --- >", res);
        switch (code) {
          case 0:
            _this.list.unitOptions = res.data; // 列表中 社区
            break;
          case 1:
            _this.installForm.unitOptions = res.data; // 表单中 社区
            break;
        }
      });
    },
    // 更新家庭
    getFamily(code, val) {
      let _this = this;
      _this.installForm.familyOptions = [];
      getFamilyAll({ unitId: val }).then(function(res) {
        console.log("res --- >", res);
        switch (code) {
          case 0:
            _this.list.familyOptions = res.data.content; // 列表中 社区
            break;
          case 1:
            _this.installForm.familyOptions = res.data.content; // 表单中 社区
            break;
        }
      });
    },
    // 创建数据
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.installForm.validate(valid => {
        if (valid) {
          console.log(this.installForm);
          addDevice({
            deviceKey: this.installForm.deviceKey,
            buttonKey: this.installForm.buttonKey,
            familyId: this.installForm.familyOptionsVal[0],
            flag: this.installForm.flag,
            installDate: this.installForm.installDate,
            operator: this.installForm.operator,
            outDate: this.installForm.outDate,
            status: this.installForm.status,
            type: this.installForm.type
          }).then(function(res) {
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
    updateData() {},
    // 关闭弹窗
    close() {
      this.dialogFormVisible = false; // 关闭弹窗
      this.$refs.installForm.resetFields();
    }
  }
};
</script>