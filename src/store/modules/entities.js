import { ref } from "@/firebase";
/* STATE */
const state = {
  entities: [],
  notes: [],
  activeEntity: 0,
  isSubType: false,
  itemKey: "",
  item: {
    itemKey: "",
    itemName: "",
    dataType: "INTEGER",
    isShow: true
  }
};

/* GETTERS */
const getters = {
  activeEntity: state => state.activeEntity,
  entities: state => state.entities,
  itemKey: state => state.itemKey,
  notes: state => state.notes
};

/* MUTATIONS */
const mutations = {
  updateActive(state, entity) {
    state.activeEntity = entity.id;
    if (entity.entityType == "subtype") {
      state.isSubType = true;
    } else {
      state.isSubType = false;
    }
  },
  setItemKey(state, itemKey) {
    state.itemKey = itemKey;
  },
  setNotes(state) {
    state.notes = [];

    state.entities.map(entity => {
      if (entity.notes) {
        Object.values(entity.notes).forEach(note => {
          state.notes.push(note);
        });
      }
    });
  }
};

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
    commit("setItemKey", key);
  },
  addItem({ state, commit }, payload) {
    if (payload) {
      ref
        .child(payload.id)
        .child("entityItems")
        .push({
          itemKey: payload.itemKey,
          itemName: payload.name,
          dataType: "INTEGER",
          fk: "fk",
          isShow: false
        });
    } else if (state.isSubType) {
      let activeEntity;
      state.entities.forEach(entity => {
        Object.values(entity.subEntities).forEach(subEntity => {
          if (subEntity.id == state.activeEntity) {
            activeEntity = entity.id;
          }
        });
      });

      ref
        .child(activeEntity)
        .child("subEntities")
        .child(state.activeEntity)
        .child("entityItems")
        .push(state.item);
      commit("setItemKey", 1);
    } else {
      ref
        .child(state.activeEntity)
        .child("entityItems")
        .push(state.item);
      commit("setItemKey", 1);
    }
  },
  delEntity({ state }) {
    ref.child(state.activeEntity).remove();
  },
  addEntity({ rootState }, entity) {
    let posX,
      posY,
      multi,
      entityName,
      entityItems,
      connType = "",
      projectID = rootState.projects.projectID,
      entityType = "";
    if (entity) {
      posX = entity.posX;
      posY = entity.posY;
      connType = entity.connType;
      multi = 2;
      entityName = "";
      entityItems = [
        {
          itemKey: "unique",
          itemName: "id",
          dataType: "INTEGER",
          isShow: true
        },
        {
          itemKey: "mandatory",
          itemName: `${entity.sourceName}`,
          dataType: "INTEGER",
          isShow: false,
          fk: "fk1"
        },
        {
          itemKey: "mandatory",
          itemName: `${entity.targetName}`,
          dataType: "INTEGER",
          isShow: false,
          fk: "fk2"
        }
      ];
    } else {
      posX = 70;
      posY = 90;
      multi = 0;
      entityName = "";
      entityItems = [
        {
          itemKey: "",
          itemName: "",
          isShow: true,
          dataType: "INTEGER"
        }
      ];
    }
    ref.push({
      ID: jsPlumbUtil.uuid(),
      entityName,
      multi,
      entityType,
      posX,
      posY,
      connType,
      entityItems,
      projectID
    });
  },
  addSubEntity({}, entityID) {
    ref
      .child(entityID)
      .child("subEntities")
      .push({
        id: "",
        ID: jsPlumbUtil.uuid(),
        entityName: "",
        entityType: "subtype",
        entityItems: [
          {
            itemKey: "",
            itemName: "",
            isShow: true,
            dataType: "INTEGER"
          }
        ]
      })
      .then(res => {
        ref
          .child(entityID)
          .child("subEntities")
          .child(res.key)
          .update({ id: res.key });
      });
  },
  initEntities({ state, rootState }) {
    const projectID = rootState.projects.projectID;

    return new Promise((resolve, reject) => {
      ref.on("value", snap => {
        const data = snap.val();
        const entities = [];

        for (let key in data) {
          const entity = data[key];
          if (entity.projectID == projectID) {
            entity.id = key;
            entities.push(entity);
          }
        }
        state.entities = entities;
        resolve("OK");
      });
    });
  },
  addNote({ commit }, payload) {
    const { entityID, id, msg } = payload;
    ref
      .child(entityID)
      .child("notes")
      .push({
        id,
        msg
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
