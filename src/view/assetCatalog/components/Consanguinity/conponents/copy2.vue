<template>
  <div class="FieldConsanguinity">
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, reactive, nextTick, onBeforeUnmount } from "vue";
  import G6 from "@antv/g6";
  const { Util, registerBehavior, registerEdge, registerNode } = G6;

  // 画布实例和挂载容器
  var graph: any;
  var container: HTMLElement | null;

  onMounted(() => {
    container = document.getElementById("container");
    createGraph(container);
    console.log(dataTransform(rawData));
    graph.data(dataTransform(rawData));
    graph.render();
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

  const rawData = [
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
    {
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
    },

    {
      id: "aaa",
      label: "aaaa",
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
  ];
  const isInBBox = (point: any, bbox: any) => {
    const { x, y } = point;
    const { minX, minY, maxX, maxY } = bbox;

    return x < maxX && x > minX && y > minY && y < maxY;
  };
  const dataTransform = (data: any) => {
    const nodes = <any>[];
    const edges = <any>[];

    data.map((node: any) => {
      nodes.push({
        ...node,
      });
      if (node.attrs) {
        node.attrs.forEach((attr: any) => {
          if (attr.relation) {
            attr.relation.forEach((relation: any) => {
              edges.push({
                source: node.id, //起点id
                target: relation.nodeId, //目标元素id
                sourceKey: attr.key, //外键
                targetKey: relation.key, //目标表键
                label: relation.label,
              });
            });
          }
        });
      }
    });
    return {
      nodes,
      edges,
    };
  };
  let modelKey = ref<string>("id");
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
          html: ` <div id="${cfg.id}"class="dom-node" style="background-color: #fff; border: 2px solid ${stroke}; border-radius: 5px; width: ${cfg.size[0]}px; height:${cfg.size[1]}px;"> <div  style="display:flex; align-items: center;background:${cfg.background};height:30px">  <span style="margin-left: 5px">${cfg.label}</span></div> ${SelectContent}  </div>`,
        },
        draggable: true,
      });
      return shape;
    },
  });
  const createGraph = (container: any): void => {
    graph = new G6.Graph({
      container: "container",
      width: container.scrollWidth,
      height: (container.scrollHeight || 500) - 100,
      // translate the graph to align the canvas's center, support by v3.5.1
      fitCenter: true,
      renderer: "svg",
      linkCenter: true,
      animate: true,
      defaultNode: {
        type: "dom-node",
        size: [200, 60],
      },
      defaultEdge: {
        type: "cubic",
      },
      layout: {
        type: "dagre",
        rankdir: "LR",
        align: "UL",
        controlPoints: true,
        nodesepFunc: () => 0.2,
        ranksepFunc: () => 0.5,
      },
    });
  };
  const listener = (dom: Element) => {
    const nodeId = dom.id;
    if (!nodeId) return;
    const node = graph.findById(nodeId);
    let stroke = "";
    if (!node.hasState("selected")) {
      stroke = "#f00";
      graph.setItemState(node, "selected", true);
    } else {
      stroke = "#5B8FF9";
      graph.setItemState(node, "selected", false);
    }
    graph.updateItem(nodeId, {
      style: {
        stroke,
      },
    });
  };

  const bindClickListener = () => {
    const domNodes = document.getElementsByClassName("dom-node");
    for (let i = 0; i < domNodes.length; i++) {
      const dom = <HTMLElement>domNodes[i];
      dom.addEventListener("click", (e: any) => {
        // listener(dom);
      });
    }
    const Department = <HTMLElement>document.querySelector("#Department");
    Department.addEventListener("change", (e: any) => {
      console.log(e.target.value);
    });
  };
</script>

<style scoped lang="scss">
  .FieldConsanguinity {
    position: relative;
    height: 500px;
  }
</style>