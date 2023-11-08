<template>
  <Modal
    v-model="show"
    :title="modal.title"
    :styles="modal.styles ? modal.styles : {}"
    @on-visible-change="visibleChange"
  >
    <Form
      ref="FormLine"
      :model="FormData"
      :rules="ruleValidate"
      :label-width="120"
    >
      <FormItem label="标签名称：" prop="labelName">
        <Input
          clearable
          v-model="FormData.labelName"
          placeholder="请输入标签名称"
        />
        <p class="tips">标签长度在16个字符范围内</p>
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
  import { withDefaults, computed, reactive, ref } from "vue";
  import ViewUIPlus from "view-ui-plus";
  const { Spin, Message } = <any>ViewUIPlus;
  import { tableTag_addTag } from "@/api/labelmanagement.ts";
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
    labelName: "",
  });
  let ruleValidate = computed(() => {
    return {
      labelName: [
        {
          required: true,
          message: "请输入标签名称",
          trigger: "blur",
          //   trigger: ["change", "blur"], 注意 这里使用["change", "blur"] validate的返回值会一直为true
        },
      ],
    };
  });

  const tableTagAddTag = ({ tagName, tagCode, tagSeq }: any): void => {
    Spin.show();
    tableTag_addTag({
      tagName,
      tagCode,
      tagSeq,
    })
      .then((res: any) => {
        Spin.hide();
        Message.success("新增成功");
        emit("operationSuccess");
        emit("visibleChange", false);
      })
      .catch((error: any) => {
        Spin.hide();
        Message.error(error.message);
      });
  };
  // 不使用any会报错
  let FormLine = ref<any>(null);
  let handleSubmit = (name: string): void => {
    if (name == "FormLine") {
      FormLine.value.validate((valid: boolean) => {
        if (valid) {
          tableTagAddTag({
            tagName: FormData.labelName,
          });
        } else {
          //手动调用每个item校验方法
          for (let el of FormLine.value.fields) {
            el.formBlur();
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
</script>

<style scoped>
  .tips {
    color: #aaa;
    margin: 10px 0;
  }
</style>