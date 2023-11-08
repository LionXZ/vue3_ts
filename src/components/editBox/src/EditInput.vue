<template>
  <div class="editBox">
    <div class="input">
      <Input
        v-model="modelValue"
        :disabled="disabled"
        @on-blur="blur"
        size="small"
      />
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
    (e: "update:modelValue", value: string): void;
    (e: "change", value: string): void;
  }>();
  interface Props {
    modelValue: string;
  }
  const props = withDefaults(defineProps<Props>(), {
    modelValue: "",
  });
  let modelValue = computed({
    get() {
      return props.modelValue;
    },
    set(v: string) {
      emit("update:modelValue", v);
    },
  });
  let disabled = ref<boolean>(true);
  const edit = (): void => {
    disabled.value = false;
  };
  const blur = (): void => {
    emit("change", modelValue.value);
    disabled.value = true;
  };
</script>

<style scoped lang='scss'>
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
</style>