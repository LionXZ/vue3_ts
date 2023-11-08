<template>
  <div class="content-main blood">
    <div>{{ img1 }}</div>
    <div class="box">
      <div id="parentDiv">
        <div id="myDiagramDiv"></div>
      </div>
    </div>
  </div>
</template>

<script setup >
  import img1 from "@/assets/dbIcon.png";
  //   import img2 from "@/assets/ziduan.png";
  import { reactive, nextTick, watch, onMounted } from "vue";
  import go from "gojs"; //引入gojs
  function TreeNode() {
    go.Node.call(this);
    this.treeExpandedChanged = function (node) {
      if (node.containingGroup !== null) {
        node.containingGroup.findExternalLinksConnected().each(function (l) {
          l.invalidateRoute();
        });
      }
    };
  }
  go.Diagram.inherit(TreeNode, go.Node);

  TreeNode.prototype.findVisibleNode = function () {
    // redirect links to lowest visible "ancestor" in the tree
    var n = this;
    while (n !== null && !n.isVisible()) {
      n = n.findTreeParentNode();
    }
    return n;
  };
  // end TreeNode

  function MappingLink() {
    go.Link.call(this);
  }
  go.Diagram.inherit(MappingLink, go.Link);

  MappingLink.prototype.getLinkPoint = function (
    node,
    port,
    spot,
    from,
    ortho,
    othernode,
    otherport
  ) {
    var r = port.getDocumentBounds();
    var group = node.containingGroup;
    var b = group !== null ? group.actualBounds : node.actualBounds;
    var op = othernode.getDocumentPoint(go.Spot.Center);
    var x = op.x > r.centerX ? b.right : b.left;
    return new go.Point(x, r.centerY);
  };
  // end MappingLink

  let data = reactive({
    level: "表级",
    parmas: {
      detail: "",
      dep: "1",
    },
    dialogFormVisible: false,
    flag: false,
    form: "",
    myDiagram: null,
    // myOverview: null,
    nodeDataArray: [],
    linkDataArray: [],
    tableNames: [],
    restaurants: [],
    obj: {},
    newParmas: {},
    newLinkDataArray: [],
  });

  const onSubmit = () => {
    data.dialogFormVisible = true;
    let key = data.obj[data.parmas.detail];
    data.newParmas.id = key;
    data.newParmas.depth = data.parmas.dep;
    data.newLinkDataArray = [];
    nextTick(() => {
      initgojs();
    });
  };

  const initgojs = () => {
    let nodeDataArray = [];
    let res = {
      tableRelations: [
        { from: "charge_stat_t", to: "car_mon_data", category: "Mapping" },
        { from: "charge_stat_source", to: "charge_stat_s", category: "Mapping" },
        { from: "charge_stat_source", to: "charge_stat_t", category: "Mapping" },
        { from: "charge_stat_s", to: "car_mon_data", category: "Mapping" },
        {
          from: "charge_start_end",
          to: "charge_stat_source",
          category: "Mapping",
        },
      ],
      tables: [
        { text: "", isGroup: true, key: "car_mon_data" },
        { text: "", isGroup: true, key: "charge_stat_t" },
        { text: "", isGroup: true, key: "charge_stat_s" },
        { text: "", isGroup: true, key: "charge_stat_source" },
        { text: "", isGroup: true, key: "charge_start_end" },
      ],
      columns: [
        {
          column: "vin",
          text: "",
          key: "charge_start_end_vin",
          group: "charge_start_end",
        },
        {
          column: "max_temperature_diff_voltage_diff_to_trips",
          text: "",
          key: "car_mon_data_max_temperature_diff_voltage_diff_to_trips",
          group: "car_mon_data",
        },
        {
          column: "max_temperature_diff_voltage_diff_to_trips",
          text: "",
          key: "charge_stat_t_max_temperature_diff_voltage_diff_to_trips",
          group: "charge_stat_t",
        },
        {
          column: "trip_max_voltage_range",
          text: "",
          key: "charge_stat_s_trip_max_voltage_range",
          group: "charge_stat_s",
        },
        {
          column: "trip_max_temperature_range",
          text: "",
          key: "charge_stat_s_trip_max_temperature_range",
          group: "charge_stat_s",
        },
        {
          column: "trip_max_voltage_range",
          text: "",
          key: "charge_stat_source_trip_max_voltage_range",
          group: "charge_stat_source",
        },
        {
          column: "trip_max_temperature_range",
          text: "",
          key: "charge_stat_source_trip_max_temperature_range",
          group: "charge_stat_source",
        },
      ],
      columnRelations: [
        {
          from: "charge_start_end_vin",
          to: "charge_stat_source_trip_max_temperature_range",
          linktext: "通过XXXXXXX获取",
        },
        {
          from: "charge_start_end_vin",
          to: "charge_stat_source_trip_max_voltage_range",
          linktext: "通过XXXXXXX获取",
        },
        {
          from: "charge_stat_s_trip_max_voltage_range",
          to: "car_mon_data_max_temperature_diff_voltage_diff_to_trips",
          linktext: "通过XXXXXXX获取",
        },
        {
          from: "charge_stat_t_max_temperature_diff_voltage_diff_to_trips",
          to: "car_mon_data_max_temperature_diff_voltage_diff_to_trips",
          linktext: "通过XXXXXXX获取",
        },
        {
          from: "charge_stat_s_trip_max_temperature_range",
          to: "car_mon_data_max_temperature_diff_voltage_diff_to_trips",
          linktext: "通过XXXXXXX获取",
        },
      ],
    };
    console.log("当前组件res:", res);
    if (JSON.stringify(res) == "{}") {
      return false;
    }
    nodeDataArray.push(...res.columns);
    nodeDataArray.push(...res.tables);
    data.nodeDataArray = nodeDataArray;
    let linkDataArray = [];
    linkDataArray.push(...res.tableRelations);
    res.columnRelations.forEach((v) => {
      v.category = "childlink";
    });
    linkDataArray.push(...res.columnRelations);
    data.linkDataArray = linkDataArray;
    init();
  };

  const initDom = () => {
    var relationship = document.getElementById("relationship");
    var parentDiv = document.createElement("div");
    parentDiv.setAttribute("id", "parentDiv");
    if (relationship) relationship.appendChild(parentDiv);

    var myDiagramDiv = document.createElement("div");
    myDiagramDiv.setAttribute("id", "myDiagramDiv");
    if (parentDiv) parentDiv.appendChild(myDiagramDiv);
  };
  const init = () => {
    var myDiagramDiv = document.getElementById("myDiagramDiv");
    var parentDiv = document.getElementById("parentDiv");
    console.log(myDiagramDiv);
    console.log(parentDiv);
    parentDiv.removeChild(myDiagramDiv);
    var div = document.createElement("div");
    div.setAttribute("id", "myDiagramDiv");
    parentDiv.appendChild(div);
    // if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make; // for conciseness in defining templates
    var roundedRectangleParams = {
      parameter1: 2, // set the rounded corner
      spot1: go.Spot.TopLeft,
      spot2: go.Spot.BottomRight, // make content go all the way to inside edges of rounded corners
    };
    data.myDiagram = $(go.Diagram, "myDiagramDiv", {
      // layout: $(DoubleTreeLayout, {
      //   directionFunction: function (n) {
      //     return n.data && n.data.dir !== "left";
      //   }
      // }),
      initialContentAlignment: go.Spot.Center, // 居中显示Diagram内容
      contentAlignment: go.Spot.Center,
      "animationManager.initialAnimationStyle": go.AnimationManager.None,
      InitialAnimationStarting: function (e) {
        var animation = e.subject.defaultAnimation;
        animation.easing = go.Animation.EaseOutExpo;
        animation.duration = 900;
        animation.add(e.diagram, "scale", 0.5, 0.7);
        animation.add(e.diagram, "opacity", 0, 1); //全局透明度
      },

      // have mouse wheel events zoom in and out instead of scroll up and down
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
      // support double-click in background creating a new node
      // "clickCreatingTool.archetypeNodeData": { text: "new node" },
      // enable undo & redo
      "undoManager.isEnabled": true,
      positionComputation: function (diagram, pt) {
        return new go.Point(Math.floor(pt.x), Math.floor(pt.y));
      },
      PartResized: function (e) {
        var node = e.subject;
        var scroller = node.findObject("SCROLLER");
        if (scroller !== null)
          scroller._updateScrollBar(scroller.findObject("TABLE"));
      },
    });
    data.myDiagram.linkTemplate = $(go.Link);
    data.myDiagram.linkTemplate = $(
      go.Link,
      {
        curve: go.Link.Bezier,
        toEndSegmentLength: 30,
        fromEndSegmentLength: 30,
      },
      //   $(go.Shape, { toArrow: "Standard" }),
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }) // the link shape, with the default black stroke
    );

    data.myDiagram.linkTemplateMap.add(
      "childlink",
      $(
        MappingLink,
        {
          isTreeLink: false,
          isLayoutPositioned: false,
          layerName: "Foreground",
        },
        { fromSpot: go.Spot.Right, toSpot: go.Spot.Left },
        { relinkableFrom: true, relinkableTo: true },
        $(
          go.Shape, // the link shape
          {
            strokeWidth: 1,
            isPanelMain: true,
            strokeDashArray: [3, 3],
            stroke: "red", //字段关联连线颜色虚线
          },
          new go.Binding("stroke", "progress", function (progress) {
            return progress ? "#52ce60" /* green */ : "#999";
          }),
          new go.Binding("strokeWidth", "progress", function (progress) {
            return progress ? 2.5 : 1.5;
          })
        ),
        $(
          go.Shape, // the arrowhead
          { toArrow: "standard", stroke: null, fill: "#ccc" },
          new go.Binding("fill", "progress", function (progress) {
            return progress ? "#52ce60" /* green */ : "#999";
          })
        ),
        $(
          go.Panel,
          "Auto",
          {
            visible: false,
          },
          new go.Binding("visible", "linktext1", function (nat) {
            if (nat) {
              return true;
            } else {
              return false;
            }
            // return nat !== undefined;
          }),
          $(
            go.Shape, // the label background, which becomes transparent around the edges
            {
              fill: "#fff",
              stroke: null,
            }
          ),
          $(
            go.TextBlock,
            { margin: new go.Margin(0, 0, 0, 50) },
            {
              stroke: "#52ce60",
              background: "rgba(255,255,255,0.75)",
              textAlign: "center",
              font: "6pt helvetica, arial, sans-serif",
              margin: 4,
              editable: false, // enable in-place editing
            },
            // editing the text automatically updates the model data
            new go.Binding("text", "linktext1").makeTwoWay()
          )
        )
      )
    );
    function theNationFlagConverter(isGroup) {
      // return "/img/form.png";
      return img1;
    }
    function theNationFlagConverter2() {
      return img1;
    }
    data.myDiagram.groupTemplate = $(
      go.Group,
      "Auto",
      {
        isSubGraphExpanded: true, //是否展开子节点
        doubleClick: (e, group) => {
          // todo 实现组选中，选中组中所有节点
        },
        layout: $(go.TreeLayout, {
          angle: 90,
          arrangement: go.TreeLayout.ArrangementVertical,
          isRealtime: false,
        }),
      },
      $(
        go.Shape,
        "RoundedRectangle",
        { margin: new go.Margin(0, 0, 0, 5) },
        roundedRectangleParams,
        { fill: "#fff", stroke: "lightgray" },
        new go.Binding("fill", "isHighlighted", function (h) {
          return h ? "#52CE60" : "#ffffff";
        }).ofObject()
      ),

      $(
        go.Panel,
        "Vertical",
        { margin: new go.Margin(5, 5, 5, 5), defaultAlignment: go.Spot.Left },

        $(
          go.Panel,
          "Horizontal",
          $(
            go.Picture, // flag image, only visible if a nation is specified
            {
              margin: new go.Margin(5, 5, 5, 5),
              visible: true,
              desiredSize: new go.Size(30, 30),
            },
            new go.Binding("source", "text", theNationFlagConverter),
            new go.Binding("visible", "text", function (nat) {
              return nat !== undefined;
            })
          ),
          $(
            go.TextBlock,
            {
              font: " 12pt sans-serif",
              margin: new go.Margin(0, 10, 0, 10),
              alignment: go.Spot.Center,
              stroke: "#1296db", //表文字颜色
            },
            new go.Binding("text", "key")
          ),
          $("SubGraphExpanderButton", {
            margin: new go.Margin(0, 5, 0, 5),
            click: incrementCounter,
          })
          //     $("input", {
          //   margin: new go.Margin(0, 5, 0, 5),
          //   click: incrementCounter
          // }),
        ),
        $(go.Placeholder)
      )
    );
    //缩略图
    //   data.myDiagram.nodeTemplate = $(
    //     go.Node,
    //     "Auto",
    //     $(
    //       go.Shape,
    //       "Rectangle",
    //       { fill: "white" },
    //       new go.Binding("fill", "color")
    //     ),
    //     $(go.TextBlock, { margin: 5 }, new go.Binding("text", "key"))
    //   );
    //   var myOverview = $(go.Overview, "myOverviewDiv", {
    //     observed: data.myDiagram
    //   });
    data.myDiagram.nodeTemplate = $(
      TreeNode,

      { selectionChanged: data.nodeSelectionChanged },

      { movable: false, copyable: false, deletable: false }, // user cannot move an individual node
      { selectionAdorned: false },
      $(
        go.Panel,
        "Horizontal",
        { position: new go.Point(10, 0) },
        new go.Binding("background", "isHighlighted", function (s) {
          return s ? "#52ce60" : "#fff";
        }).ofObject(),
        // new go.Binding("background", "isHighlighted", function(h) {
        //   return h ? "#e8eaf6" : "white";
        // }).ofObject(),
        $(
          go.Picture, // flag image, only visible if a nation is specified
          {
            margin: new go.Margin(0, 5, 0, 5),
            visible: true,
            desiredSize: new go.Size(20, 20), //字段图片尺寸
          },
          new go.Binding("source", "key", theNationFlagConverter2),
          new go.Binding("visible", "key", function (nat) {
            return nat !== undefined;
          })
        ),
        $(
          go.TextBlock,
          {
            font: " 10pt sans-serif",
            margin: new go.Margin(0, 0, 0, 0),
            alignment: go.Spot.Center,
            stroke: "#666", //字段文字颜色
          },
          new go.Binding("text", "column", function (s) {
            return s;
          }),
          new go.Binding("stroke", "select", function (select) {
            //字段关联连线颜色
            return select ? "#52ce60" /* green */ : "#28F";
          })
        )
      ) // end Horizontal Panel
    ); // end Node
    data.myDiagram.layout = $(go.TreeLayout, { isRealtime: false }); //布局
    data.myDiagram.model = new go.GraphLinksModel(
      data.nodeDataArray,
      data.linkDataArray
    );
  };

  const initMap = () => {
    var myOverviewDiv = document.getElementById("myOverviewDiv");
    var parentDiv1 = document.getElementById("parentDiv1");
    parentDiv1.removeChild(myOverviewDiv);
    var div1 = document.createElement("div");
    div1.setAttribute("id", "myOverviewDiv");
    parentDiv1.appendChild(div1);
  };
  const openGroup = () => {
    var curNode = data.myDiagram.findNodesByExample({ isGroup: true });
    //遍历输出节点对象
    let vm = data;
    curNode.each(function (node) {
      vm.myDiagram.select(node);
      vm.myDiagram.commandHandler.expandSubGraph();
    });
  };
  //点击扩展
  const incrementCounter = (e, obj) => {
    var node = obj.part;
    var data = node.data;
    let vm = data;
    node.findNodesConnected().each(function (ConnectedNode) {
      vm.linkDataArray.forEach((v) => {
        let isLink =
          v.category == "Mapping" &&
          ((v.from == ConnectedNode.data.key && v.to == data.key) ||
            (v.to == ConnectedNode.data.key && v.from == data.key));
        if (isLink && obj.part.isSubGraphExpanded) {
          console.log("关闭扩展");
          v.progress = "";
          vm.myDiagram.model.updateTargetBindings(v);
        } else if (isLink && !obj.part.isSubGraphExpanded) {
          console.log("打开扩展");
          v.progress = "true";
          // vm.myDiagram.model.updateTargetBindings(v);
        }
      });
    });
    if (obj.part.isSubGraphExpanded) {
      data.myDiagram.commandHandler.collapseSubGraph(node);
    } else {
      data.myDiagram.commandHandler.expandSubGraph(node);
    }
  };
  const nodeSelectionChanged = (node) => {
    if (node.isSelected) {
      data.newLinkDataArray = [];
      clearHightLink();
      //  获取newLinkDataArray
      console.log(node.data);
      console.log(data.linkDataArray);
      getNewLinkDataArray(node.data.key);
    }
  };
  const getNewLinkDataArray = (data1) => {
    console.log(data1);
    let newLinkDataArray = data.newLinkDataArray;
    data.linkDataArray.forEach((v) => {
      // console.log(v)
      if (v.to === data1) {
        // console.log('第一级')
        v.progress = "true";
        v.linktext1 = v.linktext;
        // this.getNewLinkDataArray(v.from);
        newLinkDataArray.push(v);
        // this.myDiagram.model.updateTargetBindings(v);
      }
      if (v.from === data1) {
        var vTo = v.to;
        var vFrom = v.from;
        v.from = vTo;
        v.to = vFrom;
        v.progress = "true";
        v.linktext1 = v.linktext;
        newLinkDataArray.push(v);
        // this.getNewLinkDataArray(v.from)
        // this.getNewLinkDataArray(v.from);
      }
      // if (v.from === data) {
      //     console.log('第二级')

      //   v.progress = "true";
      //   v.linktext1 = v.linktext;
      //   // this.getNewLinkDataArray(v.from);
      //   newLinkDataArray.push(v);
      //   // this.myDiagram.model.updateTargetBindings(v);
      // }
      // if (v.category == "Mapping") {
      //   //说明是组
      //   v.progress = "true";
      //   this.myDiagram.model.updateTargetBindings(v);
      // }
      data.myDiagram.model.updateTargetBindings(v);
    });
    console.log(999, data.newLinkDataArray);
    let newNodeDataArray = data.newLinkDataArray.map((v) => {
      return v.from;
    });
    newNodeDataArray.push(data1);
    // console.log(99, newNodeDataArray);
    // console.log(99, data);
    // console.log(99, this.nodeDataArray);
    data.nodeDataArray.forEach((v) => {
      //   console.log(v)
      if (newNodeDataArray.indexOf(v.key) != -1) {
        v.select = "true";
      } else {
        v.select = "";
      }
      data.myDiagram.model.updateTargetBindings(v);
    });
    openGroup(); //点击后关联的展开
  };
  const clearHightLink = () => {
    let arr = data.myDiagram.model.linkDataArray;
    for (var i = 0; i < arr.length; i++) {
      let res = arr[i];
      res.progress = res.progress ? "" : "";
      res.linktext1 = res.linktext1 ? "" : "";
      data.myDiagram.model.updateTargetBindings(res);
    }
  };

  watch(
    () => data.level,
    () => {
      data.myDiagram = null;
      data.parmas.detail = "";
    }
  );

  onMounted(() => {
    initDom();
    init();
    nextTick(() => {
      onSubmit();
    });
  });
</script>

<style scoped  lang="scss">
  .blood {
    // height: calc(100vh - 200px);
  }
  .elformitem {
    .el-form-item__content {
      display: flex;
      .el-select {
        width: 100px;
      }
    }
  }
  .se-button-wrap {
    display: flex;
    justify-content: center;
  }

  .page-electronicFence {
    .el-form {
      display: flex;
    }
  }
  .box {
    display: flex;
    justify-content: space-between;
    height: 700px;
    background: #ffffff;
    #parentDiv1 {
      width: 150px;
      height: 150px;
      #myOverviewDiv {
        margin-top: 80px;
        width: 150px;
        height: 150px;
        position: relative;
        div {
          width: 100%;
          height: 100%;
          border: 1px solid #ccc;
        }
      }
    }
    #parentDiv {
      // width: calc(100% - 200px);
      width: 100%;
      height: 100%;
      background-color: #ffffff;
      #myDiagramDiv {
        height: 100%;
      }
    }
  }
</style>