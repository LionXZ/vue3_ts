<template>
  <Row :gutter="20">
    <Col span="6" v-for="el of data.list" :key="el.warehouseDetailId">
    <Card bordered style="margin-bottom: 16px">
      <div class="content_explain">
        <div class="info">
          <div>
            <h4>字段名称</h4><b>：</b>
            <span style="color: #e4551b; cursor: pointer" @click="toDetail(el, 'TableStructure')">
              {{ el.warehouseDetailCode }}</span>
          </div>
        </div>
        <div class="info">
          <div>
            <h4>字段类型</h4><b>：</b>
            <span> {{ el.detailName }}</span>
          </div>
        </div>
        <div class="info">
          <div>
            <h4>所属表</h4><b>：</b>
            <span style="color: #1895b8; cursor: pointer" @click="toDetail(el)">
              <Ellipsis :text="el.warehouseCode" :lines="1" tooltip />
            </span>
          </div>
        </div>
        <div class="info">
          <div>
            <h4>描述</h4><b>：</b>
            <p>{{ el.warehouseDetailService }}</p>
          </div>
        </div>
      </div>
    </Card>
    </Col>
  </Row>

  <div class="table_page">
    <Page :total="page.total" :current="page.currentPage" :page-size="page.pageSize" :page-size-opts="page.pageSizeOpts" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-total show-sizer></Page>
  </div>
</template>

<script setup lang="ts">
import ViewUIPlus from "view-ui-plus";
const { Spin, Message } = <any>ViewUIPlus;
import { homePreview_homeQueryDetail } from "@/api/homePage.ts";
import { reactive, watchEffect, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
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
});
const emit = defineEmits<{
  (e: "getTotal", val: number): void;
}>();
const homePreviewHomeQueryDetail = (): void => {
  Spin.show();
  homePreview_homeQueryDetail({
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
  if (props.tabValue == "DataField") {
    nextTick(() => {
      homePreviewHomeQueryDetail();
    });
  }
});
watch(
  () => props.currentSearch,
  (newVal: string, oldVal: string) => {
    if (newVal != "") {
      if (props.tabValue == "DataField") {
        nextTick(() => {
          homePreviewHomeQueryDetail();
        });
      }
    }
  }
);
const changePage = (currentPage: number): void => {
  page.currentPage = currentPage;
  nextTick(() => {
    homePreviewHomeQueryDetail();
  });
};
const changePageSize = (size: number): void => {
  page.pageSize = size;
  nextTick(() => {
    homePreviewHomeQueryDetail();
  });
};
const toDetail = (data: any, tabValue: string): void => {
  if (tabValue) {
    router.push(
      `/dataAssets/assetCatalog/tableDetail/${data.warehouseId}/${tabValue}`
    );
  } else {
    router.push(`/dataAssets/assetCatalog/tableDetail/${data.warehouseId}`);
  }
};
</script>


<style scoped lang="scss">
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