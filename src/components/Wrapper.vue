
Wrapper component from a library.
Can not be changed!

<template>
  <div
    ref="wrapper"
    class="wrapper q-pa-lg q-ma-sm"
    tabindex="0"
    @keydown.right.self="focusNext"
    @keydown.left.self="focusNext"
    @keydown.enter="onEnter"
    @keydown.tab.stop.prevent="onTab"
    @keydown.n.capture="focusNext"
    @keydown.esc="wrapper.focus()"
  >
    <slot />
  </div>
</template>

<script>
import { defineComponent, ref, nextTick } from 'vue';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Wrapper',

  props: {
    navTarget: Object,
  },

  setup(props) {
    const wrapper = ref();

    function onClick() {
      // wrapper.value?.el.focus();
    }

    function onEnter() {
      // this only works if q-select has attribute autocomplete -> will render the select with an input el
      const inputs = wrapper.value?.getElementsByTagName('input');
      inputs[0]?.focus();
    }

    function focusNext() {
      console.log('next');
      void nextTick(() => void props.navTarget?.$el.focus());
    }

    function onTab() {
      console.log('tab');
      // select.value?.hidePopup();
      void nextTick(() => void props.navTarget?.$el.focus());
    }

    return {
      wrapper,
      onClick,
      onEnter,
      focusNext,
      onTab,
    };
  },
});
</script>

<style lang='scss' scoped>
.wrapper {
  width: 200px;
  background: yellow;
}

.wrapper:focus,
.wrapper:focus-within {
  outline: solid 2px blue;
}
</style>
