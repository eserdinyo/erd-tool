<template lang="pug">
    .cover
      app-toolbar
      #main.main
        app-entity(v-for='entity in entities', 
          :key="entity.id"
          :entity="entity")
      app-sidebar
</template>


<script>
import $ from "jquery";

import { jsPlumb } from "jsplumb";
import { EventBus } from "@/main";
import { ref, refConn, refConnType } from "@/firebase/";
import { mapGetters } from "vuex";

import AppSidebar from "@/components/global/Sidebar";
import AppEntity from "@/components/Entity";
import AppToolbar from "@/components/global/Toolbar";

export default {
  data() {
    return {};
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
      // CONNECTION DRAG STOP  //
      // ********************* //
      instance.bind("connectionDragStop", ci => {
        let s = ci.sourceId,
          t = ci.targetId;

        const conID =
          ci._jsPlumb.overlays[Object.keys(ci._jsPlumb.overlays)[0]].id;

        // ******************************* //
        //     1:M   ÇİFT TARAF ZORUNLU    //
        // ******************************* //
        if (conID == 4 || conID == 0 || conID == 1 || conID == 5) {
          let key = "",
            entityType = "";

          conID == 0 || conID == 4 ? (entityType = "optional") : 0;
          conID == 1 || conID == 5 ? (entityType = "mandatory") : 0;

          this.entities.forEach(entity => {
            if (entity.ID == t) {
              key = entity.id;
              ref.child(key).update({ multi: 1 });
              ref.child(key).update({ entityType });
            } else if (entity.ID == s) {
              key = entity.id;
              ref.child(key).update({ entityType });
            }
          });

          if (!(t.length < 20)) {
            refConn.push({
              sourceId: s,
              targetId: t,
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
            targetId: newEntityTarget,
            dashType: this.dashType,
            overlay: this.connType
          });
          refConn.push({
            sourceId: t,
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
          this.entities.forEach(entity => {
            if (entity.ID == t) {
              key = entity.id;
              ref.child(key).update({ multi: 1 });
              ref.child(key).update({ entityType: "mandatory" });
            } else if (entity.ID == s) {
              key = entity.id;
              ref.child(key).update({ entityType: "optinal" });
            }
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
              dashType: this.dashType,
              overlay: this.connType
            });
          }
        }
        // ****************************************  //
        //            M:M SEÇİMLİ-ZORUNLU           //
        // *************************************** //
        else if (conID == 12) {
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

          refConnType.update({ connType: 6 });

          this.$store.commit("setConnectionType", 6);
          refConn.push({
            sourceId: s,
            targetId: newEntityTarget,
            dashType: this.dashType,
            overlay: this.connType
          });
          refConn.push({
            sourceId: t,
            targetId: newEntityTarget,
            dashType: this.dashType,
            overlay: this.connType
          });
          location.reload();
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
        });
      });
      this.$store.dispatch("getConnType");
      this.$store.dispatch("getDashType");
      this.$store.dispatch("getGlobalConnType");
    }
  },
  created() {
    this.init();
  }
};
</script>


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
</style>

