<template>
  <div class="EssentialInformation">
    <div class="item">
      <span>存储目录位置</span>
      <p>
        <Ellipsis
          :text="
            info.EssentialInformationAndTableStructure?.linkisWarehouse
              ?.clusterPathName
          "
          :lines="1"
          tooltip
        />
        <!-- {{
          info.EssentialInformationAndTableStructure?.linkisWarehouse
            ?.clusterPathName
        }} -->
      </p>
    </div>
    <div class="item">
      <span>库名称</span>
      <p>
        {{
          info.EssentialInformationAndTableStructure?.linkisWarehouse
            ?.warehouseDatabaseCode
        }}
      </p>
    </div>
    <div class="item">
      <span>创建人</span>
      <p>
        {{
          info.EssentialInformationAndTableStructure?.linkisWarehouse?.createBy
        }}
      </p>
    </div>
    <div class="item">
      <span>创建时间</span>
      <p>
        {{
          info.EssentialInformationAndTableStructure?.linkisWarehouse
            ?.createTime
        }}
      </p>
    </div>
    <div class="item">
      <span>存储大小</span>
      <p>
        {{
          info.EssentialInformationAndTableStructure?.linkisWarehouse
            ?.warehouseSize
        }}
      </p>
    </div>
    <div class="item">
      <span>最后数据变更时间</span>
      <p>
        {{
          info.EssentialInformationAndTableStructure?.linkisWarehouse
            ?.updateTime
        }}
      </p>
    </div>
    <div class="item">
      <span>系统描述</span>
      <p>
        {{
          info.EssentialInformationAndTableStructure?.linkisWarehouse
            ?.warehouseDescribe
        }}
      </p>
    </div>
    <div class="item">
      <span>业务描述</span>
      <p class="pd-05">
        <EditInput
          v-model="changeLinkisWarehouse.serviceDescribe"
          @change="change_serviceDescribe"
        />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import editBox from "@/components/editBox/index.ts";
  const { EditInput } = editBox;
  import { computed, inject } from "vue";
  const emit = defineEmits<{
    (e: "change_serviceDescribe", value: string): void;
  }>();
  let info: any = inject("info");
  let changeLinkisWarehouse: any = computed({
    get(): any {
      return {
        serviceDescribe:
          info.EssentialInformationAndTableStructure?.linkisWarehouse
            ?.serviceDescribe || "",
      };
    },
    set(v: string) {},
  });
  const change_serviceDescribe = (): void => {
    emit("change_serviceDescribe", changeLinkisWarehouse.value.serviceDescribe);
  };
</script>

<style scoped lang="scss">
  .EssentialInformation {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    border: 1px solid #000;
    .item {
      width: 50%;
      line-height: 80px;
      display: flex;
      align-items: center;
      text-align: center;
      border-bottom: 1px solid #000;
      span {
        width: 30%;
        height: 80px;
        background-color: #eee;
        font-weight: 700;
        font-size: 16px;
        color: #000;
        border-right: 1px solid #000;
      }
      p {
        flex: 1;
        height: 80px;
        border-right: 1px solid #000;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
    }
    .item:last-child,
    .item:nth-child(7) {
      border-bottom: none;
    }
  }
</style>