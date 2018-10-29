<template lang="pug">
  .toolbar

    a.link(@click='addEntity')
      img(src="../../assets/img/table.png")
    hr
    a.link(@click="sendConnType(1, dashType1)")
      img(src="../../assets/img/conn1.png")
    a.link(@click="sendConnType(2, dashType2)")
      img(src="../../assets/img/conn2.png")
    a.link(@click="sendConnType(3)")
      img(src="../../assets/img/conn3.png")
    a.link(@click="sendConnType(4)")
      img(src="../../assets/img/conn4.png")
    a.link(@click="sendConnType(5)")
      img(src="../../assets/img/conn5.png")
    
</template>

<script>
import { EventBus } from "@/main";
import { refConnType, refDashType } from "@/firebase";

export default {
  data() {
    return {
      dashType1: "2 1",
      dashType2: "0",
    };
  },
  methods: {
    async sendConnType(connType,dashType) {
      await refConnType.update({ connType });
      await refDashType.update({ dashType });
      location.reload();
    },
    addEntity() {
      this.$store.dispatch("addEntity");
      location.reload();
    }
  },
  created() {}
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

