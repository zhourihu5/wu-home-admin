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
      updateURL: overall.uploadMult,
      uploadParams: {
        type: "card_content"
      }
    };
  },
  mounted() {
    this.editor = new E("#editor");
    this.uploadInit();
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
    uploadInit() {
    
      let _this = this;
      // 隐藏“网络图片”tab
      this.editor.customConfig.showLinkImg = false;
      this.editor.customConfig.uploadImgServer = this.updateURL; // 上传图片到服务器
      this.editor.customConfig.uploadImgParams = _this.uploadParams;
      // this.editor.customConfig.uploadImgParams =

      this.editor.customConfig.uploadImgHooks = {
        before: function(xhr, editor, files) {
          console.log("上传前", xhr, editor, files);
          _this.editor.customConfig.uploadImgParams.file = files;

          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //     prevent: true,
          //     msg: '放弃上传'
          // }
        },
        success: function(xhr, editor, result) {
          console.log("result -- ", result)
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        fail: function(xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function(xhr, editor) {
          console.log("错误", _this.updateURL);
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function(xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },

        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function(insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          console.log("allala- --- ", result)
          var url = result.url;
          insertImg(url);

          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      };
    },

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
