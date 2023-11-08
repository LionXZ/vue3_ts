<template>
  <div class="base-echart">
    <div ref="echartDivRef" :style="{ width: width, height: height }"></div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, withDefaults, watchEffect } from "vue";
  import { EChartsOption } from "echarts";
  import useEchart from "../hooks/useEcharts";

  // 定义props
  const props = withDefaults(
    defineProps<{
      options: EChartsOption;
      width?: string;
      height?: string;
    }>(),
    {
      width: "400px",
      height: "220px",
    }
  );

  const echartDivRef = ref<HTMLElement>();

  onMounted(() => {
    const { setOptions } = useEchart(echartDivRef.value!);
    watchEffect(() => {
      setOptions(props.options);
    });
  });
</script>
