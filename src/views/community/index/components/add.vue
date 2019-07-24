<template>
  <div class="add">
    <!-- 步骤 -->
    <div class="step">
      <el-steps :active="active" finish-status="success">
        <el-step :title="$t('steps.community')" :status="communityStatus"></el-step>
        <el-step :title="$t('steps.stage')" :description="stateDesc" :status="stateStatus"></el-step>
        <el-step :title="$t('steps.area')" :description="areaDesc" :status="areaStatus"></el-step>
        <el-step :title="$t('steps.floor')" :status="floorStatus"></el-step>
        <el-step :title="$t('steps.unit')" :status="unitStatus"></el-step>
        <el-step :title="$t('steps.layer')" :status="layerStatus"></el-step>
      </el-steps>
    </div>
    <div class="step-page">
      <component
        ref="component"
        :is="currentView"
        :communityId="communityId"
        @initButtonLoading="initButtonLoading"
        @assignment="assignment"
        @nextPage="nextPage"
        @setDescription="setDescription"
        class="switch"
      ></component>
    </div>
    <div class="options">
      <el-button
        type="primary"
        icon="el-icon-arrow-left"
        v-if="currentView != arr[0]"
        @click="upper"
        :loading="buttonLoadingUp"
      >上一页</el-button>
      <el-button type="primary" @click="next" :loading="buttonLoading">
        下一页
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.add {
  padding: 20px;
  .step {
    position: relative;
    &::after {
      content: "";
      width: 90%;
      height: 5px;
      display: block;
      border-bottom: 1px solid #dcdfe6;
      position: absolute;
      left: 5%;
      margin-top: 15px;
    }
  }
  .step-page {
    margin-top: 30px;
    .switch {
      animation: mymove 0.5s ease-in;
      -webkit-animation: mymove 0.5s ease-in; /*Safari and Chrome*/
    }
  }
  .options {
    text-align: right;
  }
}
</style>
<script>
import community from "./community";
import stage from "./stage";
import myarea from "./area";
import floor from "./floor";
import unit from "./unit";
import family from "./family";
import layer from "./layer";
import { getCommuntityById } from "@/api/community";
export default {
  components: { community, stage, myarea, floor, unit, layer, family },
  data() {
    return {
      stateDesc: "", // 期描述
      areaDesc: "", // 区描述
      communityStatus: "", // 社区状态
      stateStatus: "", // 期状态
      areaStatus: "", // 区状态
      floorStatus: "", // 楼状态
      unitStatus: "", // 单元状态
      layerStatus: "", // 层状态
      active: 0, // 步骤显示哪步
      index: 0, // 显示的组件
      arr: ["community", "stage", "myarea", "floor", "unit", "layer"],
      buttonLoading: false, // 下一步按钮加载
      buttonLoadingUp: false, // 上一步按钮加载
      communityId: "" // 缓存社区ID
    };
  },
  computed: {
    currentView() {
      // 动态组件
      return this.arr[this.index];
    }
  },
  created() {
    if (this.cid) {
      this.communityId = this.cid;
    }
  },
  props: {
    cid: {
      type: String,
      default: ""
    }
  },
  watch: {
    cid: {
      handler: function(val, oldval) {
        console.log("add锦亭  val:", val, "oldval:", oldval);
        if (val) {
          this.communityId = val;
        }
      }
    }
  },
  methods: {
    next() {
      // 下一步 按钮
      this.buttonLoading = true;
      if (this.arr[this.index] === "community") {
        // 社区保存
        this.$refs.component.createData();
      } else {
        this.nextPage();
      }
    },
    assignment(id) {
      // 赋值社区ID
      this.communityId = id.toString();
      console.log("用户保存社区了 id:--- ", this.communityId);
    },
    nextPage() {
      let _this = this;
      getCommuntityById({ id: _this.communityId }).then(function(res) {
        console.log("add 页面获取社区 --- ", res.data);
        if (res.data.flag != null) {
          let flag = _this.conversionFlag(res.data.flag);
          // 社区
          if (_this.arr[_this.index] == "community") {
            if (flag == "期") {
              if (_this.active++ > 4) _this.active = 0;
              _this.index = _this.active;
            }
            if (flag == "区") {
              _this.active = 2;
              _this.index = _this.active;
            }
            if (flag == "楼") {
              _this.active = 3;
              _this.index = _this.active;
            }
          } // 期
          else if (_this.arr[_this.index] == "stage") {
            if (_this.active++ > 4) _this.active = 0;
            _this.index = _this.active;
          } else {
            if (_this.arr[_this.index] == "layer") {
              _this.$alert(
                "您已操作完录入社区整体流程,后续修改请前往编辑功能,感谢使用",
                "提示",
                {
                  confirmButtonText: "确定",
                  callback: action => {
                    _this.$emit("close"); // 关闭弹窗
                    _this.$emit("fetchData"); // 刷新
                  }
                }
              );
            } else {
              if (_this.active++ > 4) _this.active = 0;
              _this.index = _this.active;
            }
          }
        } else {
          if (_this.active++ > 4) _this.active = 0;
          _this.index = _this.active;
        }
        _this.buttonLoading = false; // 清楚加载中
      });
    },

    // 上一页
    upper() {
      let _this = this;
      _this.buttonLoadingUp = true;
      getCommuntityById({ id: _this.communityId }).then(function(res) {
        console.log("上一步  -- ", _this.arr[_this.index]);
        if (res.data.flag != null) {
          // 期
          if (_this.arr[_this.index] == "stage") {
            if (_this.active-- == 0) _this.active = 0;
            _this.index = _this.active;
          }
          // 区
          else if (_this.arr[_this.index] == "myarea") {
            let flag = _this.conversionFlag(res.data.flag);
            console.log("区上一步当flag 有值的时候", flag);
            // 如果社区下的flag是以（期）并且点击上一页的页面是（区）页面 则返回（期）页面
            if (flag == "期") {
              if (_this.active-- == 0) _this.active = 0;
              _this.index = _this.active;
            }
            // 如果社区下的flag是以 (区) 并且点击上一页的页面是（区）页面 则返回（社区）页面
            if (flag == "区") {
              _this.active = 0;
              _this.index = _this.active;
            }
          }
          // 楼
          else if (_this.arr[_this.index] == "floor") {
            console.log("楼上一步当flag 有值的时候", res.data.flag);
            // 期
            if (res.data.flag.indexOf("-") == -1) {
              if (res.data.flag == "期") {
                if (res.data.flag.indexOf("楼") == -1) {
                  if (_this.active-- == 0) _this.active = 0;
                  _this.index = _this.active;
                } else {
                  _this.active = 1;
                  _this.index = _this.active;
                }
              } else if (res.data.flag == "区") {
                if (_this.active-- == 0) _this.active = 0;
                _this.index = _this.active;
              } else if (res.data.flag == "楼") {
                _this.active = 0;
                _this.index = _this.active;
              }
            } else {
              let flags = res.data.flag.split("-");
              if (flags.length == 2) {
                if (flags[1] == "楼") {
                  if (flags[0] == "期") {
                    _this.active = 1;
                    _this.index = _this.active;
                  } else if (flags[0] == "区") {
                    if (_this.active-- == 0) _this.active = 0;
                    _this.index = _this.active;
                  }
                } else if (flags[1] == "区") {
                  if (_this.active-- == 0) _this.active = 0;
                  _this.index = _this.active;
                }
              } else {
                if (_this.active-- == 0) _this.active = 0;
                _this.index = _this.active;
              }
            }
          } else {
            if (_this.active-- == 0) _this.active = 0;
            _this.index = _this.active;
          }
          _this.buttonLoadingUp = false;
        } else {
          if (_this.active-- == 0) _this.active = 0;
          _this.index = _this.active;
          _this.buttonLoadingUp = false;
        }
      });
    },
    conversionFlag(flagStr) {
      // 期-区-楼-单-层-家
      if (flagStr.indexOf("-") == -1) {
        return flagStr;
      } else {
        return flagStr.split("-")[0];
      }
    },
    // 设置步骤描述
    setDescription(flag) {
      console.log("设置步骤 --- ", flag);
      this.communityStatus = "success";
      if (flag) {
        if (flag.indexOf("期") == -1) {
          this.stateDesc = "当前社区未录入（期），所以本社区无（期）数据。";
          this.stateStatus = "finish";
        } else {
          this.stateStatus = "success";
        }
        if (flag.indexOf("区") == -1) {
          if (flag.indexOf("楼") != -1) {
            this.areaDesc = "当前社区未录入（区），所以本社区无（区）数据。";
            this.areaStatus = "finish";
          }
        } else {
          this.areaStatus = "success";
        }
        if (flag.indexOf("楼") != -1) {
          this.floorStatus = "success";
        }
        if (flag.indexOf("单") != -1) {
          this.unitStatus = "success";
        }
        if (flag.indexOf("层") != -1) {
          this.layerStatus = "success";
        }
      }
    },
    // 跳过
    jump() {},
    initialization() {
      this.stateDesc = ""; // 期描述
      this.areaStatus = ""; // 区描述
      this.communityStatus = ""; // 社区状态
      this.stateStatus = ""; // 期状态
      this.areaDesc = ""; // 区描述
      this.floorStatus = ""; // 楼状态
      this.unitStatus = ""; // 单元状态
      this.layerStatus = ""; // 层状态
      this.active = 0;
      this.index = 0;
      this.buttonLoading = false;
      this.communityId = ""; // 缓存社区ID
      this.$refs.component.initialization(); // 清空各个模块的数据
    },
    initButtonLoading() {
      this.buttonLoading = false;
    }
  }
};
</script>