<template>
  <div>
    <div class="careds">
      <div v-if="list.length > 0" class="options">
        <span @click="edit" v-if="!isEdit">{{$t('table.edit')}}</span>
        <el-checkbox
          v-if="isEdit"
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="selectAll"
        >{{$t('table.selectAll')}}</el-checkbox>
        <span @click="cancel" v-if="isEdit">{{$t('table.cancel')}}</span>
        <span @click="dialogVisible = true;" v-if="isEdit">{{$t('table.upperShelf')}}</span>
      </div>
      <el-tabs type="border-card">
        <el-tab-pane :label="$t('form.ApplicationAll')"></el-tab-pane>
        <el-tab-pane :label="$t('form.UpperShelf')"></el-tab-pane>
        <el-tab-pane :label="$t('form.NotOnShelves')"></el-tab-pane>

        <div class="card-list">
          <el-checkbox-group
            v-if="list.length > 0"
            v-model="cities"
            size="medium"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox border v-for="(o, index) in list" :key="index" :label="o.id">
              <el-card :body-style="{ padding: '0px' }" class="card">
                <img :src="o.icon" class="image">
                <div style="padding: 14px;">
                  <span>{{o.title}}</span>
                  <div class="bottom clearfix">
                    <time class="time">{{o.content}}</time>
                    <el-button type="text" class="button">上架</el-button>
                  </div>
                </div>
              </el-card>
            </el-checkbox>
            <label
              role="checkbox"
              class="el-checkbox el-checkbox--medium is-bordered load-more"
              @click="loadMore()"
              v-if="isNext"
            >
              <el-card shadow="hover" class="more">{{ $t('point.loadMore') }}</el-card>
            </label>
          </el-checkbox-group>
          <div v-else class="not-date">
            <p>{{ $t('table.noData') }}</p>
          </div>
        </div>
      </el-tabs>
    </div>
    <div class="popup">
      <el-dialog
        :title="$t('dialog.board')"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose"
        center
      >
        <span>
          <el-radio v-model="plate" label="1" border>{{ $t('dialog.choice') }}</el-radio>
          <el-radio v-model="plate" label="2" border>{{ $t('dialog.popularity') }}</el-radio>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button type="primary" @click="upper">{{ $t('table.confirm') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="scss">
.careds {
  margin-top: 20px;
  position: relative;
  .options {
    position: absolute;
    top: 10px;
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
  .card-list {
    .card {
      width: 150px; // 卡片宽度
      height: 220px;
    }
    .image {
      height: 150px;
    }
    .is-bordered {
      height: 100%;
      padding: 0;
    }
    .el-checkbox {
      margin-right: 0 !important;
      position: relative;
      border: none;
      margin-left: 15px !important;
      margin-bottom: 15px;
    }
    .el-checkbox__label {
      padding-left: 0;
    }
    .el-checkbox__input {
      position: absolute;
      top: 10px;
      left: 10px;
    }
    .time {
      font-size: 13px;
      color: #999;
    }

    .bottom {
      margin-top: 13px;
      line-height: 12px;
    }

    .button {
      padding: 0;
      float: right;
    }

    .image {
      width: 100%;
      display: block;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }

    .clearfix:after {
      clear: both;
    }
    .more {
      font-size: 18px;
      color: #999;
      text-align: center;
      line-height: 190px;
      width: 150px; // 卡片宽度
      height: 220px;
      &:hover {
        color: #747474;
      }
    }
    .not-date {
      text-align: center;
      padding: 50px;
      p {
        color: #999;
      }
    }
  }
}
.popup {
  .el-dialog__body {
    text-align: center !important;
  }
}
</style>
<script>
import { generatePoint } from "@/utils/i18n";
export default {
  data() {
    return {
      list: [],
      isNext: true,
      isEdit: false, // 是否是编辑状态
      isIndeterminate: false,
      checkAll: false, // 全选按钮是否被选中
      cities: [], // 选中的卡片
      dialogVisible: false, // 是否显示dialog
      plate: "1" // 1 本周精选 2人气入门  默认本周精选
    };
  },
  props: {
    services: Object
  },
  watch: {
    services: {
      handler: function(val, oldval) {
        if (val) {
          this.list = val.data;
          this.isNext = val.isNext;
          console.log("list --- >", this.list);
          this.$nextTick(() => {
            this.showCheckbox(0); // 隐藏掉多选按钮
          });
        }
      },
      immediate: true, //关键 第一不加载
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.showCheckbox(0); // 隐藏掉多选按钮
    });
  },
  methods: {
    generatePoint,
    // 编辑
    edit() {
      this.isEdit = true;
      this.showCheckbox(1); // 显示多选按钮
    },
    // 全选
    selectAll(val) {
      let os = this.list;
      let fs = []; // 全部选择的数据
      for (let i = 0; i < os.length; i++) {
        fs.push(os[i].id);
      }
      this.cities = val ? fs : [];
      this.isIndeterminate = false;
    },
    // 上架
    upper() {
      console.log("用户选择了", this.plate);
      this.dialogVisible = false;
      this.$notify({
        title: this.generatePoint("notifySuccess.title"),
        message: this.generatePoint("notifySuccess.message3"),
        type: "success"
      });
    },
    // 取消
    cancel() {
      this.isEdit = false;
      this.checkAll = false; // 全选按钮回复默认未选中状态
      this.cities = []; // 清空卡片列表被选中的状态
      this.showCheckbox(0); // 隐藏多选按钮
    },
    // 卡片被点击了 监听
    handleCheckedCitiesChange(value) {
      console.log(value);
      let checkedCount = value.length;
      this.checkAll =
        checkedCount === 0 ? false : checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    // 是否显示 单选按钮 code = 0 隐藏  1 显示
    showCheckbox(code) {
      this.$nextTick(() => {
        let mylist = document.getElementsByClassName("card-list")[0];
        let spans = mylist.getElementsByClassName("el-checkbox__input");
        console.log("spans -- ", spans);
        for (let i = 0; i < spans.length; i++) {
          if (code == 0) {
            spans[i].style.display = "none"; // 隐藏
          } else {
            spans[i].style.display = "block"; // 显示
          }
        }
      });
    },
    // 上架
    upper() {
      console.log("用户选择了", this.plate);
      this.dialogVisible = false;
      this.$notify({
        title: this.generatePoint("notifySuccess.title"),
        message: this.generatePoint("notifySuccess.message3"),
        type: "success"
      });
    },
    handleClose(done) {
      this.$confirm(this.generatePoint("close"))
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 加载更多 （分页）
    loadMore() {
      this.$emit("onPage");
    }
  }
};
</script>
