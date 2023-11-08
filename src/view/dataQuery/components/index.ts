import { defineAsyncComponent } from 'vue'
const WeCodemirror = defineAsyncComponent(() => import("./WeCodemirror.vue"));
const QueryResult = defineAsyncComponent(() => import("./QueryResult.vue"));
const OperationResults = defineAsyncComponent(() => import("./OperationResults.vue"));
const RunLog = defineAsyncComponent(() => import("./RunLog.vue"));
const HistoricalQuery = defineAsyncComponent(() => import("./HistoricalQuery.vue"));
const SaveScripts = defineAsyncComponent(() => import("./SaveScripts.vue"));
const SavedQuery = defineAsyncComponent(() => import("./SavedQuery.vue"));
// import WeCodemirror from './WeCodemirror.vue'
// import QueryResult from './QueryResult.vue'
// import OperationResults from './OperationResults.vue'
// import RunLog from './RunLog.vue'
// import HistoricalQuery from './HistoricalQuery.vue'
// import SaveScripts from './SaveScripts.vue'
// import SavedQuery from './SavedQuery.vue'
export default {
  WeCodemirror,
  QueryResult,
  OperationResults,
  RunLog,
  HistoricalQuery,
  SaveScripts,
  SavedQuery
} 