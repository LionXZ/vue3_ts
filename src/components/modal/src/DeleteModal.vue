<template>
  <!-- 删除 -->
  <Modal v-model="show" :title="'删除'">
    <div class="content">
      <Icon type="md-alert" style="color: red" />
      {{ modal.content ? modal.content : `是否确认删除?` }}
    </div>
    <template v-slot:footer>
      <div>
        <Button @click="delete_cancel">取消</Button>
        <Button type="primary" @click="delete_confirm">确定</Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
  import { withDefaults, defineProps, defineEmits, computed } from "vue";
  interface Props {
    modal: any;
  }
  const props = withDefaults(defineProps<Props>(), {
    modal: {
      show: false,
    },
  });

  const emit = defineEmits(["visibleChange", "delete_confirm"]);

  let show = computed({
    get() {
      return props.modal.show;
    },
    set(val) {
      emit("visibleChange", val);
    },
  });

  const delete_cancel = (): void => {
    emit("visibleChange", false);
  };
  const delete_confirm = (): void => {
    emit("delete_confirm", false);
  };
</script>

<style lang="scss" scoped>
  .content {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
</style>