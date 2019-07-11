<template>
  <el-cascader
    :props="communitypProps"
    :options="communityOptions"
    @change="handleCommunityList"
    v-model="communityOptionsVal"
    :placeholder="$t('table.temp.communityChoice')"
  ></el-cascader>
</template>
<script>
import { getCommuntityByArea } from "@/api/community";
export default {
  data() {
    return {
      communityOptions: [],
      communityOptionsVal: "", // 选中的数据
      communitypProps: {
        label: "name",
        value: "id"
      }
    };
  },
  props: {
    params: {
      type: Object,
      default: function() {
        return {
          type: "",
          areaValue: []
        };
      }
    }
  },
  watch: {
    "params.areaValue": {
      handler: function(val, oldval) {
        this.getCommuntity();
      },
      deep: true,
      immediate: false
    }
  },
  created() {
      console.log("areaValue -- ", this.areaValue)
  },
  methods: {
    // 监听社区
    handleCommunityList(val) {
      this.$emit("getCommunityVal", val, this.params.code); // 返回选中的社区
    },
    // 更新社区
    getCommuntity() {
      let _this = this;
      getCommuntityByArea({ areaCode: this.params.areaValue[2] }).then(
        function(res) {
          _this.communityOptions = res.data;
          console.log("res --- ", res);
        }
      );
    }
  }
};
</script>
