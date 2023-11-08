<template>
  <div class="EpigeneticRelationship">
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, reactive } from "vue";
  import G6 from "@antv/g6";

  // 画布实例和挂载容器
  var graph: any;
  var container: HTMLElement | null;

  onMounted(() => {
    container = document.getElementById("container");
    createGraph(container);
    graph.data(data);
    graph.render();
  });
  const data = {
    id: "A",
    children: [
      {
        id: "A1",
      },
      {
        id: "A2",
      },
    ],
  };
  G6.registerNode("card-node", {
    draw: (cfg: any, group: any) => {
      const r = 2;
      const color = "#5B8FF9";
      const w = cfg.size[0];
      const h = cfg.size[1];
      const shape = group.addShape("rect", {
        attrs: {
          x: -w / 2,
          y: -h / 2,
          width: w, //200,
          height: h, // 60
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
          height: h / 2,
          fill: color,
          radius: [r, r, 0, 0],
        },
        name: "title-box",
        draggable: true,
      });

      // title text
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
      if (cfg.children) {
        group.addShape("marker", {
          attrs: {
            x: w / 2,
            y: 0,
            r: 6,
            cursor: "pointer",
            symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
            stroke: "#666",
            lineWidth: 1,
            fill: "#fff",
          },
          name: "collapse-icon",
        });
      }
      group.addShape("text", {
        attrs: {
          textBaseline: "top",
          x: -w / 2 + 8,
          y: -h / 2 + 24,
          lineHeight: 20,
          text: "description",
          fill: "rgba(0,0,0, 1)",
        },
        name: `description`,
      });
      return shape;
    },
    //   const shape = group.addShape("dom", {
    //     attrs: {
    //       width: cfg.size[0],
    //       height: cfg.size[1],
    //       html: ` <div >
    //                   ${cfg.id}
    //                                  </div>`,
    //     },
    //     draggable: true,
    //   });
    //   return shape;
    // },
  });
  const minimap = new G6.Minimap();
  const legend = new G6.Legend({
    data: {
      nodes: [
        {
          id: "type3",
          label: "node-type3",
          type: "rect",
        },
      ],
    },
    containerStyle: {
      fill: "#ccc",
      lineWidth: 1,
      radius: 3,
    },
    position: "top-right",
  });
  const tooltip = new G6.Tooltip();
  const toolBar = new G6.ToolBar();
  const createGraph = (container: any): void => {
    const width = container.scrollWidth;
    const height = container.scrollHeight || 400;
    graph = new G6.TreeGraph({
      container: "container",
      width,
      height,
      renderer: "svg",
      //   fitView: true,
      //   fitViewPadding: 50,
      linkCenter: true,
      animate: true,
      modes: {
        default: ["drag-canvas"],
      },
      defaultNode: {
        type: "card-node",
        size: [100, 40],
      },
      defaultEdge: {
        type: "cubic",
      },
      layout: {
        type: "mindmap",
        direction: "H",
      },
      plugins: [minimap, tooltip, toolBar], // 配置 Grid 插件和 Minimap 插件
    });
    graph.data(data);
    graph.render();
    graph.fitView();
  };
</script>

<style scoped>
  .EpigeneticRelationship {
    position: relative;
  }
</style>