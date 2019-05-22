<template lang="pug">
  .toolbar
    a.link(@click='addEntity')
      img(src="../../assets/img/table.png")
    hr
    a.link(@click="sendConnType(0, dashType1)")
      img(src="../../assets/img/conn1.png")
    a.link(@click="sendConnType(4, dashType1)")
      img(src="../../assets/img/conn3.png")
    a.link(@click="sendConnType(10, dashType1)")
      img(src="../../assets/img/conn6.png")
    hr
    a.link(@click="sendConnType(1, dashType2)")
      img(src="../../assets/img/conn2.png")
    a.link(@click="sendConnType(5, dashType2)")
      img(src="../../assets/img/conn4.png")
    a.link(@click="sendConnType(15, dashType2)")
      img(src="../../assets/img/conn12.png")
    a.link(@click="sendConnType(11, dashType2)")
      img(src="../../assets/img/conn5.png")
    a.link(@click="sendConnType(13, dashType2)")
      img(src="../../assets/img/conn10.png")
    a.link(@click="sendConnType(14, dashType2)")
      img(src="../../assets/img/conn11.png")
    hr
    a.link(@click="sendConnType(2, dashType3)")
      img(src="../../assets/img/conn7.png")
    a.link(@click="sendConnType(6, dashType3)")
      img(src="../../assets/img/conn8.png")
    //a.link(@click="sendConnType(16, dashType4)")
      img(src="../../assets/img/conn16.png")
    hr
    a.link(@click='makeYay')
      img(src='../../assets/img/yay.png')

</template>

<script>
import { ref, refConnType, refDashType, refGlobalConnType } from "@/firebase";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dashType1: "0 5 5",
      dashType2: "150 5 0",
      dashType3: "150 5 3",
      dashType4: "5 150 3",
      globalConnType: ""
    };
  },
  computed: {
    ...mapGetters(["activeEntity"])
  },
  methods: {
    async sendConnType(connType, dashType) {
      if (connType == 2 || connType == 6 || connType == 12 || connType == 16)
        this.globalConnType = "Bezier";
      else this.globalConnType = "Flowchart";
      await refConnType.update({ connType });
      await refDashType.update({ dashType });
      await refGlobalConnType.update({ globalConnType: this.globalConnType });
      location.reload();
    },
    addEntity() {
      this.$store.dispatch("addEntity");
      location.reload();
    },
    makeYay() {
      ref.child(this.activeEntity).update({ isYay: true });
    }
  },
  created() {
    console.log(this.activeEntity);
  }
};
</script>


<style lang="scss" scoped>
.toolbar {
  background-color: #f5f6fa;
  width: 50px;
  border-right: 1px solid rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  height: 100vh;
  color: #5a5a5a;
  text-align: center;
  flex-grow: 1;
  cursor: pointer;
}

.link {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1px;
  padding: 20px 5px;
  width: auto;
  user-select: none;

  &:hover {
    background: #74baff75;
  }
  img {
    width: 25px;
  }
}
</style>