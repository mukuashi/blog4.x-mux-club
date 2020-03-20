<template>
  <article class="home animation-scale-up">
    <h1>{{app.name}}</h1>
  </article>
</template>
<style lang="less" scoped src="./index.less"></style>
<script>
import app from "@/config";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      app
    };
  },
  methods: {}
};
</script>