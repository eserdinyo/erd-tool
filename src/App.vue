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
    AppHeader,
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

</style>
