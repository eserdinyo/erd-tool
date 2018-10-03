import { ref } from "@/firebase";

/* STATE */
const state = {
  entities: [],
  activeEntity: 0,
  itemKey: "",
  item: {
    itemKey: "",
    itemName: "",
    dataType: "int"
  }
}

/* GETTERS */
const getters = {
  activeEntity: state => state.activeEntity,
  entities: state => state.entities,
  itemKey: state => state.itemKey,
}

/* MUTATIONS */
const mutations = {
  updateActive(state, entity) {
    state.activeEntity = entity;
  },
  setItemKey(state, itemKey) {
    state.itemKey = itemKey;
  }
}

/* ACTIONS */
const actions = {
  subItem({ state, commit }) {
    let key = "";
    ref
      .child(state.activeEntity)
      .child("entityItems")
      .limitToLast(1)
      .on("child_added", snap => {
        key = snap.key;
      });

    if (key != 0) {
      ref
        .child(state.activeEntity)
        .child("entityItems")
        .child(key)
        .remove();
    }
    commit('setItemKey', key)
  },
  addItem({ state, commit }) {
    ref
      .child(state.activeEntity)
      .child("entityItems")
      .push(state.item);
    commit('setItemKey', 1)
  },
  delEntity({ state }) {
    ref.child(state.activeEntity).remove();
  },
  addEntity() {
    ref.push({
      ID: jsPlumbUtil.uuid(),
      entityName: "",
      multi: false,
      fk: "",
      entityX: 20,
      entityY: 80,
      entityItems: [
        {
          itemKey: "",
          itemName: "",
          dataType: "int"
        }
      ]
    });
  },
  initEntities({ state }) {
    ref.on("value", snap => {
      const data = snap.val();

      const entities = [];
      for (let key in data) {
        const entity = data[key];
        entity.id = key;
        entities.push(entity);
      }

      state.entities = entities;
    });
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}