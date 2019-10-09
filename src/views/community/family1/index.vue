<template>
  <div class="family">家庭</div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    let user = JSON.parse(localStorage.getItem("user"))
    console.log("user --- ", user);
  }
};
</script>
<style lang="scss" scoped>
.family {

}
</style>