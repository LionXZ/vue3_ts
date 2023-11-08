<template>
  <Modal v-model="show" :title="modal.title" :styles="modal.styles ? modal.styles : {}" @on-visible-change="visibleChange">
    <Form ref="FormLine" :model="FormData" :rules="ruleValidate" :label-width="120">
      <FormItem label="查询名称：" prop="trendCode">
        <Input clearable v-model="FormData.trendCode" placeholder="请输入查询名称" />
      </FormItem>
    </Form>

    <template v-slot:footer>
      <div>
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="handleSubmit('FormLine')">确定</Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { saveScript } from "@/api/dataQuery";
import ViewUIPlus from "view-ui-plus";
const { Spin, Message } = ViewUIPlus;
import { withDefaults, computed, reactive, ref, unref, onMounted } from "vue";
interface Props {
  modal: any;
}
const props = withDefaults(defineProps<Props>(), {
  modal: {
    show: false,
  },
});
const emit = defineEmits<{
  (e: "visibleChange", val: any): void;
  (e: "operationSuccess"): void;
}>();
let show = computed({
  get() {
    return props.modal.show;
  },
  set(val) {
    emit("visibleChange", val);
  },
});
let FormData = reactive({
  trendCode: "",
});
let ruleValidate = computed(() => {
  return {
    trendCode: [
      {
        required: true,
        message: "请输入查询名称",
        trigger: "blur",
        //   trigger: ["change", "blur"], 注意 这里使用["change", "blur"] validate的返回值会一直为true
      },
    ],
  };
});
// 不使用any会报错
let FormLine = ref<any>(null);
let handleSubmit = (name: string) => {
  if (name == "FormLine") {
    FormLine.value.validate((valid: boolean) => {
      if (valid) {
        Spin.show();
        saveScript({
          trendCode: FormData.trendCode,
          scriptContent: props.modal.script,
        })
          .then((res: any) => {
            Spin.hide();
            Message.success("保存成功");
            emit("operationSuccess");
          })
          .catch((error: any) => {
            Spin.hide();
            Message.error(error.message);
          });
      } else {
        //手动调用每个item校验方法
        for (let el of FormLine.value.fields) {
          el.formChange();
        }
      }
    });
  }
};
let handleReset = (name: string): void => {
  if (name == "FormLine") {
    FormLine.value.resetFields();
  }
};

const cancel = (): void => {
  emit("visibleChange", false);
  handleReset("FormLine");
};
const visibleChange = (val: boolean): void => {
  emit("visibleChange", val);
  handleReset("FormLine");
};

onMounted(() => {});
</script>

<style scoped>
.tips {
  color: #aaa;
  margin: 10px 0;
}
</style>