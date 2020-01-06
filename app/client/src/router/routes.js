/* ##
## Copyright (c) 2019 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.

Name:     router/routes.js
Purpose:
Methods:
  *

## */

const routes = [
  // Root Routing
  {
    path: '/',
    component: () => import('layouts/BoundlessLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue')
      }
    ]
  },
  // Haircut Routing
  {
    path: '/haircut',
    component: () => import('layouts/BoundlessLayout.vue'),
    children: [
      {
        path: '',
        name: 'HairCut',
        component: () => import('pages/MainPageHairCut.vue')
      }
    ]
  },
  { // might need to amend this
    path: '/admin/console',
    component: () => import('layouts/BoundlessLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/AdminPage.vue')
      }
    ]
  },
  // Project Routing
  {
    path: '/project',
    component: () => import('layouts/BoundlessLayout.vue'),
    children: [
      {
        path: 'add',
        component: () => import('pages/SubmitProject.vue')
      },
      {
        path: 'display',
        component: () => import('pages/DisplayProjects.vue')
      },
      {
        path: ':project_id',
        component: () => import('pages/ViewProject.vue')
      },
      {
        path: ':project_id/:extraRoute',
        component: () => import('pages/ViewProject.vue')
      }
    ]
  },
  // Challenge Routing
  {
    path: '/challenge',
    component: () => import('layouts/BoundlessLayout.vue'),
    children: [
      {
        path: 'add',
        component: () => import('pages/SubmitChallenge.vue')
      },
      {
        path: 'display',
        component: () => import('pages/DisplayChallenges.vue')
      },
      {
        path: ':challenge_id',
        component: () => import('pages/ViewChallenge.vue')
      },
      {
        path: ':challenge_id/:extraRoute',
        component: () => import('pages/ViewChallenge.vue')
      }
    ]
  }
  // TODO: for attribution page
  // {
  //   path: '/about',
  //   component: () => import('layouts/BoundlessLayout.vue'),
  //   children: [
  //     {
  //       path: 'notices',
  //       component: () => import('pages/SubmitChallenge.vue')
  //     }
  //   ]
  // }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
