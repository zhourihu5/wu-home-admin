<template>
  <div class="system">
    <!-- search --->
    <div class="system-container">
      <el-input
        v-model="listQuery.title"
        :placeholder="$t('table.temp.community')"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="querySystemNews"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddSystemView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="system-table">
      <el-table
        v-loading="listLoading"
        :data="systemNewsList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.title')" width="500">
          <template slot-scope="scope">{{ scope.row.title ? scope.row.title : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column :label="$t('table.type')" width="500" align="center">
          <template
            slot-scope="scope"
          >{{ scope.row.type != null ? getTypeText(scope.row.type) : $t('table.noTime')}}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.deliveryTime')" width="574">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.createDate ? scope.row.createDate : $t('table.noTime')}}</span>
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
        ref="systemForm"
        :rules="rules"
        :model="systemForm"
        label-position="right"
        label-width="100px"
        style="width: 80%"
      >
        <el-form-item :label="$t('form.title')" prop="title">
          <el-input style="width: 60%;" v-model="systemForm.title" :placeholder="$t('table.temp.title')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.type')" prop="type">
          <el-select v-model="systemForm.type" :placeholder="$t('table.temp.modular')">
            <el-option v-for="item in type" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('form.area')" prop="areaOptionsVal">
          <el-cascader
            :props="areaProps"
            @change="handleAreaForm"
            v-model="systemForm.areaOptionsVal"
            :placeholder="$t('table.temp.area')"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('form.community')" prop="communtity">
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('point.addreCommunity')"
            placement="top"
          >
            <el-transfer
              v-model="systemForm.communtity"
              :titles="[$t('form.unchecked'), $t('form.select')]"
              :button-texts="[$t('table.delete'), $t('table.add')]"
              :data="data"
              @change="handleChange"
            ></el-transfer>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="$t('form.content')" prop="content">
          <!-- <wangeditor ref="wangeditor"></wangeditor> -->
          <el-input
            type="textarea"
            :placeholder="$t('placeholder.textarea')"
            :maxlength="textareaMaxLength"
            show-word-limit
            resize="none"
            v-model="systemForm.content"
            @input="onChange"
            rows=5
          ></el-input>
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
</template>
<style lang="scss">
.system {
  padding: 20px;
  .el-textarea {
    height: 100%;
    width: 100%;
    textarea {
      height: 100%;
    }
  }
  .el-transfer {
    margin: 20px 0 0 0;
  }
  .system-container {
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
import { getMessageAll, pushMessage } from "@/api/message";
import { generatePoint } from "@/utils/i18n";
import { overall } from "@/constant/index";
import wangeditor from "@/components/Wangeditor/index";
import { getAreas } from "@/api/area";
import { getCommuntityByArea } from "@/api/community";
export default {
  components: { Pagination, wangeditor },
  data() {
    return {
      data: [], // 穿梭框数据
      listLoading: true,
      buttonLoading: false, // 按钮加载请求
      systemNewsList: [], // 列表数据
      textareaMaxLength: 120, // textarea可输入的长度
      textareaLength: 120, // textarea 已经输入的长度
      total: 0,
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      dialogStatus: "", // 标示当前操作是添加、还是修改
      dialogFormVisible: false, // 是否展示dialog内容
      listQuery: {
        title: "",
        pageNum: 1,
        pageSize: 10
      },
      systemForm: {
        title: "",
        type: "",
        content: "",
        communtity: [],
        areaOptionsVal: [] // 三级联动数据
      },
      rules: {
        title: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        type: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        content: [
          {
            required: true,
            trigger: "change",
            // validator: this.validateContent
            message: this.generatePoint("required")
          }
        ],
        areaOptionsVal: [
          {
            type: "array",
            required: true,
            trigger: "change",
            // validator: this.validateareaOptionsVal
            message: this.generatePoint("required")
          }
        ],
        communtity: [
          {
            type: "array",
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ]
      },
      type: overall.message.type,
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
      }

      // areaOptionsVal: []
    };
  },
  created() {
    console.log(this.type);
    this.fetchData();
  },
  methods: {
    generatePoint,
    handleChange(value, direction, movedKeys) {
      console.log(" -- ", this.value);
      console.log(value, direction, movedKeys);
    },
    validateContent(rule, value, callback) {
      if (!this.$refs.wangeditor.getContentText()) {
        callback(new Error(this.generatePoint("required")));
      } else {
        callback();
      }
    },
    // 更新 textarea 可输入的值
    onChange(value) {
      this.updateTextareaLength(value);
    },
    updateTextareaLength(value) {
      this.textareaLength = this.textareaMaxLength - value.length;
    },
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getMessageAll(this.listQuery).then(function(res) {
        console.log("列表  -", res);
        _this.listLoading = false;
        _this.systemNewsList = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 获取类型 type 文本
    getTypeText(flag) {
      let text = "";
      this.type.forEach(function(v) {
        if (v.value == flag.toString()) {
          text = v.label;
        }
      });
      return text;
    },

    querySystemNews() {
      this.fetchData();
    },
    showAddSystemView() {
      this.dialogStatus = "create"; // 标示创建
      this.dialogFormVisible = true; // 展示弹窗
    },
    // 监听区域查询社区 表单
    handleAreaForm(val) {
      this.getCommuntity(1, val[2]); // 查询社区
    },
    // 更新社区
    getCommuntity(code, val) {
      let _this = this;
      getCommuntityByArea({ areaCode: val }).then(function(res) {
        let newData = [];
        res.data.forEach(function(v) {
          newData.push({
            label: v.name,
            key: v.id,
            pinyin: v.name
          });
        });
        _this.data = newData;
      });
    },
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.systemForm.validate(valid => {
        if (valid) {
          // _this.systemForm.content = this.$refs.wangeditor.getContentHtml(); // 获取html格式
          console.log(_this.systemForm);
          pushMessage({
            communtity: _this.systemForm.communtity.join(","),
            content: _this.systemForm.content,
            title: _this.systemForm.title,
            type: _this.systemForm.type
          }).then(function(res) {
            _this.dialogFormVisible = false; // 关闭弹窗
            _this.buttonLoading = false; // 清楚加载中
            if (res.message == "SUCCESS") {
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
    close() {
      console.log("关闭");
      this.systemForm = {
        title: "",
        type: "",
        content: "",
        communtity: [],
        areaOptionsVal: [] // 清空省市区
      };
      this.data = []; // 清空穿梭框
      // this.$refs.wangeditor.initContent(); // 重置富文本内容
      this.$refs.systemForm.resetFields();
      this.dialogFormVisible = false;
    }
  }
};
</script>
