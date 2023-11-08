<template>
  <div class="FieldConsanguinity">
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
  import ViewUIPlus from "view-ui-plus";
  //Spin 是异步导入 初始化时部分属性不存在 所以初始化调用在nextTick里面使用
  const { Spin, Message, Modal } = <any>ViewUIPlus;
  import { search_basic, lineage, entity_guid } from "@/api/assetCatlog.ts";
  import {
    onMounted,
    ref,
    reactive,
    nextTick,
    onBeforeUnmount,
    inject,
    computed,
  } from "vue";
  import G6 from "@antv/g6";
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
  let data: any = {
    mainTableData: null, //主表对象
    currentColumn_guid: "", //当前选择字段guid
    renderData: [], //渲染数据
    currentOptionValue: "",
  };
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
          entityGuid(guid);
        } else {
          Spin.hide();
        }
      })
      .catch((err: any) => {
        Spin.hide();
      });
  };
  const lineage_get = (guid: string): void => {
    Spin.show();
    lineage({
      guid,
    })
      .then((res: any) => {
        let list: any[] = [];
        Object.values(res.guidEntityMap).forEach((el: any) => {
          if (
            el.typeName == "hive_column_lineage" ||
            el.typeName == "hive_process"
          ) {
            list.push({
              id: el.attributes.name,
              label: el.attributes.name,
              background: "#73BCDB",
              type: "dom-operation",
            });
            return;
          }
          let tableName = el.attributes.qualifiedName.split(".")[1];
          if (tableName.includes(currentTable.value)) {
            return;
          }
          if (list.some((it: any) => it.label == tableName)) {
            let index = list.findIndex((it: any) => it.label == tableName);
            if (index != -1) {
              list[index].attrs.push({
                key: el.attributes?.name,
                guid: el.guid,
              });
            }
          } else {
            list.push({
              id: tableName,
              label: tableName,
              background: "#73BCDB",
              attrs: [
                {
                  key: el.attributes?.name,
                  guid: el.guid,
                },
              ],
            });
          }
        });
        let edges = res.relations.map((ele: any, i: number) => {
          let source: string = "";
          let target: string = "";
          if (
            res.guidEntityMap[ele.fromEntityId].typeName == "hive_column_lineage"
          ) {
            source = res.guidEntityMap[ele.fromEntityId].attributes.name;
          } else {
            source =
              res.guidEntityMap[ele.fromEntityId].attributes.qualifiedName.split(
                "."
              )[1];
          }
          if (
            res.guidEntityMap[ele.toEntityId].typeName == "hive_column_lineage"
          ) {
            target = res.guidEntityMap[ele.toEntityId].attributes.name;
          } else {
            target =
              res.guidEntityMap[ele.toEntityId].attributes.qualifiedName.split(
                "."
              )[1];
          }

          return {
            edgeType: `${ele.fromEntityId}-${ele.toEntityId}-${i}`,
            // 该边连入 source 点的第 0 个 anchorPoint，
            sourceAnchor: i,
            // 该边连入 target 点的第 0 个 anchorPoint，
            targetAnchor: i,
            sourceKey: res.guidEntityMap[ele.fromEntityId]?.attributes?.name, //外键
            targetKey: res.guidEntityMap[ele.toEntityId]?.attributes?.name, //目标表键
            source: source, //起点id
            target: target, //目标元素id
          };
        });

        const newRenderData = {
          nodes: [...list, data.mainTableData],
          edges: edges,
        };
        data.renderData = newRenderData;
        graph.changeData(data.renderData);
        setTimeout(() => {
          bindClickListener();
        }, 2000);
      })
      .catch((err: any) => {
        setTimeout(() => {
          bindClickListener();
        }, 2000);
      });
  };
  const entityGuid = (guid: string): void => {
    entity_guid({ guid })
      .then((res: any) => {
        data.mainTableData = {
          id: res.entity?.attributes?.name,
          label: res.entity?.attributes?.name,
          background: "#5BBF3F",
          attrs: res.entity?.attributes?.columns.map((el: any) => {
            return {
              ...el,
              key: res?.referredEntities[el.guid]?.attributes.name,
              relation: [],
            };
          }),
        };
        data.currentColumn_guid = data.mainTableData.attrs[0]?.guid;
        data.currentOptionValue = data.mainTableData.attrs[0]?.key;
        data.renderData = {
          nodes: [data.mainTableData],
          edges: [],
        };
        graph.data(data.renderData);
        graph.render();
        lineage_get(data.currentColumn_guid);
      })
      .catch((err: any) => {
        Spin.hide();
      });
  };

  //================================================================
  const removeClickListener = () => {
    mainTableEle?.removeEventListener("change", bindClickListener);
  };
  const bindClickListener = () => {
    Spin.hide();
    setTimeout(() => {
      removeClickListener();
      mainTableEle = <HTMLElement>(
        document.querySelector(`#${currentTable.value}`)
      );
      mainTableEle.addEventListener &&
        mainTableEle.addEventListener("change", (e: any) => {
          data.currentColumn_guid = data.mainTableData.attrs.find(
            (ele: any) => ele.key == e.target.value
          ).guid;
          //   alert(1);
          data.currentOptionValue = e.target.value;
          lineage_get(data.currentColumn_guid);
        });
      setOptionSelected();
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
    }, 500);
  };
  const setOptionSelected = (): void => {
    let option_list: any = document.querySelectorAll(
      `#${currentTable.value} option`
    );
    option_list.forEach((ele: any) => {
      if (ele.value == data.currentOptionValue) {
        ele.selected = true;
      } else {
        ele.selected = false;
      }
    });
  };

  // 画布实例和挂载容器
  var graph: any;
  var container: HTMLElement | null;
  var mainTableEle: any;

  onMounted(() => {
    container = document.getElementById("container");
    createGraph(container);
    nextTick(() => {
      //================================================================
      searchBasic(currentTable.value);
      //================================================================
      graph.on("afterupdateitem", (e: any) => {});
      graph.on("afterrender", (e: any) => {});
    });
  });
  onBeforeUnmount(() => {
    //销毁
    graph.clear();
    graph.destroy();
    graph = null;
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
        {
          key: "dss",
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
          relation: [
            {
              key: "id",
              nodeId: "aaa",
            },
            {
              key: "id",
              nodeId: "bbb",
            },
          ],
        },
        {
          key: "title",
          type: "varchar(255)",
          relation: [
            {
              key: "id",
              nodeId: "bbb",
            },
          ],
        },
        {
          key: "desc",
          type: "text",
          relation: [
            {
              key: "id",
              nodeId: "bbb",
            },
          ],
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
          key: "id",
          type: "number(6)",
        },
      ],
    },
    {
      id: "bbb",
      label: "bbbb",
      size: [200, 100],
      background: "#73BCDB",
      attrs: [
        {
          key: "id",
          type: "number(6)",
        },
        {
          key: "bb",
          type: "number(6)",
        },
        {
          key: "dddd",
          type: "number(6)",
        },
      ],
    },
  ];
  const dataTransform = (data: any) => {
    const nodes = <any>[];
    const edges = <any>[];

    data.map((node: any) => {
      nodes.push({
        ...node,
        anchorPoints: [
          [0, 0],
          [1, 1],
          [0, 0.5],
          [1, 0.5],
          [0, 1],
          [0.5, 0],
          [1, 0],
          [0.5, 1],
        ],
      });
      if (node.attrs) {
        node.attrs.forEach((attr: any) => {
          if (attr.relation) {
            attr.relation.forEach((relation: any, i: number) => {
              edges.push({
                edgeType: `${node.id}-${relation.nodeId}-${i}`,
                source: node.id, //起点id
                target: relation.nodeId, //目标元素id
                // 该边连入 source 点的第 0 个 anchorPoint，
                sourceAnchor: i,
                // 该边连入 target 点的第 0 个 anchorPoint，
                targetAnchor: i,
                sourceKey: attr.key, //外键
                targetKey: relation.key, //目标表键
                // label: `外键${attr.key}-目标表键${relation.key}`,
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
  G6.registerNode("dom-node", {
    draw: (cfg: any, group: any) => {
      let SelectContent = ``;
      if (cfg.label.includes(currentTable.value)) {
        SelectContent += ` <select id="${cfg.label}"  style="width:100%;border:none;text-align:center;color:#aaa;outline:none" > `;
        cfg.attrs.forEach((el: any) => {
          SelectContent += `<option  style="border:none;color:#aaa" :value="${el.key}" :key="${el.key}"   >${el.key}</option>`;
        });
        SelectContent += `</select>`;
      } else {
        SelectContent += `<div style="text-align:center;color:#aaa">`;
        cfg.attrs.forEach((el: any) => {
          SelectContent += `<p style="line-height:20px;height:20px;">${el.key}</p>`;
        });
        SelectContent += `</div>`;
      }
      const stroke = cfg.style
        ? cfg.style.stroke || cfg.background
        : cfg.background;
      const shape = group.addShape("dom", {
        attrs: {
          name: cfg.id,
          width: cfg.size[0],
          height: cfg.size[1],
          html: `<div class="dom-node" style="background-color: #fff; border: 2px solid ${stroke}; border-radius: 5px; width: ${cfg.size[0]}px; height:${cfg.size[1]}px;"> <div  style="display:flex; align-items: center;background:${cfg.background};height:30px"> <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAATNJREFUWEdjZBhgwAizX7RrUQLj//8KJLuHiek/qXoYGf7ffFkatwKkD+wAsa4lVxgY/muTahBl6hmfvSqLkWYU7V68ifE/gy9lhpGnm5GBcTWjWNfi9wwMDALkGUGxrk8gB5AchxRbi2TAqANQQuDfXwbHN5WxB9CDWKxzYQMDI1M9SPw/A8OB12WxjtiiQbRr8X5GBgYHsNz/f42vyuMb0NWJtC92YGJm2A8TJ84B3YvrGf4zgA0bdQBNQ4Ca2YtYs0azIUYuwBZ0TEz/HJCz4f+/DI3Y1DEyM9QjZ8N//5gwsjRIH+nZcLQcGDEFEbF5l5rqRsuB0XKAuPbAcC+I4M1yUF2PK4vBynh8aqA9HXCTjBizGBgYPg18x2TAu2YUd07JKBYZmRhvoHROyTCDaloAL1tjIlBq0koAAAAASUVORK5CYII=" style="width:20px;margin-right:10px;margin-left: 5px;"/><span style="color:#fff;display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden">${cfg.label}</span></div> ${SelectContent}  </div>`,
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
      //   fitCenter: true,
      renderer: "svg",
      //   linkCenter: true,
      animate: true,
      defaultNode: {
        type: "dom-node",
        size: [280, 60],
      },
      defaultEdge: {
        type: "cubic",
        style: {
          endArrow: true,
        },
      },
      //   modes: {
      //     default: ["drag-canvas", "zoom-canvas", "drag-node"], // 允许拖拽画布、放缩画布、拖拽节点
      //   },
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