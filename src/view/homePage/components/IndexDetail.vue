<template>
  <!-- 指标详情 -->
  <Modal
    :width="'60vw'"
    v-model="modal.show"
    :title="modal.title"
    :styles="modal.styles ? modal.styles : {}"
  >
    <div class="content" style="position: relative">
      <Form @submit.prevent :label-width="120">
        <Row :gutter="20">
          <Col span="12">
            <FormItem label="指标类别：">
              {{ data.detail?.categoryParentName }}-{{
                data.detail?.categoryName
              }}</FormItem
            >
          </Col>
          <Col span="12">
            <FormItem label="指标类型：">
              {{ data.detail?.criterionProperty }}
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="英文名称：">
              {{ data.detail?.criterionCode }}
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="中文名称：">
              {{ data.detail?.criterionName }}
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="维度：">
              {{ data.detail?.dimensionName }}
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="计算周期：">
              {{ data.detail?.countPeriod }}
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="单位："> {{ data.detail?.unitName }} </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="关联字典：">
              <div class="list">
                <span
                  class="tag"
                  v-for="el of data.detail?.dataJsonList || []"
                  :key="el.metadataId"
                  @click="showDict(el.metadataId)"
                >
                  {{ el.metadataName }}
                </span>
              </div>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="关联指标：">
              <div class="list">
                <span
                  class="tag"
                  v-for="el of data.detail?.quotaJsonList || []"
                  :key="el.criterionId"
                  @click="change_category(el.criterionId)"
                >
                  {{ el.criterionName }}
                </span>
              </div>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="指标关联表：">
              <div class="list">
                <span
                  class="tag"
                  v-for="el of data.detail?.warehouseTableVOList || []"
                  :key="el.warehouseId"
                  @click="toDetail(el)"
                >
                  {{ el.warehouseCode }}
                </span>
              </div>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="指标计算逻辑："
              >{{ data.detail?.metadataDescribe }}
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="指标业务口径：">
              {{ data.detail?.criterionDescribe }}
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="创建时间：">
              {{ data.detail?.createTime }}
            </FormItem>
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
            <FormItem label="更新人："> {{ data.detail?.createBy }} </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <template v-slot:footer>
      <div>
        <Button @click="close">关闭</Button>
      </div>
    </template>
  </Modal>

  <DictDetail
    :modal="dict_modal"
    :data="dict_data"
    @visibleChange="DictDetail_visibleChange"
    @toDetail="toDetail"
  />
</template>

<script setup lang="ts">
  import {
    withDefaults,
    watch,
    computed,
    ref,
    reactive,
    defineAsyncComponent,
    onBeforeUnmount,
    onActivated,
  } from "vue";
  import ViewUIPlus from "view-ui-plus";
  const { Spin, Message } = <any>ViewUIPlus;
  import { homePreview_metadataQuery } from "@/api/homePage.ts";
  import { useRouter } from "vue-router";
  const DictDetail = defineAsyncComponent(() => import("./DictDetail.vue"));
  interface Props {
    modal: any;
    data: any;
    tabValue: string;
  }
  const props = withDefaults(defineProps<Props>(), {
    modal: {
      show: false,
    },
    data: null,
    tabValue: "",
  });
  const emit = defineEmits(["visibleChange", "toDetail", "change_category"]);
  let show = computed({
    get() {
      return props.modal.show;
    },
    set(val) {
      emit("visibleChange", val);
    },
  });

  const change_category = (criterionId: string | number): void => {
    emit("change_category", criterionId);
  };

  interface Modal {
    show: boolean;
    title?: string;
    operation?: string;
    content?: string;
    row?: Object;
  }
  let dict_modal: Modal = reactive({
    show: false,
    title: "字典详情",
  });
  let dict_data = reactive<any>({
    detail: {},
  });
  const homePreviewMetadataQuery = (metadataId: string | number): void => {
    Spin.show();
    homePreview_metadataQuery({
      metadataId,
    })
      .then((res: any) => {
        dict_data.detail = res.data;
        Spin.hide();
      })
      .catch((error: any) => {
        Spin.hide();
        Message.error(error.message);
      });
  };
  const showDict = (metadataId: string | number): void => {
    dict_modal.show = true;
    homePreviewMetadataQuery(metadataId);
  };
  const DictDetail_visibleChange = (bool: boolean): void => {
    dict_modal.show = bool;
  };

  const close = () => {
    emit("visibleChange", false);
  };
  const router = useRouter();
  const toDetail = (data: any): void => {
    localStorage.setItem(
      "IndexDetail",
      JSON.stringify({
        dict_modal,
      })
    );
    dict_modal.show = false;
    emit("toDetail", data);
    // router.push(`/dataAssets/assetCatalog/tableDetail/${data.warehouseId}`);
  };
  onActivated(() => {
    if (localStorage.getItem("IndexDetail") && props.tabValue == "IndexData") {
      let data: any = localStorage.getItem("IndexDetail") + "";
      data = JSON.parse(data);
      dict_modal.show = data.dict_modal.show;
    }
  });
  onBeforeUnmount(() => {
    localStorage.removeItem("IndexDetail");
  });
  //=======================================================================
</script>

<style scoped lang="scss">
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