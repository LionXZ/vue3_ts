<template>
  <div class="homePage">
    <header :class="{ pdt116: !showResult }">
      <div class="title">
        <h2>
          <img src="@/assets/system.png" alt="" />
          <p>数据地图</p>
        </h2>
      </div>
      <div class="search">
        <div class="search_content">
          <Row>
            <Col span="24">
            <Input clearable v-model="search" placeholder="输入需要查找的数据关键字信息" size="large" @on-clear="click_reset">
            </Input>
            <Button icon="md-search" type="primary" @click="click_search">搜索</Button>
            </Col>
            <!-- <Col span="6"
              ><div class="form_operation">
                <Button
                  icon="md-search"
                  size="large"
                  type="primary"
                  @click="click_search"
                  style="background: #169bd5"
                  >检索</Button
                >
                <Button icon="md-refresh" size="large" @click="click_reset"
                  >重置</Button
                >
              </div>
            </Col> -->
          </Row>
        </div>
      </div>
      <transition name="fade">
        <div class="Recent" v-show="!showResult">
          <div class="Recent_content">
            <h3>最近检索：</h3>
            <div v-show="querySearchLog.list.length > 0">
              <span v-for="(e, i) of querySearchLog.list" :key="e.searchId + i" @click="click_recent_search(e.searchName)">{{ e.searchName }}</span>
            </div>
          </div>
        </div>
      </transition>
      <div class="default" v-show="!showResult">
        <img src="../../assets/default.png" alt="" />
      </div>
    </header>

    <!-- 主体内容 -->
    <main v-show="showResult">
      <div class="main_content" v-if="showTabs">
        <transition name="fade">
          <Tabs v-model="tabValue" class="main_content_tabs">
            <TabPane :label="`${el.label}（${tabs.total[el.name + 'Total']}）`" :name="el.name" v-for="el of currentTabList" :key="el.name">
            </TabPane>
          </Tabs>
        </transition>
        <div>
          <transition name="ease">
            <DataTable v-if="tabValue == 'DataTable'" :currentSearch="currentSearch" :tabValue="tabValue" @getTotal="DataTable_getTotal" />
            <DataDictionary v-else-if="tabValue == 'DataDictionary'" :currentSearch="currentSearch" :tabValue="tabValue" @getTotal="DataDictionary_getTotal" />
            <IndexData v-else-if="tabValue == 'IndexData'" :currentSearch="currentSearch" :tabValue="tabValue" @getTotal="IndexData_getTotal" />
            <DataField v-else-if="tabValue == 'DataField'" :currentSearch="currentSearch" :tabValue="tabValue" @getTotal="DataField_getTotal" />
            <SubjectDomain v-else :currentSearch="currentSearch" :tabValue="tabValue" @getTotal="SubjectDomain_getTotal" />
          </transition>
        </div>
      </div>
      <div class="empty" v-show="!showTabs">
        <img src="../../assets/no-data.gif" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  homePreview_homeQuery,
  homePreview_querySearchLog,
} from "@/api/homePage.ts";
import { reactive, ref, onMounted, provide, watch, computed } from "vue";
import ViewUIPlus from "view-ui-plus";
const { Spin, Message } = <any>ViewUIPlus;
import components from "./components/index.ts";
const { DataTable, DataDictionary, IndexData, DataField, SubjectDomain } =
  components;
let search = ref<string>("");
let currentSearch = ref<string>("");
let searchInfo = reactive<any>({});
let showResult = ref<boolean>(false);
let querySearchLog: any = reactive({
  list: [],
});
let tabValue = ref<string>("DataTable");
let tabs: any = reactive({
  list: [
    {
      label: "数据表",
      name: "DataTable",
      index: 0,
    },
    {
      label: "数据字典",
      name: "DataDictionary",
      index: 1,
    },
    {
      label: "指标",
      name: "IndexData",
      index: 2,
    },
    {
      label: "字段",
      name: "DataField",
      index: 3,
    },
    {
      label: "主题域",
      name: "SubjectDomain",
      index: 4,
    },
  ],
  total: {
    DataTableTotal: 0,
    DataDictionaryTotal: 0,
    IndexDataTotal: 0,
    DataFieldTotal: 0,
    SubjectDomainTotal: 0,
  },
});
//当前有数据的tab
let currentTabList = computed(() => {
  return tabs.list
    .filter((el: any) => {
      return tabs.total[el.name + "Total"] > 0;
    })
    .sort((a: any, b: any) => a.index - b.index);
});
//是否展示tab
let showTabs = computed(() => {
  return (
    tabs.total.DataTableTotal > 0 ||
    tabs.total.DataDictionaryTotal > 0 ||
    tabs.total.IndexDataTotal > 0 ||
    tabs.total.DataFieldTotal > 0 ||
    tabs.total.SubjectDomainTotal > 0
  );
});
// 判断字符串是否包含中文
function hasChinese(str: string) {
  return /[\u4E00-\u9FA5]+/g.test(str);
}
//点击搜索
const click_search = (): void => {
  if (!search.value) {
    Message.warning({
      content: "请输入您要搜索的关键字",
      duration: 1,
      background: true,
    });
    return;
  }
  if (search.value.length < 4 && !hasChinese(search.value)) {
    Message.warning("至少需要输入四个字符才开始进行检索");
    return;
  }
  showResult.value = true;
  currentSearch.value = search.value;
  homePreviewHomeQuery(search.value);
};
//重置
const click_reset = (): void => {
  showResult.value = false;
  search.value = "";
  currentSearch.value = "";
  tabValue.value = "DataTable";
  localStorage.removeItem("IndexData");
  localStorage.removeItem("DataDictionary");
  homePreviewQuerySearchLog();
};
//点击最近搜索
const click_recent_search = (e: string): void => {
  showResult.value = true;
  search.value = e;
  currentSearch.value = e;
  homePreviewHomeQuery(e);
};
//检索
const homePreviewHomeQuery = (queryString: string): void => {
  Spin.show();
  homePreview_homeQuery({
    queryString: queryString,
  })
    .then((res: any) => {
      searchInfo = res.data;
      tabs.total.DataTableTotal = res.data?.dataTableNumber;
      tabs.total.DataDictionaryTotal = res.data?.dataMetadataNumber;
      tabs.total.IndexDataTotal = res.data?.dataCriterionNumber;
      tabs.total.DataFieldTotal = res.data?.dataTableDetailNumber;
      tabs.total.SubjectDomainTotal = res.data?.dataSubjectNumber;
      tabValue.value = tabs.total.DataTableTotal
        ? "DataTable"
        : tabs.total.DataDictionaryTotal
        ? "DataDictionary"
        : tabs.total.IndexDataTotal
        ? "IndexData"
        : tabs.total.DataFieldTotal
        ? "DataField"
        : "SubjectDomain";
      Spin.hide();
    })
    .catch((error: any) => {
      Spin.hide();
      Message.error(error.message);
    });
};
//获取最近搜索
const homePreviewQuerySearchLog = (): void => {
  querySearchLog.list = [];
  homePreview_querySearchLog({})
    .then((res: any) => {
      querySearchLog.list = res.data.slice(0, 5);
    })
    .catch((error: any) => {
      Message.error(error.message);
    });
};
//获取total
let DataTableTotal = ref<number>(0);
const DataTable_getTotal = (total: number): void => {
  //  DataTableTotal.value = total;
};
let DataDictionaryTotal = ref<number>(0);
const DataDictionary_getTotal = (total: number): void => {
  //  DataDictionaryTotal.value = total;
};
let IndexDataTotal = ref<number>(0);
const IndexData_getTotal = (total: number): void => {
  // IndexDataTotal.value = total;
};
let DataFieldTotal = ref<number>(0);
const DataField_getTotal = (total: number): void => {
  //   DataFieldTotal.value = total;
};
let SubjectDomainTotal = ref<number>(0);
const SubjectDomain_getTotal = (total: number): void => {
  //   SubjectDomainTotal.value = total;
};
onMounted(() => {
  homePreviewQuerySearchLog();
});
</script>

<style lang="scss" scoped>
:deep(.main_content_tabs) {
  .ivu-tabs-bar {
    .ivu-tabs-nav-container {
      .ivu-tabs-nav-wrap {
        .ivu-tabs-nav-scroll {
          .ivu-tabs-nav {
            .ivu-tabs-ink-bar {
              background-color: #1895b8 !important;
            }
            .ivu-tabs-tab-active {
              color: #1895b8 !important;
            }
          }
        }
      }
    }
  }
}
:deep(.ivu-input) {
  border-radius: 20px 0 0 20px;
}
:deep(.ivu-input-search) {
  border-radius: 20px;
}
:deep(.ivu-btn) {
  border-radius: 20px;
}
.homePage {
  header {
    transition-property: padding;
    transition-duration: 0.5s;
    &.pdt116 {
      padding-top: 80px !important;
    }
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    h2 {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60%;
      line-height: 40px;
      font-size: 40px;
      margin-bottom: 20px;
      color: #aaaaaa;
      img {
        width: 48px;
        margin-right: 30px;
      }
    }
  }
  .search {
    display: flex;
    justify-content: center;
    position: relative;
    .search_content {
      width: 60%;
      text-align: center;
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
      :deep(.ivu-input-icon-clear) {
        top: 5px;
        right: 110px;
      }
    }
  }
  .default {
    margin-top: 60px;
    display: flex;
    justify-content: center;
    > img {
      width: 700px;
    }
  }
  .Recent {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    //   align-items: center;
    //   flex-direction: column;
    .Recent_content {
      width: 60%;
      display: flex;
      align-items: center;
      justify-content: center;
      > div {
        display: flex;
        align-items: center;
        justify-content: start;
        flex-wrap: wrap;
        //   flex: 1;
        > span {
          color: #169bd5;
          margin-right: 40px;
          cursor: pointer;
        }
      }
    }
  }
  main {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    .main_content {
      width: 100%;
      .left_menu {
        min-height: 300px;
        background-color: #eee;
        line-height: 40px;
        > li {
          list-style: none;
          padding-left: 30px;
          cursor: pointer;
          &.active {
            color: #169bd5;
          }
        }
        > li:hover {
          background-color: #aaa;
        }
      }
    }
    .empty {
      display: flex;
      justify-content: center;
      height: 500px;
    }
  }
}
</style>