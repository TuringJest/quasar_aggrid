
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'select',
        name: 'Select',
        component: () => import('pages/Select.vue')
      },
      {
        path: 'aggrid',
        name: 'Aggrid',
        component: () => import('pages/AgGrid.vue')
      }
    ]
  },
]

export default routes
