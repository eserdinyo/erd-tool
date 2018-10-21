<template lang="pug">
  .sidebar
    h4 Entity Relationship
    button.aktarBtn(@click="createTable", v-if="!show") Veri Tabanına Aktar
    br
    hr(v-if="show")
    router-link.aktarBtn(to='/tables', tag="button", v-if="show") Dönüştür
</template>

<script>
export default {
  data() {
    return {
      show: true
    };
  },
  methods: {
    createTable() {
      this.$store.dispatch("sendDatabase");
    }
  },
  created() {
    if (this.$route.name == "tables") {
      this.show = false;
    }
  }
};
</script>


<style lang="scss" scoped>
.sidebar {
  background-color: #f2f2f2;
  padding: 30px 10px;
  width: 300px;
  border-right: 1px solid rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  height: 100vh;
  color: #5a5a5a;
  text-align: center;
  flex-grow: 1;
}

h4 {
  text-align: center;
  background-color: rgba(#5a5a5a, 0.1);
  border: none;
  border-radius: 4px;
  padding: 10px 10px;
  margin-bottom: 20px;
  user-select: none;
}

.btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  padding: 3px 10px;
  transition: all 0.2s;
  &:active {
    background-color: #e0d8d8;
  }
}

.varlikBtn {
  margin-bottom: 10px;
  background-color: #f1c40f;
  color: #fff;
  padding: 8px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
  &:active {
    background-color: #d3ac12;
  }
}

.aktarBtn {
  background-color: #1abc9c;
  color: #fff;
  padding: 8px 10px;
  border: none;
  border-radius: 4px;
  margin-top: 20px;
  cursor: pointer;
  outline: none;

  transition: all 0.2s;
  &:active {
    background-color: #0fa083;
  }
}

select {
  margin-right: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>

