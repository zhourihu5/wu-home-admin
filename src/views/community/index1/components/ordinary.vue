<!-- 普通创建 -->
<template>
  <div class="ordinary">
    <el-form
      ref="ordinaryForm"
      :rules="rules"
      :model="ordinaryForm"
      label-position="right"
      label-width="100px"
      style="width: 90%"
    >
      <el-form-item :label="$t('form.communityName')" prop="name">
        <el-input
          v-model="ordinaryForm.name"
          :placeholder="$t('table.temp.community')"
          style=" width: 60%;"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.stage')" prop="stage">
        <el-select v-model="ordinaryForm.stage" placeholder="请选择" size="small">
          <el-option
            v-for="item in stageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('form.myArea')" prop="myArea">
        <el-select v-model="ordinaryForm.myArea" placeholder="请选择" size="small">
          <el-option
            v-for="item in stageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('form.floor')" prop="floor">
        <el-select v-model="ordinaryForm.floor" placeholder="请选择" size="small">
          <el-option
            v-for="item in floorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('form.unit')" prop="unit">
        <el-select v-model="ordinaryForm.unit" placeholder="请选择" size="small">
          <el-option
            v-for="item in stageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('form.layer')" prop="layer">
        <el-select v-model="ordinaryForm.layer" placeholder="请选择" size="small">
          <el-option
            v-for="item in stageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('form.family')" prop="family">
        <el-select v-model="ordinaryForm.family" placeholder="请选择" size="small">
          <el-option
            v-for="item in stageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button @click="close">{{ $t('table.cancel') }}</el-button> -->
      <el-button
        type="primary"
        @click="createData"
        :loading="buttonLoading"
      >{{ $t('table.confirm') }}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      buttonLoading: false, // 按钮加载请求
      ordinaryForm: {
        name: "",
        stage: "2",
        myArea: "2",
        floor: "2",
        unit: "1",
        layer: "2",
        family: "2"
      }, // form表单提交信息
      rules: {}, // 验证方式
      stageOptions: [
        {
          value: "0",
          label: "无"
        },
        {
          value: "1",
          label: "一位"
        },
        {
          value: "2",
          label: "二位"
        }
      ],
      floorOptions: [
        {
          value: "1",
          label: "一位"
        },
        {
          value: "2",
          label: "二位"
        },
        {
          value: "3",
          label: "三位"
        }
      ]
    };
  },
  created() {
  },
  methods: {
    // 创建数据
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      console.log("创建数据");
      _this.buttonLoading = false; // 按钮加载中
    },
   
    // 关闭
    close() {
      console.log("子组件关闭");
      this.ordinaryForm = {
        name: "",
        stage: "2",
        myArea: "2",
        floor: "2",
        unit: "1",
        layer: "2",
        family: "2"
      };
      //   this.$emit("close");
    }
  }
};
</script>
<style lang="scss" scoped>
.ordinary {
  .dialog-footer {
    text-align: right;
    margin: 10px;
  }
}
</style>
<style lang="scss">
.ordinary {
  .el-form-item {
    margin-bottom: 2px !important;
  }
}
</style>