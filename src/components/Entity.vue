<template>
  <div
    @mousedown="setActiveEntity(entity)"
    :class="{ activeEntity: activeEntity == entity.id }"
    class="tablo entity"
    :id="entity.ID"
  >
    <div>
      <div class="entity-input-header">
        <input
          id="entityName"
          type="text"
          class="entity-input"
          placeholder="Enter Name"
          style="text-transform:uppercase"
          :value="entity.entityName"
          @keyup="sendEntityName(entity, $event.target.value)"
        />
      </div>

      <div
        v-for="(item, idx) in entity.entityItems"
        :key="item.id"
        class="entity-row"
        :class="{ fk: idx === 0 }"
      >
        <div class="field">
          <input
            type="text"
            :value="item.itemName"
            placeholder="Name"
            class="entity-input entity-input-child"
            @keyup="sendItemName(key, entity, $event.target.value)"
          />
        </div>
        <div class="field entity-select">
          <multiselect
            label="name"
            placeholder="select"
            v-model="value"
            :options="types"
            :multiple="false"
            :close-on-select="true"
            :hide-selected="true"
            :preserve-search="true"
            selected-label
            deselect-label
            select-label
          ></multiselect>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@/firebase/";
import { mapGetters } from "vuex";
import Multiselect from "vue-multiselect";

export default {
  props: ["entity"],
  data() {
    return {
      value: null,
      types: [
        { id: 1, name: "boolean" },
        { id: 2, name: "int" },
        { id: 3, name: "char" },
        { id: 4, name: "date" },
        { id: 5, name: "float" },
        { id: 6, name: "double" }
      ]
    };
  },
  components: { Multiselect },
  computed: {
    activeEntity() {
      return this.$store.getters.activeEntity;
    },
    ...mapGetters(["entities"])
  },
  methods: {
    // ADDING SUB ENTITY TO TOP ENTITY
    addSubEntity(entityID) {
      this.$store.dispatch("addSubEntity", entityID);
    },
    // CHANGE ITEM NAME
    sendItemName(key, entityLocal, value) {
      if (entityLocal.entityType == "subtype") {
        let topEntity;
        this.entities.forEach(entity => {
          Object.values(entity.subEntities).forEach(subEntity => {
            if (subEntity.id == entityLocal.id) {
              topEntity = entity.id;
            }
          });
        });

        ref
          .child(topEntity)
          .child("subEntities")
          .child(entityLocal.id)
          .child("entityItems")
          .child(key)
          .update({ itemName: value });
      } else {
        ref
          .child(entityLocal.id)
          .child("entityItems")
          .child(key)
          .update({ itemName: value });
      }
    },
    // CHANGE ITEM KEY
    changeItem(key, entityLocal, value) {
      if (entityLocal.entityType == "subtype") {
        let topEntity;
        this.entities.forEach(entity => {
          Object.values(entity.subEntities).forEach(subEntity => {
            if (subEntity.id == entityLocal.id) {
              topEntity = entity.id;
            }
          });
        });

        ref
          .child(topEntity)
          .child("subEntities")
          .child(entityLocal.id)
          .child("entityItems")
          .child(key)
          .update({ itemKey: value });
      } else {
        ref
          .child(entityLocal.id)
          .child("entityItems")
          .child(key)
          .update({ itemKey: value });
      }
    },
    // CHANGE ENTITY OR SUBENTITY NAMES
    sendEntityName(entityLocal, value) {
      if (entityLocal.entityType == "subtype") {
        let topEntity;
        this.entities.forEach(entity => {
          Object.values(entity.subEntities).forEach(subEntity => {
            if (subEntity.id == entityLocal.id) {
              topEntity = entity.id;
            }
          });
        });

        ref
          .child(topEntity)
          .child("subEntities")
          .child(entityLocal.id)
          .update({ entityName: value });
      } else {
        ref.child(entityLocal.id).update({ entityName: value });
      }
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

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
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

td {
  padding: 5px 10px;
  text-align: center;
}
tr {
  height: 20px !important;
}

.field input {
  margin: 0;
}
.entity {
  position: absolute;
  border-radius: 5px;
  background-color: #f0f0f0;
  border: 1px solid #e67e22;
  box-shadow: 0 4px 8px rgba(52, 52, 52, 0.1);
  cursor: grab;

  &-select {
    margin-left: 10px;
  }

  &-row {
    display: flex;
    align-items: center;
    padding: 5px 10px;
  }

  &-input {
    width: 100%;
    padding: 5px 5px;
    display: inline-block;
    background: transparent;
    color: #000;
    box-sizing: border-box;
    text-align: center;
    &::-webkit-input-placeholder {
      color: #fff;
    }

    &-header {
      background-color: #e74c3c;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      padding: 3px 0;

      input {
        width: 70%;
        border: none;
        color: white;

        &:focus {
          outline: none !important;
        }
      }
    }
    &-child {
      border: 1px solid #e8e8e8;
      margin: 8px 0;
      border-radius: 5px;
      background-color: #fff;
      height: 35px;
      &::-webkit-input-placeholder {
        color: #adadad;
        font-size: 14px;
      }
    }
  }

  &:hover .ep,
  &:hover .ep1,
  &:hover .subType {
    display: unset;
  }

  &:hover .fk {
    background-color: #74baff8e;
  }
}

.subEntity {
  width: 160px;
  margin: 0 auto;
  border: 2px solid rgba(#191919, 0.7);
  margin-bottom: 10px;
  border-radius: 5px;
  position: relative;
}

.activeEntity {
  box-shadow: 0 4px 8px rgba(51, 51, 51, 0.783);
}

.ep,
.ep1 {
  position: absolute;
  right: -7px;
  top: 6px;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.2);
  border: 1px solid #333;
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

.yay {
  height: 220px;
  width: 15px;
  position: absolute;
  right: -20%;
  top: 59%;
  transform: translateY(-50%);
  border: 2px solid #191919;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  border-left: none;

  &::after {
    content: "";
    height: 10px;
    width: 10px;
    border: 2px solid #191919;
    border-radius: 50%;
    position: absolute;
    top: 26%;
    right: -60%;
  }

  &::before {
    content: "";
    height: 10px;
    width: 10px;
    border: 2px solid #191919;
    border-radius: 50%;
    position: absolute;
    bottom: 10%;
    right: -60%;
  }
}

.isYay {
  height: 500px !important;
}

.entity {
  .multiselect {
    min-height: 35px;
    width: 100px;
  }
  .multiselect__option {
    font-size: 14px;
  }
  .multiselect__tags {
    font-size: 14px;
    min-height: 35px;
  }

  .multiselect__select {
    width: 25px;
    height: 25px;
    right: 4px;
    top: 9px;

    &::before {
      border-color: #e67e22 transparent transparent;
      border-width: 4px 4px 0;
    }
  }

  .multiselect__placeholder {
    margin-bottom: 0;
    padding-top: 0px;
    padding-left: 4px;
  }

  .multiselect__single {
    font-size: 14px;
    color: #333;
    margin-bottom: 0;
  }

  .fk {
    transition: all .1s;
  }
}
</style>
