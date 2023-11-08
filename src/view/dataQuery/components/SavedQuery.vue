<template>
  <Table :columns="columns" :data="showData" @on-row-dblclick="handleRowClick">
    <template #action="{ row }">
      <Button type="text" size="small" @click="deleteRow(row)">删除</Button>
    </template>
  </Table>
  <div class="table_page">
    <Page :total="page.total" :current="page.currentPage" :page-size="page.pageSize" :page-size-opts="page.pageSizeOpts" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-total show-sizer></Page>
  </div>
  <!-- 删除行 -->
  <DeleteModal :modal="deleteRowModal" @visibleChange="deleteRowModal_VisibleChange" @delete_confirm="deleteRowModal_confirm"></DeleteModal>
</template>

<script setup lang="ts">
import ViewUIPlus from "view-ui-plus";
const { Spin, Message } = ViewUIPlus;
import DeleteModal from "@/components/modal";
import { computed, inject, reactive, watchEffect } from "vue";
import { deleteScript } from "@/api/dataQuery";
let saveScriptObj = inject<any>("saveScriptObj");
const emit = defineEmits<{
  (e: "handleRowClick", value: string): void;
}>();
const columns = [
  {
    title: "查询名称",
    key: "queryName",
    align: "center",
  },
  {
    title: "数据库",
    key: "databaseName",
    align: "center",
  },
  {
    title: "SQL",
    key: "queryText",
    align: "center",
  },
  {
    title: "创建时间",
    key: "createTime",
    align: "center",
    width: "180",
  },
  {
    title: "操作",
    slot: "action",
    align: "center",
    width: "80",
  },
];
//类型约束
interface Modal {
  show: boolean;
  title?: string;
  operation?: string;
  content?: string;
  row?: any;
}
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
watchEffect(() => {
  page.total = saveScriptObj?.saveScript?.data?.total;
});
let showData = computed(() => {
  return saveScriptObj?.saveScript?.data?.list.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize
  );
});
const changePage = (currentPage: number): void => {
  page.currentPage = currentPage;
};
const changePageSize = (size: number): void => {
  page.pageSize = size;
};
//双击
const handleRowClick = (row: any): void => {
  emit("handleRowClick", row.queryText);
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
  Spin.show();
  deleteScript({
    queryId: deleteRowModal.row.queryId,
  })
    .then((res: any) => {
      Spin.hide();
      Message.success("删除成功");
      deleteRowModal_VisibleChange(false);
      saveScriptObj.update = true;
    })
    .catch((error: any) => {
      Spin.hide();
      Message.error(error.message);
    });
};
</script>

<style scoped>
</style>