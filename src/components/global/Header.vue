<template>
  <div class="header">
    <div class="top">
      <router-link class="logo" to="/">Database ER Diagram</router-link>
      <router-link class="login" v-if="!isLoggedIn" :to="{ name: 'login' }"
        >Login</router-link
      >
      <router-link
        class="register"
        v-if="!isLoggedIn"
        :to="{ name: 'register' }"
        >Register</router-link
      ><a href="#" @click="activeProfil = !activeProfil" v-if="isLoggedIn"
        >Muhammet ESER</a
      >
      <div class="profil" :class="{ activeProfil: activeProfil }">
        <router-link to="/projects">My Projects</router-link
        ><a href="#">Setting</a><a @click="logout">Log Out</a>
      </div>
    </div>
    <div class="bottom" v-if="isLoggedIn">
      <div class="menu__ctn">
        <div class="active-project">
          Project Name <i class="fa fa-chevron-down"></i>
        </div>
        <div class="projects">
          <div
            class="projects-item projects-new"
            @click="isNewProjectOpen = true"
          >
            <i class="fa fa-plus icon"></i> New Project
          </div>
          <div
            class="projects-item"
            v-for="p in projects"
            :key="p.id"
            @click="setProjectID(p)"
          >
            {{ p.projectName }}
          </div>
        </div>
      </div>
    </div>

    <div class="popup" v-if="isNewProjectOpen">
      <div class="popup__title">New Project</div>
      <input v-model="projectName" placeholder="Project Name" /><a
        class="popup__btn"
        @click="createProject"
        >Create</a
      ><a class="popup__close" @click="isNewProjectOpen = false">x</a>
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/main";
import firebase, { firestore } from "firebase";
import { refProjects } from "@/firebase/";
import { mapGetters } from "vuex";

export default {
  name: "Header",
  data() {
    return {
      isActive: true,
      activeProfil: false,
      show: true,
      isLoggedIn: false,
      currentUser: "",
      isNewProjectOpen: false,
      projectName: "",
      currentUser: ""
    };
  },
  computed: {
    firstItemKey() {
      return this.$store.getters.itemKey;
    },
    ...mapGetters(["projects", "projectID"])
  },
  methods: {
    setProjectID(project) {
      localStorage.setItem("project", project);
      this.$store.commit("setProjectID", project.id);
      setTimeout(() => {
        this.$router.push("/");
        EventBus.$emit("initProject", 1);
      }, 500);
    },
    openNewProjectBox() {
      EventBus.$emit("openProjectBox", 1);
    },
    createProject() {
      refProjects.push({
        projectName: this.projectName,
        userID: this.currentUser.uid
      }).then(res => {
        console.log(res.response);
      })

      this.isNewProjectOpen = false;
      this.projectName = "";
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.go({ path: this.$router.path });
        });
    }
  },
  watch: {
    $route() {
      if (this.$route.name == "tables") {
        this.show = false;
      } else {
        this.show = true;
      }

      this.activeProfil = false;
    }
  },
  created() {
    this.currentUser = firebase.auth().currentUser;

    if (firebase.auth().currentUser) {
      this.isLoggedIn = true;
      this.$store.commit("setUserID", firebase.auth().currentUser.uid);
      this.$store.dispatch("getProjects");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/style/main.scss";

.top {
  background-color: red;
  a {
    cursor: pointer;
  }
}
.active-project {
  background-color: #2c3e50;
  color: #fff;
  padding: 3px 8px;
  border-radius: 5px;
  cursor: pointer;
}

.projects {
  position: absolute;
  left: 50px;
  top: 35px;
  background-color: #2c3e50;
  color: white;
  padding: 10px 0;
  width: 100%;
  border-radius: 5px;

  display: none;

  &-new {
    text-align: center;

    .icon {
      margin-right: 5px;
    }
  }

  &-item {
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.1s;

    &:hover {
      background-color: rgb(51, 88, 124);
    }
  }
}

.menu__ctn {
  z-index: 9;
  position: relative;

  .fa {
    font-size: 12px;
    margin-left: 10px;
  }

  &:hover {
    .projects {
      display: block;
    }
  }
}
.buttons {
  margin-left: 20px;
  user-select: none;
  & > * {
    height: 20px;
    width: 20px;
    margin-left: 5px;
    background: #fff;
    border: 1px solid rgb(155, 155, 155);
    border-radius: 3px;
    color: #191919;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
  }
}

.subBtn {
  &:disabled {
    cursor: not-allowed;
  }
}

.profil {
  background-color: #3d4752;
  color: #fff;
  flex-direction: column;
  padding: 12px 28px;
  position: absolute;
  right: 1%;
  margin-top: 32px;
  transition: all 0.2s;
  transform: translateY(-20%);
  display: none;

  &::before {
    content: "\A";
    border-style: solid;
    border-width: 5px 8px 5px 0;
    border-color: transparent #3d4752 transparent transparent;
    position: absolute;
    top: -8%;
    left: 50%;
    transform: translateX(-50%) rotate(90deg);
  }

  a {
    padding: 8px 5px;
    transition: all 0.2s;

    &:hover {
      color: #ccc;
    }
  }
}

.activeProfil {
  transform: translateY(0);
  display: flex;
}

.login {
  margin-left: auto;
  margin-right: 10px;
}

.register {
  margin-right: 10px;
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
