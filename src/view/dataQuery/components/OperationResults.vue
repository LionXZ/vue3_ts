<template>
  <div class="download">
    <Poptip title="选择下载参数" placement="right" width="360">
      <Button type="primary" icon="md-download" @click="resultDownload"
        >结果导出</Button
      >
      <template #content>
        <div>
          <span>请选择下载格式：</span>
          <RadioGroup v-model="formItem.splitor">
            <Radio label="csv">csv</Radio>
            <Radio label="xlsx">Excel</Radio>
          </RadioGroup>
        </div>

        <div>
          <span>请选择编码：</span>
          <RadioGroup v-model="formItem.charset">
            <Radio label="utf-8">utf-8</Radio>
            <Radio label="gbk">gbk</Radio>
          </RadioGroup>
        </div>
        <div>
          <span>请选择替换空值：</span>
          <RadioGroup v-model="formItem.nullValue">
            <Radio label="NULL">NULL</Radio>
            <Radio label="BLANK">BLANK</Radio>
          </RadioGroup>
        </div>
        <div class="form_operation">
          <!-- <Button @click="cancel" size="small">取消</Button> -->
          <Button type="primary" @click="handleSubmit" size="small"
            >确定</Button
          >
        </div>
      </template>
    </Poptip>
  </div>
  <Table :columns="tableData.columns" :data="showData"></Table>
  <div class="table_page">
    <Page
      :total="page.total"
      :current="page.currentPage"
      :page-size="page.pageSize"
      :page-size-opts="page.pageSizeOpts"
      @on-change="changePage"
      @on-page-size-change="changePageSize"
      show-elevator
      show-total
      show-sizer
    ></Page>
  </div>
</template>

<script setup lang="ts">
  import moment from "moment";
  import ViewUIPlus from "view-ui-plus";
  const { Message } = ViewUIPlus;
  import axios from "axios";
  import {
    computed,
    reactive,
    watchEffect,
    watch,
    onMounted,
    ref,
    nextTick,
  } from "vue";

  interface Props {
    name: string;
    currentResult: any;
    task: any;
    historicalQuery: any;
  }
  const props = withDefaults(defineProps<Props>(), {
    name: "",
    task: null,
    currentResult: {
      metadata: [],
      fileContent: [],
    },
    historicalQuery: [],
  });
  let tableData = reactive({
    columns: [],
    data: [],
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
    pageSize: 10, // 每页显示多少条,
    pageSizeOpts: [10, 20, 30, 50, 100],
  });
  let showData = computed(() => {
    return tableData.data.slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize
    );
  });
  const changePage = (currentPage: number): void => {
    page.currentPage = currentPage;
  };
  const changePageSize = (size: number): void => {
    page.pageSize = size;
  };

  const getData = (): void => {
    if (props.currentResult.metadata && props.currentResult.metadata.length > 0) {
      tableData.columns = props.currentResult.metadata.map((el: any) => {
        return {
          title: el.columnName,
          key: el.columnName,
          sortable: true,
          minWidth: 200,
          tooltip: true,
        };
      });
      let data = <any>[];
      props.currentResult.fileContent.forEach((el: any) => {
        let obj = {};
        props.currentResult.metadata.forEach((item: any, index: number) => {
          obj[item.columnName] = el[index];
        });
        data.push(obj);
      });
      tableData.data = data;
      page.total = data.length;
    } else {
      tableData.data = [];
    }
  };
  //   onMounted(() => {
  //     getData();
  //   });

  //   watch(props.currentResult.metadata, (newVal: any) => {
  //     getData();
  //   });
  watchEffect(() => {
    getData();
  });

  let formItem = reactive({
    splitor: "csv",
    charset: "utf-8",
    nullValue: "NULL",
  });
  let poptip_visible = ref<boolean>(false);
  const handleSubmit = (): void => {
    if (props.historicalQuery.length <= 0) {
      Message.error("请先进行相关数据查询！");
      return;
    }
    if (tableData.data && !tableData.data.length) {
      Message.error("暂无查询结果，无法导出！");
      return;
    }
    const { splitor, charset, nullValue } = formItem;
    let apiPath = `filesystem/resultsetToExcel`;
    let temPath = `${props.task.resultLocation}/_0.dolphin`;
    const timestamp = moment.unix(moment().unix()).format("MMDDHHmm");
    const filename = `Result_${props.name}_${timestamp}`;
    let url =
      `http://${window.location.host}/api/rest_j/v1/` +
      apiPath +
      "?path=" +
      temPath +
      "&charset=" +
      charset +
      "&outputFileType=" +
      splitor +
      "&nullValue=" +
      nullValue +
      "&outputFileName=" +
      filename;
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}.${splitor == "csv" ? "csv" : "xlsx"}`
    );
    const evObj = document.createEvent("MouseEvents");
    evObj.initMouseEvent(
      "click",
      true,
      true,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      true,
      false,
      0,
      null
    );
    const flag = link.dispatchEvent(evObj);
    nextTick(() => {
      if (flag) {
        Message.success("下载成功，请到本地的download文件夹查看！");
      }
    });
  };
  const resultDownload = (): void => {};
</script>

<style scoped lang="scss">
  .download {
    margin: 10px 0;
  }
</style>