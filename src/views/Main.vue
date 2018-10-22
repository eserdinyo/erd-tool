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
    return {
      dash: "2 1"
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
      "connType"
    ])
  },
  methods: {
    // JSPLUMB //
    getflow() {
      var instance = jsPlumb.getInstance({
        /*paintStyle: {
          strokeWidth: 2,
          straightdashstyle: "200 10 5",
          stroke: "#445566"
        },*/
        Connector: ["Flowchart", { curviness: 50 }],
        Endpoint: ["Dot", { radius: 1 }],
        EndpointStyle: { fill: "#191919" },
        HoverPaintStyle: { stroke: "#c0392b", lineWidth: 4 },
        EndpointHoverStyle: { fill: "#c0392b", stroke: "#c0392b" },
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

        // ************** //
        //     1:M       //
        // ************** //
        if (conID == 4) {
          let key = "";

          this.entities.forEach(entity => {
            if (entity.ID == t) {
              key = entity.id;
              ref.child(key).update({ multi: 1 });
            }
          });

          if (!(t.length < 20)) {
            refConn.push({
              sourceId: s,
              targetId: t,
              overlay: this.connType
            });
          }
        }

        // **************  //
        //     M TO M     //
        // ************** //
        if (conID == 5) {
          let sourceX,
            targetX,
            sourceY,
            posX,
            posY,
            newEntityTarget,
            entityName,
            sourceName,
            targetName;
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
          posY = sourceY + 210;
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
          this.$store.commit("setConnectionType");
          refConn.push({
            sourceId: s,
            targetId: newEntityTarget,
            overlay: this.connType
          });
          refConn.push({
            sourceId: t,
            targetId: newEntityTarget,
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
          //connectorStyle: this.changeDashStyle(),
          connectorStyle: {
            stroke: "#191919",
            strokeWidth: 3,
            outlineStroke: "transparent",
            outlineWidth: 4,
            straightdashstyle: "100 5 5"
            //dashstyle: this.dash,
          },

          connectionType: "basic",
          extract: {
            action: "the-action"
          },
          maxConnections: 2
        });

        // *********************   //
        //       MAKE TARGET      //
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
          paintStyle: { stroke: "#191919", strokeWidth: 3, dashstyle: "0" }
        });
      }
    },
    // JSPLUMB //

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
    changeDashStyle(type) {
      let color = "red";
      // if (type == 2) this.dash = "2 1";
      //console.log('in change');
      if (type == 2) color = "yellow";

      return {
        stroke: color,
        strokeWidth: 3,
        outlineStroke: "transparent",
        outlineWidth: 4,
        dashstyle: this.dash
      };
    },
    init() {
      this.$store.commit("initConnectionTypes");
      this.$store.dispatch("initEntities").then(() => {
        this.$store.dispatch("initConnections").then(() => {
          this.getflow();
        });
      });
      this.$store.dispatch("getConnType");
    }
  },
  watch: {},

  created() {
    this.init();

    /* EventBus.$on("emitDashStyle", type => {
      this.changeDashStyle(type);
    }); */
  }
};
</script>


<style lang="scss" scoped>
.cover {
  display: flex;
}
.main {
  background-image: linear-gradient(#f5f6fa77, #f5f6fa73),
    url(http://freedevelopertutorials.azurewebsites.net/wp-content/uploads/2015/06/grid.png);
  background-repeat: repeat;
  border: 1px solid rgba(#000, 0.2);
  text-align: center;
  width: 100%;
  height: 100vh;
}
</style>

