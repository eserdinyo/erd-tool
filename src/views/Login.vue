<template lang="pug">
    .Login
      .Login__box
        input(v-model="email", placeholder="E-mail")
        input(v-model="password", type="password", placeholder="Password")
        a.Login__btn(@click="login") Login
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
           this.$router.go({ path: this.$router.path });
        });
    }
  }
};
</script>


<style lang="scss" scoped>
.Login {
  &__box {
    margin: 100px auto;
    width: 300px;
    height: 350px;
    border: 1px solid rgba(204, 204, 204, 0.568);
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(155, 114, 114, 0.2);
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    input {
      padding: 5px 10px;
      margin-top: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  }

  &__btn {
    padding: 10px 40px;
    border-radius: 100px;
    background-color: #1abc9c;
    cursor: pointer;
    margin-top: 20px;
    color: #fff;
  }
}
</style>

