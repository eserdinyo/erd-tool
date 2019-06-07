<template lang="pug">
    .cover
      .main
        h2 Projects
        .Projects
          .Project(v-for="project in projects", @click="setProjectID(project)", :class="{activeProject: project.id == projectID}")
            .Project__name {{project.projectName}}
      .popup(v-if="isNewProjectOpen")
        .popup__title New Project
        input(v-model="projectName", placeholder="Project Name")
        a.popup__btn(@click="createProject") Create
        a.popup__close(@click="isNewProjectOpen = false") x

</template>

<script>
import AppToolbar from "@/components/global/Toolbar";
import { mapGetters } from "vuex";
import { EventBus } from "@/main";
import { refProjects } from "@/firebase/";
import firebase from "firebase";

export default {
  components: {
    AppToolbar
  },
  data() {
    return {
      isNewProjectOpen: false,
      projectName: "",
      currentUser: ""
    };
  },
  methods: {
    setProjectID(project) {
      localStorage.setItem("projectID", project.id);
      this.$store.commit("setProjectID", project.id);
      setTimeout(() => {
        this.$router.push({ name: "home" });
        EventBus.$emit("initProject", 1);
      }, 500);
    },
    createProject() {
      refProjects.push({
        projectName: this.projectName,
        userID: this.currentUser.uid
      });

      this.isNewProjectOpen = false;
      this.projectName = "";
    }
  },
  computed: {
    ...mapGetters(["projects", "projectID"])
  },
  created() {
    EventBus.$on("openProjectBox", () => {
      this.isNewProjectOpen = true;
    });

    this.currentUser = firebase.auth().currentUser;
  }
};
</script>


<style lang="scss" scoped>
.cover {
  display: flex;
  background-color: #2c3e50;
}

.main {
  border: 1px solid rgba(#000, 0.2);
  width: 100%;
  height: 100vh;
  h2 {
    margin-top: 40px;
    margin-left: 20px;
    margin-bottom: 20px;
    color: #ecf0f1;
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
  border-radius: 100px;
  transition: all 0.1s;
  color: #ecf0f1;

  &:hover {
    border-color: #1abc9c;
  }
}

.activeProject {
  background-color: #1abc9c;
  border-color: #1abc9c71;
  color: #fff;
}

.popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 300px;
  width: 300px;
  border-radius: 3px;
  background-color: #ddd;
  z-index: 9999999;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6);
  padding: 10px;

  input {
    width: 100%;
    padding: 0.5rem 1rem;
    margin-top: 1rem;
  }

  &__title {
    text-align: center;
    text-transform: uppercase;
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;
  }
  .entities {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    margin-top: 20px;
  }
  .entity {
    height: 30px;
    width: auto;
    border: 1px solid #1abc9c;
    border-radius: 3px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;
    cursor: pointer;

    p {
      font-weight: bold;
    }
  }

  &__btn {
    padding: 10px;
    font-size: 14px;
    background-color: #1abc9c;
    color: #fff;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 3px;
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
  }
  &__close {
    position: absolute;
    right: 8px;
    top: 8px;
    cursor: pointer;
  }

  &__choosed {
    background-color: #1abc9c;

    p {
      color: #fff;
    }
  }
}
</style>
