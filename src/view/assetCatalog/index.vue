<template>
  <div class="assetCatalog">
    <header>
      <div class="search">
        <div class="search_content">
          <Row>
            <Col span="24">
            <Input clearable v-model="queryString" placeholder="输入表名、表描述、字段名、字段描述等关键字" @on-clear="handleOnClear" />
            <Button icon="md-search" type="primary" @click="click_search">搜索</Button>
            </Col>
            <!-- <Col span="8">
            <Button icon="md-search" type="primary" @click="click_search">搜索</Button>
            </Col> -->
          </Row>
        </div>
      </div>
      <div class="searchRadio">
        <div class="searchRadio_item">
          <h4>数仓分层：</h4>
          <div class="searchRadio_item_content">
            <RadioGroup v-model="searchInfo.tierId" size="small">
              <Radio label="" border>全部</Radio>
              <Radio :label="el.tierId" border v-for="el of data.headData?.tierList" :key="el.tierId">{{ el.tierName }}</Radio>
            </RadioGroup>
          </div>
        </div>
        <div class="searchRadio_item">
          <h4>主题域：</h4>
          <div class="searchRadio_item_content">
            <transition name="slide-down">
              <RadioGroup v-model="searchInfo.subjectId" size="small" v-show="!data.showAllSubject">
                <Radio label="" border>全部</Radio>
                <Radio :label="el.subjectId" border v-for="el of data.headData?.subjectList.slice(0, 8)" :key="el.subjectId">{{ el.subjectName }}</Radio>
              </RadioGroup>
            </transition>
            <transition name="slide-up">
              <RadioGroup v-model="searchInfo.subjectId" size="small" v-show="data.showAllSubject">
                <Radio label="" border>全部</Radio>
                <Radio :label="el.subjectId" border v-for="el of data.headData?.subjectList" :key="el.subjectId">{{ el.subjectName }}</Radio>
              </RadioGroup>
            </transition>
          </div>
          <div>
            <Button icon="ios-arrow-down" type="text" v-show="!data.showAllSubject" @click="data.showAllSubject = true">更多</Button>
            <Button icon="ios-arrow-up" type="text" v-show="data.showAllSubject" @click="data.showAllSubject = false">收起</Button>
          </div>
        </div>

        <div class="searchRadio_item">
          <h4>数据库类型：</h4>
          <div class="searchRadio_item_content">
            <RadioGroup v-model="searchInfo.storageTypeId" size="small">
              <Radio label="" border>全部</Radio>
              <Radio :label="el.storageTypeId" border v-for="el of data.headData?.storageTypeList" :key="el.storageTypeId">{{ el.storageTypeName }}</Radio>
            </RadioGroup>
          </div>
        </div>

        <div class="searchRadio_item">
          <h4>数据表标签：</h4>
          <div class="searchRadio_item_content">
            <transition name="slide-down">
              <RadioGroup v-model="searchInfo.tagId" size="small" v-show="!data.showAllTable">
                <Radio label="" border>全部</Radio>
                <Radio :label="el.tagId" border v-for="el of data.headData?.tagList.slice(0, 8)" :key="el.tagId">{{ el.tagName }}</Radio>
              </RadioGroup>
            </transition>
            <transition name="slide-down">
              <RadioGroup v-model="searchInfo.tagId" size="small" v-show="data.showAllTable">
                <Radio label="" border>全部</Radio>
                <Radio :label="el.tagId" border v-for="el of data.headData?.tagList" :key="el.tagId">{{ el.tagName }}</Radio>
              </RadioGroup>
            </transition>
          </div>
          <div>
            <Button icon="ios-arrow-down" type="text" v-show="!data.showAllTable" @click="data.showAllTable = true">更多</Button>
            <Button icon="ios-arrow-up" type="text" v-show="data.showAllTable" @click="data.showAllTable = false">收起</Button>
          </div>
        </div>
      </div>
    </header>
    <main>
      <Row :gutter="20" style="padding: 0 10px;display: grid;grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));gap: 20px;">
        <div v-for="el of data.tableList" :key="el.warehouseId">
          <Card :bordered="false" style="margin-bottom: 0px">
            <template v-slot:title>
              <h4 class="title" @click="toDetail(el)">
                <img src="../../assets/tableIcon.png" alt="" />
                <div :title="el.warehouseCode" style="flex: 1;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{el.warehouseCode}}</div>
                <!-- <span>
                <Ellipsis :text="el.warehouseCode" :lines="1" tooltip />
              </span> -->
              </h4>
            </template>
            <div class="content_explain">
              <div class="info">
                <div>
                  <h4>主题域：</h4>
                  <span> {{ el.subjectName }}</span>
                </div>
              </div>
              <div class="info">
                <h4>标签：</h4>
                <!-- <span v-for="e of el.tagList" :key="e.tagId">{{ e.tagName }}</span> -->
                <span v-if="el.tagList" :title="el.tagList.map((el)=>{return el.tagName}).join('，')" style="flex: 1; text-align: right; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{el.tagList.map((el)=>{return el.tagName}).join('，')}}</span>
              </div>
              <div class="info">
                <h4>表描述：</h4>
                <!-- <span> {{ el.serviceDescribe }}</span> -->
                <span v-if="el.serviceDescribe" :title="el.serviceDescribe" style="flex: 1; text-align: left; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{el.serviceDescribe}}</span>
              </div>
              <div class="info">
                <div>
                  <h4>更新时间：</h4>
                  <span> {{ el.updateTime }}</span>
                </div>
              </div>
              <div class="info">
                <div>
                  <h4>负责人：</h4>
                  <span> {{ el.principalBy }}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Row>

      <div class="table_page">
        <Page :total="page.total" :current="page.currentPage" :page-size="page.pageSize" :page-size-opts="page.pageSizeOpts" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-total show-sizer></Page>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import ViewUIPlus from "view-ui-plus";
const { Spin, Message } = <any>ViewUIPlus;
import {
  assetCatalog_queryCatalog,
  assetCatalog_queryTablePageList,
} from "@/api/assetCatlog";
import { onMounted, reactive, ref, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
let queryString = ref<string>("");

// 判断字符串是否包含中文
function hasChinese(str: string) {
  return /[\u4E00-\u9FA5]+/g.test(str);
}
const handleOnClear = (): void => {
  assetCatalogQueryTablePageList({
    ...searchInfo,
    queryString: "",
  });
};
const click_search = (): void => {
  if (queryString.value.length < 4 && !hasChinese(queryString.value)) {
    Message.warning("至少需要输入四个字符才开始进行检索");
    return;
  }
  assetCatalogQueryTablePageList({
    ...searchInfo,
    queryString: queryString.value,
  });
};
let searchInfo = reactive({
  tierId: "",
  subjectId: "",
  storageTypeId: "",
  tagId: "",
});
let data = reactive({
  headData: null,
  tableList: [],
  showAllSubject: false,
  showAllTable: false,
});

interface Page {
  total: number; // 总页数
  currentPage: number; // 当前页数
  pageSize: number; // 每页显示多少条,
  pageSizeOpts?: number[];
}
let page: Page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 12, // 每页显示多少条,
  pageSizeOpts: [12, 24, 36],
});
const changePage = (current: number): void => {
  page.currentPage = current;
  assetCatalogQueryTablePageList({
    ...searchInfo,
    queryString: queryString.value,
  });
};
const changePageSize = (size: number): void => {
  page.pageSize = size;
  assetCatalogQueryTablePageList({
    ...searchInfo,
    queryString: queryString.value,
  });
};
const router = useRouter();
const toDetail = (data: any): void => {
  router.push(`/dataAssets/assetCatalog/tableDetail/${data.warehouseId}`);
};
//获取导航目录
const assetCatalogQueryCatalog = (): void => {
  // Spin.show();
  assetCatalog_queryCatalog({})
    .then((res: any) => {
      data.headData = res.data;
    })
    .catch((error: any) => {
      Message.error(error.message);
    });
};
//检索
const assetCatalogQueryTablePageList = ({
  queryString,
  tierId,
  subjectId,
  storageTypeId,
  tagId,
}: any): void => {
  Spin.show();
  assetCatalog_queryTablePageList({
    queryString,
    tierId,
    subjectId,
    storageTypeId,
    tagId,
    size: page.pageSize,
    current: page.currentPage,
  })
    .then((res: any) => {
      Spin.hide();
      data.tableList = res.data.list;
      page.total = res.data.total;
    })
    .catch((error: any) => {
      Spin.hide();
      Message.error(error.message);
    });
};

watch(searchInfo, (newVal, oldVal) => {
  assetCatalogQueryTablePageList({
    ...searchInfo,
    queryString: queryString.value,
  });
});
//=================================================================================================
onMounted(() => {
  assetCatalogQueryCatalog();
  nextTick(() => {
    assetCatalogQueryTablePageList({
      ...searchInfo,
      queryString: queryString.value,
    });
  });
});
//=================================================================================================
</script>

<style scoped lang="scss">
:deep(.ivu-radio-wrapper) {
  margin-bottom: 10px;
}
.assetCatalog {
  header {
    .search {
      display: flex;
      justify-content: center;
      .search_content {
        width: 100%;
        position: relative;
        :deep(.ivu-input) {
          height: 50px;
          border-radius: 25px;
          padding: 0px 110px 0px 30px;
        }
        :deep(.ivu-btn) {
          position: absolute;
          right: 5px;
          top: 5px;
          height: 40px;
          width: 100px;
          border-radius: 20px;
        }
      }
    }
    .searchRadio {
      margin: 30px 20px;
      .searchRadio_item {
        // margin-top: 10px;
        display: flex;
        //   align-items: center;
        h4 {
          font-size: 16px;
          width: 120px;
        }
        .searchRadio_item_content {
          flex: 1;
        }
      }
    }
  }
  main {
    :deep(.ivu-card) {
      background-color: #f7f8fc;
      border-radius: 8px;
      &:hover {
        box-shadow: 20px 20px 36px 0px rgba(156, 159, 163, 0.34);
      }
      .ivu-card-head {
        // border-bottom: 0px;
      }
      .ivu-card-body {
        // padding: 5px 16px 16px;
      }
    }
    .title {
      display: flex;
      align-items: center;
      cursor: pointer;
      // color: #168aa3;
      color: #000c2b;
      font-size: 18px;
      > img {
        display: none;
        width: 20px;
        margin-right: 10px;
      }
    }

    .content_explain {
      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        color: #7f8388;
        > div {
          display: flex;
        }
        h4 {
          font-weight: 400;
        }
        span {
          font-weight: 600;
        }
        .e_name {
          span {
            color: #3d9cbb;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>