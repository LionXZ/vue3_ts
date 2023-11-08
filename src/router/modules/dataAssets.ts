export default [
  {
    path: '/dataAssets/homePage',
    name: 'homePage',
    meta: {
      title: 'homePage',
      keepAlive: true // 需要缓存
    },
    component: () => import('../../view/homePage/index.vue')
  },
  {
    path: '/dataAssets/assetOverview',
    name: 'assetOverview',
    meta: {
      title: 'Asset overview',
      keepAlive: true // 需要缓存
    },
    component: () => import('../../view/assetOverview/index.vue')
  },
  {
    path: '/dataAssets/assetCatalog',
    name: 'assetCatalog',
    meta: {
      title: 'Asset catalog',
      keepAlive: true // 需要缓存
    },
    component: () => import('../../view/assetCatalog/index.vue'),
  },
  {
    path: '/dataAssets/assetCatalog/tableDetail/:id/:tabValue?',
    name: 'tableDetail',
    meta: {
      title: 'Table detail',
      keepAlive: false // 不需要缓存
    },
    component: () => import('../../view/assetCatalog/tableDetail.vue'),
  },
  {
    path: '/dataAssets/dataQuery',
    name: 'dataQuery',
    meta: {
      title: 'Data query',
      keepAlive: true // 需要缓存
    },
    component: () => import('../../view/dataQuery/index.vue'),
    // children: [
    //   {
    //     path: '/dataAssets/dataQuery/queryResult/:id',
    //     name: 'queryResult',
    //     meta: {
    //       title: 'Query result',
    //       publicPage: true
    //     },
    //     component: () => import('../../view/dataQuery/QueryResult.vue')
    //   }
    // ]
  },
  {
    path: '/dataAssets/labelManagement',
    name: 'labelManagement',
    meta: {
      title: 'Label Management',
      keepAlive: true // 需要缓存
    },
    component: () => import('../../view/labelManagement/index.vue')
  },
  {
    path: '/dataAssets/collectionTaskManagement',
    name: 'collectionTaskManagement',
    meta: {
      title: 'Collection task management',
      keepAlive: true // 需要缓存
    },
    component: () => import('../../view/collectionTaskManagement/index.vue'),

  },

  // {
  //   path: '/dataAssets/a',
  //   name: 'a',
  //   meta: {
  //     title: 'a'
  //   },
  //   component: () => import('../../view/a.vue')
  // },
]