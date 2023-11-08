<template>
  <Row :gutter="20">
    <Col span="6" v-for="el of data.list" :key="el.categoryId">
    <Card bordered style="margin-bottom: 16px">
      <template v-slot:title>
        <h4 class="title">
          <span @click="showDetail(el)">{{ `${el.criterionName}（${el.criterionCode}）` }}</span>
          <span>指标名称</span>
        </h4>
      </template>
      <div class="content_explain">
        <div class="info">
          <div>
            <h4>指标性质</h4><b>：</b>
            <span> {{ el.criterionProperty }}</span>
          </div>
        </div>
        <div class="info">
          <div>
            <h4>指标业务口径</h4><b>：</b>
            <span> </span>
          </div>
        </div>
        <div class="info">
          <div>
            <h4>更新时间</h4><b>：</b>
            <span> {{ el.updateTime }}</span>
          </div>
        </div>
        <div class="info">
          <div>
            <h4>创建人</h4><b>：</b>
            <span> {{ el.createBy }}</span>
          </div>
        </div>
      </div>
    </Card>
    </Col>
  </Row>
  <div class="table_page">
    <Page :total="page.total" :current="page.currentPage" :page-size="page.pageSize" :page-size-opts="page.pageSizeOpts" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-total show-sizer></Page>
  </div>
  <IndexDetail :modal="modal" :data="data" :tabValue="props.tabValue" @visibleChange="IndexDetail_visibleChange" @toDetail="toDetail" @change_category="change_category" />
</template>

<script setup lang="ts">
import ViewUIPlus from "view-ui-plus";
const { Spin, Message } = <any>ViewUIPlus;
import {
  homePreview_homeQueryCriterion,
  homePreview_criterionQuery,
} from "@/api/homePage.ts";
import {
  reactive,
  watchEffect,
  watch,
  nextTick,
  ref,
  defineAsyncComponent,
  onBeforeUnmount,
  onActivated,
} from "vue";
import { useRouter } from "vue-router";
const IndexDetail = defineAsyncComponent(() => import("./IndexDetail.vue"));
const router = useRouter();
interface Props {
  currentSearch: string;
  tabValue: string;
}
const props = withDefaults(defineProps<Props>(), {
  currentSearch: "",
  tabValue: "",
});
interface Page {
  total: number; // 总页数
  currentPage: number; // 当前页数
  pageSize: number; // 每页显示多少条,
  pageSizeOpts?: number[];
}
let page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 12, // 每页显示多少条,
  pageSizeOpts: [12, 24, 36],
});
let data = reactive<any>({
  list: [],
  detail: {},
});
const emit = defineEmits<{
  (e: "getTotal", val: number): void;
}>();
const homePreviewHomeQueryCriterion = (): void => {
  Spin.show();
  homePreview_homeQueryCriterion({
    current: page.currentPage,
    size: page.pageSize,
    queryString: props.currentSearch,
  })
    .then((res: any) => {
      emit("getTotal", res.data.total);
      page.total = res.data.total;
      data.list = res.data.list;
      Spin.hide();
    })
    .catch((error: any) => {
      Spin.hide();
      Message.error(error.message);
    });
};
watchEffect(() => {
  if (props.tabValue == "IndexData") {
    nextTick(() => {
      homePreviewHomeQueryCriterion();
    });
  }
});

watch(
  () => props.currentSearch,
  (newVal: string, oldVal: string) => {
    if (newVal != "") {
      if (props.tabValue == "IndexData") {
        nextTick(() => {
          homePreviewHomeQueryCriterion();
        });
      }
    }
  }
);
const changePage = (currentPage: number): void => {
  page.currentPage = currentPage;
  nextTick(() => {
    homePreviewHomeQueryCriterion();
  });
};
const changePageSize = (size: number): void => {
  page.pageSize = size;
  nextTick(() => {
    homePreviewHomeQueryCriterion();
  });
};
//===============================================================
const homePreviewCriterionQuery = (criterionId: string | number): void => {
  Spin.show();
  homePreview_criterionQuery({
    criterionId,
  })
    .then((res: any) => {
      data.detail = {
        ...res.data,
        dataJsonList: JSON.parse(res.data.dataJson),
        quotaJsonList: JSON.parse(res.data.quotaJson),
      };
      Spin.hide();
    })
    .catch((error: any) => {
      Spin.hide();
      Message.error(error.message);
    });
};
interface Modal {
  show: boolean;
  title?: string;
  operation?: string;
  content?: string;
  row?: Object;
}
let modal: Modal = reactive({
  show: false,
  title: "指标详情",
});
const showDetail = (data: any): void => {
  modal.show = true;
  modal.row = data;
  homePreviewCriterionQuery(data.criterionId);
};
const close = (): void => {
  modal.show = false;
};
const IndexDetail_visibleChange = (bool: boolean): void => {
  modal.show = bool;
};
const change_category = (criterionId: string | number): void => {
  // homePreviewCriterionQuery(criterionId);
};
//================================================================
const toDetail = (data: any): void => {
  localStorage.setItem(
    "IndexData",
    JSON.stringify({
      modal,
    })
  );
  modal.show = false;
  router.push(`/dataAssets/assetCatalog/tableDetail/${data.warehouseId}`);
};
//=======================================================================
onActivated(() => {
  if (localStorage.getItem("IndexData") && props.tabValue == "IndexData") {
    let data: any = localStorage.getItem("IndexData") + "";
    data = JSON.parse(data);
    modal.show = data.modal.show;
  }
});
onBeforeUnmount(() => {
  localStorage.removeItem("IndexData");
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
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  span:first-child {
    color: #168aa3;
  }
  span:last-child {
    font-weight: 300;
    color: #000;
  }
}

.content_explain {
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    h4 {
      width: 70px;
      text-align: justify;
      text-align-last: justify;
    }
    > div {
      display: flex;
      width: 100%;
      > span,
      p {
        color: #e4551b;
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .e_name {
      span {
        color: #3d9cbb;
        cursor: pointer;
      }
    }
  }
}
</style>