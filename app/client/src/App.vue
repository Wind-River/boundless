<!-- ##
## Copyright (c) 2019 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.

Name:     App.vue
Purpose:  Main starting code block of the application.
Methods:
  * The application global CSS declarations are found here.

##-->

<template>
  <div id="q-app">
    <router-view /> <!-- See ./src/router/routes.js -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="stylus">
// Scrollbar width for horizontal and vertical scrollbars
div::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

// Scrollbar track's color and width
div::-webkit-scrollbar-track {
  background: #ddd;
  border-radius: 2px;
}

// Scrollbar color
div::-webkit-scrollbar-thumb {
  background: rgb(219, 122, 122);
  border-radius: 3px;
}

// Coloring even child of the table
tr:nth-child(even) {
  background-color: #3498db14;
}

// Center image/elements within div element
.center-img {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

// Sets mouse hovering background color
.hoverable:hover {
  background-color: rgba(236, 233, 233, 0.884);
  border-radius: 3px;
  cursor: pointer;
}

// From Quasar
.my-sticky-header-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th // bg color is important for th; just specify one
    background-color $blue-grey-1 // for the color of display

  thead tr:first-child th
    position sticky
    top 0
    opacity 1
    z-index 1

/* Colors from: https://www.december.com/html/spec/color2.html */
.full-color {
  background-image: linear-gradient(#00EE00, #9AFF9A, #00EE00)
}

/* Colors from: https://www.december.com/html/spec/color1.html */
.half-full-color {
  background-image: linear-gradient(#FFE600, #FFF68F, #FFE600)
}

/* Colors from: https://www.december.com/html/spec/color0.html */
.null-color {
  background-image: linear-gradient(#E0E0E0, #F5F5F5, #E0E0E0)
}

.progress-bar {
  min-width: 150px;
  max-width: 35%
  min-height: 50px;
  height: 30px;
  line-height: 45px;
  text-align: center;
  font-family: Verdana, Arial, sans-serif;
  font-weight: 500;
  border: solid 1.5px;
  border-color: gray;
}
</style>
