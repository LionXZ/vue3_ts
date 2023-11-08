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

    nextTick(() => {
      bindClickListener();
      graph.on("afterupdateitem", (e: any) => {
        bindClickListener();
      });
      graph.on("afterrender", (e: any) => {
        bindClickListener();
      });
    });
  });

  onBeforeUnmount(() => {
    // graph.destroy();
  });

  const data = {
    id: "dept",
    label: "Department",
    background: "#5BBF3F",
    attrs: [
      {
        key: "id",
        type: "number(6)",
      },
      {
        key: "title",
        type: "varchar(255)",
      },
      {
        key: "desc",
        type: "text",
      },
      {
        key: "parent",
        type: "number(6)",
      },
      {
        key: "manager",
        type: "number(6)",
      },
    ],
    children: [
      {
        id: "student",
        label: "student",
        background: "#73BCDB",
        attrs: [
          {
            key: "id",
            type: "number(6)",
            relation: [
              //依赖关系
              {
                key: "id",
                nodeId: "dept",
              },
            ],
          },
        ],
      },
      {
        id: "info",
        label: "Employee",
        background: "#73BCDB",
        attrs: [
          {
            key: "deptId",
            type: "number(6)",
            relation: [
              {
                key: "id",
                nodeId: "dept",
              },
            ],
          },
        ],
      },
    ],
  };
  G6.registerNode("dom-node", {
    draw: (cfg: any, group: any) => {
      let SelectContent = ``;
      if (cfg.attrs.length > 1) {
        SelectContent += ` <select id="${cfg.label}" style="width:100%;border:none;text-align:center;color:#aaa;outline:none" > `;
        cfg.attrs.forEach((el: any) => {
          SelectContent += `<option  style="border:none;color:#aaa" :value="${el.key}" :key="${el.key}">${el.key}</option>`;
        });
        SelectContent += ` </select>`;
      } else {
        SelectContent += `<div style="text-align:center;color:#aaa">${cfg.attrs[0].key}</div>`;
      }
      const stroke = cfg.style
        ? cfg.style.stroke || cfg.background
        : cfg.background;
      const shape = group.addShape("dom", {
        attrs: {
          width: cfg.size[0],
          height: cfg.size[1],
          html: `<div id="${cfg.id}" class="dom-node" style="background-color: #fff; border: 2px solid ${stroke}; border-radius: 5px; width: ${cfg.size[0]}px; height:${cfg.size[1]}px;"><div  style="display:flex; align-items: center;background:${cfg.background};height:20px">  <span style="margin-left: 5px">${cfg.label}</span></div>${SelectContent} </div>`,
        },
        draggable: true,
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
        type: "dom-node",
        size: [180, 50],
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
        // getHeight: () => {
        //   return 40;
        // },
        // getWidth: () => {
        //   return 150;
        // },
        getVGap: () => {
          return 30;
        },
        getHGap: () => {
          return 80;
        },
        getSide: (d: any) => {
          if (d.id === "info") {
            return "left";
          }
          return "right";
        },
      },
      plugins: [minimap, toolBar], // 配置插件
    });
  };

  const bindClickListener = () => {
    const domNodes = document.getElementsByClassName("dom-node");
    for (let i = 0; i < domNodes.length; i++) {
      const dom = <HTMLElement>domNodes[i];
      dom.addEventListener("click", (e: any) => {
        alert(1);
        // listener(dom);
      });
    }
    const Department = <HTMLElement>document.querySelector("#Department");
    Department.addEventListener("change", (e: any) => {
      console.log(e.target.value);
    });
  };
</script>

<style scoped>
  .EpigeneticRelationship {
    position: relative;
  }
</style>