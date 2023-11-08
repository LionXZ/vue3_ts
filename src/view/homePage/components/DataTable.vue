<template>
  <Row :gutter="20">
    <Col span="6" v-for="el of data.list" :key="el.warehouseId">
    <Card bordered style="margin-bottom: 16px">
      <template v-slot:title>
        <h4 class="title" @click="toDetail(el)" v-line-clamp="1">
          <img src="../../../assets/tableIcon.png" alt="" />
          <span>
            <Ellipsis :text="el.warehouseCode" :lines="1" tooltip />
          </span>
        </h4>
      </template>
      <div class="content_explain">
        <div class="info">
          <div>
            <h4>主题域</h4><b>：</b>
            <span>{{ el.subjectName }}</span>
          </div>
        </div>
        <div class="info">
          <div>
            <h4>标签</h4><b>：</b>
            <p v-if="el.tagList">
              {{el.tagList.map((el)=>{return el.tagName}).join('，')}}
            </p>
          </div>
          <!-- <div class="list">
            <span v-line-clamp="1" v-for="item of el.tagList" :key="item.tagId">
              <Ellipsis :text="item.tagName" :lines="1" tooltip />
            </span>
          </div> -->
        </div>
        <div class="info">
          <div>
            <h4>表描述</h4><b>：</b>
            <span>{{ el.serviceDescribe }}</span>
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
            <h4>负责人</h4><b>：</b>
            <span>{{ el.principalBy }}</span>
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
import { homePreview_homeQueryTable } from "@/api/homePage.ts";
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
const homePreviewHomeQueryTable = (): void => {
  Spin.show();
  homePreview_homeQueryTable({
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
  if (props.tabValue == "DataTable") {
    nextTick(() => {
      homePreviewHomeQueryTable();
    });
  }
});
watch(
  () => props.currentSearch,
  (newVal: string, oldVal: string) => {
    if (newVal != "") {
      if (props.tabValue == "DataTable") {
        nextTick(() => {
          homePreviewHomeQueryTable();
        });
      }
    }
  }
);
const changePage = (currentPage: number): void => {
  page.currentPage = currentPage;
  nextTick(() => {
    homePreviewHomeQueryTable();
  });
};
const changePageSize = (size: number): void => {
  page.pageSize = size;
  nextTick(() => {
    homePreviewHomeQueryTable();
  });
};
const toDetail = (data: any): void => {
  router.push(`/dataAssets/assetCatalog/tableDetail/${data.warehouseId}`);
};
</script>

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  color: #168aa3;
  > img {
    width: 20px;
    margin-right: 10px;
  }
}
.list {
  flex: 1;
  display: flex;
  > span {
    margin-right: 3px;
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