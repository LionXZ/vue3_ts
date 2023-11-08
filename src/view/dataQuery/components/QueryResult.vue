<template>
  <div>
    <div class="run">
      <WeCodemirror
        v-model="sql"
        :data="props.data"
        @update_execute="update_execute"
        @start_execute="start_execute"
        @stop_execute="stop_execute"
        @execute_err="execute_err"
        @save_scripts="save_scripts"
      />
    </div>
    <section class="result">
      <Tabs type="card" v-model="tabValue">
        <TabPane label="运行进度" name="runProgress">
          <div class="runProgress">
            <div class="runProgress_item runStatus">
              <span>运行状态：</span>
              <div>
                <Steps :current="steps.stepList.length - 1">
                  <Step
                    :title="item.title"
                    :status="item.status"
                    v-for="(item, index) of steps.stepList"
                    :key="item.title + index"
                    style="color: green"
                  ></Step>
                </Steps>
              </div>
            </div>
            <div class="runProgress_item">
              <span>运行进度：</span>
              <div>
                <Progress
                  :percent="
                    props.data.executeResult &&
                    props.data.executeResult.progress
                      ? Number(props.data.executeResult.progress * 100)
                      : 0
                  "
                />
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane label="运行日志" name="runLog">
          <RunLog :executeResult="props.data.executeResult" />
        </TabPane>
        <TabPane label="运行结果" name="operationResults">
          <OperationResults
            :currentResult="data.currentResult"
            :name="props.data.name"
            :task="props.data.task"
            :historicalQuery="data.historicalQuery"
        /></TabPane>
        <TabPane label="历史查询" name="historicalQuery">
          <HistoricalQuery
            :historicalQuery="data.historicalQuery"
            @dbClick="historicalQuery_dbClick"
          />
        </TabPane>
        <TabPane label="保存的查询" name="savedQuery">
          <SavedQuery @handleRowClick="handleRowClick" />
        </TabPane>
      </Tabs>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { objArrayDuplicateRemoval } from "@/utils/index";
  import { convertLog } from "@/utils/convert.js";
  import ViewUIPlus from "view-ui-plus";
  const { Spin, Message } = <any>ViewUIPlus;
  import {
    jobhistory_get,
    filesystem_openLog,
    filesystem_getDirFileTrees,
    filesystem_openFile,
    entrance_status,
    entrance_progress,
    entrance_log,
  } from "@/api/dataQuery";
  import { reactive, ref, computed, watchEffect, onBeforeUnmount } from "vue";
  import components from "./index";
  const { WeCodemirror, OperationResults, RunLog, HistoricalQuery, SavedQuery } =
    components;
  import moment from "moment";
  const emit = defineEmits<{
    (e: "save_scripts", value: Object): void;
  }>();
  const save_scripts = (script: string): void => {
    emit("save_scripts", script);
  };
  interface Props {
    data: any;
  }
  const props = withDefaults(defineProps<Props>(), {
    data: {
      executeResult: {
        status: "Running",
        progress: 0,
        entranceLog: null,
        log: null,
      },
      runStatus: "",
    },
  });
  let sql = computed({
    get() {
      return props.data.scripts;
    },
    set(v: string) {
      props.data.scripts = v;
    },
  });
  let tabValue = ref<string>("runProgress");
  var timer = reactive<any>(null);
  let steps = reactive<any>({
    stepList: [],
  });

  let data = reactive<any>({
    //结果集
    currentResult: {},
    //历史查询
    historicalQuery: [],
  });
  //开始执行
  const start_execute = (): void => {
    steps.stepList = [];
    props.data.runStatus = "Running";
    props.data.executeResult = {
      status: "Running",
      progress: 0,
      entranceLog: null,
      log: null,
    };
    data.currentResult = {};
  };
  //执行失败
  const execute_err = (): void => {
    steps.stepList.push({
      title: "执行失败",
      status: "error",
    });
    props.data.runStatus = "Stop";
  };
  //停止
  const stop_execute = (executeData: any): void => {
    clearTimer();
    steps.stepList.push({
      title: "已中止",
      status: "error",
    });
    props.data.runStatus = "Stop";
    jobhistoryGet("Stop", executeData.taskID);
  };
  //任务已提交成功保存 execID taskID
  const update_execute = (executeData: any): void => {
    //保存历史
    data.historicalQuery.push({
      ...executeData,
      name: props.data.name,
      status: "Running",
      startTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      scripts: props.data.scripts,
      keyInformation: "",
      costTime: "",
      logPath: "",
      currentResult: [],
    });
    steps.stepList = [
      {
        title: "已提交",
        status: "process",
      },
      {
        title: "排队中",
        status: "process",
      },
      {
        title: "执行中",
        status: "process",
      },
    ];
    props.data.executeResult = executeData;
    startTimer(5000);
  };
  //执行状态监听
  const entranceStatus = (): void => {
    entrance_status(props.data.executeResult)
      .then((res: any) => {
        props.data.runStatus = res.status;
        let index = data.historicalQuery.findIndex(
          (el: any) => el.taskID == props.data.executeResult.taskID
        );
        if (index != -1) {
          data.historicalQuery[index].status = res.status;
        }
        if (res.status == "Running") {
          steps.stepList.push({
            title: "执行中",
            status: "process",
          });
          steps.stepList = objArrayDuplicateRemoval(steps.stepList, "title");
        }
        if (res.status == "Failed") {
          steps.stepList.push({
            title: "执行失败",
            status: "error",
          });
          steps.stepList = objArrayDuplicateRemoval(steps.stepList, "title");
          Message.error("执行失败");
          clearTimer();
        }
        if (res.status == "Succeed") {
          steps.stepList.push({
            title: "成功",
            status: "process",
          });
          steps.stepList = objArrayDuplicateRemoval(steps.stepList, "title");
          Message.success("执行成功");
          clearTimer();
        }
        props.data.executeResult.status = res.status;
      })
      .catch((error: any) => {
        Message.error(error.message);
      });
  };

  //执行进度监听
  const entranceProgress = (): void => {
    entrance_progress(props.data.executeResult)
      .then((res: any) => {
        props.data.executeResult.progress = res.progress;
      })
      .catch((error: any) => {
        Spin.hide();
        Message.error(error.message);
      });
  };

  //实时获取log
  const entranceLog = (): void => {
    entrance_log(props.data.executeResult)
      .then((res: any) => {
        props.data.executeResult.entranceLog = formatLog(res.log);
      })
      .catch((error: any) => {
        Spin.hide();
        Message.error(error.message);
      });
  };

  //获取info
  const jobhistoryGet = (status: string, taskID: string): void => {
    // Spin.show();
    jobhistory_get({
      taskID,
    })
      .then((res: any) => {
        Spin.hide();
        props.data.task = res.task;
        //停止也要获取log 和存储costTime logPath
        filesystemOpenLog(res.task.logPath);
        //完善历史查询数据
        let index = data.historicalQuery.findIndex(
          (el: any) => el.taskID == props.data.executeResult.taskID
        );
        if (index != -1) {
          data.historicalQuery[index].costTime = res.task.costTime;
          data.historicalQuery[index].logPath = res.task.logPath;
          data.historicalQuery[index].status = status;
        }
        if (status != "Succeed") return;
        //获取结果集
        filesystemGetDirFileTrees(res.task.resultLocation);
      })
      .catch((error: any) => {
        Spin.hide();
        Message.error(error.message);
      });
  };
  //格式化log
  const formatLog = (data: string[]): any => {
    const log = { all: "", error: "", warning: "", info: "" };
    const convertLogs = convertLog(data);
    Object.keys(convertLogs).forEach((key) => {
      if (convertLogs[key]) {
        log[key] += convertLogs[key] + "\n";
      }
    });
    return log;
  };
  //获取log
  const filesystemOpenLog = (path: string): void => {
    filesystem_openLog({
      path,
    })
      .then((res: any) => {
        props.data.executeResult.log = formatLog(res.log);
      })
      .catch((error: any) => {
        Message.error(error.message);
      });
  };
  // 获取结果集
  const filesystemGetDirFileTrees = (path: string): void => {
    steps.stepList.push({
      title: "读取结果集中",
      status: "process",
    });
    filesystem_getDirFileTrees({
      path,
    })
      .then((res: any) => {
        const resultList = res.dirFileTrees.children.sort(
          (a: any, b: any) => parseInt(a.name, 10) - parseInt(b.name, 10)
        );
        if (resultList.length) {
          filesystemOpenFile(resultList[0].path);
        }
      })
      .catch((error: any) => {
        Message.error(error.message);
      });
  };
  // 获取结果
  const filesystemOpenFile = (path: string): void => {
    filesystem_openFile({
      path,
      page: 1,
      pageSize: 5000,
    })
      .then((res: any) => {
        steps.stepList.push({
          title: "完成",
          status: "process",
        });
        data.currentResult = res;
        //完善历史查询数据
        let index = data.historicalQuery.findIndex(
          (el: any) => el.taskID == props.data.executeResult.taskID
        );
        if (index != -1) {
          data.historicalQuery[index].currentResult = res;
        }
      })
      .catch((error: any) => {
        Message.error(error.message);
      });
  };
  const startTimer = (time: number): void => {
    timer = setInterval(() => {
      entranceStatus();
      entranceProgress();
      entranceLog();
    }, time);
  };
  //清除定时器
  const clearTimer = (): void => {
    clearInterval(timer);
    timer = null;
  };

  //双击保存的查询行 切换sqL
  const handleRowClick = (queryText: string): void => {
    if (props.data.runStatus == "Running") {
      Message.warning("执行中，请稍候！");
      return;
    }
    sql.value = queryText;
  };

  watchEffect(() => {
    if (
      props.data.executeResult &&
      props.data.executeResult.progress == 1 &&
      props.data.executeResult.status == "Succeed"
    ) {
      clearTimer();
      jobhistoryGet("Succeed", props.data.executeResult.taskID);
    }
  });
  //历史记录表格行双击
  const historicalQuery_dbClick = (row: any): void => {
    if (props.data.runStatus == "Running") {
      Message.warning("执行中，请稍候！");
      return;
    }
    sql.value = row.scripts;
  };

  onBeforeUnmount(() => {
    clearTimer();
  });
</script>

<style scoped lang="scss">
  .result {
    .runProgress {
      padding: 0 20px;
      .runStatus {
        line-height: 80px;
        height: 80px;
      }
      .runProgress_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > span {
          width: 100px;
        }
        > div {
          flex: 1;
        }
      }
    }
  }
</style>