<template lang="pug">
    .cover
        .main
          app-table(v-for="table in tables",
            :table="table"
            :key="table.id")
        app-sidebar

</template>

<script>
import AppSidebar from "@/components/global/Sidebar";
import AppTable from "@/components/Table";

import { EventBus } from "@/main";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["tables"])
  },
  components: {
    AppSidebar,
    AppTable
  },
  created() {
    this.$store.dispatch("getTables");
  }
};
</script>

<style lang="scss" scoped>
.cover {
  display: flex;
}
.main {
  background: #f5f6fa;
  border: 1px solid rgba(#000, 0.2);
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
}
</style>


