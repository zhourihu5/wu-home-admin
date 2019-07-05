<template>
  <div class="advert-bottom">
    <!-- search --->
    <div class="advert-bottom-container">
      <el-input
        v-model="listQuery.title"
        :placeholder="$t('table.temp.community')"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="queryAdvertBottom"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="showAddAdvertView"
      >{{ $t('table.add') }}</el-button>
    </div>
    <!-- table --->
    <div class="advert-bottom-table">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" :label="$t('table.id')" width="100">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.advertTitle')" width="300">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column :label="$t('table.cover')" width="250" align="center">
          <template slot-scope="scope">
            <img v-if="scope.row.cover" :src="scope.row.cover" :alt="$t('table.icon')" class="icon">
            <p v-else>{{ $t('table.noTime') }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.jumpPath')" width="180" align="center">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="view_window">点击查看</a>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.uptime')" width="225">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.startDate ? scope.row.startDate : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.downtime')" width="225">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.endDate ? scope.row.endDate : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.deliveryTime')" width="225">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.dayTime ? scope.row.dayTime : $t('table.noTime')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.operation')" align="center" width="320">
          <template slot-scope="{row}">
            <el-button type="danger" size="mini" @click="deleteData(row)">{{ $t('table.delete') }}</el-button>
          </template>
          <!-- <el-button type="primary" size="mini" @click="showEditUserView">{{ $t('table.edit') }}</el-button> -->
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="fetchData"
      />
    </div>
    <!-- dialog -->
    <el-dialog
      :title="textMap[dialogStatus] == 'Create' ? $t('form.create') : $t('form.edit')"
      :visible.sync="dialogFormVisible"
      @close="close"
    >
      <el-form
        ref="advertFormBottom"
        :rules="rules"
        :model="advertFormBottom"
        label-position="right"
        label-width="100px"
        style="width: 80%"
      >
        <el-form-item :label="$t('form.Cover')" prop="file">
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :limit="1"
            :multiple="false"
            :file-list="fileList"
            :on-exceed="exceedUpload"
            :on-success="handleAvatarSuccess"
            :data="uploadParams"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('form.title')" prop="title">
          <el-input
            style="width: 60%;"
            v-model="advertFormBottom.title"
            :placeholder="$t('table.temp.title')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.link')" prop="url">
          <el-input
            style="width: 60%;"
            v-model="advertFormBottom.url"
            :placeholder="$t('table.temp.url')"
          />
        </el-form-item>
        <!-- <el-form-item :label="$t('form.link')" prop="url">
          <el-input :placeholder="$t('table.temp.url')" v-model="advertFormBottom.url">
            <template slot="prepend">Http://</template>
          </el-input>
        </el-form-item>-->
        <el-form-item :label="$t('form.area')" prop="areaOptionsVal">
          <el-cascader
            :props="areaProps"
            @change="handleAreaForm"
            v-model="advertFormBottom.areaOptionsVal"
            :placeholder="$t('table.temp.area')"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('form.community')" prop="communtity">
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('point.addreCommunity')"
            placement="top"
          >
            <el-transfer
              v-model="advertFormBottom.communtity"
              :titles="[$t('form.unchecked'), $t('form.select')]"
              :button-texts="[$t('table.delete'), $t('table.add')]"
              :data="data"
              @change="handleChange"
            ></el-transfer>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="$t('form.uptime')" prop="startDate">
          <el-date-picker
            v-model="advertFormBottom.startDate"
            type="datetime"
            :placeholder="$t('table.temp.date')"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item :label="$t('form.downtime')" prop="endDate">
          <el-date-picker
            v-model="advertFormBottom.endDate"
            type="datetime"
            :placeholder="$t('table.temp.date')"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item :label="$t('form.deliveryTime')" prop="dayTime">
          <el-time-picker
            v-model="advertFormBottom.dayTime"
            :placeholder="$t('table.temp.date')"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="createData"
          :loading="buttonLoading"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.advert-bottom {
  .advert-bottom-container {
    margin-bottom: 20px;
  }
  h3 {
    margin-bottom: 30px;
  }
  a {
    color: #409eff;
    &:hover {
      color: #3880ca;
    }
  }
  .icon {
    width: 40px;
    height: 40px;
  }
}
</style>

<script>
import { getAdvertList, addAdver, deleteAdver } from "./../../../../api/advert";
import { getCommuntityByArea } from "@/api/community";
import Pagination from "@/components/Pagination"; // 分页
import { getAreas } from "@/api/area";
import { generatePoint } from "@/utils/i18n";
import { overall } from "@/constant/index";
export default {
  data() {
    return {
      uploadUrl: overall.uploadUrl,
      fileList: [], // 上传图片回显列表
      uploadParams: {
        type: "adv"
      },
      data: [],
      list: [],
      listLoading: true,
      buttonLoading: false, // 按钮加载请求
      dialogStatus: "",
      dialogFormVisible: false,
      total: 0, // 分页
      textMap: {
        // 弹窗展示的title
        update: "Edit",
        create: "Create"
      },
      listQuery: {
        title: "",
        pageNum: 1,
        pageSize: 10
      },
      advertFormBottom: {
        title: "",
        url: "",
        areaOptionsVal: "",
        communtity: [],
        startDate: "",
        endDate: "",
        cover: "",
        dayTime: "" // 发送时间
      },
      rules: {
        title: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        url: [
          {
            required: true,
            trigger: "change",
            validator: this.validateUrl
          }
        ],
        areaOptionsVal: [
          {
            type: "array",
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        communtity: [
          {
            type: "array",
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        startDate: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        endDate: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        dayTime: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("required")
          }
        ],
        file: [
          {
            validator: (rule, value, callback) => {
              if (this.advertFormBottom.cover == "") {
                callback(this.generatePoint("upload"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          // 只可选择大于当前时间的日期
          return time.getTime() < Date.now();
        }
      },
      // 省市区
      areaProps: {
        label: "areaName",
        value: "id",
        children: "children",
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          switch (level) {
            case 0:
              getAreas().then(function(res) {
                resolve(res.data);
              });
              break;
            case 1:
              getAreas({ pid: node.value }).then(function(res) {
                resolve(res.data);
              });
              break;
            case 2:
              getAreas({ pid: node.value }).then(function(res) {
                for (let i = 0; i < res.data.length; i++) {
                  res.data[i].leaf = true;
                }
                resolve(res.data);
              });
              break;
          }
        }
      }
    };
  },
  created() {
    this.fetchData();
  },
  components: {
    Pagination
  },
  methods: {
    generatePoint,
    handleChange(value, direction, movedKeys) {
      console.log(" -- ", this.value);
      console.log(value, direction, movedKeys);
    },
    // 验证url
    validateUrl(rule, value, callback) {
      if (!value) {
        callback(new Error(this.generatePoint("required")));
      } else {
        if (
          value.match(/http:\/\/.+/) != null ||
          value.match(/https:\/\/.+/) != null
        ) {
          callback();
        } else {
          callback(new Error(this.generatePoint("urlInvalid")));
        }
      }
    },
    // 列表数据
    fetchData() {
      let _this = this;
      _this.listLoading = true;
      getAdvertList(this.listQuery).then(function(res) {
        console.log("列表  -", res);
        _this.listLoading = false;
        _this.list = res.data.content; // 列表数据
        _this.total = res.data.totalPages; // 总页数
      });
    },
    // 查询
    queryAdvertBottom() {
      this.fetchData();
    },
    // 显示编辑页面
    showAddAdvertView() {
      let _this = this;
      _this.dialogStatus = "create"; // 标示创建
      _this.dialogFormVisible = true; // 展示弹窗
    },
    // 超出文件上传个数时触发
    exceedUpload(file, fileList) {
      // this.$message.error("超过最大上传数量,目前只可上传1张");
      this.$notify({
        title: this.generatePoint("notifyWarning.title"),
        message: this.generatePoint("notifyWarning.message"),
        type: "warning"
      });
    },
    // 监听区域查询社区 表单
    handleAreaForm(val) {
      this.getCommuntity(1, val[2]); // 查询社区
    },
    // 更新社区
    getCommuntity(code, val) {
      let _this = this;
      getCommuntityByArea({ areaCode: val }).then(function(res) {
        let newData = [];
        res.data.forEach(function(v) {
          newData.push({
            label: v.name,
            key: v.id,
            pinyin: v.name
          });
        });
        _this.data = newData;
      });
    },
    createData() {
      let _this = this;
      _this.buttonLoading = true; // 按钮加载中
      _this.$refs.advertFormBottom.validate(valid => {
        console.log(_this.advertFormBottom);
        if (valid) {
          console.log(_this.advertFormBottom);
          addAdver({
            communtity: _this.advertFormBottom.communtity.join(","),
            cover: _this.advertFormBottom.cover,
            endDate: _this.advertFormBottom.endDate,
            startDate: _this.advertFormBottom.startDate,
            title: _this.advertFormBottom.title,
            url: _this.advertFormBottom.url,
            dayTime: _this.advertFormBottom.dayTime
          }).then(function(res) {
            console.log("res ---- ", res);
            _this.buttonLoading = false; // 清楚加载中
            if (res.message == "SUCCESS") {
              _this.dialogFormVisible = false;
              _this.$notify({
                title: _this.generatePoint("notifySuccess.title"),
                message: _this.generatePoint("notifySuccess.message"),
                type: "success"
              });
            } else {
              _this.$message.error(_this.generatePoint("system"));
            }
            _this.fetchData();
          });
        } else {
          _this.buttonLoading = false; // 清楚加载中
          return false;
        }
      });
    },
    // 删除数据
    deleteData(row) {
      console.log("删除", row);
      let _this = this;
      this.$confirm(_this.generatePoint("delete"))
        .then(_ => {
          deleteAdver({ id: row.id }).then(function(res) {
            if (res.message == "SUCCESS") {
              _this.$notify({
                title: _this.generatePoint("notifySuccess.title"),
                message: _this.generatePoint("notifySuccess.message5"),
                type: "success"
              });
            } else {
              _this.$message.error(_this.generatePoint("system"));
            }
            _this.fetchData();
          });
        })
        .catch(_ => {});
    },
    handleAvatarSuccess(res, file) {
      // console.log("handleAvatarSuccess --", res, file);
      this.advertFormBottom.cover = res.data;
    },
    close() {
      console.log("关闭");
      this.advertFormBottom = {
        title: "",
        type: "",
        content: "",
        communtity: [],
        areaOptionsVal: [] // 清空省市区
      };
      // this.data = []; // 清空穿梭框
      // this.$refs.wangeditor.initContent(); // 重置富文本内容
      this.$refs.advertFormBottom.resetFields();
      this.fileList = [];
      this.dialogFormVisible = false;
    }
  }
};
</script>