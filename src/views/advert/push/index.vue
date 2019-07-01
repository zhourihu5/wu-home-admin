<template>
  <div>广告推广</div>
</template>
<style lang="scss">
@import "~@/styles/mixin.scss";
.push {
  margin: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  .push-checkbox {
    margin: 50px 0 50px 0;
  }
  .owner {
    .owner-title {
      display: inline-block;
    }
    .area-tree {
    }
    // .all {
    //   margin-left: 20px;
    // }
    // .el-icon-menu:before {
    //   color: #cf0f32;
    //   font-size: 18px;
    //   margin-right: 10px;
    // }
    // .owner-checkbox {
    //   margin-left: 10px;
    // }
    // .floor {
    //   margin-bottom: 10px;
    //   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    //   padding: 10px;
    //   .stage {
    //     margin: 10px;
    //     .rooms {
    //       margin: 10px;
    //       @include clearfix;
    //       .room-item {
    //         float: left;
    //         border-radius: 4px;
    //         width: 245px;
    //         height: 95px;
    //         box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    //         margin: 10px;
    //         @include clearfix;
    //         position: relative;
    //         cursor: pointer;
    //         &:hover {
    //           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
    //             0 0 6px rgba(0, 0, 0, 0.04);
    //           .room-icon {
    //             i {
    //               color: #cf0f32;
    //               transition: color 0.5s;
    //             }
    //           }
    //         }
    //         .room-icon {
    //           float: left;
    //           width: 50px;
    //           height: 50px;
    //           line-height: 50px;
    //           background: #f7f7f7;
    //           border-radius: 50%;
    //           text-align: center;
    //           position: absolute;
    //           top: 50%;
    //           left: 20%;
    //           margin: -25px 0 0 -25px;
    //           i {
    //             font-size: 24px;
    //             color: #727272;
    //           }
    //         }
    //         .romm-content {
    //           float: left;
    //           width: 150px;
    //           height: 50px;
    //           position: absolute;
    //           top: 50%;
    //           left: 50%;
    //           margin: -25px 0 0 -40px;
    //           p {
    //             margin: 0;
    //             font-size: 14px;
    //             line-height: 1.7;
    //             color: #727272;
    //           }
    //           .number {
    //             color: #a4cd03;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  }
}
</style>
<script>
import uploadText from "./../../../components/operate/uploadText";
import addUrl from "./../../../components/operate/addUrl";
import { getFloorList } from "./../../../api/advert";
import { getAreas } from "./../../../api/area";
export default {
  data() {
    return {
      checkList: [],
      props: {
        label: "name",
        children: "zones"
      },
      count: 1,
      tree: []
      // activeNames: ["1"], // 选择业主 默认展开哪个
      // isIndeterminate: true,
      // checkAll: false,
      // checkedCities: [], // 已经选中的
      // list: [], // 获取的数据
      // dialogVisible: false,
      // houseArr: [],
    };
  },
  created() {
    this.getDatas();
  },
  components: {
    uploadText,
    addUrl
  },
  methods: {
    // 获取数据
    getDatas() {
      let _this = this;

      // getAreas().then(function(res) {
      //   console.log("res --- >", res);
      // })
      // getFloorList().then(function(res) {
      //   _this.list = res.data;

      // });
    },

    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    loadNode(node, resolve) {
      console.log(node, resolve);
      if (node.level === 0) {
        getAreas({ pid: 0 }).then(function(res) {
          console.log("res --- >", res);
           return resolve(res.data);
        });
      }
      // if (node.level > 3) return resolve([]);

      // var hasChild;
      // if (node.data.name === "region1") {
      //   hasChild = true;
      // } else if (node.data.name === "region2") {
      //   hasChild = false;
      // } else {
      //   hasChild = Math.random() > 0.5;
      // }

      // setTimeout(() => {
      //   var data;
      //   if (hasChild) {
      //     data = [
      //       {
      //         name: "zone" + this.count++
      //       },
      //       {
      //         name: "zone" + this.count++
      //       }
      //     ];
      //   } else {
      //     data = [];
      //   }

      //   resolve(data);
      // }, 500);
    }
    // handleChange(val) {
    //   // console.log("handleChange --", val);
    // },
    // showDialog(item) {
    //   console.log(item)
    //   // this.houseArr = item.children;
    //   // this.dialogVisible = true;
    // },
    // handleClose(done) {
    //   this.$confirm("确认关闭？")
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // },
    // handleCheckAllChange(val) {
    //   if (val) {
    //     // 全选
    //     let arr = this.list;
    //     let newArr = [];
    //     for (var i = 0; i < arr.length; i++) {
    //       deep(arr[i]);
    //     }
    //     function deep(val) {
    //       console.log("val --- >", val);
    //       if (val.children) {
    //         if (val.children.length > 0) {
    //           newArr.push(val.id);
    //           for (var i = 0; i < val.children.length; i++) {
    //             deep(val.children[i]);
    //           }
    //         }
    //       }
    //     }
    //     console.log("newArr --- >", newArr);
    //     this.checkedCities = newArr;
    //   } else {
    //     this.checkedCities = [];
    //   }
    //   this.isIndeterminate = false;
    // },
    // handleCheckedCitiesChange(value) {
    //   console.log(" ---- >", value);
    //   // let checkedCount = value.length;
    //   // this.checkAll = checkedCount === this.list.length;
    //   // this.isIndeterminate =
    //   //   checkedCount > 0 && checkedCount < this.list.length;
    // }
  }
};
</script>

