<template>
  <q-page :style-fn="offset => ({height: offset ? `calc(100vh - ${offset}px)` : '100vh'})">
    <div class="q-pl-md" style="height: 20%">
      <table>
        <thead>
        <tr>
          <th class="q-px-md"></th>
          <th class="q-px-md">CustomFloatingFilter</th>
          <th class="q-px-md">CustomFloatingFilterIntercept</th>
        </tr>
        </thead>

        <tbody>
        <tr>
          <td>
            <code><b>tab/tab+shift</b></code> while input is focused -> focus next/prv header input
          </td>
          <td class="text-center">&#9940;</td>
          <td class="text-center">&#9935;</td>

        </tr>
        <tr>
          <td>
            <code><b>cmd+delete</b></code> -> reset input and focus header
          </td>
          <td class="text-center">&check;</td>
          <td class="text-center">&check;</td>
        </tr>

        <tr>
          <td>
            <code><b>esc</b></code> while input is focused -> focus header
          </td>
          <td class="text-center">&check;</td>
          <td class="text-center">&check;</td>
        </tr>

        <tr>
          <td>
            <code><b>enter</b></code> with open popup -> focus header
          </td>
          <td class="text-center">&check;</td>
          <td class="text-center">&#9940;</td>
        </tr>

        </tbody>
      </table>

    </div>
    <ag-grid-vue
      style="width: 100%; height: 80%"
      class="ag-theme-material"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :default-col-def="defaultColDef"
      @grid-ready="onGridReady"
    />
  </q-page>
</template>

<script>
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-material.css';
import { ModuleRegistry } from '@ag-grid-community/core';
import { AgGridVue } from '@ag-grid-community/vue3';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import CustomFloatingFilter from 'src/components/CustomFloatingFilter';
import CustomFloatingFilterIntercept from 'src/components/CustomFloatingFilterIntercept';
import { brands, countries, data, models, years } from 'app/mock';


export default {
  name: 'AgGrid',
  components: {
    AgGridVue,
    // eslint-disable-next-line vue/no-unused-components
    CustomFloatingFilter,
    // eslint-disable-next-line vue/no-unused-components
    CustomFloatingFilterIntercept
  },

  setup() {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);

    const defaultColDef = {
      resizable: true,
      sortable: true,
      editable: true,
      minWidth: 100,
      width: 250,
      maxWidth: 500,
      floatingFilter: true,
      suppressMenu: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 100
      }
    };

    const columnDefs = [
      // simple QSelect Setup
      {
        field: 'make',
        headerName: 'Brand (CustomFloatingFilter)',
        floatingFilterComponent: 'CustomFloatingFilter',
        floatingFilterComponentParams: {
          options: brands
        }
      },
      {
        field: 'country',
        headerName: 'Country (CustomFloatingFilter)',
        floatingFilterComponent: 'CustomFloatingFilter',
        floatingFilterComponentParams: {
          options: countries
        }
      },
      // uses input for focus interception
      // handle tabbing
      {
        field: 'model',
        headerName: 'Model (CustomFloatingFilterIntercept)',
        floatingFilterComponent: 'CustomFloatingFilterIntercept',
        floatingFilterComponentParams: {
          options: models
        }
      },
      // uses input for focus interception
      // QSelect with useInput
      {
        field: 'year',
        headerName: 'Year (CustomFloatingFilterIntercept)',
        floatingFilterComponent: 'CustomFloatingFilterIntercept',
        floatingFilterComponentParams: {
          options: years,
          inputProps: {
            useInput: true,
            hideSelected: true,
            fillInput: true,
            inputDebounce: 0
          }
        }
      },
      {
        field: 'price',
        headerName: 'Price (AgGrid Input)',
        flex: 1,
        // minWidth: 300,
        maxWidth: null,
      }

    ];

    const rowData = Array.apply(null, { length: 500 }).map((el) => {
      const item = data[Math.floor(Math.random() * 3)];
      return ({
        make: item.brand,
        country: item.country,
        model: item.model,
        year: item.year,
        price: item.price
      });
    });


    // const gridApi = ref();
    // const columnApi = ref();
    //
    function onGridReady(params) {
      //     gridApi.value = params.api;
      //     columnApi.value = params.columnApi;
    }

    return {
      onGridReady,
      columnDefs,
      rowData,
      defaultColDef
    };
  }
};
</script>

<style lang="scss">
// disable browser navigation on horizontal scroll
html, body {
  overscroll-behavior-x: none;
}

//.ag-root-wrapper {
//  min-height: inherit;
//}

.ag-theme-material .ag-header-cell, .ag-theme-material .ag-header-group-cell {
  padding: 6px 24px;
}

.q-field__marginal {
  height: unset;
}


.filter-select.q-field--auto-height .q-field__control, .q-field--auto-height .q-field__native {
  min-height: unset;
  height: 40px;
}

.ag-theme-material .ag-header-cell, .ag-theme-material .ag-header-group-cell {
  padding: 6px 24px;
}


/*
Transition
 */
.q-field--standard .q-field__control:before {
  transition: none;
}

.q-field--standard .q-field__control:after {
  transition: none;
}

.q-field--filled .q-field__control:before {
  transition: none;
}

.q-field--filled .q-field__control:after {
  transition: none;
}
</style>
