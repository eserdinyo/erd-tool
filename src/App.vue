<template lang="pug">
  #app
    app-header
    router-view
</template>

<script>
import AppHeader from "@/components/global/Header";
export default {
  name: "App",
  components: {
    AppHeader
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
  font-size: 14px;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}

.aLabel {
  color: #fff;
  padding: 0.1rem .5rem;
  border-radius: 3px;
  font-size: 12px;
  border: 1px solid #333;
  cursor: pointer;
}
</style>
