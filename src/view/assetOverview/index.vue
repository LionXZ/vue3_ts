<template>
  <div class="dataView z-data-model">
    <div class="view-header">
      <div class="flex-box">
        <div>
          <div class="icon-box all">
            <img src="../../assets/img/assetOverview/tableNum.png" alt="" />
          </div>
        </div>
        <div class="nums">
          <span class="nums-text">总表数量</span>
          <p class="nums-number">{{ tableTotalNumber || 0 }}</p>
        </div>
      </div>
      <div class="flex-box">
        <div class="icon-box storage">
          <img src="../../assets/img/assetOverview/storageNum.png" alt="" />
        </div>
        <div class="nums">
          <span class="nums-text">总存储量</span>
          <p class="nums-number">{{ spaceTotalNumber || 0 }}</p>
        </div>
      </div>
      <div class="flex-box">
        <div class="icon-box indicators">
          <img src="../../assets/img/assetOverview/indicatorsNum.png" alt="" />
        </div>
        <div class="nums">
          <span class="nums-text">指标数量</span>
          <p class="nums-number">{{ criterionTotalNumber || 0 }}</p>
        </div>
      </div>
      <div class="flex-box">
        <div class="icon-box dictionary">
          <img src="../../assets/img/assetOverview/dictionaryNum.png" alt="" />
        </div>
        <div class="nums">
          <span class="nums-text">数据字典数量</span>
          <p class="nums-number">{{ metadataTotalNumber || 0 }}</p>
        </div>
      </div>
    </div>
    <div class="view-content">
      <div class="view-charts">
        <div>数据表分布（按来源）</div>
        <BaseEchart :width="'100%'" :options="f_options1"></BaseEchart>
      </div>
      <div class="view-charts">
        <div>指标分布（按指标类型）</div>
        <BaseEchart :width="'100%'" :options="f_options2"></BaseEchart>
      </div>
      <div class="view-charts">
        <div>数据表分布（按主题域）</div>
        <BaseEchart :width="'100%'" :options="f_options3"></BaseEchart>
      </div>
    </div>
    <div class="view-bottom">
      <div>数据量变化趋势</div>
      <div class="content">
        <BaseEchart :options="f_options4" :width="'100%'" :height="'300px'"></BaseEchart>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as assetOverview from "../../api/assetOverview";
const {
  homePreview_dataTotalNumber,
  homePreview_dataPercentTier,
  homePreview_dataCriterionPercent,
  homePreview_dataPercentSubject,
  homePreview_dataPercentTrend,
} = assetOverview;
import {
  options1,
  options2,
  options3,
  options4,
} from "./chartsOptions/options";
import BaseEchart from "../../components/echarts";
import { onMounted, reactive, ref } from "vue";
//========================================================================================================
let tableTotalNumber = ref<number>(0);
let spaceTotalNumber = ref<number>(0);
let criterionTotalNumber = ref<number>(0);
let metadataTotalNumber = ref<number>(0);
let f_options1: any = reactive(options1);
let f_options2: any = reactive(options2);
let f_options3: any = reactive(options3);
let f_options4: any = reactive(options4);
//获取统计
const homePreviewDataTotalNumber = (): void => {
  homePreview_dataTotalNumber({}).then((res: any) => {
    tableTotalNumber.value = res.data.tableTotalNumber;
    spaceTotalNumber.value = res.data.spaceTotalNumber;
    criterionTotalNumber.value = res.data.criterionTotalNumber;
    metadataTotalNumber.value = res.data.metadataTotalNumber;
  });
};
//数据表分布-来源
const homePreviewDataPercentTier = (): void => {
  homePreview_dataPercentTier({}).then((res: any) => {
    let data: any = [];
    for (let i in res.data) {
      data.push({
        name: res.data[i].distributeName,
        value: res.data[i].distributeNumber,
        percent: res.data[i].distributePercentage * 100,
      });
    }
    f_options1.legend.formatter = (param: any) => {
      let val = data.find((e: any) => e.name == param);
      return `${param}   ${val.value}（${val.percent.toFixed(0)}%）`;
    };
    f_options1.series[0].data = data;
  });
};

//数据指标分布
const homePreviewDataCriterionPercent = (): void => {
  homePreview_dataCriterionPercent({}).then((res: any) => {
    let data = [["主题域", "数量"]];
    for (let i in res.data) {
      data.push([
        `${res.data[i].distributeName}`,
        `${res.data[i].distributeNumber}`,
      ]);
    }
    f_options2.dataset.source = data;
  });
};

//数据表分布-按主题域
const homePreviewDataPercentSubject = (): void => {
  homePreview_dataPercentSubject({}).then((res: any) => {
    let data: any = [];
    for (let i in res.data) {
      data.push({
        name: res.data[i].distributeName,
        value: res.data[i].distributeNumber,
        percent: res.data[i].distributePercentage * 100,
      });
    }
    f_options3.legend.formatter = (param: any) => {
      let val = data.find((e: any) => e.name == param);
      return `${param}   ${val.value}（${val.percent.toFixed(0)}%）`;
    };
    f_options3.series[0].data = data;
  });
};

//数据量变化趋势
const homePreviewDataPercentTrend = (): void => {
  homePreview_dataPercentTrend({}).then((res: any) => {
    let data = [];
    for (let i in res.data) {
      data.push([`${res.data[i].trendDate}`, `${res.data[i].trendNumber}`]);
    }
    f_options4.dataset.source = data.reverse();
  });
};

//========================================================================================================

onMounted(() => {
  homePreviewDataTotalNumber();
  homePreviewDataPercentTier();
  homePreviewDataCriterionPercent();
  homePreviewDataPercentSubject();
  homePreviewDataPercentTrend();
});
</script>

<style lang="scss" scoped>
.dataView {
  background-color: #f0f2f5;
  margin: -10px;
  .view-header {
    width: 100%;
    height: 100px;
    border-radius: 7px;
    padding: 20px 0;
    background: #ffffff;
    display: flex;
    .flex-box {
      flex: 1;
      display: flex;
      text-align: center;
      justify-content: center;
      .icons {
        width: 26px;
        height: 26px;
      }
      .nums {
        padding-left: 20px;
        .nums-text {
          font-size: 16px;
          color: #8e9093;
        }
        .nums-number {
          // font-family: DIN-Black, DIN;
          font-size: 26px;
          font-weight: 600;
          color: #000c2b;
        }
      }
      .icon-box {
        height: 60px;
        width: 60px;
        // background: rgba($color: #3E71FF, $alpha: 0.1);
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        > img {
          width: 26px;
        }
      }
      .all {
        background: rgba($color: #3e71ff, $alpha: 0.1);
      }
      .storage {
        background: rgba($color: #02daaa, $alpha: 0.1);
      }
      .indicators {
        background: rgba($color: #57cdfc, $alpha: 0.1);
      }
      .dictionary {
        background: rgba($color: #fcc851, $alpha: 0.1);
      }
    }
    .flex-box:nth-child(1),
    .flex-box:nth-child(2),
    .flex-box:nth-child(3) {
      border-right: 1px solid #d9dbe1;
    }
  }
  .view-content {
    width: 100%;
    height: 250px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .view-charts {
      width: 33%;
      background: #ffffff;
      height: 250px;
      padding: 10px 20px;
    }
    .view-charts:nth-child(2) {
      // margin:0 10px;
    }
  }
  .view-bottom {
    background: #ffffff;
    margin-top: 10px;
    padding: 20px 0 0 20px;
  }
}
</style>