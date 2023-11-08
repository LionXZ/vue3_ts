<template>
  <div class="ChangeRecord">
    <Spin size="large" fix :show="tableObj.loading"></Spin>
    <Table :columns="tableObj.columns" :data="tableObj.tableData"></Table>
    <div class="table_page">
      <Page
        :total="page.total"
        :current="page.currentPage"
        :page-size="page.pageSize"
        :page-size-opts="page.pageSizeOpts"
        @on-change="changePage"
        @on-page-size-change="changePageSize"
        show-elevator
        show-total
        show-sizer
      ></Page>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ViewUIPlus from "view-ui-plus";
  const { Spin, Message } = ViewUIPlus;
  import { assetCatalog_updateTableLog } from "@/api/assetCatlog";
  import { inject, onMounted, reactive } from "vue";
  let info: any = inject("info");
  let tableObj = reactive({
    loading: false,
    columns: [
      {
        type: "index",
        title: "序号",
        width: 80,
        align: "center",
      },
      {
        title: "变更时间",
        key: "updateTime",
        align: "center",
      },
      {
        title: "变更人",
        key: "updateBy",
        align: "center",
      },
      {
        title: "变更内容",
        key: "warehouseCreateName",
        align: "center",
      },
    ],
    tableData: [],
  });
  interface Page {
    total: number; // 总页数
    currentPage: number; // 当前页数
    pageSize: number; // 每页显示多少条,
    pageSizeOpts?: number[];
  }
  const assetCatalogUpdateTableLog = (warehouseId: string | number): void => {
    tableObj.loading = true;
    // Spin.show();
    assetCatalog_updateTableLog({
      warehouseId,
      current: page.currentPage,
      size: page.pageSize,
    })
      .then((res: any) => {
        tableObj.loading = false;
        tableObj.tableData = res.data.list;
        page.total = res.data.total;
      })
      .catch((error: any) => {
        tableObj.loading = false;
        // Spin.hide();
        Message.error(error.message);
      });
  };

  let page = reactive({
    total: 0, // 总页数
    currentPage: 1, // 当前页数
    pageSize: 10, // 每页显示多少条,
    pageSizeOpts: [10, 20, 30, 50, 100],
  });
  const changePage = (currentPage: number): void => {
    page.currentPage = currentPage;
    assetCatalogUpdateTableLog(info.warehouseId);
  };
  const changePageSize = (size: number): void => {
    page.pageSize = size;
    assetCatalogUpdateTableLog(info.warehouseId);
  };

  onMounted(() => {
    assetCatalogUpdateTableLog(info.warehouseId);
  });
</script>

<style scoped>
  .ChangeRecord {
    position: relative;
    min-height: 400px;
  }
</style>
