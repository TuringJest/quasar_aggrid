import { getAllFocusableDomElements } from 'src/dom-utils';
import { nextTick } from 'vue';

export function useAgGridFloatingFilter(params, filterModel, inputRef) {
  /**
   * required by AG-Grid to set floatingFilter
   */
  function onParentModelChanged(parentModel) {
    filterModel.value = parentModel?.filter;
  }

  /**
   * set AgGrid filter
   */
  function setAgFilter(val) {
    // reset
    if (!val) {
      params.parentFilterInstance((instance) => {
        instance.onFloatingFilterChanged(null, null);
      });
    }
    // set filter
    params.parentFilterInstance((instance) => {
      instance.onFloatingFilterChanged('equals', val);
    });
  }

  /**
   * Navigation Helper
   */
  function focusAgHeader() {
    inputRef.value?.$el.closest('.ag-header-cell')?.focus();
  }

  /**
   * Helpers to maintain AG-Grid forward and backward tabbing on custom floatingFilter components
   */
  function focusPrvFloatingHeader() {
    const sibling = getHeaderCell(inputRef.value)?.previousSibling
    if (!sibling) return

    // focus last focusable element of sibling
    void nextTick(() => {
      getAllFocusableDomElements(sibling)?.slice(-1)[0]?.focus()
    })
    // const target = sibling.querySelector('input') as HTMLElement
  }

  function focusNextFloatingHeader() {
    const el = getHeaderCell(inputRef.value)
    if (!el) return

    // check if filter button is present
    let target = el.querySelector('.ag-floating-filter-button-button')
    if (target) {
      void nextTick(() => void target?.focus())
      return
    }

    // focus first focusable element of sibling
    void nextTick(() => {
      void getAllFocusableDomElements(el.nextSibling)?.[0]?.focus()
    })
    // const target = sibling.querySelector('input') as HTMLElement
  }


  // function getHeaderCell(inputRef: HTMLElement | InstanceType<any>): Maybe<HTMLElement> {
  //   let el: Maybe<HTMLElement>
  //
  //   if (inputRef instanceof HTMLElement) {
  //     el = inputRef.closest('div.ag-header-cell') as HTMLElement
  //   }
  //   else if (inputRef.$el && inputRef.$el instanceof HTMLElement) {
  //     el = inputRef.$el.closest('div.ag-header-cell') as HTMLElement
  //   }
  //   return el
  // }

  return {
    setAgFilter,
    onParentModelChanged,
    focusAgHeader,
    focusPrvFloatingHeader,
    focusNextFloatingHeader
  }
}

function getHeaderCell(inputRef) {
  if (inputRef instanceof HTMLElement) {
    return inputRef.closest('div.ag-header-cell')
  }
  else if (inputRef.$el && inputRef.$el instanceof HTMLElement) {
    return inputRef.$el.closest('div.ag-header-cell')
  }
}
