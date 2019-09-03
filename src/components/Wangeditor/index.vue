<template>
  <div class="editor">
    <!-- <h3>请输入正文内容</h3> -->
    <div id="editor"></div>
  </div>
</template>
<style lang="scss">
.w-e-toolbar {
  flex-wrap: wrap;
}
</style>
<script>
import E from "wangeditor";
import { overall } from "@/constant/index";
export default {
  data() {
    return {
      editor: null,
      updateURL: overall.uploadUrl
    };
  },
  mounted() {
    this.editor = new E("#editor");
    let _this = this;
    // 隐藏“网络图片”tab
    this.editor.customConfig.showLinkImg = false;
    this.editor.customConfig.uploadImgMaxLength = 1;
    this.editor.customConfig.uploadFileName = "file"; //上传参数 自定义
    this.editor.customConfig.uploadImgParams = {
      type: "card_content",
    };
    this.editor.customConfig.uploadImgServer = this.updateURL; // 上传图片到服务器
    this.editor.customConfig.uploadImgHooks = {
      customInsert: function(insertImg, result, editor) {
        console.log("insertImg -- ", insertImg);
        console.log("result -- ", result);
        console.log("editor -- ", editor);
        var url = result.data;
        insertImg(url);
      }
    };

    // 自定义菜单配置
    this.editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "emoticon", // 表情
      "image", // 插入图片
      "table", // 表格
      "video", // 插入视频
      "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];

    this.editor.create();
  },
  methods: {
    uploadInit() {},

    // 获取内容
    getContentHtml() {
      return this.editor.txt.html();
    },
    getContentText() {
      return this.editor.txt.text();
    },
    initContent() {
      this.editor.txt.html("");
    },
    setContent(content) {
      this.editor.txt.html(content)
    },
    onDisable() {
      this.editor.disable(); 
    }
  }
};
</script>
