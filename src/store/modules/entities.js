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
  addEntity({ commit, state }, entity) {
    let posX, posY, multi, entityName, entityItems, entityType = "";
    if (entity) {
      posX = entity.posX;
      posY = entity.posY;
      multi = 2;
      entityName = entity.entityName;
      entityItems = [
        {
          itemKey: "unique",
          itemName: `${entity.sourceName}Id`,
          dataType: "INTEGER"
        },
        {
          itemKey: "unique",
          itemName: `${entity.targetName}Id`,
          dataType: "INTEGER"
        }
      ]

    } else {
      posX = 70;
      posY = 90;
      multi = 0;
      entityName = "";
      entityItems = [
        {
          itemKey: "",
          itemName: "",
          dataType: "int"
        }
      ]
    }
    ref.push({
      ID: jsPlumbUtil.uuid(),
      entityName,
      multi,
      entityType,
      posX,
      posY,
      entityItems,
    });
  },
  initEntities({ state }) {

    return new Promise((resolve, reject) => {
      ref.on("value", snap => {
        const data = snap.val();
        const entities = [];

        for (let key in data) {
          const entity = data[key];
          entity.id = key;
          entities.push(entity);
        }
        state.entities = entities;
        resolve('OK')
      });
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}