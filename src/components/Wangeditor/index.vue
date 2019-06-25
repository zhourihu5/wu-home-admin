<template>
  <div class="editor">
    <!-- <h3>请输入正文内容</h3> -->
    <div id="editor"></div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import E from "wangeditor";
export default {
  data() {
    return {
      editor: null
    };
  },
  mounted() {
    this.editor = new E("#editor");
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
      // "image", // 插入图片
      "table", // 表格
      "video", // 插入视频
      "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];

    this.editor.create();
  },
  methods: {
    // 获取内容
    getContentHtml() {
      return this.editor.txt.html();
    },
    getContentText() {
      return this.editor.txt.text();
    },
    initContent() {
     this.editor.txt.html("");
    }
  }
};
</script>
