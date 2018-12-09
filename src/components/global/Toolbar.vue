<template lang="pug">
  .toolbar

    a.link(@click='addEntity')
      img(src="../../assets/img/table.png")
    hr
    a.link(@click="sendConnType(0, dashType1)")
      img(src="../../assets/img/conn1.png")
    a.link(@click="sendConnType(2, dashType1)")
      img(src="../../assets/img/conn3.png")
    a.link(@click="sendConnType(11, dashType1)")
      img(src="../../assets/img/conn6.png")
    hr
    a.link(@click="sendConnType(0, dashType2)")
      img(src="../../assets/img/conn2.png")
    a.link(@click="sendConnType(2, dashType2)")
      img(src="../../assets/img/conn4.png")
    a.link(@click="sendConnType(10, dashType2)")
      img(src="../../assets/img/conn5.png")
    hr
    a.link(@click="sendConnType(0, dashType3)")
      img(src="../../assets/img/conn7.png")
    a.link(@click="sendConnType(2, dashType3)")
      img(src="../../assets/img/conn8.png")
    a.link(@click="sendConnType(11, dashType3)")
      img(src="../../assets/img/conn9.png")
    
    
    
</template>

<script>
import { refConnType, refDashType } from "@/firebase";

export default {
  data() {
    return {
      dashType1: "0 5 5",
      dashType2: "150 5 0",
      dashType3: "150 5 3",
    };
  },
  methods: {
    async sendConnType(connType, dashType) {
      await refConnType.update({ connType });
      await refDashType.update({ dashType });
      location.reload();
    },
    addEntity() {
      this.$store.dispatch("addEntity");
      location.reload();
    }
  }
};
</script>


<style lang="scss" scoped>
.toolbar {
  background-color: #f5f6fa;
  padding: 30px 0;
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