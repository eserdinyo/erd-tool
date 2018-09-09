<template lang="pug">
    .cover()
      #main.main()
        template(v-for='entity in entities')
            .tablo.entity(:id="entity.ID")
              table(@mousedown="activeEntity(entity.id)" , :class="{ activeEntity : active_el == entity.id}",)
                thead
                  th(colspan='4')
                    input#entityName(type='text', placeholder='Varlık İsmi', :value='entity.entityName',@keyup="sendEntityName(entity,$event.target.value)")
                tbody
                  tr.row(v-for='(item,key) in entity.entityItems', :key='item.id')
                    td
                      .field
                        select#element(v-model="item.itemKey", @change="changeItem(key,entity,$event.target.value)")
                          option(disabled, value='') ID
                          option(title="Unique", value='unique') #
                          option(title="Mandatory", value='mandatory') *
                          option(title="Optional", value='optional') o
                    td
                      .field
                        input(type='text',:value="item.itemName", placeholder='İsmi', @keyup="sendItemName(key,entity, $event.target.value)")
              .ep
      sidebar
        
</template>


<script>
import $ from "jquery";
import { jsPlumb } from "jsplumb";
import { ref, refConn } from "../firebase/";
import { EventBus } from "../main";
import Sidebar from "./Siderbar";

export default {
  data() {
    return {
      active_el: 0,
      entities: [],
      conns: [],
      dash: "2 1",
      con: "",
      leftEndpoint: 1,
      rightEndpoint: 1,
      item: {
        itemKey: "",
        itemName: "",
        dataType: "int"
      },
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
  methods: {
    activeEntity(el) {
      this.active_el = el;
    },
    // JSPLUMB //
    getflow() {
      var instance = jsPlumb.getInstance({
        /*paintStyle: {
          strokeWidth: 2,
          straightdashstyle: "200 10 5",
          stroke: "#445566"
        },*/
        Connector: ["Bezier", { curviness: 50 }],
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

        this.conns.forEach(conn => {
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
          containment: "#main",

          stop: e => {
            //console.log(e.el.id);
            ref.child(this.active_el).update({ entityX: e.pos[0] });
            ref.child(this.active_el).update({ entityY: e.pos[1] });
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
      for (let i in this.conns) {
        instance.connect({
          source: this.conns[i].sourceId,
          target: this.conns[i].targetId,
          overlays: this.conns[i].overlay,
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
          containment: "#main",

          stop: e => {
            //console.log(e.el.id);
            ref.child(this.active_el).update({ entityX: e.pos[0] });
            ref.child(this.active_el).update({ entityY: e.pos[1] });
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
    getEntites() {
      ref.on("value", snap => {
        const data = snap.val();

        const entites = [];
        for (let key in data) {
          const entity = data[key];
          entity.id = key;
          entites.push(entity);
        }

        this.entities = entites;
      });
    },
    getConnections() {
      refConn.on("value", snap => {
        const data = snap.val();

        const connections = [];
        for (let key in data) {
          const conn = data[key];
          conn.id = key;
          connections.push(conn);
        }

        this.conns = connections;
      });
    },
    addItem(id) {
      ref
        .child(id)
        .child("entityItems")
        .push(this.item);
    },
    subItem(id) {
      let key = "";
      ref
        .child(id)
        .child("entityItems")
        .limitToLast(1)
        .on("child_added", snap => {
          key = snap.key;
        });

      if (key != 0) {
        ref
          .child(id)
          .child("entityItems")
          .child(key)
          .remove();

        let length = ref.child(id).child("entityItems");
      }
      EventBus.$emit("emitKey", key);
    },
    delEntity(id) {
      ref.child(id).remove();
    },
    sendEntityName(entity, value) {
      ref.child(entity.id).update({ entityName: value });
    },
    changeItem(key, entity, value) {
      ref
        .child(entity.id)
        .child("entityItems")
        .child(key)
        .update({ itemKey: value });
    },
    sendItemName(key, entity, value) {
      ref
        .child(entity.id)
        .child("entityItems")
        .child(key)
        .update({ itemName: value });
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
    this.con = this.con0;
    EventBus.$on("emitEntity", entity => {
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
    });

    this.getEntites();
    this.getConnections();
    EventBus.$on("emitLeftEndpoint", leftKey => {
      this.setConnections(leftKey);
    });
    EventBus.$on("emitRightEndpoint", rightKey => {
      this.setConnections(rightKey);
    });
    EventBus.$on("emitDashStyle", type => {
      this.changeDashStyle(type);
    });

    EventBus.$on("emitAdd", key => {
      this.addItem(this.active_el);
    });
    EventBus.$on("emitSub", key => {
      this.subItem(this.active_el);
    });

    document.onkeydown = evt => {
      evt = evt || window.event;
      if (evt.keyCode == 46) {
        if (this.active_el != 0) {
          this.delEntity(this.active_el);
        }
      } else if (evt.keyCode == 27) {
        console.log("esc");

        this.active_el = 0;
        console.log(this.active_el);
      }
    };
  },
  components: {
    Sidebar
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
  flex-grow: 15;
  height: 100vh;
}

.activeEntity {
  border: 2px solid rgba(#e74c3c, 0.9);
}

.ep {
  position: absolute;
  right: 61%;
  top: 62px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: rgba(204, 204, 204, 0.486);
  border: 1px solid rgba(170, 170, 170, 0.459);
  cursor: pointer;
}
//*************//
// Tablo
.tablo {
  select {
    background: transparent;
    padding: 3px 10px;
    border: 1px solid (#191919, 0.3);
    color: #191919;
  }
}

table {
  width: 100%;
  margin-bottom: 3px;
  padding-bottom: 3px;
  border: 2px solid rgba(#191919, 0.7);
  border-radius: 3px;
  background-color: rgba(#fff, 1);
  z-index: 99;
  cursor: move;
  /*
  &::after {
    content: "";
    height: 20px;
    width: 20px;
    background: url(../assets/img/rightArrow.png);
    background-size: cover;
    position: absolute;
    top: 0%;
    left: 99%;
    margin-top: 40px;
  }
  &::before {
    content: "";
    height: 20px;
    width: 20px;
    background: url(../assets/img/leftArrow.png);
    background-size: cover;
    position: absolute;
    top: 0%;
    left: -7%;
    margin-top: 40px;
  } */
}
th {
  border-bottom: 1px solid rgba(#191919, 0.5);
  padding: 0;
}
td {
  padding: 5px 10px;
  text-align: center;
}
input[type="text"] {
  width: 100%;
  padding: 5px 5px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  background: transparent;
  color: #000;
  border-radius: 4px;
  box-sizing: border-box;
  text-align: center;
  &::-webkit-input-placeholder {
    color: rgb(121, 121, 121);
  }
}
.field input {
  margin: 0;
}
.addBtn {
  font-weight: bold;
  position: absolute;
  left: 40%;
  font-weight: 900;
  background-color: #1abc9c;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  padding: 0 8px;
  transition: all 0.2s;
  &:active {
    background-color: #0fa083;
  }
}
.subBtn {
  font-weight: bold;
  position: absolute;
  left: 40%;
  font-weight: 900;
  background-color: #1abc9c;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  padding: 0 10px;
  transition: all 0.2s;
  margin-left: 30px;
  &:active {
    background-color: #0fa083;
  }
  &:disabled {
    cursor: not-allowed;
  }
}
.delBtn {
  position: absolute;
  top: 0;
  left: 0;
  margin-left: -2px;
  margin-top: -7px;
  background: transparent;
  padding: 0;
  border: none;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  transition: all 0.3s;
  backface-visibility: hidden;
  user-select: none;
  &:hover {
    transform: scale(1.5);
  }
}
.entity {
  width: 250px;
  position: absolute;
}
</style>

