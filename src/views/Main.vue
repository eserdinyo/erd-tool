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
import { ref, refConn } from "@/firebase/";
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

      // Set position of Entities
      for (let i in this.entities) {
        $(`#${this.entities[i].ID}`).css({
          left: this.entities[i].entityX,
          top: this.entities[i].entityY
        });
      }

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

      instance.bind("connectionDragStop", ci => {
        let s = ci.sourceId,
          t = ci.targetId;

        const conID =
          ci._jsPlumb.overlays[Object.keys(ci._jsPlumb.overlays)[0]].id;

        if (conID == 2) {
          let key = "";

          this.entities.forEach(entity => {
            if (entity.ID == t) {
              key = entity.id;
              ref.child(key).update({ multi: true });
            }
          });

          this.entities.forEach(entity => {
            if (entity.ID == s) {
              ref.child(key).update({ fk: `${entity.entityName}_id` });
            }
          });
        }

        if (!(t.length < 20)) {
          refConn.push({
            sourceId: s,
            targetId: t,
            overlay: this.connType
          });
        }
      });

      // MAKE DRAGGABLE
      for (let i in this.entities) {
        instance.draggable(this.entities[i].ID, {
          grid: [10, 10],
          containment: "main",

          stop: e => {
            ref.child(this.activeEntity).update({ entityX: e.pos[0] });
            ref.child(this.activeEntity).update({ entityY: e.pos[1] });
          }
        });

        // MAKE SOURCE
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

        // MAKE TARGET
        instance.makeTarget(this.entities[i].ID, {
          dropOptions: { hoverClass: "dragHover" },
          anchor: "Continuous"
        });
      }

      // SET CONNECTIONS
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
            ref.child(this.activeEntity).update({ entityX: e.pos[0] });
            ref.child(this.activeEntity).update({ entityY: e.pos[1] });
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
    }
  },
  watch: {
    connType() {}
  },

  created() {
    this.$store.commit("initConnectionTypes");
    this.$store.dispatch("initEntities");
    this.$store.dispatch("initConnections");
    this.$store.dispatch("getConnType");

    EventBus.$on("emitDashStyle", type => {
      this.changeDashStyle(type);
    });

    setTimeout(() => {
      this.getflow();
    }, 2000);
  },
  updated() {
    // this.makeDraggable();
  },
  mounted() {}
};
</script>


<style lang="scss" scoped>
.cover {
  display: flex;
}
.main {
  background-image: url(http://freedevelopertutorials.azurewebsites.net/wp-content/uploads/2015/06/grid.png);
  background-repeat: repeat;
  border: 1px solid rgba(#000, 0.2);
  text-align: center;
  width: 100%;
  height: 100vh;
}
</style>

