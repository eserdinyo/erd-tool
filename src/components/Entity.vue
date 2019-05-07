<template lang="pug">
 .tablo.entity(:id="entity.ID")
    table(@mousedown="setActiveEntity(entity)",
    :class="{ activeEntity : activeEntity == entity.id}")
      thead
        th(colspan='4')
          input#entityName(type='text',
                          placeholder='Entity Name', 
                          style="text-transform:uppercase",
                          :value='entity.entityName',
                          @keyup="sendEntityName(entity,$event.target.value)")
      tbody
        tr.row(v-for='(item,key) in entity.entityItems',
              :key='item.id',
              v-if="item.isShow")
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
                    placeholder='Name', 
                    @keyup="sendItemName(key,entity, $event.target.value)")
    .subEntity(v-for="subEntity in entity.subEntities")
      .tablo
        table(@mousedown="setActiveEntity(subEntity)",
        :class="{ activeEntity : activeEntity == subEntity.id}")
          thead
            th(colspan='4')
              input#entityName(type='text',
                              placeholder='Entity Name', 
                              style="text-transform:uppercase",
                              :value='subEntity.entityName',
                              @keyup="sendEntityName(entity,$event.target.value)")
          tbody
            tr.row(v-for='(item,key) in subEntity.entityItems',
              :key='item.id',
              v-if="item.isShow")
              td
                .field
                  select
                    option(disabled, value='') ID
                    option(title="Unique", value='unique') #
                    option(title="Mandatory", value='mandatory') *
                    option(title="Optional", value='optional') o
              td
                .field
                  input(type='text',:value="item.itemName", 
                    placeholder='Name', 
                    @keyup="sendItemName(key,entity, $event.target.value)")

    .ep(v-if="entity.multi != 2")
    .notes
      .notes__note(v-for="note in entity.notes")
        p {{note.id}}
    .line1(v-if="entity.multi == 2")
    .line2(v-if="entity.multi == 2 && entity.connType == '10'")
    .subType(@click="addSubEntity(entity.id)") Add SubType
    
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
    addSubEntity(entityID) {
      this.$store.dispatch("addSubEntity", entityID);
    },
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

        if (evt.keyCode == 93) {
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
.notes {
  display: flex;
  position: absolute;
  top: -14px;
  left: 0;
  &__note {
    height: 13px;
    width: 13px;
    font-size: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: #e74c3c;
    color: #fff;
    margin-left: 5px;
    font-weight: bold;
  }
}

.tablo {
  select {
    background: transparent;
    padding: 3px 10px;
    border: 1px solid (#191919, 0.3);
    color: #191919;
  }
  position: relative;
}

table {
  width: 100%;
  margin-bottom: 3px;
  padding-bottom: 3px;
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
tr {
  height: 20px !important;
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
  border: 2px solid rgba(#191919, 0.7);
  border-radius: 5px;

  &:hover .ep,
  &:hover .ep1,
  &:hover .subType {
    display: unset;
  }
}

.subEntity {
  width: 200px;
  margin: 0 auto;
  border: 2px solid rgba(#191919, 0.7);
  margin-bottom: 10px;
  border-radius: 5px;
}

.activeEntity {
  border: 2px solid #1abb9c;
  box-shadow: 0 4px 8px rgba(#1abb9c, 0.7);
}

.ep, .ep1 {
  position: absolute;
  left: 23.35%;
  top: 60px;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.2);
  border: 1px solid rgba(170, 170, 170, 0.8);
  cursor: pointer;
  display: none;
}

.line1 {
  height: 3px;
  width: 150px;
  background-color: #000;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-100%, -50%);
}

.line2 {
  height: 3px;
  width: 150px;
  background-color: #000;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(100%, -50%);
}

.enityName {
  padding: 5px;
  font-weight: 400;
  font-size: 13px;
}

.row:nth-child(odd) {
  background: rgba(204, 204, 204, 0.3);
}

.subType {
  position: absolute;
  bottom: -5%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 3px;
  background-color: #2fbc9c;
  color: #fff;
  font-size: 10px;
  padding: 2px 5px;
  cursor: pointer;
  display: none;
}
</style>

