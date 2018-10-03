<template lang="pug">
  .header   
    .top
        a.logo(href="#") Database ER Diagram
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

      .bottom__selects
        .bottom__selects--1
          .dropdownbox.dropdownbox__1.sekiller
            img.dropdownSelected(src='../../assets/img/line_long.png', alt='icon')
          ul#Sekiller.menu.menu__1
              li#1(@click="dashStyle(1)")
                img(src='../../assets/img/line_long.png', alt='icon')
              li#2(@click="dashStyle(2)")
                img(src='../../assets/img/dashed.png', alt='icon')
              li#3(@click="dashStyle(3)")
                img(src='../../assets/img/left_dashed.png', alt='icon')
              li#4(@click="dashStyle(4)")
                img(src='../../assets/img/right_dashed.png', alt='icon')
        .bottom__selects--2
          .dropdownbox.dropdownbox__2.sekiller
            img.dropdownSelected(src='../../assets/img/line.png', alt='icon')
          ul#Sekiller.menu
              li#1(@click="setLeftEndpoint(1)")
                img(src='../../assets/img/line.png', alt='icon')
              li#2(@click="setLeftEndpoint(2)")
                img(src='../../assets/img/line_left.png', alt='icon')
              li#3(@click="setLeftEndpoint(3)")
                img(src='../../assets/img/arrow_left.png', alt='icon')
              li#4(@click="setLeftEndpoint(4)")
                img(src='../../assets/img/arrow_break_left.png', alt='icon')
        .bottom__selects--3
          .dropdownbox.dropdownbox__3.sekiller
            img.dropdownSelected(src='../../assets/img/line.png', alt='icon')
          ul#Sekiller.menu
              li#1(@click="setRightEndpoint(1)")
                img(src='../../assets/img/line.png', alt='icon')
              li#2(@click="setRightEndpoint(2)")
                img(src='../../assets/img/line_right.png', alt='icon')
              li#3(@click="setRightEndpoint(3)")
                img(src='../../assets/img/arrow_right.png', alt='icon')
              li#4(@click="setRightEndpoint(4)")
                img(src='../../assets/img/arrow_break_right.png', alt='icon')
      
        .buttons
          button.addBtn(@click='addItem') +
          button.subBtn(:disabled='firstItemKey == 0', @click='subItem') -

      
</template>

<script>
import { EventBus } from "@/main";
import $ from "jquery";

export default {
  data() {
    return {
      isActive: true,
      activeProfil: false
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
    makeSelect() {
      $(".sekiller").on("click", function() {
        $(this)
          .next(".menu")
          .toggleClass("showMenu");
        $(".menu > li").click(function() {
          var imgSource = $(this)
            .children("img")
            .attr("src");
          var id = $(this)
            .children("img")
            .attr("id");

          if (imgSource.length > 0) {
            $(this)
              .parent("ul")
              .prev(".dropdownbox")
              .children("img")
              .attr("src", imgSource);
            $(this)
              .parent("ul")
              .prev(".dropdownbox")
              .children("img")
              .attr("data-id", id);
            $(this)
              .parent("ul")
              .prev(".dropdownbox")
              .children("img")
              .css("display", "block");
            $(this)
              .parent("ul")
              .removeClass("showMenu");
            $(".dropdownText").hide();
          } else {
            $(".dropdownText").show();
            $(this)
              .parent("ul")
              .prev(".dropdownbox")
              .children("img")
              .css("display", "none");
          }
        });
      });
    },
    setLeftEndpoint(key) {
      this.$store.commit("setLeftEndpoint", key);
    },
    setRightEndpoint(key) {
      this.$store.commit("setRightEndpoint", key);
    },
    dashStyle(type) {
      EventBus.$emit("emitDashStyle", type);
    }
  },
  mounted() {
    this.makeSelect();
  }
};
</script>


<style lang="scss" scoped>
@import "@/style/main.scss";

.buttons {
  margin-left: 20px;
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
