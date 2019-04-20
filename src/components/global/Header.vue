<template lang="pug">
  .header   
    .top
        router-link.logo(to="/") Database ER Diagram
        router-link.login(v-if="!isLoggedIn",:to="{ name: 'login'}") Login
        router-link.register(v-if="!isLoggedIn",:to="{ name: 'register'}") Register
        a(href="#", @click="activeProfil = !activeProfil", v-if="isLoggedIn") Muhammet ESER
        .profil(:class="{activeProfil : activeProfil}", )
          router-link(to="/projects") My Projects
          a(href="#") Setting
          a(@click="logout") Log Out
    .bottom(v-if="isLoggedIn")
      ul.menu__ctn
        li(@click="isActive = !isActive") File
          ul.menu__ctn--file(:class="{active: isActive}", @mouseleave="isActive = !isActive")
            li 
              a(@click="openNewProjectBox") New Project
            li Rename
            li Save
            li Save As
            hr.line
            li Import
            li Export
        li Edit
        li View
        li Help
</template>

<script>
import { EventBus } from "@/main";
import firebase, { firestore } from "firebase";

export default {
  name: "Header",
  data() {
    return {
      isActive: true,
      activeProfil: false,
      show: true,
      isLoggedIn: false,
      currentUser: ""
    };
  },
  computed: {
    firstItemKey() {
      return this.$store.getters.itemKey;
    }
  },
  methods: {
    addItem() {
      this.$store.dispatch("addItem");
    },
    subItem() {
      this.$store.dispatch("subItem");
    },
    openNewProjectBox() {
      EventBus.$emit("openProjectBox", 1);
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
    if (firebase.auth().currentUser) {
      this.isLoggedIn = true;
      this.currentUser = firebase.auth().currentUser.email;
      this.$store.commit("setUserID", firebase.auth().currentUser.uid);
      this.$store.dispatch("getProjects");
    }
  }
};
</script>


<style lang="scss" scoped>
@import "@/style/main.scss";

.top {
  a {
    cursor: pointer;
  }
}

.menu__ctn {
  z-index: 9;
  
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
</style>
