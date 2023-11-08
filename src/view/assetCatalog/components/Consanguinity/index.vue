<template>
  <div>
    <Tabs v-model="tabValue" type="card">
      <TabPane
        :label="item.label"
        :name="item.name"
        v-for="item of tabList"
        :key="item.name"
      >
      </TabPane>
    </Tabs>
    <EpigeneticRelationship v-if="tabValue == 'EpigeneticRelationship'" />
    <FieldConsanguinity v-else />
    <!-- <component :is="currentElementComponent" /> -->
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from "vue";
  import components from "./conponents/index";
  const { EpigeneticRelationship, FieldConsanguinity } = components;
  let tabList = reactive([
    { label: "表血缘", name: "EpigeneticRelationship" },
    { label: "字段血缘", name: "FieldConsanguinity" },
  ]);
  let tabValue = ref<string>("EpigeneticRelationship");
  let currentElementComponent = computed(() => {
    return components[tabValue.value];
  });
</script>

<style scoped>
</style>