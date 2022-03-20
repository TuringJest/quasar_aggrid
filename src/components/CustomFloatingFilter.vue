<template>
  <div class="full-width">
    <q-select
      ref="select"
      v-model="filterModel"
      class="filter-select"
      :options="options"

      @update:model-value="onUpdate"
      @focus="select.focus()"
      @keydown.esc="focusAgHeader"
      @popup-hide="onPopupHide"
    >
      <template #append>
        <q-icon
          v-if="filterModel"
          class="cursor-pointer"
          name="o_clear"
          size="xs"
          @click.prevent.stop="onClear"
        />
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useAgGridFloatingFilter } from 'src/composables/aggrid';

const props = defineProps({
  params: Object
});

const select = ref();
const filterModel = ref();
const options = computed(() => props.params?.options);

const {
  setAgFilter,
  focusAgHeader,
  onParentModelChanged,
} = useAgGridFloatingFilter(props.params, filterModel, select);


/**
 * Navigation Helpers
 */
function onUpdate() {
  // popup will keep hanging if open
  select.value.hidePopup();
  // handle keydown.delete with closed popup
  nextTick(() => focusAgHeader())
}

function onClear() {
  filterModel.value = '';
  // popup will keep hanging if open
  select.value.hidePopup();
  nextTick(() => focusAgHeader())
}

function onPopupHide() {
  // Will interfere if we focus another element.
  // E.g. tabbing will not focus correctly anymore.

  nextTick(() => focusAgHeader())
}

/**
 * Set AGFilter
 */
watch(filterModel, val => {
  setAgFilter(val);
});

defineExpose({
  onParentModelChanged
});
</script>

<style lang="scss">

</style>
