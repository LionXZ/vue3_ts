import { defineAsyncComponent } from 'vue'
const DataTable = defineAsyncComponent(() => import("./DataTable.vue"));
const DataDictionary = defineAsyncComponent(() => import("./DataDictionary.vue"));
const IndexData = defineAsyncComponent(() => import("./IndexData.vue"));
const DataField = defineAsyncComponent(() => import("./DataField.vue"));
const SubjectDomain = defineAsyncComponent(() => import("./SubjectDomain.vue"));
// import DataTable from './DataTable.vue'
// import DataDictionary from './DataDictionary.vue'
// import IndexData from './IndexData.vue'
// import DataField from './DataField.vue'
// import SubjectDomain from './SubjectDomain.vue'
export default {
  DataTable, DataDictionary, IndexData, DataField, SubjectDomain
}
