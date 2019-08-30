<template>
  <div class="experience-see">
    <el-form
      ref="experienceForm"
      label-position="left"
      label-width="100px"
      style="width: 100%;margin: 0 auto;padding: 15px;border: 1px solid #dcdfe6;"
    >
      <el-form-item :label="$t('form.community')" prop="communityName">
        <div>{{ experienceForm.communityNames }}</div>
      </el-form-item>
      <el-form-item :label="$t('form.name')" prop="name">
        <div>{{ experienceForm.name }}</div>
      </el-form-item>
      <el-form-item :label="$t('form.validDate')" prop="validDate">
        <div>{{ experienceForm.startDate }} - {{ experienceForm.endDate }}</div>
      </el-form-item>
      <el-form-item :label="$t('form.banner')" prop="bannerFile">
        <div>
          <img :src="experienceForm.banner" alt="banner" />
        </div>
      </el-form-item>
      <el-form-item :label="$t('form.detailsImg')" prop="bannerFile">
        <div>
          <img :src="experienceForm.cover" alt="cover" />
        </div>
      </el-form-item>
      <el-form-item :label="$t('form.experienceImg')" prop="bannerFile">
        <img v-for="(itme, index) in experienceForm.experienceImgs" :key="index" :src="itme" alt="体验卷图">
      </el-form-item>
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
  </div>
</template>
<script>
import { dateFtt } from "@/utils/index"; // 分页
export default {
  data() {
    return {};
  },
  props: {
    experienceForm: {
      type: Object
    }
  },
  created() {
    console.log("experienceForm --- ", this.experienceForm);
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