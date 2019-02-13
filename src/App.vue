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
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}

.aLabel {
  background-color: #c0392b;
  color: #fff;
  padding: 0.1rem .5rem;
  border-radius: 3px;
  font-size: 12px;
  border: 1px solid #333;
  cursor: pointer;
}
</style>
