<template>
  <Table
    :columns="columns"
    :data="props.historicalQuery"
    @on-row-dblclick="handleRowDbClick"
  >
    <template #status="{ row }">
      <Tag color="green" v-if="row.status == 'Running'">执行中</Tag>
      <Tag color="success" v-if="row.status == 'Succeed'">成功</Tag>
      <Tag color="error" v-if="row.status == 'Failed'">执行失败</Tag>
      <Tag color="red" v-if="row.status == 'Stop'">中止</Tag>
    </template>
    <template #action="{ row }">
      <Button
        type="primary"
        size="small"
        @click="downLoadLog(row)"
        :disabled="row.status == 'Running'"
        >日志下载</Button
      >
    </template>
  </Table>
</template>

<script setup lang="ts">
  import { filesystem_download, jobhistory_get } from "@/api/dataQuery";
  import { saveLog } from "@/utils/index";
  import { reactive } from "vue";
  //   const {
  //    filesystem_download
  //   } = dataQuery;
  interface Props {
    historicalQuery: any;
  }
  const props = withDefaults(defineProps<Props>(), {
    historicalQuery: [],
  });
  const emit = defineEmits(["dbClick"]);

  let currentRow = reactive({});

  const columns = [
    {
      title: "任务ID",
      key: "taskID",
      align: "center",
    },
    {
      title: "启动时间",
      key: "startTime",
      align: "center",
      width: 180,
    },
    {
      title: "状态",
      key: "status",
      slot: "status",
      align: "center",
    },
    {
      title: "代码",
      key: "scripts",
      align: "center",
      width: 450,
    },
    {
      title: "执行时长(ms)",
      key: "costTime",
      align: "center",
    },
    // {
    //   title: "关键信息",
    //   key: "keyInformation",
    //   align: "center",
    // },
    // {
    //   title: "Action",
    //   slot: "action",
    //   align: "center",
    //   width: 260,
    // },
  ];

  //查看
  const view = (row: any): void => {
    currentRow = row;
  };
  //日志下载
  const downLoadLog = (row: any): void => {
    if (row.status == "Succeed") {
      filesystem_download({
        path: row.logPath,
      }).then((data: any) => {
        saveLog(data, `${row.name}-${row.taskID}`);
      });
    } else {
      jobhistory_get({
        taskID: row.taskID,
      }).then((res: any) => {
        filesystem_download({
          path: res.task.logPath,
        }).then((data: any) => {
          saveLog(data, `${row.name}-${row.taskID}`);
        });
      });
    }
  };
  //双击
  const handleRowDbClick = (row: any): void => {
    emit("dbClick", row);
  };
</script>

<style scoped>
</style>