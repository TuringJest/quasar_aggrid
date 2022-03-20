<template>
  <q-page>
    <div>
      <p>
        <b>Navigation example:</b>
      </p>
      <ul>
        <li> Use 'Arrow Right' and 'Arrow Left' to navigate between wrappers</li>
        <li> Press 'Enter' to focus input or select with popup</li>
        <li> Press 'Esc' to return to wrapper for navigation</li>
        <li> Press 'ctrl/cmd + backspace' to clear selection and return to wrapper</li>
        <li> Press 'n' to focus the other wrapper</li>
      </ul>
    </div>

    <div class="flex">
      <Wrapper ref="wrapper1" :navTarget="wrapper2">
        <q-select
          ref="select"
          v-model="model1"
          @update:model-value="onUpdate"
          :options="['opt1', 'opt2']"
          filled
          clearable

          autocomplete="new-field"

          @keydown.esc="onEsc"
          @focus="onFocusSelect"
          @keydown.enter="onEnter"
          @keydown.delete="onDelete"
        >
          <template #append>
            <q-icon
              v-if="model1"
              class="cursor-pointer"
              name="delete"
              size="xs"
              @click="onClear"
            />
          </template>
        </q-select>
      </Wrapper>

      <Wrapper ref="wrapper2" :navTarget="wrapper1">
        <q-input
          ref="input"
          v-model="model2"
          :options="['opt1', 'opt2']"
          filled
        />
      </Wrapper>
    </div>


    <q-page-container>
      <h4 class="q-mb-sm">Requirements:</h4>
      <ul>
        <li>
          Open the dropdown immediately on focus (showPopup @focus -- causes issues
          onClick)
        </li>
        <li>Exit select when option is selected</li>
        <li>Hotkey to reset and exit the select (cmd/ctrl + backspace)</li>
        <li>
          Reset the select state when another component changes focus (press 'n'
          while the dropdown is open)
        </li>
        <li>Close on esc</li>
        <li>Clearing opens the dropdown</li>
        <li>
          hotkeys should be easier to configure in case they collide with library
          functionality - tab should not select the highlighted option in dropdown
          @keydown.tab)
        </li>
      </ul>

      <h5 class="q-mb-xs">Issues</h5>
      <ul>
        <li>Click doesn't open the dropdown properly when select is not focused</li>
        <li>Dropdown doesn't close when focus is changed externally</li>
        <li>Clear now opens the dropdown because of showPopup onFocus</li>
      </ul>
    </q-page-container>
  </q-page>
</template>

<script>
import { defineComponent, nextTick, onMounted, ref } from 'vue';
import Wrapper from '/src/components/Wrapper.vue';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Select',
  components: { Wrapper},

  setup() {
    const wrapper1 = ref();
    const wrapper2 = ref();
    const select = ref();
    const input = ref();

    const model1 = ref();
    const model2 = ref();

    onMounted(() => {
      wrapper1.value?.$el.focus();
    });

    /**
     * Event Handlers
     */

    //  immediately opens popup when focused with enter
    //  ---> !! breaks opening of popup @click when select is not focused
    function onFocusSelect() {
      select.value?.focus();
      select.value?.showPopup();
    }

    // focus back to wrapper after selection
    function onUpdate() {
      wrapper1.value?.$el.focus();
    }

    // hotkey to reset select and focus wrapper
    function onDelete($e) {
      if ($e.metaKey || $e.ctrlKey) {
        resetSelect();
      }
    }

    // reset select
    // --> !! breaks behavior for click on clear btn
    function onClear($e) {
      resetSelect();
    }

    // leave select
    function onEsc() {
      wrapper1.value?.$el.focus();
    }

    // needed if there is no option selected in the dropdown
    function onEnter($e) {
      wrapper1.value?.$el.focus();
    }

    /**
     * Helper
     */
    function resetSelect() {
      console.log('reset');
      model1.value = '';
      select.value?.hidePopup();
      void nextTick(() => {
        wrapper1.value?.$el.focus();
      });
    }

    return {
      wrapper1,
      wrapper2,
      select,
      input,
      model1,
      model2,
      onFocusSelect,
      onEsc,
      onUpdate,
      onDelete,
      onClear,
      onEnter
    };
  }
});
</script>
