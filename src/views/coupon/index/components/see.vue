<template>
  <div class="sess">
    <!-- <div>{{ getTypeText(issuedForm.type) }}</div> -->
    <el-form
      ref="issuedForm"
      label-position="left"
      label-width="100px"
      style="width: 100%;margin: 0 auto;padding: 15px;border: 1px solid #dcdfe6;"
    >
      <el-form-item :label="$t('table.type')" prop="communityId">
        <div>{{ getTypeText(issuedForm.type) }}</div>
      </el-form-item>

      <template v-if="issuedForm.type == 1">
        <el-form-item :label="$t('form.name')" prop="name">
          <div>{{issuedForm.name}}</div>
        </el-form-item>
        <el-form-item :label="$t('form.denomination')" prop="money">
          <div>{{issuedForm.money}}</div>
        </el-form-item>
        <el-form-item :label="$t('form.blacklist')" prop="blacklist">
          <el-card v-if="issuedForm.userNames.length > 0" class="box-card">
            <div v-for="o in issuedForm.userNames" :key="o" class="text item">{{'黑名单用户：' + o }}</div>
          </el-card>
        </el-form-item>
        <el-form-item :label="$t('form.everyoneNumber')" prop="everyoneNum">
          <div>{{issuedForm.everyoneNum}}</div>
        </el-form-item>
        <el-form-item :label="$t('form.threshold')" prop="limitNum">
          <div v-if="issuedForm.limitNum == 0">无限制</div>
          <div v-else>
            <span>满 {{issuedForm.limitNum}} 元可用</span>
          </div>
        </el-form-item>
        <el-form-item :label="$t('form.validDate')" prop="validDate">
          <div>{{dateFtt("yyyy-MM-dd hh:mm:ss", issuedForm.startDate)}} - {{ dateFtt("yyyy-MM-dd hh:mm:ss", issuedForm.endDate)}}</div>
        </el-form-item>
        <el-form-item :label="$t('form.remarks')" prop="remark">
          <div
            v-html="issuedForm.remark"
            style="padding: 5px;border: 1px solid #dcdfe6; max-height: 300px;height: 300px;overflow: auto;"
          ></div>
        </el-form-item>
      </template>
      <template v-if="issuedForm.type == 2">
        <el-form-item :label="$t('form.name')" prop="name">
          <div>{{issuedForm.name}}</div>
        </el-form-item>
        <el-form-item :label="$t('form.denomination')" prop="money">
          <div>{{issuedForm.money}}</div>
        </el-form-item>
        <el-form-item :label="$t('form.grantCount')" prop="grantCount">
          <div>{{issuedForm.grantCount}}</div>
        </el-form-item>
        <el-form-item :label="$t('form.everyoneNumber')" prop="everyoneNum">
          <div>{{issuedForm.everyoneNum}}</div>
        </el-form-item>
        <el-form-item :label="$t('form.addActivity')" prop="activityId">
          <div>{{issuedForm.activityName}}</div>
        </el-form-item>
        <el-form-item :label="$t('form.validDate')" prop="validDate">
          <div>{{dateFtt("yyyy-MM-dd hh:mm:ss", issuedForm.startDate)}} - {{ dateFtt("yyyy-MM-dd hh:mm:ss", issuedForm.endDate)}}</div>
        </el-form-item>
        <el-form-item :label="$t('form.remarks')" prop="remark">
          <div
            v-html="issuedForm.remark"
            style="padding: 5px;border: 1px solid #dcdfe6;max-height: 300px;height: 300px;overflow: auto;"
          ></div>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>
<script>
import { dateFtt } from "@/utils/index";
export default {
  data() {
    return {
      
    };
  },
  props: {
    issuedForm: {
      type: Object
    },
    typeOptions: {
      type: Array
    }
  },
  created() {
    console.log("issuedForm --- ", this.issuedForm);
  },
  methods: {
    dateFtt,
    getTypeText(type) {
      let text = "";
      this.typeOptions.forEach(function(v) {
        if (v.value == type) {
          text = v.label;
        }
      });
      return text;
    }
  }
};
</script>
<style lang="scss">
</style>