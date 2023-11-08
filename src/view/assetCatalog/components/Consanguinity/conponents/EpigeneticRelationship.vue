<template>
  <div class="FieldConsanguinity">
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
  import ViewUIPlus from "view-ui-plus";
  //Spin 是异步导入 初始化时部分属性不存在 所以初始化调用在nextTick里面使用
  const { Spin, Message, Modal } = <any>ViewUIPlus;
  import { search_basic, lineage } from "@/api/assetCatlog.ts";
  import {
    onMounted,
    ref,
    nextTick,
    onBeforeUnmount,
    inject,
    computed,
  } from "vue";
  import G6 from "@antv/g6";
  import axios from "axios";
  const { Util, registerBehavior, registerEdge, registerNode } = G6;
  const info: any = inject("info");
  let currentDatabase = computed(() => {
    return info.EssentialInformationAndTableStructure?.linkisWarehouse
      ?.warehouseDatabaseCode;
  });
  let currentTable = computed(() => {
    // return "ads_order_by_province";
    return info.EssentialInformationAndTableStructure?.linkisWarehouse
      ?.warehouseCode;
  });

  //================================================================
  const searchBasic = (query: string): void => {
    Spin.show();
    search_basic({
      query: query, //表名
      limit: 25,
      offset: 0,
      typeName: "hive_table",
    })
      .then((res: any) => {
        const index = res.entities.findIndex((el: any) => {
          return el.attributes.qualifiedName.includes(
            `${currentDatabase.value}.${currentTable.value}`
          );
        });
        const guid = index != -1 ? res.entities[index].guid : "";
        if (guid != "") {
          lineage_get(guid);
        } else {
          Spin.hide();
        }
      })
      .catch((err: any) => {
        Spin.hide();
      });
  };
  const lineage_get = (guid: string): void => {
    lineage({
      guid,
    })
      .then((res: any) => {
        let data: any = Object.values(res.guidEntityMap).map((el: any) => {
          if (
            el.typeName == "hive_process" ||
            el.typeName == "hive_column_lineage"
          ) {
            return {
              id: el.guid,
              label: el.attributes.name,
              guid: el.guid,
              background: "#73BCDB",
              type: "dom-operation",
            };
          }
          return {
            id: el.guid,
            label: el.attributes.name,
            guid: el.guid,
            background:
              el.attributes.name != currentTable.value ? "#73BCDB" : "#5BBF3F",
          };
        });
        data = data.map((el: any) => {
          let relation = res.relations
            .map((item: any) => {
              //   if (
              //     res.guidEntityMap[item.fromEntityId].typeName == "hive_column" ||
              //     res.guidEntityMap[item.toEntityId].typeName == "hive_column"
              //   ) {
              //     return false;
              //   }
              if (item.fromEntityId == el.id) {
                return {
                  target: item.toEntityId,
                };
              }
            })
            .filter((e: any) => e);
          return {
            ...el,
            relation,
          };
        });

        const rawData = dataTransform(data);
        graph.data(rawData);
        graph.render();
        setTimeout(() => {
          bindClickListener();
        }, 2000);
      })
      .catch((err: any) => {
        setTimeout(() => {
          bindClickListener();
        }, 2000);
        Spin.hide();
      });
  };
  //==============================================================
  const removeClickListener = () => {};
  const bindClickListener = () => {
    Spin.hide();
    let list: any = document.querySelectorAll(`.dom-operation`);
    list.forEach((el: any) => {
      el.addEventListener("click", (e: any) => {
        let content =
          e.target?.childNodes?.length > 1
            ? e.target.childNodes[1].innerText
            : e.target.childNodes[0].data;
        Modal.info({
          title: "操作语句",
          content: content,
        });
      });
    });
  };

  //================================================================
  // 画布实例和挂载容器
  var graph: any;
  var container: HTMLElement | null;

  onMounted(() => {
    //================================================================
    container = document.getElementById("container");
    createGraph(container);
    nextTick(() => {
      //================================================================
      searchBasic(currentTable.value);
      //================================================================
    });
  });
  onBeforeUnmount(() => {
    //销毁
    graph.clear();
    graph.destroy();
    graph = null;
  });
  // 动态获取图片
  const getAssetsImages = (url: string) => {
    return new URL(url, import.meta.url).href;
  };

  //   const rawData = [
  //     {
  //       id: "student",
  //       label: "student",
  //       background: "#73BCDB",
  //       type: "dom-operation",
  //       size: [180, 80],
  //       relation: [
  //         {
  //           target: "dept",
  //         },
  //       ],
  //     },
  //     {
  //       id: "info",
  //       label: "Employee",
  //       background: "#73BCDB",
  //       relation: [
  //         {
  //           target: "dept",
  //         },
  //       ],
  //     },
  //     {
  //       id: "dept",
  //       label: "Department",
  //       background: "#5BBF3F",
  //       relation: [
  //         {
  //           target: "aaa",
  //         },
  //         {
  //           target: "bbb",
  //         },
  //       ],
  //     },
  //     {
  //       id: "aaa",
  //       label: "aaaa",
  //       background: "#73BCDB",
  //     },
  //     {
  //       id: "bbb",
  //       label: "bbbb",
  //       background: "#73BCDB",
  //     },
  //   ];
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
        anchorPoints: [
          [0, 0],
          [0, 0.5],
          [0, 1],
          [0.5, 0],
          [0.5, 1],
          [1, 0],
          [1, 0.5],
          [1, 1],
        ],
      });
      if (node.relation) {
        node.relation.forEach((relation: any, i: number) => {
          edges.push({
            edgeType: `${node.id}-${relation.target}-${i}`,
            source: node.id, //起点id
            target: relation.target, //目标元素id
            // // 该边连入 source 点的第 0 个 anchorPoint，
            // sourceAnchor: i,
            // // 该边连入 target 点的第 0 个 anchorPoint，
            // targetAnchor: i,
            sourceKey: node.id, //外键
            targetKey: relation.target, //目标表键
            label: relation.label,
          });
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
      const stroke = cfg.style
        ? cfg.style.stroke || cfg.background
        : cfg.background;
      const shape = group.addShape("dom", {
        attrs: {
          name: cfg.id,
          width: cfg.size[0],
          height: cfg.size[1],
          html: `<div style="cursor: pointer;width: ${cfg.size[0]}px; height:${cfg.size[1]}px;background:${cfg.background};color:#fff;border: 2px solid ${cfg.background}; border-radius: 5px;  display: flex;  align-items: center;padding:0 10px;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAATNJREFUWEdjZBhgwAizX7RrUQLj//8KJLuHiek/qXoYGf7ffFkatwKkD+wAsa4lVxgY/muTahBl6hmfvSqLkWYU7V68ifE/gy9lhpGnm5GBcTWjWNfi9wwMDALkGUGxrk8gB5AchxRbi2TAqANQQuDfXwbHN5WxB9CDWKxzYQMDI1M9SPw/A8OB12WxjtiiQbRr8X5GBgYHsNz/f42vyuMb0NWJtC92YGJm2A8TJ84B3YvrGf4zgA0bdQBNQ4Ca2YtYs0azIUYuwBZ0TEz/HJCz4f+/DI3Y1DEyM9QjZ8N//5gwsjRIH+nZcLQcGDEFEbF5l5rqRsuB0XKAuPbAcC+I4M1yUF2PK4vBynh8aqA9HXCTjBizGBgYPg18x2TAu2YUd07JKBYZmRhvoHROyTCDaloAL1tjIlBq0koAAAAASUVORK5CYII=" style="width:20px;margin-right:10px"/><p style="display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden">${cfg.label}</p></div>`,
        },
        draggable: true,
      });
      return shape;
    },
  });
  G6.registerNode("dom-operation", {
    draw: (cfg: any, group: any) => {
      const stroke = cfg.style
        ? cfg.style.stroke || cfg.background
        : cfg.background;
      const shape = group.addShape("dom", {
        attrs: {
          name: cfg.id,
          width: cfg.size[0],
          height: cfg.size[1],
          html: `<div class="dom-operation" style="cursor: pointer;width: ${cfg.size[0]}px; height:${cfg.size[1]}px;background:${cfg.background};color:#fff;border: 2px solid ${cfg.background}; border-radius: 5px;  display: flex;  align-items: center;padding:0 10px;"><img src="data:image/png;base64,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" style="width:20px;margin-right:10px"/><p style="display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden">${cfg.label}</p></div>`,
        },
        draggable: true,
      });
      return shape;
    },
  });
  const minimap = new G6.Minimap();
  const toolBar = new G6.ToolBar();
  const createGraph = (container: any): void => {
    graph = new G6.Graph({
      container: "container",
      width: container.scrollWidth,
      height: (container.scrollHeight || 500) - 100,
      fitCenter: true,
      renderer: "svg",
      //   linkCenter: true,
      animate: true,
      defaultNode: {
        type: "dom-node",
        size: [200, 30],
      },
      defaultEdge: {
        type: "cubic",
        style: {
          endArrow: true,
        },
      },
      modes: {
        default: [
          {
            // 以下是自定义提示的重点
            type: "tooltip",
            formatText: (data: any) => {
              // data 对应后台返回对应节点的数据，根据需要做展示
              return `<div>ID: ${data.id}</div> `;
            },
          },
          // "drag-canvas", "zoom-canvas", "drag-node"
        ], // 允许拖拽画布、放缩画布、拖拽节点
      },
      layout: {
        type: "dagre",
        rankdir: "LR", // 可选，默认为图的中心
        // align: "UL", // 可选
        nodesep: 20, // 可选
        ranksep: 50, // 可选
        controlPoints: true, // 可选
      },
      plugins: [minimap, toolBar], // 配置插件
    });
  };
</script>

<style scoped lang="scss">
  .FieldConsanguinity {
    position: relative;
    height: 500px;
  }
</style>