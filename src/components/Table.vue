<template lang="pug">
  vue-draggable-resizable(:grid="[10,10]",   :w='100', :h='100', :resizable='false')
    #entity.tablo.entity
      table
        thead
          th(colspan='4')
            input(type='text',id ="entityName", placeholder='Varlık İsmi')
        tbody
          tr.row(v-for='n in 2', :key='n.id')
            td
              .field
                input(type='text',  placeholder='Anahtar(#,o,*)')
            td
              .field
                input(type='text', placeholder='İsmi')
      button.addBtn  + 
      button.subBtn  -
      button.delBtn  x
</template>

<script>

export default {
  data() {
    return {
      entityKey: "",
      selected: "",
      entityName: "",
      data: {
        itemKey: "",
        itemName: ""
      }
    };
  },
  methods: {
    
  },
  components: {
  },
  mounted() {
    
  }
};
</script>


<style lang="scss" scoped>
.tablo {
  select {
    background: transparent;
    padding: 3px 10px;
    border: 1px solid (#191919, 0.3);
    color: #191919;
  }
}
table {
  width: 100%;
  margin-bottom: 3px;
  padding-bottom: 3px;
  border: 2px solid rgba(#191919, 0.7);
  border-radius: 3px;
  background-color: rgba(#fff, 1);
  z-index: 99;
  cursor: pointer;
  /*
  &::after {
    content: "";
    height: 20px;
    width: 20px;
    background: url(../assets/img/rightArrow.png);
    background-size: cover;
    position: absolute;
    top: 0%;
    left: 99%;
    margin-top: 40px;
  }
  &::before {
    content: "";
    height: 20px;
    width: 20px;
    background: url(../assets/img/leftArrow.png);
    background-size: cover;
    position: absolute;
    top: 0%;
    left: -7%;
    margin-top: 40px;
  } */
}
th {
  border-bottom: 1px solid rgba(#191919, 0.5);
  padding: 0;
}
td {
  padding: 5px 10px;
  text-align: center;
}
input[type="text"] {
  width: 100%;
  padding: 5px 5px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  background: transparent;
  color: #000;
  border-radius: 4px;
  box-sizing: border-box;
  text-align: center;
  &::-webkit-input-placeholder {
    color: rgb(121, 121, 121);
  }
}
.field input {
  margin: 0;
}
.addBtn {
  font-weight: bold;
  position: absolute;
  left: 40%;
  font-weight: 900;
  background-color: #1abc9c;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  padding: 0 8px;
  transition: all 0.2s;
  &:active {
    background-color: #0fa083;
  }
}
.subBtn {
  font-weight: bold;
  position: absolute;
  left: 40%;
  font-weight: 900;
  background-color: #1abc9c;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  padding: 0 10px;
  transition: all 0.2s;
  margin-left: 30px;
  &:active {
    background-color: #0fa083;
  }
  &:disabled {
    cursor: not-allowed;
  }
}
.delBtn {
  position: absolute;
  top: 0;
  left: 0;
  margin-left: -2px;
  margin-top: -7px;
  background: transparent;
  padding: 0;
  border: none;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  transition: all 0.3s;
  backface-visibility: hidden;
  &:hover {
    transform: scale(1.5);
  }
}
.entity {
  width: 250px;
  position: absolute;
}
.cover {
  position: relative;
  background-image: url(http://freedevelopertutorials.azurewebsites.net/wp-content/uploads/2015/06/grid.png);
  background-repeat: repeat;
  flex-grow: 15;
}
</style>

