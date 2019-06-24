<template>
  <div class="editor">
    <h3>请输入正文内容</h3>
    <div id="editor" ></div>
  </div>
</template>
<style lang="scss">
.editor {
    margin: 50px 0 50px 0;
}
</style>
<script>
import E from "wangeditor";
export default {
  data() {
    return {};
  },
  mounted() {
    let editor = new E("#editor");
    editor.create();
  }
};
</script>
