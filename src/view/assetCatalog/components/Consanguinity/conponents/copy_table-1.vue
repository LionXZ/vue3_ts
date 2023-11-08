<template>
  <div class="EpigeneticRelationship">
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
  import img from "@/assets/tableIcon.png";
  import { onMounted, ref, reactive, nextTick, onBeforeUnmount } from "vue";
  import G6 from "@antv/g6";

  // 画布实例和挂载容器
  var graph: any;
  var container: HTMLElement | null;

  onMounted(() => {
    container = document.getElementById("container");
    createGraph(container);
    graph.data(data);
    graph.render();
    // 为图上的所有节点绑定点击监听
    graph.on("node:click", (evt: any) => {
      //   graph.updateChildren(
      //     [
      //       { id: "Logistic regression" },
      //       { id: "Linear discriminant analysis" },
      //       { id: "Rules" },
      //     ],
      //     evt.item?._cfg?.id
      //   );
      //   graph.layout(true);
    });
  });

  onBeforeUnmount(() => {
    // graph.destroy();
  });

  const data = {
    id: "Modeling Methods",
    children: [
      {
        id: "Classification",
        // children: [
        //   { id: "Logistic regression" },
        //   { id: "Linear discriminant analysis" },
        //   { id: "Rules" },
        // ],
      },
      {
        id: "Consensus",
        // children: [
        //   {
        //     id: "Models diversity",
        //   },
        //   {
        //     id: "Methods",
        //   },
        // ],
      },
      {
        id: "Regression",
        // children: [
        //   { id: "Multiple linear regression" },
        //   { id: "Partial least squares" },
        // ],
      },
    ],
  };
  G6.registerNode("card-node", {
    draw: (cfg: any, group: any) => {
      const r = 2;
      const color = cfg.id == "Modeling Methods" ? "#5BBF3F" : "#73BCDB";
      const w = cfg.size[0];
      const h = cfg.size[1];

      const shape = group.addShape("rect", {
        attrs: {
          x: -w / 2,
          y: -h / 2,
          width: w,
          height: h,
          stroke: color,
          radius: r,
          fill: "#fff",
        },
        name: "main-box",
        draggable: true,
      });

      group.addShape("rect", {
        attrs: {
          x: -w / 2,
          y: -h / 2,
          width: w,
          height: h,
          fill: color,
          radius: [r, r, 0, 0],
        },
        name: "title-box",
        draggable: true,
      });

      group.addShape("text", {
        attrs: {
          textBaseline: "top",
          x: -w / 2 + 8,
          y: -h / 2 + 2,
          lineHeight: 20,
          text: cfg.id,
          fill: "#fff",
        },
        name: "title",
      });
      return shape;
    },
  });
  const minimap = new G6.Minimap();
  const toolBar = new G6.ToolBar();
  const createGraph = (container: any): void => {
    const width = container.scrollWidth;
    const height = container.scrollHeight || 400;
    graph = new G6.TreeGraph({
      container: "container",
      width,
      height,
      renderer: "svg",
      fitView: true,
      fitViewPadding: [30, 300, 30, 30],
      linkCenter: true,
      animate: true,
      modes: {
        default: [
          {
            type: "collapse-expand",
            onChange: function onChange(item: any, collapsed) {
              const data = item.get("model");
              data.collapsed = collapsed;
              return true;
            },
          },
          "drag-canvas",
          "zoom-canvas",
        ],
      },
      defaultNode: {
        type: "card-node",
        size: [200, 20],
        labelCfg: {
          style: {
            fontSize: 16,
          },
        },
      },
      defaultEdge: {
        type: "cubic",
      },
      layout: {
        type: "mindmap",
        direction: "H",
        getHeight: () => {
          return 40;
        },
        getWidth: () => {
          return 150;
        },
        getVGap: () => {
          return 30;
        },
        getHGap: () => {
          return 80;
        },
        getSide: (d: any) => {
          if (d.id === "Classification") {
            return "left";
          }
          return "right";
        },
      },
      plugins: [minimap, toolBar], // 配置插件
    });
  };
</script>

<style scoped>
  .EpigeneticRelationship {
    position: relative;
  }
</style>