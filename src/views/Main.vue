<script>
import $ from "jquery";

import { jsPlumb } from "jsplumb";
import { EventBus } from "@/main";
import { ref, refConn, refConnType, refGlobalConnType } from "@/firebase/";
import { mapGetters } from "vuex";

import AppSidebar from "@/components/global/Sidebar";
import AppEntity from "@/components/Entity";
import AppToolbar from "@/components/global/Toolbar";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      isChoosed: "",
      entityID: "",
      sourceKey: "",
      targetKey: "",
      isPopupOpen: false
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
      "globalConnType"
    ])
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

      // ********************* //
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

        this.connections.forEach(conn => {
          if (conn.sourceId == s && conn.targetId == t) {
            refConn.child(conn.id).remove();
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
          if (conID == 12) {
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
              dashType1 = "0 5 5",
              dashType2 = "150 5 0",
              msgTargetName,
              msgSourceName;

            // entityType'ı güncelle
            this.entities.forEach(entity => {
              if (entity.ID == t) {
                key = entity.id;
                ref.child(key).update({ entityType: "mandatory" });
              } else if (entity.ID == s) {
                key = entity.id;
                ref.child(key).update({ entityType: "optional" });
              }
            });

            // get some values for new entity
            this.entities.forEach(entity => {
              if (entity.ID == s) {
                sourceX = entity.posX;
                sourceY = entity.posY;
                msgSourceName = entity.entityName;
                sourceName = `${entity.entityName
                  .slice(
                    entity.entityName.indexOf("/") + 1,
                    entity.entityName.length
                  )
                  .toLowerCase()}_${entity.entityItems[0].itemName}`;
              }
              if (entity.ID == t) {
                targetX = entity.posX;
                msgTargetName = entity.entityName;

                targetName = `${entity.entityName
                  .slice(
                    entity.entityName.indexOf("/") + 1,
                    entity.entityName.length
                  )
                  .toLowerCase()}_${entity.entityItems[0].itemName}`;
              }
            });

            this.addNote(
              key,
              this.notes.length + 1,
              `Every ${msgTargetName
                .slice("0", msgTargetName.indexOf("/"))
                .toUpperCase()} must have a ${msgSourceName
                .slice("0", msgSourceName.indexOf("/"))
                .toUpperCase()}`
            );

            posX = (targetX - sourceX) / 2 + sourceX - 10;
            posY = sourceY + 300;

            this.$store.dispatch("addEntity", {
              posX,
              posY,
              entityName,
              sourceName,
              targetName
            });

            this.entities.forEach(entity => {
              if (entity.multi == 2) newEntityTarget = entity.ID;
            });

            refConnType.update({ connType: 6 });
            refGlobalConnType.update({ globalConnType: "Flowchart" });

            this.$store.commit("setConnectionType", 6);
            refConn.push({
              sourceId: s,
              connType: 0,
              targetId: newEntityTarget,
              dashType: dashType1,
              overlay: this.connType
            });
            refConn.push({
              sourceId: t,
              connType: 0,
              targetId: newEntityTarget,
              dashType: dashType2,
              overlay: this.connType
            });
            location.reload();
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

        // *******************************      //
        //     1:M-1:1   ÇİFT TARAF ZORUNLU    //
        // *******************************    //
        if (conID == 0 || conID == 1 || conID == 5 || conID == 4) {
          let key = "",
            entityType = "",
            connType = "";

          conID == 0 || conID == 4 ? (entityType = "optional") : 0;
          conID == 1 || conID == 5 ? (entityType = "mandatory") : 0;

          conID == 0 ? (connType = 0) : conID == 1 ? (connType = 1) : 0;

          this.entities.forEach(entity => {
            if (entity.ID == t) {
              key = entity.id;
              this.targetKey = key;
              ref.child(key).update({ multi: 1 });
              ref.child(key).update({ entityType });
            } else if (entity.ID == s) {
              key = entity.id;
              this.sourceKey = key;
              ref.child(key).update({ entityType });
            }
          });

          if (!(t.length < 20)) {
            refConn.push({
              sourceId: s,
              targetId: t,
              connType,
              dashType: this.dashType,
              overlay: this.connType
            });
          }
        }

        // ****************************************  //
        //     M TO M ÇİFT TARAF ZORUNLU || SECIMLİ //
        // *************************************** //
        if (conID == 10 || conID == 11) {
          let sourceX,
            key,
            targetX,
            sourceY,
            posX,
            posY,
            newEntityTarget,
            entityName,
            sourceName,
            targetName,
            entityType;

          conID == 10 ? (entityType = "optional") : (entityType = "mandatory");

          // entityType'ı güncelle
          this.entities.forEach(entity => {
            if (entity.ID == t) {
              key = entity.id;
              ref.child(key).update({ entityType });
            } else if (entity.ID == s) {
              key = entity.id;
              ref.child(key).update({ entityType });
            }
          });

          // get some values for new entity
          this.entities.forEach(entity => {
            if (entity.ID == s) {
              sourceX = entity.posX;
              sourceY = entity.posY;
              sourceName = entity.entityName;
            }
            if (entity.ID == t) {
              targetX = entity.posX;
              targetName = entity.entityName;
            }
          });

          posX = (targetX - sourceX) / 2 + sourceX - 10;
          posY = sourceY + 300;
          entityName = `${sourceName}_${targetName}`;
          this.$store.dispatch("addEntity", {
            posX,
            posY,
            entityName,
            sourceName,
            targetName
          });

          this.entities.forEach(entity => {
            if (entity.multi == 2) newEntityTarget = entity.ID;
          });

          refConnType.update({ connType: 4 });

          this.$store.commit("setConnectionType", 4);
          refConn.push({
            sourceId: s,
            connType: 0,
            targetId: newEntityTarget,
            dashType: this.dashType,
            overlay: this.connType
          });
          refConn.push({
            sourceId: t,

            connType: 0,

            targetId: newEntityTarget,
            dashType: this.dashType,
            overlay: this.connType
          });
          location.reload();
        }
        // ****************************************  //
        //            1:1 SEÇİMLİ-ZORUNLU           //
        // *************************************** //
        if (conID == 2) {
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
          refConn.push({
            sourceId: s,
            targetId: t,
            connType: 2,
            dashType: this.dashType,
            overlay: this.connType
          });

          // ****************************************  //
          //            1:M SEÇİMLİ-ZORUNLU           //
          // *************************************** //
        } else if (conID == 6) {
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
              overlay: this.connType
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
          maxConnections: 2
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

    setConnType() {
      return "";
    },

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
      if (name) {
        return name.slice(0, name.indexOf("/")).toUpperCase();
      }
    },
    getEntityFk(entity) {
      this.entityID = entity.ID;

      if (entity.id == this.sourceKey) {
        ref.child(this.sourceKey).update({ multi: 1 });
        ref.child(this.targetKey).update({ multi: 0 });
      } else {
        ref.child(this.targetKey).update({ multi: 1 });
        ref.child(this.sourceKey).update({ multi: 0 });
      }
    },
    closeModal() {
      this.isPopupOpen = false;
    },
    goTables() {
      this.$router.push({ name: "tables" });
    }
  },
  created() {
    this.init();

    EventBus.$on("donustur", () => {
      this.connections.forEach(conn => {
        if (conn.connType == 0 || conn.connType == 1 || conn.connType == 2) {
          this.entities.forEach(entity => {
            if (entity.ID == conn.targetId) {
              this.targetKey = entity.id;
            } else if (entity.ID == conn.sourceId) {
              this.sourceKey = entity.id;
            }
          });
          this.isPopupOpen = true;
        } else {
          this.$router.push({ name: "tables" });
        }
      });
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

