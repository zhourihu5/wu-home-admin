<template>
  <div class="community" @click="hiddenMenu">
    <!-- 树列表 -->
    <el-row>
      <el-col :span="8" style="height: 100%;">
        <div class="item-box" v-loading="regionLoading">
          <h3>区域</h3>
          <div class="item-tree">
            <el-tree
              accordion
              :data="regionList"
              :props="regionProps"
              :render-content="regionContent"
            ></el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="item-box">
          <h3>小区层级</h3>
          <div class="item-tree">
            <el-tree :data="communityList" :props="communityProps" :load="loadCommunity" lazy></el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="item-box">
          <h3>家庭</h3>
          <div class="item-tree"></div>
        </div>
      </el-col>
    </el-row>
    <!-- dialog -->
    <div class="community-dialog">
      <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="close">
        <!-- 创建社区 -->
        <template v-if="code == 0">
          <template v-if="pattern == 1">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="完整模式" name="complete"></el-tab-pane>
              <el-tab-pane label="大型模式" name="large"></el-tab-pane>
              <el-tab-pane label="小型模式" name="csmall"></el-tab-pane>
            </el-tabs>
            <component
              :is="currentView"
              :isClose="dialogFormVisible"
              @close="close"
              @fetchData="fetchData"
            ></component>
          </template>
          <div v-else>
            <ordinary ref="ordinary" @close="close"></ordinary>
          </div>
        </template>
        <!-- 创建层 -->
        <template v-else-if="code == 1"></template>
        <!-- 创建房 -->
        <template v-else></template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getAreasAll } from "@/api/area"; // 省市区数据API
import {
  getCommuntityByArea,
  getStageByCommuntity,
  getDistrictByCommuntity,
  getFloorByCommuntity,
  getUnitByFloor
} from "@/api/community"; // 社区API
import complete from "./components/complete";
import large from "./components/large";
import csmall from "./components/csmall";
import ordinary from "./components/ordinary";
import $ from "jquery";
import { generateI18n } from "@/utils/i18n";
import axios from "axios";
export default {
  components: { complete, large, csmall, ordinary },
  data() {
    return {
      // 区域树
      regionList: [],
      // 区域树树配置项
      regionProps: {
        label: "areaName",
        children: "children",
        value: "id"
      },
      // 社区树
      communityList: [],
      communityProps: {
        label: "name",
        children: "children",
        value: "code"
      },
      communityflag: "", // 操作的社区对象的flag
      // 区域树
      regionLoading: false, // 区域树loding
      treeItem: null, // 用户选中的区域
      dialogFormVisible: false, // 是否展示dialog内容
      activeName: "csmall",
      index: 2,
      arr: ["complete", "large", "csmall"],
      code: 0, // 创建模式 0 创建社区 1创建层 3创建房间
      pattern: 0, // 社区创建模式 0快捷 1普通
      title: "" // 弹窗标题
    };
  },
  computed: {
    // 动态组件
    currentView() {
      return this.arr[this.index];
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    generateI18n,
    // 获取区域数据
    fetchData() {
      let _this = this;
      _this.regionLoading = true;
      getAreasAll().then(function(res) {
        _this.regionList = res.data;
        _this.regionLoading = false;
        _this.treeLogic;
      });
    },
    // 区域被点击
    regionNodeClick(data) {
      let _this = this;
      _this.hiddenMenu();
      // 查询社区
      getCommuntityByArea({ areaCode: data.id }).then(function(res) {
        _this.communityList = res.data;
        console.log("res --- >", res.data);
      });
    },
    // 区域树展示形式 on-click={() => this.hiddenMenu()}
    regionContent(h, { node, data, store }) {
      return (
        <span class="region" on-click={() => this.regionNodeClick(data)}>
          <span>
            <span>{node.label}</span>
          </span>
          <span class="options">
            <el-button
              style="font-size: 12px;"
              type="text"
              on-click={() => this.regionMenu(data)}
            >
              创建
            </el-button>

            <ul class="region-menu">
              <li>
                <a href="#" on-click={() => this.showCreate(0, { pattern: 1 })}>
                  快速创建
                </a>
              </li>
              <li>
                <a href="#" on-click={() => this.showCreate(0, { pattern: 0 })}>
                  普通创建
                </a>
              </li>
            </ul>
          </span>
        </span>
      );
    },
    // 显示区域菜单
    regionMenu(data) {
      $(".region-menu").css("display", "none");
      let event = event ? event : window.event;
      var $obj = $(event.srcElement);
      $obj
        .parent()
        .parent()
        .children("ul")
        .css("display", "block");
      this.treeItem = data; // 记录用户选中的区域
      event.stopPropagation(); // 阻止事件冒泡
    },
    // 隐藏区域菜单
    hiddenMenu() {
      $(".region-menu").css("display", "none");
      event.stopPropagation(); // 阻止事件冒泡
    },
    // 动态加载社区
    loadCommunity(node, resolve) {
      console.log("动态加载社区 --- ", node);
      let _this = this;
      // 获取标识
      function getFlag(index1, index2) {
        let parentFlag =
          _this.communityflag.indexOf("-") >= 1
            ? _this.communityflag.split("-")[index1]
            : _this.communityflag;
        let flag =
          _this.communityflag.indexOf("-") >= 1
            ? _this.communityflag.split("-")[index2]
            : _this.communityflag;
        return {
          parentFlag: parentFlag,
          flag: flag
        };
      }
      // 查询期
      function onGetStageByCommuntity(params) {
        getStageByCommuntity(params).then(function(res) {
          console.log("查询期的数据 res -- >", res);
          resolve(res.data);
        });
      }
      // 查询区
      function onGetDistrictByCommuntity(params) {
        getDistrictByCommuntity(params).then(function(res) {
          console.log("查询区的数据 res -- >", res);
          resolve(res.data);
        });
      }
      // 查询楼
      function onGetFloorByCommuntity(params) {
        getFloorByCommuntity(params).then(function(res) {
          console.log("查询楼的数据 res -- >", res);
          resolve(res.data);
        });
      }
      // 单元
      function onGetUnitByFloor(params) {
        getUnitByFloor(params).then(function(res) {
          console.log("查询单元的数据 res -- >", res);
          resolve(res.data);
        });
      }

      // 点击一级
      if (node.level === 1) {
        this.communityflag = node.data.flag; // 每次点击社区都将用户操作的社区标识保存起来
        let flagObject = getFlag(0, 0); // 获取标识
        console.log(" flagObject --- ", flagObject);
        switch (flagObject.flag) {
          case "期":
            onGetStageByCommuntity({ commCode: node.data.code });
            break;
          case "区":
            onGetDistrictByCommuntity({ commCode: node.data.code });
            break;
          case "楼":
            onGetFloorByCommuntity({ commCode: node.data.code });
            break;
          default:
            resolve([]);
        }
      }

      // 点击二级
      if (node.level === 2) {
        console.log("this.communityflag --- >", this.communityflag);
        let params = {};
        let flagObject = getFlag(0, 1); // 获取标识
        switch (flagObject.flag) {
          case "区":
            onGetDistrictByCommuntity({ issuCode: node.data.code });
            break;
          case "楼":
            // 根据上一级flag 来决定用什么去查询
            if (flagObject.parentFlag == "期") params.issuCode = node.data.code;
            if (flagObject.parentFlag == "区") params.disCode = node.data.code;
            onGetFloorByCommuntity(params);
            break;
          case "单":
            // 根据上一级flag 来决定用什么去查询
            if (flagObject.parentFlag == "期") params.issuCode = node.data.code;
            if (flagObject.parentFlag == "区") params.disCode = node.data.code;
            if (flagObject.parentFlag == "楼")
              params.floorCode = node.data.code;
            onGetUnitByFloor(params);
            break;
          default:
            resolve([]);
        }
      }

      // 点击三级
      if (node.level === 3) {
        console.log("this.communityflag --- >", this.communityflag);
        let params = {};
        let flagObject = getFlag(1, 2); // 获取标识
        switch (flagObject.flag) {
          case "楼":
            // 根据上一级flag 来决定用什么去查询
            if (flagObject.parentFlag == "期") params.issuCode = node.data.code;
            if (flagObject.parentFlag == "区") params.disCode = node.data.code;
            onGetFloorByCommuntity(params);
            break;
          case "单":
            // 根据上一级flag 来决定用什么去查询
            if (flagObject.parentFlag == "期") params.issuCode = node.data.code;
            if (flagObject.parentFlag == "区") params.disCode = node.data.code;
            if (flagObject.parentFlag == "楼")
              params.floorCode = node.data.code;
            onGetUnitByFloor(params);
            break;
          default:
            resolve([]);
        }
      }

      // 点击三级
      if (node.level === 4) {
        console.log("this.communityflag --- >", this.communityflag);
        let params = {};
        let flagObject = getFlag(2, 3); // 获取标识
        switch (flagObject.flag) {
          case "单":
            // 根据上一级flag 来决定用什么去查询
            if (flagObject.parentFlag == "期") params.issuCode = node.data.code;
            if (flagObject.parentFlag == "区") params.disCode = node.data.code;
            if (flagObject.parentFlag == "楼")
              params.floorCode = node.data.code;
            onGetUnitByFloor(params);

            break;
          default:
            resolve([]);
        }
      }
      if (node.level === 5) resolve([]); // 第五级返回
    },
    async test(params) {},
    // 显示Dialog
    showCreate(code, params) {
      // 创建社区
      if (code == 0) {
        this.title =
          this.generateI18n("form.create") +
          this.generateI18n("form.community");
        this.pattern = params.pattern;
        console.log("创建社区", this.pattern);
        this.dialogFormVisible = true;
        event.stopPropagation(); // 阻止事件冒泡
      }
    },
    // 页签切换
    handleClick(tab, event) {
      this.index = tab.index;
    },
    // 关闭Dialog
    close() {
      console.log("关闭");
      this.dialogFormVisible = false;
      if (this.pattern == 0) {
        this.$refs.ordinary.close(); // 重置
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.community {
  .item-box {
    min-height: calc(100vh - 50px);
    margin: 5px;
    box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.1);
    border: 1px solid #409eff;
    h3 {
      width: 100%;
      background-color: #409eff;
      margin: 0;
      padding: 5px;
      color: #ffffff;
      font-size: 15px;
    }
  }
}
</style>
<style lang="scss" >
@import "~@/styles/mixin.scss";
.item-tree {
  .region {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    .options {
      position: relative;
      .region-menu {
        display: none;
        background-color: #ffffff;
        padding: 0;
        margin: 0;
        border: 1px solid #409eff;
        list-style-type: none;
        position: absolute;
        top: 25px;
        left: -45px;
        z-index: 100;
        animation: mymove 0.5s ease-in;
        -webkit-animation: mymove 0.5s ease-in; /*Safari and Chrome*/
        li {
          a {
            display: block;
            padding: 3px;
          }
          a:hover {
            background-color: #e4e7ed;
          }
        }
      }
    }
  }
}
</style>