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
            img.dropdownSelected(src='../assets/img/line_long.png', alt='icon')
          ul#Sekiller.menu.menu__1
              li#1(@click="dashStyle(1)")
                img(src='../assets/img/line_long.png', alt='icon')
              li#2(@click="dashStyle(2)")
                img(src='../assets/img/dashed.png', alt='icon')
              li#3(@click="dashStyle(3)")
                img(src='../assets/img/left_dashed.png', alt='icon')
              li#4(@click="dashStyle(4)")
                img(src='../assets/img/right_dashed.png', alt='icon')
        .bottom__selects--2
          .dropdownbox.dropdownbox__2.sekiller
            img.dropdownSelected(src='../assets/img/line.png', alt='icon')
          ul#Sekiller.menu
              li#1(@click="leftEndpoint(1)")
                img(src='../assets/img/line.png', alt='icon')
              li#2(@click="leftEndpoint(2)")
                img(src='../assets/img/line_left.png', alt='icon')
              li#3(@click="leftEndpoint(3)")
                img(src='../assets/img/arrow_left.png', alt='icon')
              li#4(@click="leftEndpoint(4)")
                img(src='../assets/img/arrow_break_left.png', alt='icon')
        .bottom__selects--3
          .dropdownbox.dropdownbox__3.sekiller
            img.dropdownSelected(src='../assets/img/line.png', alt='icon')
          ul#Sekiller.menu
              li#1(@click="rightEndpoint(5)")
                img(src='../assets/img/line.png', alt='icon')
              li#2(@click="rightEndpoint(6)")
                img(src='../assets/img/line_right.png', alt='icon')
              li#3(@click="rightEndpoint(7)")
                img(src='../assets/img/arrow_right.png', alt='icon')
              li#4(@click="rightEndpoint(8)")
                img(src='../assets/img/arrow_break_right.png', alt='icon')
      
        .buttons
          button.addBtn(@click='addItem') +
          button.subBtn(:disabled='key == 1', @click='subItem') -

      
</template>

<script>
import { EventBus } from "../main";
import $ from "jquery";

export default {
  data() {
    return {
      isActive: true,
      activeProfil: false,
      key: ""
    };
  },
  methods: {
    addItem() {
      EventBus.$emit("emitAdd", 1);
    },
    subItem() {
      EventBus.$emit("emitSub", 1);
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
    leftEndpoint(key) {
      EventBus.$emit("emitLeftEndpoint", key);
    },
    rightEndpoint(key) {
      EventBus.$emit("emitRightEndpoint", key);
    },
    dashStyle(type) {
      EventBus.$emit("emitDashStyle", type);
    }
  },
  created() {
    EventBus.$on("emitKey", key => {
      this.key = key;
    });
  },
  mounted() {
    this.makeSelect();
  }
};
</script>


<style lang="scss" scoped>
// ******** //
// BUTTONS  //
// ******** //

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

// ********* //
// SELECBOX //
// ********* //

.dropdownbox {
  margin: 0 auto;
  width: 70px;
  height: 20px;
  color: rgb(254, 238, 223);
  cursor: pointer;
  border: 1px solid rgb(155, 155, 155);
  color: #191919;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  padding: 1px 5px;
  background-color: #fff;
  img {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  &__1 {
    border-radius: 5px;
    width: 100px;

    &::before {
      content: "\A";
      border-style: solid;
      border-width: 5px 8px 5px 0;
      transform: rotate(270deg);
      border-color: transparent #3d4752 transparent transparent;
      position: absolute;
      margin-left: 80px;
      margin-top: 3px;
    }
  }
  &__2 {
    border-right: none;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;

    &::before {
      content: "\A";
      border-style: solid;
      border-width: 5px 8px 5px 0;
      transform: rotate(270deg);
      border-color: transparent #3d4752 transparent transparent;
      position: absolute;
      margin-left: 50px;
      margin-top: 3px;
    }
  }
  &__3 {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;

    &::before {
      content: "\A";
      border-style: solid;
      border-width: 5px 8px 5px 0;
      transform: rotate(270deg);
      border-color: transparent #3d4752 transparent transparent;
      position: absolute;
      margin-left: 50px;
      margin-top: 3px;
    }
  }
}

ul.menu {
  position: absolute;
  margin: 0 auto;
  overflow: hidden;
  height: 0;
  background: #fff;
  color: rgb(254, 241, 240);
  cursor: pointer;
  user-select: none;
  -moz-user-select: none;
  /* Safari */
  -khtml-user-select: none;
  z-index: 1;
  width: 80px;
  -webkit-box-shadow: 0px 2px 24px 1px rgba(143, 143, 143, 1);
  -moz-box-shadow: 0px 2px 24px 1px rgba(143, 143, 143, 1);
  box-shadow: 0px 2px 24px 1px rgba(143, 143, 143, 1);

  &__1 {
    width: 100px;
  }
}

ul.menu li {
  &:nth-child(1) {
    padding: 12px 0;
  }
  font-family: Arial, Helvetica, sans-serif;
  padding: 7px 0;
  font-size: 14px;
  line-height: 1.4em;
  -webkit-transition: all 0.2s;
  -moz-transition: all 0.2s;
  -o-transition: all 0.2s;
  transition: all 0.2s;
  border-bottom: 1px dotted rgb(254, 238, 223);
  color: #3d4752;
  text-align: center;
  display: flex;
  justify-content: center;
  align-content: center;
}

ul.menu li:hover {
  background-color: rgb(235, 235, 235);
}

.menu.showMenu {
  /*-moz-transform:scale(1);*/
  height: auto !important;
}

.header {
  background-color: #f2f2f2;

  hr.line {
    border: 0;
    height: 1px;
    background: #333;
    margin: 5px 0;
    background-image: linear-gradient(to right, #ccc, #c0392b, #ccc);
  }

  .top {
    background-color: #3d4752;
    padding: 10px 20px;

    a {
      color: #fff;
      font-weight: 600;
      font-size: 13px;
      text-decoration: none;
      user-select: none;
    }

    display: flex;
    justify-content: space-between;

    p {
      font-weight: 600;
      font-size: 13px;
    }
  }

  .bottom {
    display: flex;
    align-items: center;

    &__selects {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      select {
        border-color: rgb(155, 155, 155);
        padding: 1px 0;
      }
      &--1 {
        margin-right: 10px;
        border-radius: 5px;
      }
      &--2 {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-right: none;
      }
      &--3 {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    }
  }
  .menu__ctn {
    padding: 5px 20px;
    ul {
      list-style-type: none;
    }

    & > li {
      color: #5a5a5a;
      font-weight: 600;
      text-decoration: none;
      font-size: 13px;
      position: relative;

      display: inline;
      padding: 5px 15px;
      transition: all 0.2s;
      &:hover {
        background-color: #dfdfdf;
        cursor: pointer;
      }
    }

    &--file {
      position: absolute;
      margin-top: 5px;
      width: 230px;
      background-color: #f2f2f2;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      padding-top: 5px;
      padding-bottom: 5px;
      li {
        padding: 5px 25px;
        transition: all 0.2s;
        &:hover {
          background-color: #dfdfdf;
        }
      }
    }
  }
}

.active {
  display: none;
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
