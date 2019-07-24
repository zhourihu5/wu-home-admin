<template>
  <div class="add-stage">
    <!-- form --->
    <h3>{{ $t('steps.stage') }}</h3>
    <div class="stage-form">
      <el-form
        ref="stageForm"
        :rules="rules"
        :model="stageForm"
        label-position="right"
        label-width="100px"
        style="width: 60%"
        class="my-form"
      >
        <el-form-item :label="$t('form.name')" prop="name">
          <el-input
            style="width: 60%;"
            v-model="stageForm.name"
            :placeholder="$t('table.temp.name')"
            :clearable="true"
            @clear="inputClear"
            @keyup.enter.native="createData"
          />
          <el-button
            :loading="buttonLoading"
            @click="createData"
          >{{ dialogStatus==='create' ? $t('table.add'):$t('table.update')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="stage-table">
      <!-- <h3>({{cacheData.community ? cacheData.community.name : 'xxx'}} 社区) 期列表</h3> -->
      <div class="my-list" v-loading="listLoading">
        <div v-if="listTags.length == 0" class="not-date">
          <p>{{ $t('table.noData') }}</p>
        </div>
        <div v-else>
          <el-button
            v-for="(item, index) in listTags"
            :key="index"
            type="primary"
            size="medium"
            @click="updateItem(item)"
          >{{item.name}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.add-stage {
  padding: 10px 50px 10px 50px;
  h3 {
    text-align: center;
    margin-bottom: 30px;
  }
  .stage-form {
    .my-form {
      margin: 0 auto;
    }
  }
  .stage-table {
    h3 {
      color: #409eff;
      font-size: 15px;
      text-align: center;
    }
    .my-list {
      // height: 410px;
      overflow: auto;
      margin: 0 30px 0 30px;
      .el-button--medium {
        margin: 10px !important;
      }
      .not-date {
        font-size: 14px;
        text-align: center;
        margin-top: 150px;
        color: #909399;
      }
    }
  }
}
</style>
<style>
</style>

<script>
import { generatePoint } from "@/utils/i18n";
import {
  getStageByCommuntity,
  addStage,
  getCommuntityById
} from "@/api/community";
export default {
  data() {
    return {
      listTags: [],
      listLoading: false,
      buttonLoading: false,
      community: null, // 社区对象
      stageForm: {
        id: "",
        name: "", // 名称
        code: ""
      },
      rules: {
        name: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ]
      },
      dialogStatus: "create" // 标示当前操作是添加、还是修改
    };
  },
  created() {
    console.log("添加期页面接收到的社区ID --- >--- ", this.communityId);
    let _this = this;
    if (_this.communityId) {
      // 查询社区
      getCommuntityById({ id: this.communityId }).then(function(res) {
        _this.community = res.data;
        _this.fetchData(); // 查询数据
      });
    }
  },
  props: {
    communityId: String
  },
  methods: {
    generatePoint,
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getStageByCommuntity({ commCode: _this.community.code }).then(function(
        res
      ) {
        _this.listLoading = false;
        _this.listTags = res.data; // 列表数据
      });
    },
    // 创建数据
    createData() {
      let _this = this;
      _this.$refs.stageForm.validate(valid => {
        if (valid) {
          _this.buttonLoading = true; // 按钮加载中
          try {
            // 参数
            let params = {
              communtityId: _this.community.id,
              name: _this.stageForm.name
            };
            // 修改
            if (this.dialogStatus == "update") {
              params.id = _this.stageForm.id;
              params.code = _this.stageForm.code;
            }
            addStage(params).then(function(res) {
              if (res.message == "SUCCESS") {
                _this.$notify({
                  title: _this.generatePoint("notifySuccess.title"),
                  message: _this.generatePoint("notifySuccess.message"),
                  type: "success"
                });
                _this.fetchData(); // 刷新列表
              } else {
                _this.$message.error(_this.generatePoint("system"));
              }
              _this.buttonLoading = false; // 清楚加载中
            });
          } catch (err) {
            console.error("err --- ", err); // 控制台打印异常
            _this.buttonLoading = false; // 清楚加载中
            _this.$message.error(_this.generatePoint("system"));
          }
        } else {
          _this.$emit("initButtonLoading"); // 清楚加载中
          return false;
        }
      });
    },
    // 修改
    updateItem(item) {
      console.log("item --- ", item);
      this.dialogStatus = "update";
      this.stageForm.name = item.name;
      this.stageForm.id = item.id;
      this.stageForm.code = item.code;
    },
    // 恢复添加
    inputClear() {
      this.dialogStatus = "create";
      this.stageForm.name = "";
      this.stageForm.id = "";
      this.stageForm.code = "";
      this.$refs.stageForm.resetFields(); // 重置表单
    },
    // 恢复初始化数据
    initialization() {
      this.stageForm = {
        id: "",
        name: "", // 名称
        code: ""
      };
      this.community = null;
      this.listTags = [];
      this.dialogStatus = "create";
    }
  }
};
</script>