<template>
  <div class="collectionTaskManagement">
    <header>
      <Form :model="FormData">
        <Row :gutter="20">
          <Col span="6">
            <FormItem
              prop="warehouseCode"
              label="数据源类型："
              :label-width="140"
            >
              <Select v-model="FormData.warehouseCode">
                <Option v-for="item in 5" :value="item" :key="item">{{
                  item
                }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem
              prop="warehouseCode"
              label="运行状态："
              :label-width="140"
            >
              <Select v-model="FormData.warehouseCode">
                <Option v-for="item in 5" :value="item" :key="item">{{
                  item
                }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem
              prop="warehouseCode"
              label="运行计划："
              :label-width="140"
            >
              <Select v-model="FormData.warehouseCode">
                <Option v-for="item in 5" :value="item" :key="item">{{
                  item
                }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem prop="warehouseCode" :label-width="0">
              <Input
                clearable
                v-model="FormData.warehouseCode"
                placeholder="请输入任务名称、描述等"
              />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem>
              <div class="form_operation">
                <Button
                  icon="md-search"
                  type="primary"
                  @click="handleSubmit('FormData')"
                  >搜索</Button
                >

                <Button @click="handleReset('FormData')" icon="ios-refresh"
                  >重置</Button
                >
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </header>

    <!-- main -->
    <main>
      <div class="add_button">
        <Button type="primary" icon="md-add">新建采集任务 </Button>
      </div>
      <Table
        :data="tableObj.tableData"
        :columns="tableColumns"
        stripe
        :loading="loading"
      >
        <template #operation="{ row }">
          <div class="table_operation">
            <Button type="success" size="small" style="margin-right: 5px"
              >详情{{ row }}</Button
            >
            <Button type="primary" size="small" style="margin-right: 5px"
              >编辑</Button
            >
            <Button type="error" size="small">删除</Button>
            <Button type="primary" size="small" style="margin-right: 5px"
              >运行</Button
            >
            <Button type="primary" size="small" style="margin-right: 5px"
              >停止</Button
            >
          </div>
        </template>
      </Table>
      <div class="table_page">
        <Page
          :total="tableObj.page.total"
          :current="tableObj.page.currentPage"
          :page-size="tableObj.page.pageSize"
          :page-size-opts="tableObj.page.pageSizeOpts"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          show-elevator
          show-total
          show-sizer
        ></Page>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from "vue";
  let FormData = reactive({});
  let loading = ref<boolean>(false);
  interface TableRow {}
  interface Page {
    total: number; // 总页数
    currentPage: number; // 当前页数
    pageSize: number; // 每页显示多少条,
    pageSizeOpts?: number[];
  }
  interface TableObj {
    page: Page;
    tableData: TableRow[];
  }
  let tableObj = reactive({
    page: {
      total: 0, // 总页数
      currentPage: 1, // 当前页数
      pageSize: 10, // 每页显示多少条,
      pageSizeOpts: [10, 20, 30, 50, 100],
    },
    tableData: [],
  });

  const tableColumns = [
    {
      title: "任务名称",
      key: "warehouseCode",
      align: "center",
      slot: "warehouseCode",
    },
    {
      title: "数据源类型",
      key: "warehouseName",
      align: "center",
    },
    {
      title: "运行状态",
      key: "subjectName",
      align: "center",
    },
    {
      title: "运行计划",
      key: "tierName",
      align: "center",
    },

    {
      title: "上次执行时间",
      key: "createName",
      align: "center",
    },
    {
      title: "创建人",
      key: "onlineName",
      align: "center",
    },
    {
      title: "更新时间",
      key: "createBy",
      align: "center",
    },
    {
      title: "操作",
      slot: "operation",
      width: 200,
      fixed: "right",
      align: "center",
    },
  ];
</script>

<style lang="scss" scoped>
</style>