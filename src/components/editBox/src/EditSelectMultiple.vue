<template>
  <div class="editBox">
    <div class="input">
      <Select
        v-model="modelValue"
        size="small"
        :disabled="disabled"
        clearable
        filterable
        multiple
        @on-change="change"
        @on-open-change="handleOpenChange"
        :max-tag-count="1"
      >
        <Option
          v-for="(item, index) in props.list"
          :value="item.value"
          :key="item.value + index"
          >{{ item.label }}</Option
        >
      </Select>
    </div>
    <div class="icon">
      <Icon
        type="ios-create-outline"
        style="font-size: 20px; cursor: pointer"
        @click="edit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  const emit = defineEmits<{
    (e: "update:modelValue", value: any): void;
    (e: "change"): void;
  }>();
  interface item {
    label: string;
    value: string | number;
  }
  interface Props {
    modelValue: any;
    list: item[] | null;
  }
  const props = withDefaults(defineProps<Props>(), {
    modelValue: [],
    list: null,
  });
  let modelValue = computed({
    get() {
      return props.modelValue;
    },
    set(v) {
      emit("update:modelValue", v);
    },
  });
  let disabled = ref<boolean>(true);
  const edit = (): void => {
    disabled.value = false;
  };
  const change = (): void => {
    // disabled.value = true;
  };
  const handleOpenChange = (bool: boolean): void => {
    disabled.value = !bool;
    if (!bool) {
      emit("change");
    }
  };
</script>

<style scoped lang="scss">
  .editBox {
    display: flex;
    align-items: center;
    .input {
      flex: 1;
    }
    .icon {
      width: 10%;
      margin-left: 5px;
    }
  }
  :deep(.ivu-select-multiple) {
    .ivu-select-selection {
      > div:last-child {
        height: 24px !important;
      }
    }
  }
</style>