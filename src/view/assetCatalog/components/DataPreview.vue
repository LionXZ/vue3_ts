<template>
  <div class="DataPreview">
    <Table :columns="tableObj.columns" :data="tableObj.tableData"></Table>
  </div>
</template>

<script setup lang="ts">
  import ViewUIPlus from "view-ui-plus";
  const { Spin, Message } = ViewUIPlus;
  import { dataPreview_preview } from "@/api/assetCatlog";
  import { inject, onMounted, reactive, nextTick } from "vue";
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
    ],
    tableData: [],
  });

  const dataPreviewPreview = (warehouseId: string | number): void => {
    tableObj.loading = true;
    Spin.show();
    dataPreview_preview({ warehouseId })
      .then((res: any) => {
        tableObj.loading = false;
        Spin.hide();
        let columns = res.meta?.split(",")?.map((el: string) => {
          return {
            title: el,
            key: el,
            align: "center",
            sortable: true,
            minWidth: 200,
          };
        });
        tableObj.columns = tableObj.columns.concat(columns);
        tableObj.tableData = JSON.parse(res.data)?.map((el: any) => {
          let obj = {};
          columns.forEach((item: any, index: number) => {
            obj[item.key] = el[index];
          });
          return obj;
        });
      })
      .catch((error: any) => {
        tableObj.loading = false;
        Spin.hide();
        Message.error(error.message || "请求失败");
      });
  };

  onMounted(() => {
    nextTick(() => {
      dataPreviewPreview(info.warehouseId);
    });
  });
</script>

<style scoped>
</style>