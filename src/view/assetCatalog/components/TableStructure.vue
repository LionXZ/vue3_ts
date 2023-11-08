<template>
  <div class="TableStructure">
    <div class="TableStructureItem">
      <h3>表结构</h3>
      <Table :columns="columns1" :data="tableData1" stripe>
        <template #warehouseDetailService="{ row }">
          <EditInput v-model="row.warehouseDetailService" @change="
              (warehouseDetailService) =>
                change_warehouseDetailService(warehouseDetailService, row)
            " />
          <!-- <Input v-model="row.warehouseDetailService" style="width: 100%" /> -->
        </template>
        <template #action="{ row }">
          <Button type="text" size="small" style="color: #0000ff">血缘</Button>
        </template>
      </Table>
    </div>
    <div class="TableStructureItem">
      <h3>分区</h3>
      <Table :columns="columns2" :data="tableData2" stripe>
        <template #warehouseDetailService="{ row }">
          <EditInput v-model="row.warehouseDetailService" @change="
              (warehouseDetailService) =>
                change_warehouseDetailService(warehouseDetailService, row)
            " />
          <!-- <Input v-model="row.warehouseDetailService" style="width: 100%" /> -->
        </template>
      </Table>
    </div>
    <div class="TableStructureItem">
      <h3>
        桶
        <span v-if="info.data.databaseStorageTypeName=='hive'">
          {{`（Buckets Num: ${BucketsNum}      Clustered By: ${ClusteredBy}）`}}
        </span>
      </h3>
      <Table :data="tableData3" :columns="columns3" stripe></Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import ViewUIPlus from "view-ui-plus";
const { Spin, Message } = ViewUIPlus;
import { assetCatalog_updateDetailService } from "@/api/assetCatlog";
import editBox from "@/components/editBox/index.ts";
const { EditInput } = editBox;
import { computed, inject } from "vue";
const emit = defineEmits<{
  (e: "change_warehouseDetailService_success"): void;
}>();

let info: any = inject("info");
const columns1 = [
  {
    type: "index",
    title: "序号",
    width: 80,
    align: "center",
  },
  {
    title: "字段",
    key: "warehouseDetailCode",
    align: "center",
  },
  {
    title: "数据类型",
    key: "detailName",
    align: "center",
  },
  {
    title: "系统描述",
    key: "warehouseDetailName",
    align: "center",
  },
  {
    title: "业务描述",
    key: "warehouseDetailService",
    align: "center",
    slot: "warehouseDetailService",
  },
  // {
  //   title: "操作",
  //   key: "action",
  //   align: "center",
  //   slot: "action",
  // },
];
const tableData1 = computed(() => {
  return info.EssentialInformationAndTableStructure?.linkisWarehouseDetail.filter(
    (e: any) => e.warehouseDetailType == 1
  );
});
const columns2 = [
  {
    type: "index",
    title: "序号",
    width: 80,
    align: "center",
  },
  {
    title: "分区字段名称",
    key: "warehouseDetailCode",
    align: "center",
  },
  {
    title: "数据类型",
    key: "detailName",
    align: "center",
  },
  {
    title: "系统描述",
    key: "warehouseDetailName",
    align: "center",
  },
  {
    title: "业务描述",
    key: "warehouseDetailService",
    align: "center",
    slot: "warehouseDetailService",
  },
];
const tableData2 = computed(() => {
  return info.EssentialInformationAndTableStructure?.linkisWarehouseDetail?.filter(
    (e: any) => e.warehouseDetailType == 2
  );
});
// const columns3 = [
//   {
//     type: "index",
//     title: "序号",
//     width: 80,
//     align: "center",
//   },
//   {
//     title: "Sorted By字段名称",
//     key: "warehouseDetailCode",
//     align: "center",
//   },
//   {
//     title: "Sorted By字段排序方式",
//     key: "detailName",
//     align: "center",
//   },
// ];
const columns3 = computed(() => {
  let array = [
    {
      type: "index",
      title: "序号",
      width: 80,
      align: "center",
    },
    {
      title: "Sorted By字段名称",
      key: "warehouseDetailCode",
      align: "center",
    },
    {
      title: "Sorted By字段排序方式",
      key: "detailName",
      align: "center",
    },
  ];
  if (info.data.databaseStorageTypeName == "clickhouse") {
    array[1].title = "Order By字段名称";
    array[2].title = "Order By字段排序方式";
  }
  return array;
});
const BucketsNum = computed(() => {
  return info.EssentialInformationAndTableStructure?.linkisWarehouseDetail?.find(
    (e: any) => e.warehouseDetailType == 4
  )?.warehouseDetailCode;
});
const ClusteredBy = computed(() => {
  return info.EssentialInformationAndTableStructure?.linkisWarehouseDetail
    ?.filter((e: any) => e.warehouseDetailType == 3)
    .map((e: any) => e.warehouseDetailCode)
    .join(",");
});
const tableData3 = computed(() => {
  return info.EssentialInformationAndTableStructure?.linkisWarehouseDetail.filter(
    (e: any) => e.warehouseDetailType == 5
  );
});
const change_warehouseDetailService = (
  warehouseDetailService: string,
  row: any
): void => {
  assetCatalogUpdateDetailService({
    warehouseDetailId: row.warehouseDetailId,
    warehouseDetailService,
  });
};
const assetCatalogUpdateDetailService = ({
  warehouseDetailId,
  warehouseDetailService,
}: any) => {
  Spin.show();
  assetCatalog_updateDetailService({
    warehouseDetailId,
    warehouseDetailService,
  })
    .then((res: any) => {
      Spin.hide();
      Message.success("修改成功");
      emit("change_warehouseDetailService_success");
    })
    .catch((error: any) => {
      Spin.hide();
      Message.error(error.message);
    });
};
</script>

<style scoped lang="scss">
.TableStructure {
  .TableStructureItem {
    margin-bottom: 20px;
    > h3 {
      margin-bottom: 10px;
    }
  }
}
</style>