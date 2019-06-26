<template>
  <div class="service-all">
    <div class="options">
      <span @click="edit" v-if="!isEdit">{{$t('table.edit')}}</span>
      <el-checkbox
        v-if="isEdit"
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="selectAll"
      >{{$t('table.selectAll')}}</el-checkbox>
      <span @click="cancel" v-if="isEdit">{{$t('table.cancel')}}</span>
    </div>
    <div class="cared-list" v-loading="listLoading">
      <el-checkbox-group
        v-if="serviceList.length > 0"
        v-model="checkedCities"
        @change="handleCheckedCitiesChange"
      >
        <div class="item" v-for="(o, index) in serviceList" :key="index">
          <el-checkbox :class="{'no-display': isCheckedBox }" :label="o.id"></el-checkbox>
          <div class="icon">
            <img :src="o.cover" :alt="o.title" class="image">
          </div>
          <p class="title">{{o.title}}</p>
          <p class="content">{{o.memo}}</p>
        </div>

        <div v-if="listQuery.pageNum < total" class="item" @click="toPage">
          <p class="loading">{{ $t('point.loadMore') }}</p>
        </div>
      </el-checkbox-group>
      <div v-else class="not-data">
        <p>{{ $t('table.noData') }}</p>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import "~@/styles/mixin.scss";
.service-all {
  animation: mymove 0.5s ease-in;
  -webkit-animation: mymove 0.5s ease-in; /*Safari and Chrome*/
  .options {
    position: absolute;
    top: 15px;
    right: 25px;
    z-index: 100;
    .el-checkbox {
      margin: 0;
    }
    span {
      font-size: 14px;
      color: #606266;
      padding: 0 10px 0px 10px;
      &:hover {
        color: #409eff;
        cursor: pointer;
      }
    }
    .el-checkbox__input {
      padding: 0;
      span {
        padding: 0;
      }
    }
  }
  .cared-list {
    @include clearfix;
    .no-display {
      display: none;
    }
    .not-data {
      text-align: center;
      padding: 50px;
      p {
        color: #999;
      }
    }
    .item {
      width: 150px;
      height: 215px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      margin: 10px;
      float: left;
      position: relative;
      .el-checkbox {
        position: absolute;
        top: 5px;
        left: 5px;
        .el-checkbox__label {
          display: none
        }
      }
      .icon {
        width: 150px;
        height: 150px;
        .image {
          width: 100%;
          height: 100%;
        }
      }
      .title {
        color: #303133;
        font-size: 14px;
        padding: 5px;
        margin: 0;
      }
      .content {
        margin: 0;
        font-size: 13px;
        color: #999;
        padding: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .loading {
        font-size: 20px;
        color: #999;
        text-align: center;
        line-height: 215px;
        margin: 0;
        &:hover {
          color: #409eff;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          transition: 0.5s color, 0.5s box-shadow;
        }
        &:active {
          background-color: #f9f9f9;
        }
      }
    }
  }
}
</style>
<script>
import { getServiceAll } from "@/api/service";
export default {
  data() {
    return {
      checkedCities: [], // 选中的
      serviceList: [], // 集合
      listLoading: true,
      isEdit: false,
      isIndeterminate: true,
      listQuery: {
        type: 1,
        pageNum: 1,
        pageSize: 10
      },
      checkAll: false,
      isCheckedBox: true,
      total: 0 // 总页数
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 查询数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getServiceAll(this.listQuery).then(function(res) {
        console.log("res --- ", res);
        _this.listLoading = false;
        _this.serviceList = _this.serviceList.concat(res.data.content); // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 编辑
    edit() {
      this.isEdit = true;
      this.isCheckedBox = false; // 显示多选按钮
    },
    // 全选
    selectAll(val) {
      console.log("val --- ", val);
      if (val) {
        let os = this.serviceList;
        for (let i = 0; i < os.length; i++) {
          this.checkedCities.push(os[i].id);
        }
      } else {
        this.checkedCities = [];
      }
      this.isIndeterminate = false;
    },
    // 取消
    cancel() {
      this.isEdit = false;
      this.checkAll = false; // 全选按钮回复默认未选中状态
      this.checkedCities = []; // 清空卡片列表被选中的状态
      this.isCheckedBox = true; // 隐藏多选按钮
    },
    // 卡片被点击了 监听
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.serviceList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.serviceList.length;
    },
    // 分页
    toPage() {
      this.listQuery.pageNum = this.listQuery.pageNum + 1;
      this.fetchData();
    },
    restDefault() {
      this.checkedCities = []; // 选中的
      this.isEdit = false;
      this.isIndeterminate = true;
      this.isCheckedBox = true;
      this.serviceList = [];
    }
  }
};
</script>