<template>
  <Codemirror v-model:value="code" :options="cmOptions" border :height="300" />
</template>

<script setup lang="ts">
import { ref, watchEffect, watch, computed } from "vue";
import Codemirror, {
  createLinkMark,
  createLogMark,
  createTitle,
} from "codemirror-editor-vue3";
interface Props {
  executeResult: any;
}
const props = withDefaults(defineProps<Props>(), {
  executeResult: null,
});
const cmOptions = {
  mode: "log",
  theme: "default",
};
// watch(
//   () => props.executeResult,
//   (newVal, oldVal) => {
//     console.log(oldVal, newVal);
//   }
// );
let code = computed(() => {
  let str = ``;
  if (props.executeResult && props.executeResult.progress == 1) {
    // 执行成功时：
    if (props.executeResult.status == "Succeed") {
      for (const key in props.executeResult.log) {
        if (
          Object.prototype.hasOwnProperty.call(props.executeResult.log, key)
        ) {
          const element = props.executeResult.log[key];
          switch (key) {
            case "info":
              str += createLogMark(element, "info");
              break;
            case "warning":
              str += createLogMark(element, "warning");
              break;
            case "error":
              str += createLogMark(element, "error");
              break;
            default:
              break;
          }
        }
      }
    }
    // 执行失败时：
    if (props.executeResult.status == "Failed") {
      for (const key in props.executeResult.entranceLog) {
        if (
          Object.prototype.hasOwnProperty.call(
            props.executeResult.entranceLog,
            key
          )
        ) {
          const element = props.executeResult.entranceLog[key];
          switch (key) {
            case "info":
              str += createLogMark(element, "info");
              break;
            case "warning":
              str += createLogMark(element, "warning");
              break;
            case "error":
              str += createLogMark(element, "error");
              break;
            default:
              break;
          }
        }
      }
    }
  }
  return str;
});
</script>

<style scoped>
</style>