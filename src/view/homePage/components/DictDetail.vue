<template>
  <!-- 字典详情 -->
  <Modal :z-index="1100" :width="'60vw'" v-model="show" :title="modal.title" :styles="modal.styles ? modal.styles : {}">
    <Form @submit.prevent :label-width="120">
      <Row :gutter="20">
        <Col span="12">
        <FormItem label="字典类别：">
          {{ data.detail?.categoryParentName }}-{{ data.detail?.categoryName }}
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="中文名称：">
          {{ data.detail?.metadataName }}
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="英文名称：">
          {{ data.detail?.metadataCode }}
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="数据类型："> {{ data.detail?.dataType }} </FormItem>
        </Col>
        <Col span="24">
        <FormItem label="数据取值："> {{ data.detail?.dataValue }}</FormItem>
        </Col>
        <Col span="24">
        <FormItem label="关联表：">
          <div class="list">
            <span class="tag" v-for="el of data.detail?.warehouseTableVOList || []" :key="el.warehouseId" @click="toDetail(el)">
              {{ el.warehouseCode }}
            </span>
          </div>
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="创建时间："> {{ data.detail?.createTime }}</FormItem>
        </Col>
        <Col span="12">
        <FormItem label="创建人："> {{ data.detail?.createBy }} </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="更新时间：">
          {{ data.detail?.updateTime }}
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="更新人："> {{ data.detail?.updateBy }} </FormItem>
        </Col>
        <Col span="24">
        <FormItem label="描述：">
          <Input clearable disabled type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入描述" v-model="data.detail.attributeType">
          </Input>
        </FormItem>
        </Col>
      </Row>
    </Form>
    <template v-slot:footer>
      <div>
        <Button @click="close">关闭</Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { withDefaults, watch, computed, ref } from "vue";
import { useRouter } from "vue-router";
interface Props {
  modal: any;
  data: any;
}
const props = withDefaults(defineProps<Props>(), {
  modal: {
    show: false,
  },
  data: null,
});
const emit = defineEmits(["visibleChange", "toDetail"]);
let show = computed({
  get() {
    return props.modal.show;
  },
  set(val) {
    emit("visibleChange", val);
  },
});

const close = () => {
  emit("visibleChange", false);
};
const router = useRouter();
const toDetail = (data: any): void => {
  emit("toDetail", data);
  // router.push(`/dataAssets/assetCatalog/tableDetail/${data.warehouseId}`);
};
</script>

<style scoped lang='scss'>
.list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  line-height: 16px;
  .tag {
    padding: 5px;
    border: 1px solid #eee;
    border-radius: 3px;
    color: #007bfa;
    cursor: pointer;
    margin-right: 3px;
  }
}
</style>