import $ from "jquery";

let data = "CREATE TABLE MyFriends ( id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,firstname VARCHAR(30) NOT NULL)"

const state = {

}

const getters = {

}

const mutations = {

}

const actions = {

  sendTables() {
    $.post(
      "http://localhost/main.php",
      {
        data: data
      },
      function (result) { }
    );
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}