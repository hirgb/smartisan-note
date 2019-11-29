<template>
  <div id="app">
    <Editor />
  </div>
</template>

<script>
import Editor from './components/Editor.vue'

export default {
  name: 'app',
  components: {
    Editor
  }
}
</script>

<style>
* {
    padding: 0;
    margin: 0;
}

#app {
    padding: 0;
    margin: 0;
    font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "Hiragino Sans GB", "Microsoft Yahei", 微软雅黑, STHeiti, 华文细黑, sans-serif;
    font-size: 14px;
}
</style>
