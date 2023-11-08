<template>
  <div class="operation">
    <Button type="primary" style="margin-right: 10px" size="small" @click="undo">
      <Icon type="ios-undo" style="margin-right: 3px" />撤销
    </Button>
    <Button type="primary" style="margin-right: 10px" size="small" @click="redo">恢复
      <Icon type="md-share-alt" />
    </Button>
    <Button type="primary" style="margin-right: 10px" size="small" @click="lint">语法检查</Button>
    <Button type="primary" style="margin-right: 10px" size="small" @click="formatter">格式化</Button>
    <Button type="primary" style="margin-right: 10px" size="small" @click="implement" v-if="!isInExecution">执行
      <Icon type="md-play" />
    </Button>
    <Button type="primary" style="margin-right: 10px" size="small" @click="stop" v-else>停止
      <Icon type="md-pause" />
    </Button>
    <Button type="primary" style="margin-right: 10px" size="small" @click="save">保存
      <Icon type="md-document" />
    </Button>
  </div>
  <Codemirror v-model:value="code" :options="cmOptions" border ref="cmRefDom" @change="onChange" @ready="onReady" @focus="onFocus" @blur="onblur" :height="300">
  </Codemirror>
</template>

<script setup lang="ts">
import ViewUIPlus from "view-ui-plus";
const { Spin, Message } = ViewUIPlus;
import {
  dw_tablesql_verifySQL,
  entrance_execute,
  entrance_kill,
} from "@/api/dataQuery";
import {
  computed,
  ref,
  onMounted,
  watchEffect,
  watch,
  nextTick,
  defineAsyncComponent,
} from "vue";
import Codemirror, { CmComponentRef } from "codemirror-editor-vue3";
// @types/codemirror
import { Editor, EditorConfiguration } from "codemirror";
import { format } from "sql-formatter";
// 引入主题后还需要在 options 中指定主题才会生效
import "codemirror/theme/solarized.css";
// language
import "codemirror/mode/sql/sql.js";

// 引入代码自动提示插件
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/sql-hint";
import "codemirror/addon/hint/show-hint";
//=========================================================================================

interface Props {
  modelValue: string;
  mode: string;
  data: any;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  mode: "text/x-sql",
  data: {
    executeResult: {
      status: "Running",
      progress: 0,
      entranceLog: null,
      log: null,
    },
    runStatus: "Running",
  },
});
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "update_execute", value: Object): void;
  (e: "start_execute"): void;
  (e: "execute_err"): void;
  (e: "stop_execute", value: Object): void;
  (e: "save_scripts", value: Object): void;
}>();
const cminstance = ref<Editor>();
const cmRefDom = ref<CmComponentRef>(null);
let code = computed({
  get() {
    return props.modelValue;
  },
  set(v: string) {
    emit("update:modelValue", v);
  },
});

const cmOptions: EditorConfiguration = {
  tabSize: 2,
  // styleActiveLine: true,
  lineNumbers: true,
  // line: true,
  mode: props.mode,
  // mode: "text/x-sql",
  theme: "solarized",
  hintOptions: {
    // 自定义提示选项
    completeSingle: false, // 当匹配只有一项的时候是否自动补全
  },
};

//=========================================================================================

onMounted(() => {
  cminstance.value = cmRefDom.value?.cminstance;
  cminstance.value.on("keypress", () => {
    cminstance.value.showHint();
  });
});
//=========================================================================================
const onReady = (cm: Editor) => {
  // cminstance.value = cm;
};
const onChange = (value: string, cm: Editor) => {
  // console.log("onChange", value, cm);
  code.value = value;
};
const onFocus = (cm: Editor, event: FocusEvent) => {
  // console.log("onFocus", cm, event);
};
const onblur = (cminstance: Editor, event: FocusEvent | any) => {
  // console.log(cminstance, event, "onblur");
  // code.value = event.target?.value;
};
//撤销
const undo = () => {
  cminstance.value.undo();
};
//回退
const redo = () => {
  cminstance.value.redo();
};
//格式化
const formatter = () => {
  code.value = format(code.value);
};
//=========================================================================================

let isInExecution = ref<boolean>(false);
let init = ref<boolean>(true);
let isExecute = ref<boolean>(false);
//执行
const implement = () => {
  if (code.value.length <= 1) {
    Message["error"]("请先输入sql");
    return;
  }
  emit("start_execute");
  isInExecution.value = true;
  isExecute.value = true;
  init.value = false;
  entrance_execute({
    executeApplicationName: "hive",
    executionCode: code.value,
    runType: "hql",
    params: { variable: {}, configuration: {} },
    source: { scriptPath: props.data.name },
  })
    .then((res: any) => {
      isExecute.value = false;
      emit("update_execute", res);
    })
    .catch((error: any) => {
      isInExecution.value = false;
      Message["error"](error.message);
      emit("execute_err");
    });
};
//停止
const stop = () => {
  if (isExecute.value == true) {
    Message["warning"]("接口请求中，请稍候");
    return;
  }
  emit("stop_execute", props.data.executeResult);
  entrance_kill({
    ...props.data.executeResult,
  })
    .then((res: any) => {
      isInExecution.value = false;
      Message["success"]("任务已停止");
    })
    .catch((error: any) => {
      isInExecution.value = false;
      Message["error"](error.message);
    });
};
//语法检查
const lint = () => {
  if (code.value.length <= 1) {
    Message["error"]("请先输入sql");
    return;
  }
  Spin.show();
  dw_tablesql_verifySQL({
    sql: code.value,
  })
    .then((res: any) => {
      Spin.hide();
      Message["success"]("校验成功，SQL正确");
    })
    .catch((error: any) => {
      console.log(error);
      Spin.hide();
      Message["error"]("校验失败！请检查相关SQL语句！");
    });
};
//保存
const save = () => {
  if (!code.value) {
    Message["warning"]("请先输入要保存的SQL");
    return;
  }
  if (code.value.length <= 1) {
    Message["warning"]("请先输入要保存的SQL");
    return;
  }
  emit("save_scripts", code.value);
};
watch(
  () => props.data.runStatus,
  (newVal: any, oldVal: any) => {
    if (newVal == "Succeed" || newVal == "Stop" || newVal == "Failed") {
      isInExecution.value = false;
    } else {
      isInExecution.value = true;
    }
  }
);
//初始查询
watchEffect(() => {
  if (props.data.run == true && init.value) {
    implement();
  }
});
//=========================================================================================
</script>

<style scoped lang="scss">
.operation {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>