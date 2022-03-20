<template>
  <div class="full-width">
    <!-- intercept AgGid focus (enter from header and forward tabbing) -->
    <input class="focus-target" @focus="interceptFocus">
    <q-select
      ref="select"
      v-bind="params.inputProps"
      v-model="filterModel"
      class="filter-select"
      :options="optionsFiltered"

      @filter="filterFn"
      @blur="onBlur"
      @popup-hide="onPopupHide"
      @keydown.esc="focusAgHeader"
      @keydown.delete="onDelete"
      @keydown.tab="onTab"
    >
      <template #append>
        <q-icon
          v-if="filterModel"
          class="cursor-pointer clear-select-btn"
          name="o_clear"
          size="xs"

          @click.prevent.stop="onClear"
        />
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <!-- intercept ag-grid backward tabbing   -->
    <input class="focus-target" @focus="interceptFocus">
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
const optionsFiltered = ref([...options.value]);

const {
  setAgFilter,
  focusAgHeader,
  onParentModelChanged,
  focusNextFloatingHeader,
  focusPrvFloatingHeader
} = useAgGridFloatingFilter(props.params, filterModel, select);

/**
 * Event Handlers
 */
function interceptFocus() {
    nextTick(() => select.value?.focus());
  if(!props.params?.inputProps?.useInput){
    nextTick(() => select.value?.showPopup());
  }
}

function onDelete($e) {
  if ($e.metaKey || $e.ctrlKey) reset();
}

function onClear() {
  reset();
}

function reset() {
  filterModel.value = '';
  // make sure there is no opened popup, or it will stay hanging
  select.value.hidePopup();
  void nextTick(() => focusAgHeader());
}

function onPopupHide() {
  // Will interfere if we focus another element.
  // E.g. tabbing will not focus correctly anymore.

  // -> difficult to time all events in the correct order...
  // -> can lead to unwanted side-effects
  // popupHide is not reliable because it is triggered by many things

  // focusAgHeader();
}


// handle tabbing (agGrid offers does this for header cells, but it collides with QSelect tab handler)
function onTab($e) {
  // it's painful to handle this because there are many edge cases that have to be tested for.
  // Ideally, only AgGrid handles this internally but this seems not possible with QSelect at the moment

  $e.stopImmediatePropagation();
  $e.preventDefault();
  if ($e.shiftKey) {
    focusPrvFloatingHeader();
  } else {
    focusNextFloatingHeader();
  }
}

// clean up input
function onBlur() {
  if (props.params.inputProps?.useInput) {
    nextTick(() => {
      select.value.updateInputValue(filterModel.value || '');
    });
  }
}

/**
 * Filter Select Options
 */
function filterFn(val, update) {
  if (val === '') {
    update(() => {
      optionsFiltered.value = options.value;
    });
    return;
  }
  update(() => {
      const needle = val.toLowerCase();
      optionsFiltered.value = options.value?.filter(v => v.toLowerCase().indexOf(needle) > -1);
    },
    ref => {
      if (val !== '' && ref.options.length > 0) {
        ref.setOptionIndex(-1); // reset optionIndex in case there is something selected
        ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
      }
    }
  );
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
.filter-select {
  .q-field--auto-height .q-field__control, .q-field--auto-height .q-field__native {
    min-height: unset;
    height: 40px;
  }
}

.focus-target {
  position: absolute;
  pointer-events: none;
  height: 0;
  opacity: 0;
}

</style>
