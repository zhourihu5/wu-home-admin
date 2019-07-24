<template>
  <div class="add-community">
    <el-form
      ref="communityForm"
      :rules="rules"
      :model="communityForm"
      label-position="right"
      label-width="100px"
      style="width: 40%"
      class="myForm"
    >
      <el-form-item :label="$t('form.area')" prop="areaValue">
        <province ref="provinceForm" :params="communityForm" @getProvinceVal="getProvinceVal"></province>
      </el-form-item>
      <el-form-item :label="$t('form.communityName')" prop="cname">
        <el-input v-model="communityForm.cname" :placeholder="$t('table.temp.community')"/>
      </el-form-item>
      <el-form-item :label="$t('form.address')" prop="address">
        <el-input v-model="communityForm.address" :placeholder="$t('table.temp.address')"/>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.add-community {
  padding: 20px 10px 20px 10px;
  .myForm {
    margin: 0 auto;
  }
}
</style>
<script>
import Province from "@/components/Linkage/province"; // 省市区三级联动
import { generatePoint } from "@/utils/i18n";
import { addCommuntity, getCommuntityById } from "@/api/community";
import { getAreas } from "@/api/area";
export default {
  components: { Province },
  data() {
    return {
      communityForm: {
        code: "form",
        cname: "", // 社区名称
        address: "", // 详细地址
        id: "",
        areaValue: []
      },
      // 验证规则
      rules: {
        areaValue: [
          {
            type: "array",
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.communityForm.areaValue.length <= 0) {
                callback(this.generatePoint("mandatory"));
              } else {
                callback();
              }
            }
          }
        ],
        cname: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        address: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ]
      }
    };
  },
  watch: {
    communityId: {
      handler: function(val, oldval) {
        if (val) {
          this.fetchData();
        }
      }
    }
  },
  props: {
    communityId: String
  },
  created() {
    console.log("添加社区页面接收到的社区ID --- >", this.communityId);
    if (this.communityId) {
      // 查询社区 回显数据
      this.fetchData();
    }
  },
  methods: {
    generatePoint,
    // 查询数据
    fetchData() {
      let _this = this;
      getCommuntityById({ id: _this.communityId }).then(function(res) {
        console.log("社区页面 获取的社区", res);
        _this.$emit("setDescription", res.data.flag);
        _this.communityForm.cname = res.data.name;
        _this.communityForm.address = res.data.address;
        _this.communityForm.id = res.data.id;
        _this.communityForm.areaValue.push(res.data.city);
        _this.communityForm.areaValue.push(res.data.province);
        _this.communityForm.areaValue.push(res.data.area);
        _this.$nextTick(() => {
          _this.$refs.provinceForm.echoArea(_this.communityForm.areaValue);
        });
      });
    },
    // 获取省市区数据
    getProvinceVal(val, code) {
      if (code == "form") {
        this.communityForm.areaValue = val;
      }
    },
    // 创建数据
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.communityForm.validate(valid => {
        if (valid) {
          try {
            let params = {
              address: _this.communityForm.address,
              name: _this.communityForm.cname,
              province: _this.communityForm.areaValue[0],
              city: _this.communityForm.areaValue[1],
              area: _this.communityForm.areaValue[2]
            };
            // 修改
            if (_this.communityForm.id != "") {
              params.id = _this.communityForm.id;
            }
            addCommuntity(params).then(function(res) {
              if (res.message == "SUCCESS") {
                _this.$notify({
                  title: _this.generatePoint("notifySuccess.title"),
                  message: _this.generatePoint("notifySuccess.message"),
                  type: "success"
                });
                _this.$emit("assignment", res.data.id); // 赋值社区ID
                _this.$emit("nextPage"); // 下一页
              } else {
                _this.$message.error(_this.generatePoint("system"));
              }
            });
          } catch (err) {
            console.error("err --- ", err); // 控制台打印异常
            _this.$emit("initButtonLoading"); // 清楚加载中
            _this.$message.error(_this.generatePoint("system"));
          }
          // 保存
        } else {
          _this.$emit("initButtonLoading"); // 清楚加载中
          return false;
        }
      });
    },
    // 恢复初始化数据
    initialization() {
      this.communityForm = {
        code: "form",
        cname: "", // 社区名称
        address: "", // 详细地址
        id: "",
        areaValue: []
      };
      this.$refs.provinceForm.initialization(); // 重置省市区
      this.$refs.communityForm.resetFields(); // 重置表单
    }
  }
};
</script>