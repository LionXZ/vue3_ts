import { defineAsyncComponent } from 'vue'
const AddLabel = defineAsyncComponent(() => import("./AddLabel.vue"));
const ReName = defineAsyncComponent(() => import("./ReName.vue"));
// import AddLabel from './AddLabel.vue'
// import ReName from './ReName.vue'
export default {
  AddLabel,
  ReName
} 