<template lang="pug">
    .cover
      .main
        h2 Projects
        .Projects
          .Project(v-for="project in projects", @click="setProjectID(project)", :class="{activeProject: project.id == projectID}")
            .Project__name {{project.projectName}}

</template>

<script>
import AppToolbar from "@/components/global/Toolbar";
import { mapGetters } from "vuex";
import { EventBus } from "@/main";

export default {
  components: {
    AppToolbar
  },
  methods: {
    setProjectID(project) {
      localStorage.setItem("projectID", project.id);
      this.$store.commit("setProjectID", project.id);
      setTimeout(() => {
        this.$router.push({ name: "home" });
        EventBus.$emit("initProject", 1);
      }, 500);
    }
  },
  computed: {
    ...mapGetters(["projects", "projectID"])
  }
};
</script>


<style lang="scss" scoped>
.cover {
  display: flex;
}

.main {
  border: 1px solid rgba(#000, 0.2);
  width: 100%;
  height: 100vh;
  h2 {
    margin-top: 40px;
    margin-left: 20px;
    margin-bottom: 20px;
  }
}

.Projects {
  margin: 0 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 20px;
}

.Project {
  border: 1px solid #ccc;
  padding: 20px;
  cursor: pointer;
  text-align: left;
  font-weight: bold;
  border-radius: 5px;
  transition: all 0.1s;

  &:hover {
    border-color: #1abc9c;
  }
}

.activeProject {
  background-color: #1abc9c;
  border-color: #1abc9c71;
  color: #fff;
}
</style>
