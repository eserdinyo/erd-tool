<template lang="pug">
  .header   
    .top
        router-link.logo(to="/") Database ER Diagram
        a(href="#", @click="activeProfil = !activeProfil") Muhammet ESER
        .profil(:class="{activeProfil : activeProfil}", )
          a(href="#") Setting
          a(href="#") Log Out
    .bottom
      ul.menu__ctn
        li(@click="isActive = !isActive") File
          ul.menu__ctn--file(:class="{active: isActive}", @mouseleave="isActive = !isActive")
            li New Document
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
export default {
  name: "Header",
  data() {
    return {
      isActive: true,
      activeProfil: false,
      show: true
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
    }
  },
  watch: {
    $route() {
      if (this.$route.name == "tables") {
        this.show = false;
      } else {
        this.show = true;
      }
    }
  }
};
</script>


<style lang="scss" scoped>
@import "@/style/main.scss";

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
  display: flex;
  flex-direction: column;
  padding: 12px 28px;
  position: absolute;
  right: 1%;
  margin-top: 25px;
  transition: all 0.2s;
  transform: translateY(-20%);
  opacity: 0;

  &::before {
    content: "\A";
    border-style: solid;
    border-width: 5px 8px 5px 0;
    border-color: transparent #fff transparent transparent;
    position: absolute;
    top: -10%;
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
  opacity: 1;
}
</style>
