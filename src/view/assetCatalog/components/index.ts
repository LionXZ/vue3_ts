import { defineAsyncComponent } from 'vue'
const EssentialInformation = defineAsyncComponent(() => import("./EssentialInformation.vue"));
const TableStructure = defineAsyncComponent(() => import("./TableStructure.vue"));
const Consanguinity = defineAsyncComponent(() => import("./Consanguinity/index.vue"));
const DataPreview = defineAsyncComponent(() => import("./DataPreview.vue"));
const ChangeRecord = defineAsyncComponent(() => import("./ChangeRecord.vue"));
// import EssentialInformation from './EssentialInformation.vue'
// import TableStructure from './TableStructure.vue'
// import Consanguinity from './Consanguinity/index.vue'
// import DataPreview from './DataPreview.vue'
// import ChangeRecord from './ChangeRecord.vue'


export default {
  EssentialInformation,
  TableStructure,
  Consanguinity,
  DataPreview,
  ChangeRecord
}