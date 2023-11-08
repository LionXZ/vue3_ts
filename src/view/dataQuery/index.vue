<template>
  <div class="dataQuery">
    <Row :gutter="20">
      <Col span="4" style="border-right:1px solid #dddddd;">
      <Input v-model="search" placeholder="请输入关键字" />
      <Tree class="dataQuery_tree" expand-node :data="treeData" @on-contextmenu="handleContextMenu" @on-select-change="handleSelectChange" :load-data="loadData">
        <template #contextMenu>
          <DropdownItem>名称：{{treeObj.contextData.title}}</DropdownItem>
          <Divider style="margin: 5px 0" />
          <DropdownItem v-show="treeObj.contextData.level == 0" @click="copyText(treeObj.contextData.databaseName)">复制库名</DropdownItem>
          <DropdownItem v-show="treeObj.contextData.level == 2" @click="copyText(treeObj.contextData.columnName)">复制字段名</DropdownItem>
          <!-- <DropdownItem v-show="treeObj.contextData.level != 1"
              >复制库名并粘贴至脚本</DropdownItem
            > -->
          <!-- ======================================== -->
          <DropdownItem v-show="treeObj.contextData.level == 1" @click="queryTable">查询表</DropdownItem>
          <!-- <DropdownItem
              style="color: #ed4014"
              v-show="treeObj.contextData.level == 1"
              >删除表</DropdownItem
            >
            <DropdownItem v-show="treeObj.contextData.level == 1"
              >查看表结构</DropdownItem
            > -->
          <Divider style="margin: 5px 0" v-show="treeObj.contextData.level == 1" />
          <!-- <DropdownItem v-show="treeObj.contextData.level == 1"
              >导出表</DropdownItem
            > -->
          <DropdownItem v-show="treeObj.contextData.level == 1" @click="copyText(treeObj.contextData.tableName)">复制表名</DropdownItem>
          <!-- <DropdownItem v-show="treeObj.contextData.level == 1"
              >复制表名并粘贴至脚本</DropdownItem
            > -->
          <DropdownItem v-show="
                treeObj.contextData.level == 1 &&
                treeObj.contextData.children &&
                treeObj.contextData.children.length > 0
              " @click="copyAllColumns">复制表全字段</DropdownItem>
          <!-- ======================================== -->
          <!-- <Divider style="margin: 5px 0" />
            <DropdownItem>刷新</DropdownItem> -->
        </template>
      </Tree>
      </Col>
      <Col span="20">
      <!-- <WeEditor /> -->
      <Tabs type="card" :closable="tabData.tabList.length > 1" @on-tab-remove="handleTabRemove" v-show="tabData.tabList.length" v-model="tabData.tabValue">
        <TabPane :label="el.label || '查询1'" :name="el.name || '查询1'" v-for="el of tabData.tabList" :key="el.name || '查询1'">
          <QueryResult :data="el" @save_scripts="save_scripts" />
        </TabPane>
      </Tabs>
      <!-- <keep-alive>
          <router-view></router-view>
        </keep-alive> -->
      </Col>
    </Row>

    <!--保存查询  -->
    <SaveScripts :modal="modal" @visibleChange="visibleChange" @operationSuccess="operationSuccess" />
  </div>
</template>

<script setup lang="ts">
import ViewUIPlus from "view-ui-plus";
const { Copy, Notice } = ViewUIPlus;
import axios from "@/utils/axios";
import {
  reactive,
  ref,
  onMounted,
  computed,
  provide,
  watchEffect,
  defineAsyncComponent,
} from "vue";
import { useRouter } from "vue-router";
import components from "./components/index";
const { QueryResult, SaveScripts } = components;
import WeEditor from "../../components/editor";
import { objArrayDuplicateRemoval } from "../../utils/index";
import {
  datasource_all,
  datasource_columns,
  listScript,
} from "@/api/dataQuery";
//   let sql = ref<string>("select ");
const router = useRouter();
let search = ref<string>("");
interface TreeDataItem {
  title: string;
  index?: number;
  expand?: boolean;
  contextmenu?: boolean;
  children?: TreeDataItem[];
}
interface TreeObj {
  treeData: TreeDataItem[];
  contextData: any;
}
//引用类型数据  直接操作会失去响应式
let treeObj: TreeObj = reactive({
  treeData: [],
  contextData: {},
});
let treeData = computed(() => {
  return filterMenu(treeObj.treeData, search.value);
});
const handleContextMenu = (data: any): void => {
  treeObj.contextData = data;
};
const handleSelectChange = (list: TreeDataItem[], data: TreeDataItem): void => {
  // tabData.tabList.push({
  //   name: data.title,
  //   label: data.title,
  // });
  // tabData.tabList = objArrayDuplicateRemoval(tabData.tabList, "name");
  // tabData.tabValue = data.title;
};
const formatTreeData = (data: any) => {
  const res: any[] = [];
  data.forEach((el: any) => {
    const tmp = {
      ...el,
      title: el.tableName || el.databaseName,
      level: el.tables ? 0 : 1,
      contextmenu: true,
      loading: false,
    };
    if (el.tables) {
      tmp.children = formatTreeData(el.tables);
    } else {
      tmp.children = [];
    }
    res.push(tmp);
  });
  return res;
};

const filterMenu = (menuList: any[], search: string): any[] => {
  let res = <any>[];
  menuList.forEach((el) => {
    const tmp = {
      ...el,
    };
    if (
      tmp.title.includes(search) ||
      (tmp.children &&
        tmp.children.length &&
        tmp.children.some((e: any) => e.title.includes(search)))
    ) {
      res.push({
        ...tmp,
        expand: search ? true : false,
      });
    } else {
      if (tmp.children) {
        tmp.children = filterMenu(tmp.children, search);
      }
    }
  });
  return res;
};

let loading = ref<boolean>(false);
const getTreeData = async () => {
  loading.value = true;
  const data = await datasource_all();
  loading.value = false;
  treeObj.treeData = formatTreeData(data.dbs);
};
const loadData = async (item: any, callback: any) => {
  const data = await datasource_columns({
    database: item.databaseName,
    table: item.tableName,
  });
  callback(
    data.columns.map((el: any) => {
      return {
        ...el,
        title: `${el.columnName}（${el.columnType}）`,
        level: 2,
        disabled: true,
        contextmenu: true,
      };
    })
  );
};
//=========================================================================
onMounted(() => {
  getTreeData();
  getSaveScript();
});
interface TabItem {
  name?: string;
  label?: string;
  scripts?: string;
  run?: boolean;
}
interface TabData {
  tabValue: string | undefined;
  tabList: TabItem[];
}
let tabData: TabData = reactive({
  tabValue: "",
  tabList: [{ name: "查询1", label: "查询1" }],
});
const handleTabRemove = (name: string): void => {
  tabData.tabList = tabData.tabList.filter((el) => el.name != name);
  tabData.tabValue = tabData.tabList.length
    ? tabData.tabList[tabData.tabList.length - 1].name
    : "";
};

//=========================================================================
//查询表
const queryTable = (): void => {
  tabData.tabList.push({
    name: `${treeObj.contextData.databaseName}.${treeObj.contextData.tableName}`,
    label: `${treeObj.contextData.databaseName}.${treeObj.contextData.tableName}`,
    scripts: `select * from ${treeObj.contextData.databaseName}.${treeObj.contextData.tableName} limit 20`,
    run: true,
  });
  tabData.tabList = objArrayDuplicateRemoval(tabData.tabList, "name");
  tabData.tabValue = `${treeObj.contextData.databaseName}.${treeObj.contextData.tableName}`;
};

//===============================================================
//复制
const copyText = (text: string): void => {
  Copy({
    text,
    success: () => {
      // Notice.success({
      //   title: "复制成功",
      // });
    },
    error: () => {
      // Notice.error({
      //   title: "复制失败",
      // });
    },
  });
};
//复制库名并粘贴至脚本
//复制表名并粘贴至脚本
//复制表全字段
const copyAllColumns = (): void => {
  let data = treeObj.contextData.children.map((el: any) => {
    return el.columnName;
  });
  copyText(data.join(","));
};
//===============================================================

interface Modal {
  show: boolean;
  title?: string;
  operation?: string;
  content?: string;
  script?: string;
}
let modal: Modal = reactive({
  show: false,
  title: "保存查询",
});
const save_scripts = (script: string): void => {
  modal.show = true;
  modal.script = script;
};
const visibleChange = (val: boolean): void => {
  modal.show = val;
};
const operationSuccess = (): void => {
  modal.show = false;
  getSaveScript();
};
let saveScriptObj = reactive({
  saveScript: {},
  update: false,
});
const getSaveScript = (): void => {
  listScript().then((res: any) => {
    saveScriptObj.saveScript = res;
    saveScriptObj.update = false;
  });
};
provide("saveScriptObj", saveScriptObj);
watchEffect(() => {
  if (saveScriptObj.update) {
    getSaveScript();
  }
});
//===============================================================
</script>

<style scoped lang="scss">
.dataQuery {
  height: 100%;
  :deep(.ivu-row) {
    height: 100%;
    .ivu-col {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
}
</style>