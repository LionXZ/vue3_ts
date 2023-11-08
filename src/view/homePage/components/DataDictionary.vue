<template>
  <Row :gutter="20">
    <Col span="6" v-for="el of data.list" :key="el.metadataId">
    <Card bordered style="margin-bottom: 16px">
      <div class="content_explain">
        <div class="name">
          <div class="e_name">
            <h4>英文名称</h4><b>：</b>
            <span @click="showDetail(el)"> {{ el.metadataCode }}</span>
          </div>
          <div class="C_name">
            <h4>中文名称</h4><b>：</b>
            <span> {{ el.metadataName }}</span>
          </div>
        </div>
        <div class="info">
          <div>
            <h4>更新时间</h4><b>：</b>
            <span>{{ el.updateTime }}</span>
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
  <!-- 字典详情 -->
  <DictDetail :modal="modal" :data="data" @visibleChange="DictDetail_visibleChange" @toDetail="toDetail" />
</template>

<script setup lang="ts">
import ViewUIPlus from "view-ui-plus";
const { Spin, Message } = <any>ViewUIPlus;
import {
  homePreview_homeQueryMetadata,
  homePreview_metadataQuery,
} from "@/api/homePage.ts";
import {
  reactive,
  watchEffect,
  watch,
  nextTick,
  defineAsyncComponent,
  onActivated,
  onBeforeUnmount,
} from "vue";
import { useRouter } from "vue-router";
const DictDetail = defineAsyncComponent(() => import("./DictDetail.vue"));
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
  detail: {
    attributeType: "",
  },
});
const emit = defineEmits<{
  (e: "getTotal", val: number): void;
}>();
const homePreviewHomeQueryMetadata = (): void => {
  Spin.show();
  homePreview_homeQueryMetadata({
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
  if (props.tabValue == "DataDictionary") {
    nextTick(() => {
      homePreviewHomeQueryMetadata();
    });
  }
});
watch(
  () => props.currentSearch,
  (newVal: string, oldVal: string) => {
    if (newVal != "") {
      if (props.tabValue == "DataDictionary") {
        nextTick(() => {
          homePreviewHomeQueryMetadata();
        });
      }
    }
  }
);
const changePage = (currentPage: number): void => {
  page.currentPage = currentPage;
  nextTick(() => {
    homePreviewHomeQueryMetadata();
  });
};
const changePageSize = (size: number): void => {
  page.pageSize = size;
  nextTick(() => {
    homePreviewHomeQueryMetadata();
  });
};
//===============================================================
const homePreviewMetadataQuery = (metadataId: string | number): void => {
  Spin.show();
  homePreview_metadataQuery({
    metadataId,
  })
    .then((res: any) => {
      data.detail = res.data;
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
  title: "字典详情",
});
const showDetail = (data: any): void => {
  modal.show = true;
  modal.row = data;
  homePreviewMetadataQuery(data.metadataId);
};
const close = (): void => {
  modal.show = false;
};
const toDetail = (data: any): void => {
  localStorage.setItem(
    "DataDictionary",
    JSON.stringify({
      modal,
    })
  );
  modal.show = false;
  router.push(`/dataAssets/assetCatalog/tableDetail/${data.warehouseId}`);
};
const DictDetail_visibleChange = (bool: boolean): void => {
  modal.show = bool;
};

//=======================================================================
onActivated(() => {
  if (
    localStorage.getItem("DataDictionary") &&
    props.tabValue == "DataDictionary"
  ) {
    let data: any = localStorage.getItem("DataDictionary") + "";
    data = JSON.parse(data);
    modal.show = data.modal.show;
  }
});
onBeforeUnmount(() => {
  localStorage.removeItem("DataDictionary");
});
//=======================================================================
</script>

<style scoped lang="scss">
.tag {
  padding: 5px;
  border: 1px solid #eee;
  border-radius: 3px;
  color: #007bfa;
  cursor: pointer;
  margin-right: 3px;
}
.content_explain {
  .name,
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
  .name {
    margin-bottom: 20px;
  }
}
</style>