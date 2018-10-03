<template lang="pug">
    .cover
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

export default {
  data() {
    return {
      dash: "2 1",
      con: "",
      leftEndpoint: 1,
      rightEndpoint: 1,
      con0: [
        [
          // Line
          "Arrow",
          {
            location: 0,
            length: 0.000001,
            foldback: 1,
            id: "0"
          }
        ]
      ],
      con1: [
        // left 1 right 2
        [
          // Line
          "Arrow",
          {
            location: 0.95,
            length: 1,
            foldback: 1,
            id: "1"
          }
        ]
      ],
      con2: [
        // left 1 right 3
        [
          // Arrow
          "Arrow",
          {
            location: 1,
            id: "2",
            length: 10,
            foldback: 0.3,
            direction: -1
          }
        ]
      ],
      con3: [
        // left 1 right 4
        [
          // Arrow
          "Arrow",
          {
            location: 1,
            id: "3",
            length: 10,
            foldback: 0.3,
            direction: -1
          }
        ],
        [
          // Line
          "Arrow",
          {
            location: 0.95,
            length: 1,
            foldback: 1,
            direction: 1,

            id: "label2"
          }
        ]
      ],
      con4: [
        // left 2 right 1
        [
          // Line
          "Arrow",
          {
            location: 0.05,
            length: 1,
            foldback: 1,
            direction: 1,

            id: "4",
            paintStyle: {
              lineWidth: 50,
              stroke: "black",
              fill: "black"
            }
          }
        ]
      ],
      con5: [
        // left 2 right 2
        [
          // Line
          "Arrow",
          {
            location: 0.05,
            length: 1,
            foldback: 1,
            direction: 1,

            id: "5"
          }
        ],
        [
          // Line
          "Arrow",
          {
            location: 0.95,
            length: 1,
            foldback: 1,
            direction: 1,

            id: "label2"
          }
        ]
      ],
      con6: [
        // left 2 right 3
        [
          // Line
          "Arrow",
          {
            location: 0.05,
            length: 1,
            foldback: 1,
            direction: 1,

            id: "6"
          }
        ],
        [
          // Arrow
          "Arrow",
          {
            location: 1,
            id: "arrow2",
            length: 10,
            foldback: 0.3,
            direction: -1
          }
        ]
      ],
      con7: [
        // left 2 right 4
        [
          // Line
          "Arrow",
          {
            location: 0.05,
            length: 1,
            foldback: 1,
            direction: 1,

            id: "7"
          }
        ],
        [
          // Line
          "Arrow",
          {
            location: 0.95,
            length: 1,
            foldback: 1,
            direction: 1,

            id: "label1"
          }
        ],
        [
          // Arrow
          "Arrow",
          {
            location: 1,
            id: "arrow2",
            length: 10,
            foldback: 0.3,
            direction: -1
          }
        ]
      ],
      con8: [
        // left 3 right 1
        [
          // Arrow
          "Arrow",
          {
            location: 0,
            id: "8",
            length: 10,
            foldback: 0.3,
            direction: 1
          }
        ]
      ],
      con9: [
        // left 3 right 2
        [
          // Line
          "Arrow",
          {
            location: 0.95,
            length: 1,
            foldback: 1,
            id: "9"
          }
        ],
        [
          // Arrow
          "Arrow",
          {
            location: 0,
            id: "arrow",
            length: 10,
            foldback: 0.3,
            direction: 1
          }
        ]
      ],
      con10: [
        // left 3 right 3
        [
          // Arrow
          "Arrow",
          {
            location: 0,
            id: "10",
            length: 10,
            foldback: 0.3,
            direction: 1
          }
        ],
        [
          // Arrow
          "Arrow",
          {
            location: 1,
            id: "arrow2",
            length: 10,
            foldback: 0.3,
            direction: -1
          }
        ]
      ],
      con11: [
        // left 3 right 4
        [
          // Arrow
          "Arrow",
          {
            location: 0,
            id: "11",
            length: 10,
            foldback: 0.3,
            direction: 1
          }
        ],
        [
          // Line
          "Arrow",
          {
            location: 0.95,
            length: 1,
            foldback: 1,
            direction: 1,
            id: "label2"
          }
        ],
        [
          // Arrow
          "Arrow",
          {
            location: 1,
            id: "arrow1",
            length: 10,
            foldback: 0.3,
            direction: -1
          }
        ]
      ],
      con12: [
        // left 4 right 1
        [
          // Line
          "Arrow",
          {
            location: 0.05,
            length: 1,
            foldback: 1,
            direction: 1,
            id: "12"
          }
        ],
        [
          // Arrow
          "Arrow",
          {
            location: 0,
            id: "arrow1",
            length: 10,
            foldback: 0.3,
            direction: -1
          }
        ]
      ],
      con13: [
        // left 4 right 2
        [
          // Line
          "Arrow",
          {
            location: 0.1,
            length: 1,
            foldback: 1,
            direction: 1,
            id: "13"
          }
        ],
        [
          // Arrow
          "Arrow",
          {
            location: 0,
            id: "arrow1",
            length: 10,
            foldback: 0.3,
            direction: 1
          }
        ],
        [
          // Line
          "Arrow",
          {
            location: 0.95,
            length: 1,
            foldback: 1,
            direction: 1,
            id: "label1"
          }
        ]
      ],
      con14: [
        // left 4 right 3
        [
          // Line
          "Arrow",
          {
            location: 0.05,
            length: 1,
            foldback: 1,
            direction: 1,
            id: "14"
          }
        ],
        [
          // Arrow
          "Arrow",
          {
            location: 0,
            id: "arrow1",
            length: 10,
            foldback: 0.3,
            direction: -1
          }
        ],
        [
          // Arrow
          "Arrow",
          {
            location: 1,
            id: "arrow2",
            length: 10,
            foldback: 0.3,
            direction: -1
          }
        ]
      ],
      con15: [
        [
          // Line
          "Arrow",
          {
            location: 0.05,
            length: 1,
            foldback: 1,
            direction: 1,
            id: "15"
          }
        ],
        [
          // Arrow
          "Arrow",
          {
            location: 0,
            id: "arrow1",
            length: 10,
            foldback: 0.3,
            direction: 1
          }
        ],
        [
          // Line
          "Arrow",
          {
            location: 0.95,
            length: 1,
            foldback: 1,
            direction: 1,
            id: "label1"
          }
        ],
        [
          // Arrow
          "Arrow",
          {
            location: 1,
            id: "arrow2",
            length: 10,
            foldback: 0.3,
            direction: -1
          }
        ]
      ]
    };
  },
  computed: {
    ...mapGetters(["entities", "connections", "activeEntity"])
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
        ConnectionOverlays: this.con,
        Container: "main"
      });
      window.ins = instance;

      // Set position of Entities
      for (let i in this.entities) {
        $(`#${this.entities[i].ID}`).css({
          left: this.entities[i].entityX,
          top: this.entities[i].entityY
        });
      }

      // GET CONNECTION INFO
      instance.bind("click", c => {
        let s = c.endpoints[0].elementId;
        let t = c.endpoints[1].elementId;
      });

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

        if (conID == 8 || conID == 0) {
          var key = "";

          this.entities.forEach(entity => {
            if (entity.ID == s) {
              key = entity.id;
              ref.child(key).update({ multi: true });
            }
          });

          this.entities.forEach(entity => {
            if (entity.ID == t) {
              ref.child(key).update({ fk: entity.entityName });
            }
          });
        }

        if (!(t.length < 20)) {
          refConn.push({
            sourceId: s,
            targetId: t,
            overlay: this.con
          });
        }
      });

      for (let i in this.entities) {
        // MAKE DRAGGABLE
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
        ins.draggable(this.entities[i].ID, {
          grid: [10, 10],
          containment: "main",

          stop: e => {
            console.log(e.el.id);
            ref.child(this.activeEntity).update({ entityX: e.pos[0] });
            ref.child(this.activeEntity).update({ entityY: e.pos[1] });
          }
        });
      }
    },
    changeOverlay() {
      instance = jsPlumb.getInstance({
        ConnectionOverlays: this.con
      });
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
    setConnections(key) {
      if (key < 5) {
        this.leftEndpoint = key;
      } else {
        if (key == 5) this.rightEndpoint = 1;
        if (key == 6) this.rightEndpoint = 2;
        if (key == 7) this.rightEndpoint = 3;
        if (key == 8) this.rightEndpoint = 4;
      }

      let l = this.leftEndpoint;
      let r = this.rightEndpoint;

      if (l == 1 && r == 1) {
        this.con = this.con0;
      } else if (l == 1 && r == 2) {
        this.con = this.con1;
      } else if (l == 1 && r == 3) {
        this.con = this.con2;
      } else if (l == 1 && r == 4) {
        this.con = this.con3;
      } else if (l == 2 && r == 1) {
        this.con == this.con4;
      } else if (l == 2 && r == 2) {
        this.con = this.con5;
      } else if (l == 2 && r == 3) {
        this.con = this.con6;
      } else if (l == 2 && r == 4) {
        this.con = this.con7;
      } else if (l == 3 && r == 1) {
        this.con = this.con8;
      } else if (l == 3 && r == 2) {
        this.con = this.con9;
      } else if (l == 3 && r == 3) {
        this.con = this.con10;
      } else if (l == 3 && r == 4) {
        this.con = this.con11;
      } else if (l == 4 && r == 1) {
        this.con = this.con12;
      } else if (l == 4 && r == 2) {
        this.con = this.con13;
      } else if (l == 4 && r == 3) {
        this.con = this.con14;
      } else if (l == 4 && r == 4) {
        this.con = this.con15;
      }

      this.changeOverlay();
    }
  },
  created() {
    this.$store.dispatch("initEntities");
    this.$store.dispatch("initConnections");

    this.con = this.con0;

    EventBus.$on("emitLeftEndpoint", leftKey => {
      this.setConnections(leftKey);
    });
    EventBus.$on("emitRightEndpoint", rightKey => {
      this.setConnections(rightKey);
    });
    EventBus.$on("emitDashStyle", type => {
      this.changeDashStyle(type);
    });
  },
  components: {
    AppEntity,
    AppSidebar
  },
  updated() {
    this.makeDraggable();
  },
  mounted() {
    setTimeout(() => {
      this.getflow();
    }, 2000);
  }
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

