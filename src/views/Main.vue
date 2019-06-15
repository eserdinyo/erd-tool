<script>
import $ from "jquery";

import { jsPlumb } from "jsplumb";
import { EventBus } from "@/main";
import {
  ref,
  refConn,
  refConnType,
  refGlobalConnType,
  refProjects
} from "@/firebase/";
import { mapGetters } from "vuex";

import AppSidebar from "@/components/global/Sidebar";
import AppToolbar from "@/components/global/Toolbar";
import AppEntity from "@/components/Entity";
import firebase from "firebase";

export default {
  data() {
    return {
      isChoosed: "",
      entityID: "",
      sourceKey: "",
      targetKey: "",
      targetEntity: "",
      sourceEntity: "",
      isPopupOpen: false,
      isNewProjectOpen: false,
      projectName: "",
      currentUser: "",
      isSource: ""
    };
  },
  components: {
    AppEntity,
    AppSidebar,
    AppToolbar
  },
  computed: {
    ...mapGetters([
      "entities",
      "connections",
      "activeEntity",
      "connTypes",
      "connType",
      "dashType",
      "notes",
      "globalConnType",
      "projectID",
      "lastItemKey"
    ]),
    chooseEntity() {
      return this.entities.filter(entity => entity.multi == 0);
    }
  },
  methods: {
    // JSPLUMB //
    getflow() {
      var instance = jsPlumb.getInstance({
        Connector: [this.globalConnType, { curviness: 150 }],
        Endpoint: ["Dot", { radius: 1 }],
        EndpointStyle: { fill: "#191919" },
        HoverPaintStyle: { stroke: "#c0392b", lineWidth: 10 },
        EndpointHoverStyle: {
          fill: "#c0392b",
          stroke: "#c0392b",
          lineWidth: 10
        },
        Anchor: ["Left", "Right", "TopCenter", "BottomCenter"],
        ConnectionOverlays: this.connType,
        Container: "main"
      });

      // *********************** //
      //   SET ENTITY POSITION  //
      // ********************* //
      for (let i in this.entities) {
        $(`#${this.entities[i].ID}`).css({
          left: this.entities[i].posX,
          top: this.entities[i].posY
        });
      }

      // ********************* //
      //   REMOVE CONNECTION  //
      // ********************* //
      instance.bind("dblclick", c => {
        let s = c.endpoints[0].elementId;
        let t = c.endpoints[1].elementId;
        let findConn;

        // DELETE MULTI BOT OF SIDE
        this.entities.forEach(entity => {
          if (entity.ID == c.targetId || entity.ID == c.sourceId) {
            ref.child(entity.id).update({ multi: "0" });
            ref.child(entity.id).update({ belongsTo: "" });
          }
        });

        // DELETE FK ITEM AND CONN
        this.connections.forEach(conn => {
          if (conn.sourceId == s && conn.targetId == t) {
            findConn = conn;
            refConn.child(conn.id).remove();
          }
        });

        this.entities.forEach(entity => {
          if (findConn.entityID == entity.id) {
            ref
              .child(findConn.entityID)
              .child("entityItems")
              .child(findConn.fkID)
              .remove();
          }
        });

        instance.deleteConnection(c);
      });

      // ********************* //
      //         CLICK         //
      // ********************* //
      instance.bind("click", c => {
        if (c.getOverlay("convert")) {
          const conID =
            c._jsPlumb.overlays[Object.keys(c._jsPlumb.overlays)[0]].id;
          let s = c.sourceId,
            t = c.targetId;

          // **************************************  //
          //            M:M SEÇİMLİ-ZORUNLU         //
          // ************************************* //
          if (conID == 10 || conID == 11 || conID == 12) {
            let sourceX,
              key,
              targetX,
              sourceY,
              posX,
              posY,
              newEntityTarget,
              sourceName,
              targetName,
              entityType,
              dashType1,
              dashType2,
              sourceEntity,
              targetEntity,
              // dashType2 = "150 5 0",
              //dashType3 = "150 5 3",
              msgTargetName,
              msgSourceName;

            if (conID == 10) {
              dashType1 = "0 5 5";
              dashType2 = "0 5 5";
            }
            if (conID == 11) {
              dashType1 = "150 5 0";
              dashType2 = "150 5 0";
            }
            if (conID == 12) {
              dashType1 = "0 5 5";
              dashType2 = "150 5 0";
            }

            // entityType'ı güncelle
            this.entities.forEach(entity => {
              if (entity.ID == t) {
                key = entity.id;
                ref.child(key).update({ entityType: "mm" });
              } else if (entity.ID == s) {
                key = entity.id;
                ref.child(key).update({ entityType: "mm" });
              }
            });

            // get some values for new entity
            this.entities.forEach(entity => {
              if (entity.ID == s) {
                sourceX = entity.posX;
                sourceY = entity.posY;
                sourceEntity = entity;
                msgSourceName = entity.entityName;
                sourceName = `${this.getShortName(entity.entityName)}_${
                  entity.entityItems[0].itemName
                }`;
              }
              if (entity.ID == t) {
                targetX = entity.posX;
                targetEntity = entity;
                msgTargetName = entity.entityName;
                targetName = `${this.getShortName(entity.entityName)}_${
                  entity.entityItems[0].itemName
                }`;
              }
            });

            this.addNote(
              key,
              this.notes.length + 1,
              `Every ${msgTargetName
                .slice("0", msgTargetName.indexOf("("))
                .toUpperCase()} must have a ${msgSourceName
                .slice("0", msgSourceName.indexOf("("))
                .toUpperCase()}`
            );

            posX = (targetX - sourceX) / 2 + sourceX - 10;
            posY = sourceY + 300;

            this.$store.dispatch("addEntity", {
              posX,
              posY,
              entityName,
              sourceName,
              targetName,
              targetEntity,
              sourceEntity,
              connType: conID
            });

            this.entities.forEach(entity => {
              if (entity.multi == 2) {
                newEntityTarget = entity.ID;
                ref
                  .child(sourceEntity.id)
                  .child("belongsTo")
                  .push(entity.ID);
                ref
                  .child(targetEntity.id)
                  .child("belongsTo")
                  .push(entity.ID);
              }
            });

            refConnType.update({ connType: 6 });
            refGlobalConnType.update({ globalConnType: "Flowchart" });

            this.$store.commit("setConnectionType", 6);
            refConn.push({
              sourceId: s,
              connType: 6,
              targetId: newEntityTarget,
              dashType: dashType1,
              overlay: this.connType,
              projectID: this.projectID
            });
            refConn.push({
              sourceId: t,
              connType: 6,
              targetId: newEntityTarget,
              dashType: dashType2,
              overlay: this.connType,
              projectID: this.projectID
            }).then(res => { 
              location.reload();
            })
            
          }

          if (conID == 10) {
            console.log("...");
          }
        }
      });

      // ********************* //
      // CONNECTION DRAG STOP  //
      // ********************* //
      instance.bind("connectionDragStop", ci => {
        let s = ci.sourceId,
          t = ci.targetId;

        const conID =
          ci._jsPlumb.overlays[Object.keys(ci._jsPlumb.overlays)[0]].id;

        console.log(conID);

        // *******************************    //
        //     1:M-1:1   ÇİFT TARAF ZORUNLU  //
        // *******************************  //
        if (
          conID == 0 ||
          conID == 1 ||
          conID == 2 ||
          conID == 5 ||
          conID == 4 ||
          conID == 13 ||
          conID == 14 ||
          conID == 17
        ) {
          let key = "",
            entityType = "",
            connType = "";

          conID == 0 || conID == 4 || conID == 17
            ? (entityType = "optional")
            : 0;
          conID == 1 || conID == 5 || conID == 13 || conID == 14
            ? (entityType = "mandatory")
            : 0;

          // 1 ve 2. icin farkli islemler yap
          if (conID == 0 || conID == 1) {
            this.entities.forEach(entity => {
              if (entity.ID == t) {
                key = entity.id;
                this.targetKey = key;
                this.targetEntity = entity;
                ref.child(key).update({ entityType });
              } else if (entity.ID == s) {
                key = entity.id;
                this.sourceEntity = entity;
                this.sourceKey = key;
                ref.child(key).update({ entityType });
              }
            });

            this.entities.forEach(entity => {
              if (entity.isYay && s.length > 15 && t.length > 15) {
                let name;
                let belongsTo;
                if (entity.entityName == this.sourceEntity.entityName) {
                  this.isSource = true;
                  name = `${this.getShortName(this.targetEntity.entityName)}_${
                    this.targetEntity.entityItems[0].itemName
                  }`;
                } else {
                  this.isSource = false;
                  name = `${this.getShortName(this.sourceEntity.entityName)}_${
                    this.sourceEntity.entityItems[0].itemName
                  }`;
                }
                this.isSource
                  ? (belongsTo = this.targetEntity.ID)
                  : (belongsTo = this.sourceEntity.ID);
                this.$store.dispatch("addItem", {
                  id: entity.id,
                  belongsTo,
                  itemKey: conID == 0 ? "optional" : "mandatory",
                  name,
                  dataType: "INTEGER"
                });

                ref.child(this.targetKey).update({ belongsYay: true });
                ref.child(this.sourceKey).update({ belongsYay: true });
              }
            });
          } else {
            this.entities.forEach(entity => {
              if (entity.ID == t) {
                key = entity.id;
                this.targetKey = key;
                this.targetEntity = entity;
                ref.child(key).update({ multi: 1 });
                ref.child(key).update({ entityType });
              } else if (entity.ID == s) {
                key = entity.id;
                this.sourceEntity = entity;
                this.sourceKey = key;
                ref.child(key).update({ entityType });
              }
            });
            if (this.targetEntity.isYay) {
              ref.child(this.sourceKey).update({ belongsYay: true });
            }
          }

          if (conID == 13 || conID == 14) {
            this.addNote(key, this.notes.length + 1, "You can't change the FK");
            this.$store.dispatch("addItem", {
              id: this.sourceKey,
              itemKey: "mandatory",
              name: `${this.getShortName(this.targetEntity.entityName)}_${
                this.targetEntity.entityItems[0].itemName
              }`,
              dataType: "INTEGER"
            });
            location.reload();
          }
          if ((conID == 4 || conID == 5) && s != t) {
            /* ref
              .child(this.targetKey)
              .update({ belongsTo: this.sourceEntity.ID }); */
            /* ref
              .child(this.sourceKey)
              .update({ belongsTo: this.targetEntity.ID }); */

            ref
              .child(this.sourceKey)
              .child("belongsTo")
              .push(this.targetEntity.ID);

            this.$store.dispatch("addItem", {
              id: this.targetKey,
              itemKey: conID == 4 ? "optional" : "mandatory",
              belongsTo: this.sourceEntity.ID,
              name: `${this.getShortName(this.sourceEntity.entityName)}_${
                this.sourceEntity.entityItems[0].itemName
              }`,
              dataType: "INTEGER"
            });
          }
          if (!(t.length < 20)) {
            refConn
              .push({
                sourceId: s,
                targetId: t,
                connType: conID,
                dashType: this.dashType,
                overlay: this.connType,
                projectID: this.projectID
              })
              .then(res => {
                if (this.isSource) {
                  refConn.child(res.key).update({
                    entityID: this.sourceKey,
                    fkID: this.lastItemKey
                  });
                  this.isSource = false;
                } else {
                  refConn.child(res.key).update({
                    entityID: this.targetKey,
                    fkID: this.lastItemKey
                  });
                }
              });
          }

          // ************************* //
          // ADD RELATIONS TO HIMSELF //
          // ********************** //
          if (s == t) {
            this.$store.dispatch("addItem", {
              id: this.targetKey,
              itemKey: "mandatory",
              name: `${this.getShortName(this.targetEntity.entityName)}_type`,
              dataType: "INTEGER"
            });
          }
        }
        // ****************************************  //
        //            1:M SEÇİMLİ-ZORUNLU           //
        // *************************************** //
        else if (conID == 6) {
          let key = "";

          this.entities.forEach(entity => {
            if (entity.ID == t) {
              key = entity.id;
              ref.child(key).update({ multi: 1 });
              ref.child(key).update({ entityType: "mandatory" });
            } else if (entity.ID == s) {
              key = entity.id;
              ref.child(key).update({ entityType: "optional" });
            }
          });

          if (!(t.length < 20)) {
            refConn.push({
              sourceId: s,
              targetId: t,
              connType: 6,
              dashType: this.dashType,
              overlay: this.connType,
              projectID: this.projectID
            });
          }
        }
      });

      // ****************************  //
      //    UPDATE ENTITY POSITION    //
      // *************************** //
      for (let i in this.entities) {
        instance.draggable(this.entities[i].ID, {
          grid: [10, 10],
          containment: "main",

          stop: e => {
            ref.child(this.activeEntity).update({ posX: e.pos[0] });
            ref.child(this.activeEntity).update({ posY: e.pos[1] });
          }
        });

        // *********************   //
        //    MAKE SOURCE         //
        // ********************* //
        instance.makeSource(this.entities[i].ID, {
          filter: ".ep",
          anchor: "Continuous",
          connectorStyle: {
            stroke: "#191919",
            strokeWidth: 3,
            outlineStroke: "transparent",
            outlineWidth: 4,
            straightdashstyle: this.dashType
          },

          connectionType: "basic",
          extract: {
            action: "the-action"
          },
          maxConnections: 3
        });

        // *********************   //
        //      MAKE TARGET       //
        // ********************* //
        instance.makeTarget(this.entities[i].ID, {
          dropOptions: { hoverClass: "dragHover" },
          anchor: "Continuous"
        });
      }

      // *********************   //
      // SET INIT CONNECTION    //
      // ********************* //
      for (let i in this.connections) {
        instance.connect({
          source: this.connections[i].sourceId,
          target: this.connections[i].targetId,
          overlays: this.connections[i].overlay,
          paintStyle: {
            stroke: "#191919",
            strokeWidth: 3,
            straightdashstyle: this.connections[i].dashType
          }
        });
      }
    },
    /* ************ */
    // JSPLUMB-END //
    /* *********** */

    makeDraggable() {
      // Make Draggable
      for (let i in this.entities) {
        instance.draggable(this.entities[i].ID, {
          grid: [10, 10],
          containment: "main",

          stop: e => {
            ref.child(this.activeEntity).update({ posX: e.pos[0] });
            ref.child(this.activeEntity).update({ posY: e.pos[1] });
          }
        });
      }
    },
    init() {
      this.$store.commit("initConnectionTypes");
      this.$store.dispatch("initEntities").then(() => {
        this.$store.dispatch("initConnections").then(() => {
          this.getflow();
          this.$store.commit("setNotes");
        });
      });
      this.$store.dispatch("getConnType");
      this.$store.dispatch("getDashType");
      this.$store.dispatch("getGlobalConnType");
    },
    addNote(entityID, id, msg) {
      this.$store.dispatch("addNote", { entityID, id, msg });
    },
    getEntityName(name) {
      if (name.includes("(")) {
        return name.slice(0, name.indexOf("(")).toUpperCase();
      } else return name.toUpperCase();
    },
    getShortName(name) {
      if (name.indexOf("(") != -1)
        return name.slice(name.indexOf("(") + 1, name.length - 1).toLowerCase();
      else return name.toLowerCase();
    },
    getEntityFk(ent) {
      let connKey;
      this.entityID = ent.ID;
      const optionality =
        ent.entityType == "mandatory" ? "mandatory" : "optional";

      this.connections.forEach(conn => {
        if (
          conn.entityID == this.sourceKey ||
          conn.entityID == this.targetKey
        ) {
          connKey = conn.id;
        }
      });

      if (ent.id == this.targetKey) {
        ref
          .child(this.sourceKey)
          .child("belongsTo")
          .push(ent.ID);
      } else {
        ref
          .child(this.targetKey)
          .child("belongsTo")
          .push(ent.ID);
      }

      if (ent.id == this.sourceKey) {
        ref.child(this.sourceKey).update({ multi: 1 });
        ref.child(this.targetKey).update({ multi: 0 });
        this.entities.forEach(entity => {
          if (entity.id == this.targetKey) {
            setTimeout(() => {
              refConn.child(connKey).update({
                entityID: ent.id,
                fkID: this.lastItemKey
              });
            }, 1000);

            const name = `${this.getShortName(entity.entityName)}_${
              entity.entityItems[0].itemName
            }`;

            this.$store.dispatch("addItem", {
              id: ent.id,
              itemKey: optionality,
              belongsTo: entity.ID,
              name,
              dataType: entity.entityItems[0].dataType
            });
          }
        });
      } else {
        setTimeout(() => {
          refConn.child(connKey).update({
            entityID: ent.id,
            fkID: this.lastItemKey
          });
        }, 1000);
        ref.child(this.targetKey).update({ multi: 1 });
        ref.child(this.sourceKey).update({ multi: 0 });
        this.entities.forEach(entity => {
          if (entity.id == this.sourceKey) {
            const name = `${this.getShortName(entity.entityName)}_${
              entity.entityItems[0].itemName
            }`;

            this.$store.dispatch("addItem", {
              id: ent.id,
              itemKey: optionality,
              belongsTo: entity.ID,
              name,
              dataType: entity.entityItems[0].dataType
            });
          }
        });
      }
    },
    closeModal() {
      this.isPopupOpen = false;
    },
    goTables() {
      this.$router.push({ name: "tables" });
    },
    createProject() {
      refProjects.push({
        projectName: this.projectName,
        userID: this.currentUser.uid
      });

      this.isNewProjectOpen = false;
      this.projectName = "";
    }
  },
  created() {
    this.init();
    this.currentUser = firebase.auth().currentUser;

    EventBus.$on("donustur", () => {
      if (!this.entities.some(entity => entity.isYay)) {
        if (
          this.connections.some(
            conn => conn.connType == 0 || conn.connType == 1
          )
        ) {
          this.connections.forEach(conn => {
            this.entities.forEach(entity => {
              if (entity.ID == conn.targetId) {
                this.targetKey = entity.id;
              } else if (entity.ID == conn.sourceId) {
                this.sourceKey = entity.id;
              }
            });
          });
          this.isPopupOpen = true;
        } else {
          this.$router.push({ name: "tables" });
        }
      } else {
        this.$router.push({ name: "tables" });
      }
    });

    EventBus.$on("openProjectBox", () => {
      this.isNewProjectOpen = true;
    });

    EventBus.$on("initProject", () => {
      location.reload();
    });

    // this.addNote("-LZBHBzetEiRM6p9oqmH", 21, "foo");
  }
};
</script>

<template lang="pug">
    .cover
      app-toolbar
      #main.main
        app-entity(v-for='entity in entities', 
          :key="entity.id"
          :entity="entity")
      app-sidebar
      .popup(v-if="isPopupOpen")
        .popup__title Choose Foreign Key
        .entities
          .entity(v-for="entity in entities", @click="getEntityFk(entity)", :class="{popup__choosed:entity.ID == entityID}")
            p {{getEntityName(entity.entityName)}}
        a.popup__btn(@click="goTables") continue
        a.popup__close(@click="closeModal") x
      .popup(v-if="isNewProjectOpen")
        .popup__title Enter Project Name
        input(v-model="projectName", placeholder="Project Name")
        a.popup__btn(@click="createProject") Create
        a.popup__close(@click="isNewProjectOpen = false") x

</template>

<style lang="scss" scoped>
.cover {
  display: flex;
}
.main {
  background-image: linear-gradient(#f5f6faab, #f5f6faa1),
    url(http://freedevelopertutorials.azurewebsites.net/wp-content/uploads/2015/06/grid.png);
  background-repeat: repeat;
  border: 1px solid rgba(#000, 0.2);
  text-align: center;
  width: 100%;
  height: 100vh;
}

.popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 300px;
  width: 300px;
  border-radius: 3px;
  background-color: #ddd;
  z-index: 9999999;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6);
  padding: 10px;

  input {
    width: 100%;
    padding: 0.5rem 1rem;
    margin-top: 1rem;
  }

  &__title {
    text-align: center;
    text-transform: uppercase;
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;
  }
  .entities {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    margin-top: 20px;
  }
  .entity {
    height: 30px;
    width: auto;
    border: 1px solid #1abc9c;
    border-radius: 3px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;
    cursor: pointer;

    p {
      font-weight: bold;
    }
  }

  &__btn {
    padding: 10px;
    font-size: 14px;
    background-color: #1abc9c;
    color: #fff;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 3px;
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
  }
  &__close {
    position: absolute;
    right: 8px;
    top: 8px;
    cursor: pointer;
  }

  &__choosed {
    background-color: #1abc9c;

    p {
      color: #fff;
    }
  }
}
</style>

