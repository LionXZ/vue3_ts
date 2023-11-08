<template>
  <div class="tableDetail">
    <header>
      <p class="back mb-10" @click="back">
        <Icon type="md-arrow-round-back" style="margin-right: 10px" />返回上一页
      </p>
      <h3>表详情信息</h3>
      <h4>
        <Icon type="md-grid" />{{
          info.EssentialInformationAndTableStructure?.linkisWarehouse
            ?.warehouseCode
        }}
      </h4>
      <div class="content mb-10 mt-10">
        <Button type="primary" size="small" style="position: absolute; top: 10px; right: 10px; z-index: 1000" @click="viewSql">查看建表SQL</Button>
        <Row :gutter="20">
          <Col :span="24">
          <Row :gutter="20">
            <Col :span="5">
            <p class="mb-20 content_item">
              <span>中文名称：</span>
              {{ `${info.data?.warehouseName}` }}
              <!-- <EditInput
                    v-model="changeInfo.warehouseName"
                    @change="change_warehouseName"
                  /> -->
            </p>
            </Col>
            <Col :span="4">
            <p class="content_item">
              <span>分层：</span> {{ `${info.data?.tierSuffix}` }}
            </p>
            </Col>
            <Col :span="5">
            <p class="content_item">
              <span>主题域：</span> {{ `${info.data?.subjectName}` }}
            </p>
            </Col>
            <Col :span="4">
            <p class="content_item">
              <span>数据库类型：</span>{{ `${info.data?.databaseStorageTypeName}` }}
            </p>
            </Col>
          </Row>
          </Col>
          <Col :span="24">
          <Row :gutter="20">
            <Col :span="7">
            <p class="content_item">
              <span>表标签：</span>
              <EditSelectMultiple v-model="changeInfo.tagList" :list="info?.tagList" @change="change_tagList" />
            </p>
            </Col>
            <Col :span="7">
            <p class="content_item">
              <span> 负责人：</span>
              <!--                   
                    {{ `${info.data?.principalBy}` }}
                    <Icon
                      type="ios-create-outline"
                      style="
                        margin-left: 5px;
                        font-size: 20px;
                        cursor: pointer;
                      "
                  /> -->
              <EditSelectMultiple v-model="changeInfo.principalBy" :list="info?.principalBy" @change="change_principalBy" />
            </p>
            </Col>
            <Col :span="4">
            <p class="content_item">
              <span> 存储格式：{{ `${info.data?.hiveStorageType}` }}</span>
            </p>
            </Col>
            <Col>
            <p class="content_item">
              <span>DDL最后更新时间：{{ `${info.data?.updateTime}` }}</span>
            </p>
            </Col>
          </Row>
          </Col>
        </Row>
      </div>
    </header>
    <main>
      <Tabs v-model="tabValue" type="card">
        <TabPane v-for="item of tabList.list" :label="item.label" :name="item.name" :key="item.name">
        </TabPane>
      </Tabs>
      <transition name="ease">
        <keep-alive>
          <EssentialInformation v-if="tabValue == 'EssentialInformation'" @change_serviceDescribe="change_serviceDescribe" />
          <TableStructure v-else-if="tabValue == 'TableStructure'" @change_warehouseDetailService_success="change_warehouseDetailService_success" />
          <Consanguinity v-else-if="tabValue == 'Consanguinity'" />
          <DataPreview v-else-if="tabValue == 'DataPreview'" />
          <component v-else :is="currentElementComponent" />
        </keep-alive>
      </transition>
    </main>
  </div>

  <!-- 建表SQL -->
  <Modal v-model="info.viewCreateSql" title="建表SQL">
    <div class="content">
      <Input v-model="createSql" type="textarea" :autosize="{ minRows: 12 }" disabled />
    </div>
    <template v-slot:footer>
      <div>
        <Button type="primary" @click="copy">一键复制</Button>
        <Button @click="info.viewCreateSql = false">关闭</Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import ViewUIPlus from "view-ui-plus";
//Spin 是异步导入 初始化时部分属性不存在 所以初始化调用在nextTick里面使用
const { Spin, Message, Copy } = <any>ViewUIPlus;
import editBox from "@/components/editBox/index.ts";
const { EditInput, EditSelectOne, EditSelectMultiple } = editBox;
import {
  assetCatalog_queryTable,
  assetCatalog_queryTableInfo,
  tableTag_queryTagList,
  listUser,
  assetCatalog_editTable,
} from "@/api/assetCatlog";
import {
  computed,
  onMounted,
  reactive,
  ref,
  provide,
  nextTick,
  watchEffect,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import components from "./components/index";
const { EssentialInformation, TableStructure, DataPreview, Consanguinity } =
  components;
const router = useRouter();
const route = useRoute();
//返回
const back = (): void => {
  router.back();
};
let tabList = reactive({
  list: [
    { label: "基本信息", name: "EssentialInformation" },
    { label: "表结构", name: "TableStructure" },
    { label: "血缘关系", name: "Consanguinity" },
    { label: "数据预览", name: "DataPreview" },
    { label: "变更记录", name: "ChangeRecord" },
  ],
});

let tabValue = ref<string>("EssentialInformation");
watchEffect(() => {
  if (route.params.tabValue) {
    tabValue.value = route.params.tabValue + "";
  }
});
let currentElementComponent = computed(() => {
  return components[tabValue.value];
});
let info: any = reactive({
  viewCreateSql: false,
  warehouseId: route.params.id,
  EssentialInformationAndTableStructure: null,
});
let createSql = computed(() => {
  return info.data?.createSql;
});
const viewSql = (): void => {
  info.viewCreateSql = true;
};
let changeInfo: any = computed({
  get(): any {
    return {
      warehouseName: info.data?.warehouseName || "",
      tagList: info.data?.tagList?.map((e: any) => e.tagId) || [],
      principalBy: info.data?.principalBy?.split(",") || [],
    };
  },
  set(v: string) {},
});
//表详细信息
const assetCatalogQueryTable = (warehouseId: string | number): void => {
  Spin.show();
  assetCatalog_queryTable({
    warehouseId,
  })
    .then((res: any) => {
      info.data = res.data;
      //clickhouse类型没有血缘关系
      if (info.data?.databaseStorageTypeName == "clickhouse") {
        tabList.list = tabList.list.filter((item) => {
          return item.label != "血缘关系";
        });
      }
    })
    .catch((error: any) => {
      Message.error(error.message);
    });
};
//基本信息和表结构
const assetCatalogQueryTableInfo = (warehouseId: string | number): void => {
  Spin.show();
  assetCatalog_queryTableInfo({ warehouseId })
    .then((res: any) => {
      Spin.hide();
      info.EssentialInformationAndTableStructure = res.data;
    })
    .catch((error: any) => {
      Spin.hide();
      Message.error(error.message);
    });
};
//向组件共享
provide("info", info);
//标签列表
const tableTagQueryTagList = (): void => {
  tableTag_queryTagList({})
    .then((res: any) => {
      info.tagList = res.data.map((el: any) => {
        return {
          value: el.tagId,
          label: el.tagName,
        };
      });
    })
    .catch((error: any) => {
      Message.error(error.message);
    });
};
//用户列表
const querylistUser = (): void => {
  listUser({
    userName: "",
    pageSize: 1000000,
    pageNo: 1,
  })
    .then((res: any) => {
      info.principalBy = res.users?.map((el: any) => {
        return {
          value: el.username,
          label: el.username,
        };
      });
    })
    .catch((error: any) => {
      Message.error(error.message);
    });
};
//修改
const assetCatalogEditTable = ({
  principalBy,
  serviceDescribe,
  tagList,
}: any) => {
  Spin.show();
  assetCatalog_editTable({
    warehouseId: info.warehouseId,
    principalBy,
    serviceDescribe,
    tagList,
  })
    .then((res: any) => {
      Spin.hide();
      Message.success("修改成功");
      assetCatalogQueryTable(info.warehouseId);
    })
    .catch((error: any) => {
      Spin.hide();
      Message.error(error.message);
    });
};
//修改中文名
const change_warehouseName = (warehouseName: string): void => {
  console.log(warehouseName);
};

//修改标签列表
const change_tagList = (): void => {
  assetCatalogEditTable({
    tagList: changeInfo.value.tagList,
  });
};
//修改负责人
const change_principalBy = (): void => {
  assetCatalogEditTable({
    principalBy: changeInfo.value.principalBy.join(","),
  });
};
//修改基本信息的业务描述
const change_serviceDescribe = (serviceDescribe: string): void => {
  assetCatalogEditTable({
    serviceDescribe,
  });
};
//修改表结构业务描述成功
const change_warehouseDetailService_success = (): void => {
  assetCatalogQueryTableInfo(info.warehouseId);
};
//=================================================================
onMounted(() => {
  nextTick(() => {
    assetCatalogQueryTable(info.warehouseId);
    assetCatalogQueryTableInfo(info.warehouseId);
    tableTagQueryTagList(); //获取标签列表
    querylistUser(); //获取负责人列表
  });
});
//=================================================================
const copy = () => {
  Copy({
    text: createSql.value,
  });
};
</script>

<style scoped lang="scss">
.tableDetail {
  header {
    position: relative;
    h3 {
      line-height: 30px;
      height: 30px;
      font-size: 20px;
    }
    h4 {
      font-size: 16px;
      margin: 10px 0;
    }
    .back {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: 600;
      position: absolute;
      right: 10px;
    }
    .content {
      padding: 10px;
      position: relative;
      background-color: #eee;
      .content_item {
        display: flex;
        align-items: c;
        > span {
          font-weight: 600;
        }
      }
    }
  }
}
</style>