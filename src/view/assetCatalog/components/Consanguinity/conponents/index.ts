import { defineAsyncComponent } from 'vue'
const EpigeneticRelationship = defineAsyncComponent(() => import("./EpigeneticRelationship.vue"));
const FieldConsanguinity = defineAsyncComponent(() => import("./FieldConsanguinity.vue"));
// import EpigeneticRelationship from './EpigeneticRelationship.vue'
// import FieldConsanguinity from './FieldConsanguinity.vue'

export default {
  EpigeneticRelationship,
  FieldConsanguinity
}