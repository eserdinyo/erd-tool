<template lang="pug">
 .tablo.entity(:id="entity.ID")
    table(@mousedown="setActiveEntity(entity.id)" , 
          :class="{ activeEntity : activeEntity == entity.id}")
      thead
        th(colspan='4')
          input#entityName(type='text',
                          placeholder='Varlık İsmi', 
                          :value='entity.entityName',
                          @keyup="sendEntityName(entity,$event.target.value)")
      tbody
        tr.row(v-for='(item,key) in entity.entityItems',
              :key='item.id')
          td
            .field
              select#element(v-model="item.itemKey", 
                              @change="changeItem(key,entity,$event.target.value)")
                option(disabled, value='') ID
                option(title="Unique", value='unique') #
                option(title="Mandatory", value='mandatory') *
                option(title="Optional", value='optional') o
          td
            .field
              input(type='text',:value="item.itemName", 
                    placeholder='İsmi', 
                    @keyup="sendItemName(key,entity, $event.target.value)")
    .ep(v-if="entity.multi != 2")
</template>

<script>
import { ref } from "@/firebase/";

export default {
  props: ["entity"],
  data() {
    return {};
  },
  computed: {
    activeEntity() {
      return this.$store.getters.activeEntity;
    }
  },
  methods: {
    sendItemName(key, entity, value) {
      ref
        .child(entity.id)
        .child("entityItems")
        .child(key)
        .update({ itemName: value });
    },
    changeItem(key, entity, value) {
      ref
        .child(entity.id)
        .child("entityItems")
        .child(key)
        .update({ itemKey: value });
    },
    sendEntityName(entity, value) {
      ref.child(entity.id).update({ entityName: value });
    },
    setActiveEntity(entity) {
      this.$store.commit("updateActive", entity);
    },
    delEntity() {
      this.$store.dispatch("delEntity");
    },
    initForDelete() {
      document.onkeydown = evt => {
        evt = evt || window.event;
        if (evt.keyCode == 46) {
          if (this.activeEntity != 0) {
            this.delEntity();
          }
        } else if (evt.keyCode == 27) {
          this.$store.commit("updateActive", 0);
        } else if (evt.keyCode == 38) {
          // Arrow Up
          this.$store.dispatch("subItem");
        } else if (evt.keyCode == 40) {
          // Arrow Down
          this.$store.dispatch("addItem");
        }
      };
    }
  },
  created() {
    this.initForDelete();
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
  cursor: move;
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
.entity {
  width: 250px;
  position: absolute;

  &:hover .ep {
    display: unset;
  }
}

.activeEntity {
  border: 2px solid rgba(#e74c3c, 0.7);
  box-shadow: 0 10px 20px rgba(51, 51, 51, 0.4);
}

.ep {
  position: absolute;
  left: 30%;
  top: 60px;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.2);
  border: 1px solid rgba(170, 170, 170, 0.8);
  cursor: pointer;
  display: none;
}

.enityName {
  padding: 5px;
  font-weight: 400;
  font-size: 13px;
}

.row:nth-child(odd) {
  background: rgba(204, 204, 204, 0.3);
}
</style>

