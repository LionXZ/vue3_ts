<template>
  <div class="collectionTaskManagement">
    <Row :gutter="20">
      <Col span="4" style="border-right:1px solid #dddddd;">
      <div class="menuParent">
        <div class="title">
          <Button type="primary" icon="ios-add" long @click="addLabel">新建标签</Button>
          <!-- <Icon type="md-add-circle" @click="addLabel" /> -->
        </div>
        <Input v-model="search" placeholder="请输入关键字" clearable />
        <!-- <div class="resetTree">
          <Button @click="resetTree" type="primary" icon="ios-refresh">重置</Button>
        </div> -->
        <Tree :data="tagList" @on-contextmenu="handleContextMenu" @on-select-change="handleSelectChange">
          <template #contextMenu>
            <DropdownItem @click="reNameLabel">重命名</DropdownItem>
            <DropdownItem @click="deleteLabel" style="color: #ed4014">删除</DropdownItem>
          </template>
        </Tree>
      </div>
      </Col>
      <Col span="20">
      <div class="right_content">
        <header>
          <Form :model="FormData" ref="FormLine">
            <Row :gutter="20">
              <Col span="6">
              <FormItem prop="warehouseCode" label="数据库类型" :label-width="90">
                <Select clearable filterable v-model="FormData.warehouseStorageTypeName">
                  <Option v-for="item in database.list" :value="item.configName" :key="item.configName + item.configId">{{ item.configName }}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem prop="tagNameAndCode" :label-width="0">
                <Input clearable v-model="FormData.tagNameAndCode" placeholder="请输入数据库名称、表名称、描述等" />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem>
                <div class="form_operation">
                  <Button icon="md-search" type="primary" @click="handleSubmit('FormLine')">搜索</Button>
                  <Button @click="handleReset('FormLine')" icon="ios-refresh">重置</Button>
                </div>
              </FormItem>
              </Col>
            </Row>
          </Form>
        </header>

        <!-- main -->
        <main>
          <Table :data="tableData.list" :columns="tableColumns" stripe :loading="tableData.loading">
            <template #warehouseCode="{ row }">
              <div class="warehouseCode" @click="toDetail(row)">
                {{ row.warehouseCode }}
              </div>
            </template>
            <template #operation="{ row }">
              <div class="table_operation">
                <Button type="text" size="small" @click="deleteRow(row)">删除</Button>
              </div>
            </template>
          </Table>
          <div class="table_page">
            <Page :total="page.total" :current="page.currentPage" :page-size="page.pageSize" :page-size-opts="page.pageSizeOpts" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-total show-sizer></Page>
          </div>
        </main>
      </div>
      </Col>
    </Row>
    <!-- ================================================================== -->
    <!-- 新建标签 -->
    <AddLabel :modal="addLabelModal" @visibleChange="AddLabelVisibleChange" @operationSuccess="AddLabelOperationSuccess"></AddLabel>
    <!-- 重命名 -->
    <ReName :modal="renameModal" @visibleChange="RenameVisibleChange" @operationSuccess="RenameOperationSuccess"></ReName>
    <!-- 删除标签 -->
    <DeleteModal :modal="deleteLabelModal" @visibleChange="deleteLabelModal_VisibleChange" @delete_confirm="deleteLabelModal_confirm"></DeleteModal>
    <!-- ================================================================== -->
    <!-- 删除行 -->
    <DeleteModal :modal="deleteRowModal" @visibleChange="deleteRowModal_VisibleChange" @delete_confirm="deleteRowModal_confirm"></DeleteModal>
    <!-- ================================================================== -->
  </div>
</template>

<script setup lang="ts">
import {
  tableTag_queryTagList,
  tableTag_deleteTag,
  tableTag_queryTableTagPageList,
  tableTag_databaseTypeList,
  tableTag_deleteTableTag,
} from "@/api/labelmanagement.ts";
import ViewUIPlus from "view-ui-plus";
const { Spin, Message } = <any>ViewUIPlus;
import { onMounted, reactive, ref, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import DeleteModal from "../../components/modal";
import components from "./components/index";
const { ReName, AddLabel } = components;
//===========================================================================================
//左侧板块
//  键入检索
let search = ref<string>("");
const resetTree = (): void => {
  tagData.selectData = {};
  search.value = "";
  tableTagQueryTableTagPageList();
};
//类型约束
interface Modal {
  show: boolean;
  title?: string;
  operation?: string;
  content?: string;
  row?: any;
}
//-----------------------------------------
interface TreeDataItem {
  title: string;
  expand?: boolean;
  contextmenu?: boolean;
  children?: TreeDataItem[];
}
let tagData = reactive<any>({
  tagList: [],
  contextData: {},
  selectData: {},
});
const handleContextMenu = (data: TreeDataItem): void => {
  tagData.contextData = data;
};
const handleSelectChange = (data: TreeDataItem): void => {
  tagData.selectData = data[0];
  tableTagQueryTableTagPageList();
};
let tagList = computed(() => {
  if (!search.value) {
    return tagData.tagList;
  }
  return tagData.tagList.filter((e: any) => e.title.includes(search.value));
});
//-----------------------------------------
onMounted(() => {
  nextTick(() => {
    tableTagQueryTagList();
    tableTagDatabaseTypeList();
    tableTagQueryTableTagPageList();
  });
});

//-----------------------------------------
//获取标签列表
const tableTagQueryTagList = (): void => {
  tableTag_queryTagList({})
    .then((res: any) => {
      tagData.tagList = res.data.map((el: any) => {
        return {
          title: el.tagName,
          ...el,
          expand: false,
          contextmenu: true,
          children: [],
        };
      });
    })
    .catch((error: any) => {
      Message.error(error.message);
    });
};
//新增标签
let addLabelModal: Modal = reactive({
  show: false,
  title: "新建标签",
  operation: "edit",
});
const addLabel = (): void => {
  addLabelModal.show = true;
};
const AddLabelVisibleChange = (val: boolean): void => {
  addLabelModal.show = val;
};
//新增成功
const AddLabelOperationSuccess = (): void => {
  tableTagQueryTagList();
};
//-----------------------------------------
// 重命名
let renameModal: Modal = reactive({
  show: false,
  title: "标签重命名",
  operation: "edit",
});
const reNameLabel = (): void => {
  renameModal.show = true;
  renameModal.row = tagData.contextData;
};
const RenameVisibleChange = (val: boolean): void => {
  renameModal.show = val;
};
const RenameOperationSuccess = (): void => {
  tableTagQueryTagList();
};
//-----------------------------------------
//删除
let deleteLabelModal: Modal = reactive({
  show: false,
});
const deleteLabel = (): void => {
  deleteLabelModal.show = true;
  deleteLabelModal.content = "是否确认删除该标签？";
};
const deleteLabelModal_VisibleChange = (val: boolean): void => {
  deleteLabelModal.show = val;
};
const deleteLabelModal_confirm = (): void => {
  tableTagDeleteTag(tagData.contextData.tagId);
};
const tableTagDeleteTag = (tagId: number | string): void => {
  Spin.show();
  tableTag_deleteTag({
    tagId,
  })
    .then((res: any) => {
      deleteLabelModal.show = false;
      Spin.hide();
      Message.success("删除成功");
      tableTagQueryTagList();
    })
    .catch((error: any) => {
      Spin.hide();
      Message.error(error.message);
    });
};
//===========================================================================================
//右侧板块
interface FormData {
  warehouseStorageTypeName?: string;
  tagNameAndCode?: string;
}
let FormData: FormData = reactive({
  warehouseStorageTypeName: "",
  tagNameAndCode: "",
});
// 不使用any会报错
let FormLine = ref<any>(null);
let handleSubmit = (name: string): void => {
  if (name == "FormLine") {
    FormLine.value.validate((valid: boolean) => {
      tableTagQueryTableTagPageList();
      if (valid) {
      } else {
        //手动调用每个item校验方法
        for (let el of FormLine.value.fields) {
          el.formBlur();
        }
      }
    });
  }
};
let handleReset = (name: string): void => {
  if (name == "FormLine") {
    FormLine.value.resetFields();
    tableTagQueryTableTagPageList();
  }
};

let database = reactive<any>({
  list: [],
});
const tableTagDatabaseTypeList = (): void => {
  tableTag_databaseTypeList({})
    .then((res: any) => {
      database.list = res.data;
    })
    .catch((error: any) => {
      Message.error(error.message);
    });
};
//------------------------------------------------------------------------------
//table
let tableData = reactive<any>({
  loading: false,
  list: [],
});
interface Page {
  total: number; // 总页数
  currentPage: number; // 当前页数
  pageSize: number; // 每页显示多少条,
  pageSizeOpts?: number[];
}
let page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10, // 每页显示多少条,
  pageSizeOpts: [10, 20, 30, 50, 100],
});
//   #region
let tableColumns = [
  {
    title: "数据库类型",
    key: "warehouseStorageTypeName",
    align: "center",
    minWidth: 100,
  },
  {
    title: "数据库名称",
    key: "warehouseDatabaseCode",
    align: "center",
    minWidth: 200,
  },
  {
    title: "表名称",
    key: "warehouseCode",
    slot: "warehouseCode",
    align: "center",
    minWidth: 200,
  },
  {
    title: "表描述",
    key: "warehouseDescribe",
    align: "center",
    minWidth: 300,
  },
  {
    title: "操作",
    slot: "operation",
    width: 80,
    fixed: "right",
    align: "center",
  },
];
//   #endregion
const tableTagQueryTableTagPageList = (): void => {
  Spin.show();
  tableTag_queryTableTagPageList({
    current: page.currentPage,
    size: page.pageSize,
    tagTableId: "",
    tagId: tagData.selectData.tagId ? tagData.selectData.tagId : "",
    warehouseStorageTypeName: FormData.warehouseStorageTypeName,
    tagNameAndCode: FormData.tagNameAndCode,
  })
    .then((res: any) => {
      page.total = res.data.total;
      tableData.list = res.data.list;
      Spin.hide();
    })
    .catch((error: any) => {
      Spin.hide();
      Message.error(error.message);
    });
};
const changePage = (currentPage: number): void => {
  page.currentPage = currentPage;
  tableTagQueryTableTagPageList();
};
const changePageSize = (size: number): void => {
  page.pageSize = size;
  tableTagQueryTableTagPageList();
};

//----------------------------------------------------------------------------
//删除表格行
const tableTagDeleteTableTag = (tagTableId: number | string): void => {
  Spin.show();
  tableTag_deleteTableTag({
    tagTableId,
  })
    .then((res: any) => {
      Message.success("删除成功");
      Spin.hide();
      deleteRowModal.show = false;
      tableTagQueryTableTagPageList();
    })
    .catch((error: any) => {
      Spin.hide();
      Message.error(error.message);
    });
};
//删除
let deleteRowModal: Modal = reactive({
  show: false,
});
const deleteRow = (row: any): void => {
  deleteRowModal.show = true;
  deleteRowModal.row = row;
  deleteRowModal.content = "是否确认删除该行数据？";
};

const deleteRowModal_VisibleChange = (val: boolean): void => {
  deleteRowModal.show = val;
};
const deleteRowModal_confirm = (): void => {
  tableTagDeleteTableTag(deleteRowModal.row.tagTableId);
};
const router = useRouter();
const toDetail = (data: any): void => {
  router.push(`/dataAssets/assetCatalog/tableDetail/${data.warehouseId}`);
};
//----------------------------------------------------------------------------
</script>

<style lang="scss" scoped>
.collectionTaskManagement {
  height: 100%;
  :deep(.ivu-row) {
    height: 100%;
    .ivu-col {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
  .menuParent {
    min-height: calc(100vh - 60px) !important;
    //   overflow-x: hidden;
    //   overflow-y: scroll;
    .title {
      display: flex;
      align-items: center;
      line-height: 40px;
      justify-content: space-between;
      // padding-right: 10px;
      margin-bottom: 10px;
      font-size: 20px;
    }
  }
  .resetTree {
    margin: 16px 0;
    display: flex;
    align-items: center;
  }
  .warehouseCode {
    cursor: pointer;
    color: #0000ff;
  }
}
</style>