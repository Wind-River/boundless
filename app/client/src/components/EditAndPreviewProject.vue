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

Name:     components/EditAndPreviewProject.vue
Purpose:
Methods:
  *

## -->

<template>
  <div class="q-pa-lg">
    <q-layout>
      <!-- -------------------- Header -------------------- -->
      <q-header reveal>
        <q-toolbar>
          <q-toolbar-title>
            <div align="center" >
              <strong v-if="childMode === 'edit'">Edit Mode</strong>
              <strong v-else>Preview Mode</strong>
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <!-- -------------------- Footer -------------------- -->
      <q-footer reveal>
        <q-toolbar>
          <q-toolbar-title>
            <div align="center">
              <strong v-if="childMode === 'edit'">Edit Mode</strong>
              <strong v-else>Preview Mode</strong>
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>

      <!-- -------------------- Loading Spinner -------------------- -->
      <div
        v-if="loading"
        class="absolute-center"
        style="bottom: 15em;"
      >
        <q-spinner color="primary" size="8em" />
      </div>

      <!-- -------------------- Main Content -------------------- -->
      <q-form
        v-else
        @submit="onSubmit"
      >
        <q-splitter
          v-model="splitterModel"
          disable
        >

          <template v-slot:before>
            <q-tabs
              vertical inline-label stretch
              class="text-primary"
              v-model="pageTab"
            >
              <q-tab
                no-caps
                name="main" icon="view_stream" label="Main"
              />
              <q-separator />
              <q-tab
                no-caps
                name="logs" icon="forum" label="Logs"
              />
              <q-separator />
              <q-tab
                no-caps
                name="attachments" icon="attachment" label="Attachments"
              />
              <q-separator />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              v-model="pageTab"
              animated
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <!-- -------------------- Main -------------------- -->
              <q-tab-panel name="main">
                <div v-if="curData">
                  <!-- ------------------- Project Layout ------------------ -->
                  <div
                    align="center"
                    class="shadow-2"
                    style="
                      margin: auto;
                      max-width: 1000px;
                      min-width: 800px;
                      border-radius: 3px;
                    "
                  >
                    <!-- ----------------- Preview Project ----------------- -->
                    <div v-if="childMode === 'preview'">
                      <br class="small">

                      <!-- ----------------- Project Page ----------------- -->
                      <div class="q-pa-md" align="left">

                        <!-- ---------------- Project Title ---------------- -->
                        <div class="q-pa-md text-h4 text-primary text-center">
                          {{ curData.project }}
                          <q-separator />
                        </div>

                        <!-- -------------- Project Overview -------------- -->
                        <div
                          class="q-pa-sm q-col-gutter-md row items-start"
                          style="height: 320px;"
                        >

                          <div class="col-9">
                            <div class="text-h5">
                              Overview
                              <q-separator color="secondary" />
                            </div>

                            <div
                              class="row q-mt-sm q-mb-sm"
                              style="max-height: 240px;"
                            >
                              <div class="col-5 q-mt-sm">
                                <!-- -------------- Main Image ------------- -->
                                <q-img
                                  contain
                                  class="project-img bg-black"
                                  :src="mainImage.cur"
                                  :ratio="4/3"
                                />
                              </div>

                              <!-- -------------- Description -------------- -->
                              <div class="col overviewCSS">

                                <div class="q-pa-sm">
                                  <pre>{{ curData.description }}</pre>
                                </div>

                              </div>
                            </div>
                          </div>

                          <div class="col-3" >

                            <div class="text-h5">
                              Team
                              <q-separator color="secondary" />
                            </div>

                            <div class="overviewCSS">
                              <q-list dense>
                                <q-item
                                  v-for="(teamMember, index) in curData.members"
                                  :key="index"
                                  clickable v-ripple
                                  class="q-my-sm"
                                >
                                  <q-item-section avatar>
                                    <q-avatar color="primary" text-color="secondary"  >
                                      {{ teamMember.name[0] }}
                                    </q-avatar>
                                  </q-item-section>

                                  <q-item-section>
                                    <q-item-label v-if="teamMember.role === 'lead'">
                                      {{ teamMember.name }}: ({{ teamMember.role }})
                                    </q-item-label>
                                    <q-item-label v-else>
                                      {{ teamMember.name }}
                                    </q-item-label>
                                    <q-item-label caption lines="1">
                                      {{ teamMember.email }}
                                    </q-item-label>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                            </div>

                          </div>

                        </div>

                        <q-separator inset />

                        <!-- ---------------- Progress Bar ----------------- -->
                        <div class="q-pa-md text-h7" align="center">
                          <div class="text-h5">
                            Progress
                          </div>

                          <div class="q-mt-sm progress-bar">

                            <div class="row" v-if="curData.progress === -1">
                              <div class="col null-color">
                                Idea
                              </div>
                              <div class="col null-color">
                                PoC
                              </div>
                              <div class="col null-color">
                                Value
                              </div>
                            </div>

                            <div class="row" v-if="curData.progress === 0">
                              <div class="col half-full-color">
                                Idea
                              </div>
                              <div class="col null-color">
                                PoC
                              </div>
                              <div class="col null-color">
                                Value
                              </div>
                            </div>

                            <div class="row" v-if="curData.progress === 1">
                              <div class="col full-color">
                                Idea
                              </div>
                              <div class="col null-color">
                                PoC
                              </div>
                              <div class="col null-color">
                                Value
                              </div>
                            </div>

                            <div class="row" v-if="curData.progress === 2">
                              <div class="col full-color">
                                Idea
                              </div>
                              <div class="col half-full-color">
                                PoC
                              </div>
                              <div class="col null-color">
                                Value
                              </div>
                            </div>

                            <div class="row" v-if="curData.progress === 3">
                              <div class="col full-color">
                                Idea
                              </div>
                              <div class="col full-color">
                                PoC
                              </div>
                              <div class="col null-color">
                                Value
                              </div>
                            </div>

                            <div class="row" v-if="curData.progress === 4">
                              <div class="col full-color">
                                Idea
                              </div>
                              <div class="col full-color">
                                PoC
                              </div>
                              <div class="col half-full-color">
                                Value
                              </div>
                            </div>

                            <div class="row" v-if="curData.progress === 5">
                              <div class="col full-color">
                                Idea
                              </div>
                              <div class="col full-color">
                                PoC
                              </div>
                              <div class="col full-color">
                                Value
                              </div>
                            </div>

                          </div>

                        </div>

                        <q-separator inset />

                        <!-- ---------------- Project Chips ---------------- -->
                        <div class="q-pa-md" align="center">

                          <q-chip
                            disable clickable
                            color="secondary"
                            text-color="white" icon="far fa-clipboard"
                          >
                            Copy URL
                          </q-chip>

                          <span
                            v-for="(chipContent, chipInd) in curData.webpage.chips"
                            :key="chipInd"
                          >
                            <q-chip
                              v-if="!chipContent.hidden"
                              clickable
                              color="secondary" text-color="white"
                              :icon="chipContent.content.icon"
                              @click="openNewTab(chipContent.content.url)"
                            >
                              {{ chipContent.content.label }}
                            </q-chip>
                          </span>

                          <q-chip
                            clickable
                            @click="popDialog('keywords')"
                            color="secondary" text-color="white" icon="vpn_key"
                          >
                            Keywords
                          </q-chip>

                        </div>

                        <!-- ------------------- Body ------------------- -->
                        <div class="q-pa-md">
                          <div
                            v-for="(bodyContent, bodyInd) in curData.webpage.body"
                            :key="bodyInd"
                          >
                            <div :hidden="bodyContent.hidden === true">
                              <div class="text-h5 q-mt-sm">
                                {{ bodyContent.content.label }}
                              </div>
                              <q-separator color="secondary" />
                              <div>
                                <div v-if="bodyContent.content.type === 'TEXT_BOX'">
                                  <div class="q-pa-sm">
                                    <pre>{{ bodyContent.content.text }}</pre>
                                  </div>
                                </div>
                                <div v-else>
                                  <ul>
                                    <li
                                      v-for="(link, ulIndex) in bodyContent.content.list"
                                      :key="ulIndex"
                                    >
                                      <div
                                        v-if="bodyContent.content.type === 'EVENT_LIST'"
                                        style="display: inline; padding-left: 12px;"
                                      >
                                        {{ link.subject }}
                                        <hr>
                                        Description: {{ link.body }} <br>
                                        Date and Time: {{ link.date }} <br>
                                        <a v-if="link.url !== ''" :href="link.url">More...</a>
                                      </div>
                                      <span v-else>
                                        <em v-if="link.url === ''">
                                          {{ link.item }}
                                        </em>
                                        <a v-else :href="link.url" target="_blank">
                                          {{ link.item }}
                                        </a>
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <br>
                            </div>
                          </div>
                        </div>
                      </div>

                      <br><br>

                    </div>

                    <!-- ------------------ Edit Project ------------------- -->
                    <div v-else-if="childMode === 'edit'">
                      <br class="small">

                      <!-- ----------------- Project Page ------------------ -->
                      <div class="q-pa-md" align="left">

                        <!-- --------------- Project Title ----------------- -->
                        <div class="q-pa-md text-h4 text-primary text-center">
                          <a class="cursor-pointer">{{ curData.project }} </a>

                          <q-icon
                            class="cursor-pointer"
                            name="edit" size=".8em" color="accent"
                          />

                          <q-popup-edit
                            buttons
                            title="Edit the Project Name"
                            v-model="curData.project"
                            :validate="projectNameValidation"
                            @save="updated = true"
                          >
                            <q-input
                              dense autofocus filled hide-bottom-space
                              v-model="curData.project"
                              :rules="[val => !!val || 'Field is required']"
                            />
                          </q-popup-edit>

                          <q-separator />
                        </div>

                        <!-- -------------- Project Overview --------------- -->
                        <div
                          class="q-pa-sm q-col-gutter-md row items-start"
                          style="height: 320px;"
                        >
                          <!-- -------------- Overview Panel --------------- -->
                          <div class="col-9">
                            <!-- ----------------- Title ------------------ -->
                            <div class="text-h5">
                              Overview
                              <q-separator color="secondary" />
                            </div>

                            <!-- ---------------- Content ------------------ -->
                            <div
                              class="row q-mt-sm q-mb-sm"
                              style="max-height: 240px;"
                            >
                              <!-- ------------- Main Image ---------------- -->
                              <div
                                class="col-5 q-mt-sm cursor-pointer"
                                @click="invokeFilePicker"
                              >
                                <q-img
                                  contain
                                  :src="mainImage.cur" :ratio="4/3"
                                  class="project-img bg-black"
                                />

                                <q-icon
                                  dense flat
                                  size="xs" color="accent" name="collections"
                                  class="full-width"
                                />

                                <input
                                  hidden
                                  type="file" ref="imageInput"
                                  accept="image/*"
                                  @change="filePickerOnChange"
                                />

                                <q-tooltip
                                  anchor="bottom middle"
                                  self="top middle"
                                  :offset="[10, 10]"
                                >
                                  Choose your image file...
                                </q-tooltip>
                              </div>

                              <!-- ------------- Description --------------- -->
                              <div class="col overviewCSS">

                                <q-input
                                  filled autogrow
                                  class="q-pa-sm"
                                  v-model="curData.description"
                                  :rules="[val => !!val || notifyError()]"
                                  @focus="updated = true"
                                />

                              </div>
                            </div>

                          </div>

                          <!-- --------------- Team Panel ----------------- -->
                          <div class="col-3">

                            <div class="text-h5">
                              <div class="row">
                                Team
                                <q-space/>

                                <!-- Adding Member/s to Project -->
                                <q-btn
                                  dense round
                                  size="sm" color="accent" icon="add"
                                  style="top: 5px;"
                                  @click="addProjectMember"
                                />
                              </div>

                              <q-separator class="q-mb-sm" color="secondary" />
                            </div>

                            <div
                              class="overviewCSS q-mt-sm"
                              style="overflow-x: hidden;"
                            >
                              <q-list dense>
                                <q-item
                                  v-for="(teamMember, index) in curData.members"
                                  :key="index"
                                  clickable v-ripple
                                  class="q-my-sm"
                                >
                                  <q-item-section avatar>
                                    <q-avatar color="primary" text-color="secondary"  >
                                      {{ teamMember.name[0] }}
                                    </q-avatar>
                                  </q-item-section>

                                  <q-item-section>
                                    <q-item-label v-if="teamMember.role === 'lead'">
                                      {{ teamMember.name }}: ({{ teamMember.role }})
                                    </q-item-label>
                                    <q-item-label v-else>
                                      {{ teamMember.name }}
                                    </q-item-label>
                                    <q-item-label caption lines="1">
                                      {{ teamMember.email }}
                                    </q-item-label>
                                  </q-item-section>

                                  <q-toggle
                                    dense
                                    color="accent"
                                    true-value="lead" false-value="member"
                                    v-model="curData.members[index].role"
                                    @input="updated = true"
                                  />

                                  <q-btn
                                    :disable="curData.members.length === 1"
                                    dense round
                                    class="q-my-md"
                                    color="accent" size="sm" icon="delete"
                                    @click="curData.members.splice(index, 1); updated = true"
                                  />
                                </q-item>
                              </q-list>

                            </div>

                          </div>
                        </div>

                        <q-separator inset />
                        <!-- --------------- Progress Bar ------------------ -->
                        <div class="q-pa-md text-h7" align="center">
                          <div class="text-h5">
                            Progress
                          </div>

                          <div class="row q-mt-sm">
                            <div class="col">
                              <!-- Col filler -->
                            </div>

                            <div class="col progress-bar">
                              <div class="row" v-if="curData.progress === -1">
                                <div class="col null-color">
                                  Idea
                                </div>
                                <div class="col null-color">
                                  PoC
                                </div>
                                <div class="col null-color">
                                  Value
                                </div>
                              </div>

                              <div class="row" v-if="curData.progress === 0">
                                <div class="col half-full-color">
                                  Idea
                                </div>
                                <div class="col null-color">
                                  PoC
                                </div>
                                <div class="col null-color">
                                  Value
                                </div>
                              </div>

                              <div class="row" v-if="curData.progress === 1">
                                <div class="col full-color">
                                  Idea
                                </div>
                                <div class="col null-color">
                                  PoC
                                </div>
                                <div class="col null-color">
                                  Value
                                </div>
                              </div>

                              <div class="row" v-if="curData.progress === 2">
                                <div class="col full-color">
                                  Idea
                                </div>
                                <div class="col half-full-color">
                                  PoC
                                </div>
                                <div class="col null-color">
                                  Value
                                </div>
                              </div>

                              <div class="row" v-if="curData.progress === 3">
                                <div class="col full-color">
                                  Idea
                                </div>
                                <div class="col full-color">
                                  PoC
                                </div>
                                <div class="col null-color">
                                  Value
                                </div>
                              </div>

                              <div class="row" v-if="curData.progress === 4">
                                <div class="col full-color">
                                  Idea
                                </div>
                                <div class="col full-color">
                                  PoC
                                </div>
                                <div class="col half-full-color">
                                  Value
                                </div>
                              </div>

                              <div class="row" v-if="curData.progress === 5">
                                <div class="col full-color">
                                  Idea
                                </div>
                                <div class="col full-color">
                                  PoC
                                </div>
                                <div class="col full-color">
                                  Value
                                </div>
                              </div>
                            </div>

                            <div class="col q-ml-sm" align="left">
                              <div v-if="mode === 'edit'">
                                <div class="row">
                                  <q-btn
                                    dense
                                    size="sm" color="accent"
                                    icon="keyboard_arrow_up"
                                    @click="progressCountUp"
                                  />
                                </div>
                                <div class="row" style="margin-top: 1px;">
                                  <q-btn
                                    dense
                                    size="sm" color="accent"
                                    icon="keyboard_arrow_down"
                                    @click="progressCountDown"
                                  />
                                </div>
                              </div>
                            </div>

                          </div>

                        </div>

                        <hr>
                        <!-- ------------------ Keywords ------------------ -->
                        <div class="row q-pa-sm" align="left">
                          <p class="col-4 header">Keywords:</p>

                          <q-option-group
                            dense inline
                            class="col" type="checkbox"
                            v-model="curData.keywords"
                            :options="keywordsOptions"
                            @input="updated = true"
                          />
                        </div>

                        <hr>
                        <!-- -------------------- Chips -------------------- -->
                        <div>
                          <div class="row" align="left">
                            <p class="col q-pa-sm header">
                              Add Chips:
                            </p>

                            <q-select
                              dense outlined options-dense
                              class="col-3" label="Chip Type"
                              style="overflow: auto;"
                              v-model="chipType"
                              :options="configData.chipContentType"
                            />

                            <div class="col-1 q-mt-sm" align="center" >
                              <q-btn
                                :disable="chipType === ''"
                                dense round
                                color="accent" icon="add"
                                @click="addChip(); addedChip = true"
                              />
                            </div>
                          </div>

                          <div
                            v-for="(chipContent, chipInd) in curData.webpage.chips"
                            :key="chipInd"
                            class="row q-mt-sm q-mb-sm"
                          >
                            <!-- ----------- Chip Type SOURCE -------------- -->
                            <div
                              v-if="chipContent.content.type === 'SOURCE'"
                              class="col q-mb-xs q-pa-sm"
                            >
                              <q-card class="q-pa-md">
                                <div class="row" align="left">
                                  <strong>Source Chip</strong>
                                  <hr class="col q-ml-sm">
                                </div>

                                <q-input
                                  filled
                                  class="q-mt-sm" label="Source"
                                  placeholder="Link to source code goes here."
                                  v-model="chipContent.content.url"
                                  :autofocus="addedChip"
                                  :rules="[val => !!val || 'Field is required']"
                                  @focus="addedChip = false"
                                />
                              </q-card>
                            </div>

                            <!-- ------------- Chip Type VIDEO ------------- -->
                            <div
                              v-if="chipContent.content.type === 'VIDEO'"
                              class="col q-mb-xs q-pa-sm"
                            >
                              <q-card class="q-pa-md">
                                <div class="row" align="left">
                                  <strong>Video Chip</strong>
                                  <hr class="col q-ml-sm">
                                </div>

                                <q-input
                                  filled
                                  class="q-mt-sm" label="Video"
                                  placeholder="Link to video goes here. (Currently only supports one.)"
                                  v-model="chipContent.content.url"
                                  :autofocus="addedChip"
                                  :rules="[val => !!val || 'Field is required']"
                                  @focus="addedChip = false"
                                />
                              </q-card>
                            </div>

                            <!-- ------------ Chip Type CUSTOM ------------- -->
                            <div
                              v-if="chipContent.content.type === 'CUSTOM'"
                              class="col q-mb-xs q-pa-sm"
                            >
                              <q-card class="q-pa-md">
                                <div class="row" align="left">
                                  <strong>Custom Chip</strong>
                                  <hr class="col q-ml-sm">
                                </div>

                                <q-input
                                  filled dense
                                  class="q-mt-sm" label="Custom Chip Label"
                                  placeholder="Please enter the label for the custom chip."
                                  v-model="chipContent.content.label"
                                  :rules="[val => !!val || 'Field is required']"
                                  :autofocus="addedChip"
                                  @focus="addedChip = false"
                                />

                                <q-input
                                  filled dense
                                  class="q-mt-sm" label="Custom Chip URL"
                                  placeholder="Link to video goes here. (Currently only supports one.)"
                                  v-model="chipContent.content.url"
                                  :rules="[val => !!val || 'Field is required']"
                                  @focus="addedChip = false"
                                />

                                <div class="row q-pa-sm" align="left">
                                  <div class="col">
                                    <q-list bordered separator>
                                      <q-item
                                        v-for="
                                          (val, ind) in configData.customChips
                                        "
                                        :key="ind"
                                        clickable v-ripple
                                        :active="
                                          chipContent.content.icon === val.value
                                        "
                                        @click="
                                          chipContent.content.icon = val.value
                                        "
                                        active-class="text-white bg-secondary"
                                      >
                                        <q-item-section avatar>
                                          <q-icon :name="val.value" />
                                        </q-item-section>

                                        <q-item-section align="center">
                                        </q-item-section>

                                        <q-item-section side>
                                          {{ val.label }}
                                        </q-item-section>
                                      </q-item>
                                    </q-list>
                                  </div>

                                  <div
                                    class="col" align="center"
                                    style="
                                      display: flex;
                                      justify-content: center;
                                      align-items: center;
                                    "
                                  >
                                    <q-chip
                                      color="secondary" text-color="white"
                                      :icon="chipContent.content.icon"
                                    >
                                      {{ chipContent.content.label || 'Sample goes here' }}
                                    </q-chip>
                                  </div>
                                </div>
                              </q-card>
                            </div>

                            <!-- ----------- Chip Index & Delete ----------- -->
                            <div
                              class="col-1" align="center"
                              style="margin: .7vh auto;"
                            >
                              <q-checkbox
                                dense
                                class="q-pa-sm q-mb-sm" label="Hide"
                                v-model="curData.webpage.chips[chipInd].hidden"
                              />

                              <q-input
                                dense filled
                                class="q-pa-xs q-mb-sm"
                                label="Index" type="number"
                                v-model="curData.webpage.chips[chipInd].index"
                                @blur="curData.webpage.chips[chipInd].index = curData.webpage.chips[chipInd].index < 1 ?  1 : parseInt(curData.webpage.chips[chipInd].index)"
                              />

                              <q-btn
                                dense round
                                class="bottom" color="accent" icon="delete"
                                @click="curData.webpage.chips.splice(chipInd, 1)"
                              />
                            </div>
                          </div>
                        </div>

                        <hr>

                        <!-- ---------------- Custom Field ----------------- -->
                        <div>
                          <div class="row" align="left">
                            <p class="col q-pa-sm header">
                              Add Content:
                            </p>

                            <q-select
                              dense outlined options-dense
                              class="col-3" label="Content Type"
                              style="overflow: auto;"
                              v-model="bodyType"
                              :options="configData.bodyContentType"
                            />

                            <div class="col-1 q-mt-sm" align="center" >
                              <q-btn
                                :disable="bodyType === ''"
                                dense round
                                color="accent" icon="add"
                                @click="addCustomField(); addedContent = true"
                              />
                            </div>
                          </div>

                          <div
                            v-for="(bodyContent, ind) in curData.webpage.body"
                            :key="ind"
                            class="row q-mt-sm q-mb-sm"
                          >

                            <!-- ---------- Custom Type TEXT_BOX ----------- -->
                            <div
                              v-if="bodyContent.content.type === 'TEXT_BOX'"
                              class="col q-mb-xs q-pa-sm"
                            >
                              <q-card class="q-pa-md">
                                <div class="row" align="left">
                                  <strong>Text Box</strong>
                                  <hr class="col q-ml-sm">
                                </div>

                                <q-input
                                  filled
                                  class="q-mt-sm" label="Label"
                                  placeholder="Title"
                                  v-model="bodyContent.content.label"
                                  :autofocus="addedContent"
                                  :rules="[val => !!val || 'Field is required']"
                                  @focus="addedContent = false"
                                />

                                <q-input
                                  filled autogrow
                                  class="q-mt-sm" label="Body/Text Description"
                                  placeholder="Please enter the body for the respective label."
                                  v-model="bodyContent.content.text"
                                  :rules="[val => !!val || 'Field is required']"
                                />
                              </q-card>
                            </div>

                            <!-- ------- Custom Type UNORDERED_LIST -------- -->
                            <div
                              v-else-if="bodyContent.content.type === 'UNORDERED_LIST'"
                              class="col q-mb-xs q-pa-sm"
                            >
                              <q-card class="q-pa-md">
                                <div class="row" align="left">
                                  <strong>Unordered List</strong>
                                  <hr class="col q-ml-sm">
                                </div>

                                <q-input
                                  filled
                                  class="q-mt-sm" label="Label"
                                  placeholder="Title"
                                  v-model="bodyContent.content.label"
                                  :autofocus="addedContent"
                                  :rules="[val => !!val || 'Field is required']"
                                  @focus="addedContent = false"
                                />

                                <div class="row inline full-width q-pa-md">
                                  <strong>List</strong>
                                  <hr class="col q-ml-sm q-mr-sm">
                                  <div>
                                    <q-btn
                                      dense round
                                      color="accent" icon="add"
                                      @click="bodyContent.content.list.push({})"
                                    />
                                  </div>
                                </div>

                                <ul>
                                  <li
                                    v-for="(link, ulIndex) in bodyContent.content.list"
                                    :key="ulIndex"
                                    align="left"
                                  >
                                    <div class="row inline full-width q-gutter-xs q-mb-sm">
                                      <q-input
                                        dense filled
                                        class="col" label="URL Name"
                                        placeholder="Please enter the alias for the URL."
                                        v-model="link.item"
                                        :rules="[val => !!val || 'Field is required']"
                                      />

                                      <q-input
                                        dense filled
                                        class="col" label="URL"
                                        placeholder="https://www.goole.com"
                                        v-model="link.url"
                                        :rules="[val => true]"
                                      />

                                      <q-btn
                                        :disable="bodyContent.content.list.length === 1"
                                        dense flat round
                                        icon="delete"
                                        @click="bodyContent.content.list.splice(ulIndex, 1)"
                                      />
                                    </div>
                                  </li>
                                </ul>
                              </q-card>
                            </div>

                            <!-- -------- Custom Type ORDERED_LIST --------- -->
                            <div
                              v-else-if="bodyContent.content.type === 'ORDERED_LIST'"
                              class="col q-mb-xs q-pa-sm"
                            >
                              <q-card class="q-pa-md">
                                <div class="row" align="left">
                                  <strong>Ordered List</strong>
                                  <hr class="col q-ml-sm">
                                </div>

                                <q-input
                                  filled
                                  class="q-mt-sm"
                                  label="Label" placeholder="Title"
                                  v-model="bodyContent.content.label"
                                  :autofocus="addedContent"
                                  :rules="[val => !!val || 'Field is required']"
                                  @focus="addedContent = false"
                                />

                                <div class="row inline full-width q-pa-md">
                                  <strong>List</strong>
                                  <hr class="col q-ml-sm q-mr-sm">
                                  <div>
                                    <q-btn
                                      dense round
                                      color="accent" icon="add"
                                      @click="bodyContent.content.list.push({index: bodyContent.content.list.length + 1})"
                                    />
                                  </div>
                                </div>

                                <ul>
                                  <li
                                    v-for="(link, olIndex) in bodyContent.content.list"
                                    :key="olIndex"
                                    align="left"
                                  >
                                    <div class="row inline full-width q-gutter-xs q-mb-sm">
                                      <q-input
                                        dense filled
                                        class="col-1" type="number"
                                        label="Index"
                                        v-model="link.index"
                                        :rules="[val => !!val]"
                                        @blur="link.index = link.index > 0 ? parseInt(link.index) : 1"
                                      />

                                      <q-input
                                        dense filled
                                        class="col" label="URL Name"
                                        placeholder="Please enter the alias for the URL."
                                        v-model="link.item"
                                        :rules="[val => !!val || 'Field is required']"
                                      />

                                      <q-input
                                        dense filled
                                        class="col" label="URL"
                                        placeholder="https://www.goole.com"
                                        v-model="link.url"
                                        :rules="[val => true]"
                                      />

                                      <q-btn
                                        :disable="bodyContent.content.list.length === 1"
                                        dense flat round
                                        icon="delete"
                                        @click="bodyContent.content.list.splice(olIndex, 1)"
                                      />
                                    </div>
                                  </li>
                                </ul>
                              </q-card>
                            </div>

                            <!-- -------- Custom Type EVENT_LIST ---------- -->
                            <div
                              v-else
                              class="col q-mb-xs q-pa-sm"
                            >
                              <q-card class="q-pa-md">
                                <div class="row" align="left">
                                  <strong>Event List</strong>
                                  <hr class="col q-ml-sm">
                                </div>

                                <q-input
                                  filled
                                  class="q-mt-sm" label="Label"
                                  placeholder="Title"
                                  v-model="bodyContent.content.label"
                                  :autofocus="addedContent"
                                  :rules="[val => !!val || 'Field is required']"
                                  @focus="addedContent = false"
                                />

                                <div class="row inline full-width q-pa-md">
                                  <strong>List</strong>
                                  <hr class="col q-ml-sm q-mr-sm">
                                  <div>
                                    <q-btn
                                      dense round
                                      color="accent" icon="add"
                                      @click="bodyContent.content.list.push({})"
                                    />
                                  </div>
                                </div>

                                <ul>
                                  <li
                                    v-for="(link, evIndex) in bodyContent.content.list"
                                    :key="evIndex"
                                    align="left"
                                  >
                                    <div class="row inline full-width">
                                      <div class="row inline full-width q-gutter-xs">
                                        <q-input
                                          dense filled
                                          class="col" label="Subject"
                                          placeholder="Please enter the subject matter here."
                                          v-model="link.subject"
                                          :rules="[val => !!val || 'Field is required']"
                                        />

                                        <q-input
                                          dense filled
                                          class="col" label="Date and Time"
                                          placeholder="2019:06:02.00:00"
                                          v-model="link.date"
                                          :rules="[val => !!val || 'Field is required']"
                                        />

                                        <q-btn
                                          disable dense flat round
                                          @click="bodyContent.content.list.splice(evIndex, 1)"
                                        />
                                      </div>
                                      <div class="row inline full-width q-gutter-xs">
                                        <q-input
                                          dense filled
                                          class="col" label="Body"
                                          placeholder="Please enter the details regarding the subject matter."
                                          v-model="link.body"
                                          :rules="[val => !!val || 'Field is required']"
                                        />

                                        <q-input
                                          dense filled
                                          class="col" label="URL"
                                          placeholder="https://www.goole.com"
                                          v-model="link.url"
                                          :rules="[val => !!val || 'Field is required']"
                                        />

                                        <q-btn
                                          :disable="bodyContent.content.list.length === 1"
                                          dense flat round
                                          icon="delete"
                                          @click="bodyContent.content.list.splice(evIndex, 1)"
                                        />
                                      </div>
                                    </div>
                                  </li>
                                </ul>

                              </q-card>
                            </div>

                            <!-- ------- Custom Field Index & Delete ------- -->
                            <div
                              class="col-1" align="center"
                              style="margin: auto;"
                            >
                              <q-checkbox
                                dense
                                class="q-pa-sm q-mb-sm" label='Hide'
                                v-model="curData.webpage.body[ind].hidden"
                                @input="updated = true"
                              />

                              <q-input
                                dense filled
                                class="q-pa-xs q-mb-md"
                                label="Index" type="number"
                                v-model="curData.webpage.body[ind].index"
                                @blur="curData.webpage.body[ind].index = curData.webpage.body[ind].index < 1 ?  1 : parseInt(curData.webpage.body[ind].index)"
                              />

                              <q-btn
                                dense round
                                class="bottom" color="accent" icon="delete"
                                @click="curData.webpage.body.splice(ind, 1)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <br><br>

                    </div>
                  </div>

                  <!-- ------------------- Popup Dialog -------------------- -->
                  <div class="q-pa-md q-gutter-sm">
                    <q-dialog v-model="fixedDialog">
                      <q-card>
                        <q-card-section>
                          <div class="text-h6">{{ dialogJSON.title }}</div>
                        </q-card-section>

                        <q-separator />

                        <q-card-section v-if="dialogJSON.message" style="width: 50vh;">
                          <ul>
                            <li
                              v-for="(val, ind) in dialogJSON.message"
                              :key="ind"
                            >
                              {{ val }}
                            </li>
                          </ul>
                        </q-card-section>

                        <q-card-section v-else style="width: 50vh;">
                          <p>N/A</p>
                        </q-card-section>

                        <q-separator />

                        <q-card-actions align="right" >
                          <q-btn flat label="Close" color="primary" v-close-popup />
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                  </div>
                </div>

                <q-inner-loading :showing="!Boolean(mainImage.cur)">
                  <q-spinner-gears size="50px" color="primary" />
                </q-inner-loading>
              </q-tab-panel>

              <!-- -------------------- Logs -------------------- -->
              <q-tab-panel name="logs">
                <div
                  v-if="curData"
                  align="center"
                  class="shadow-2"
                  style="
                    margin: auto;
                    max-width: 1000px;
                    min-width: 800px;
                    border-radius: 3px;
                  "
                >
                  <!-- -------------------- Preview Log -------------------- -->
                  <div v-if="childMode === 'preview'">
                    <div class="q-pa-sm">
                      Preview Log
                    </div>

                    <div
                      v-if="curData.logs"
                      class="q-pa-md q-gutter-sm"
                    >
                      <div
                        v-for="(val, ind) in curData.logs"
                        :key="ind"
                      >
                        <div
                          v-if="!val.hidden"
                          align="left"
                          class="shadow-2 q-pa-sm"
                          style="border-radius: 3px;"
                        >
                          <div class="cursor-pointer">
                            {{ val.title }}
                          </div>

                          <div
                            v-if="val.description"
                            class="cursor-pointer"
                          >
                            <pre>{{ val.description }}</pre>
                          </div>

                          <div
                            v-for="(childVal, childInd) in val.data"
                            :key="childInd"
                          >
                            <dir v-if="!childVal.hidden">
                              <div>
                                Title: {{ childVal.title }}
                              </div>
                              <div>
                                Date: {{ childVal.date }}
                              </div>
                              <div>
                                Description:
                                <hr>
                                <pre>{{ childVal.description }}</pre>
                                <hr>

                                <div align="right">
                                  <q-btn
                                    dense round flat
                                    color="accent" icon="reply"
                                    @click="replyLog(ind, childVal)"
                                  />
                                </div>
                              </div>
                            </dir>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  <!-- -------------------- Edit Log -------------------- -->
                  <div v-else-if="childMode === 'edit'">

                    <!-- ----------------- Main Add Button ----------------- -->
                    <div class="q-pa-sm">
                      <q-btn
                        round
                        icon="add" color="secondary"
                        @click="createLogThread"
                      />
                    </div>

                    <!-- -------------------- Log Family ------------------- -->
                    <div
                      v-if="curData.logs"
                      class="q-pa-md q-gutter-sm"
                    >
                      <div
                        v-for="(val, ind) in curData.logs"
                        :key="ind"
                        align="left"
                        class="shadow-2 q-pa-sm"
                        style="border-radius: 3px;"
                      >
                        <div class="row">
                          <div class="col">
                            <div class="cursor-pointer q-pa-xs">
                              Title: {{ val.title }}
                              <q-popup-edit
                                buttons
                                v-model="val.title"
                                @hide="updateAtHide"
                              >
                                <q-input
                                  dense filled autofocus
                                  v-model="val.title"
                                />
                              </q-popup-edit>
                            </div>

                            <div class="cursor-pointer q-pa-xs">
                              Description:
                              <pre>{{ val.description }}</pre>
                              <q-popup-edit
                                buttons
                                v-model="val.description"
                                @hide="updateAtHide"
                              >
                                <q-input
                                  dense filled autofocus
                                  v-model="val.description"
                                />
                              </q-popup-edit>
                            </div>

                            <div class="cursor-pointer q-pa-xs q-mt-xs">
                              Index: {{ val.index }}
                              <q-popup-edit
                                buttons
                                v-model="val.index"
                                @hide="updateAtHide(['index', ind, val.index])"
                              >
                                <q-input
                                  dense filled autofocus
                                  type="number"
                                  v-model="val.index"
                                />
                              </q-popup-edit>
                            </div>

                            <div>
                              <q-checkbox
                                left-label
                                label="Hidden:"
                                v-model="val.hidden"
                                @input="updateAtHide"
                              />
                            </div>
                          </div>

                          <div align="right" class="col">
                            <q-btn
                              round flat
                              icon="delete"
                              @click="deleteLogThread(ind)"
                            />
                          </div>
                        </div>

                        <div class="q-mb-md">
                          <q-btn
                            round
                            color="accent" icon="add"
                            @click="addLog(ind)"
                          />
                        </div>

                        <!-- ------------------ Log Data ------------------ -->
                        <div v-if="val.data">
                          <div
                            v-for="(dataVal, dataInd) in val.data"
                            :key="dataInd"
                            class="shadow-2 q-pa-sm q-mb-sm"
                            style="border-radius: 3px;"
                          >
                            <div class="cursor-pointer q-pa-xs">
                              Title: {{ dataVal.title }}
                              <q-popup-edit
                                buttons
                                v-model="dataVal.title"
                                @hide="updateAtHide"
                              >
                                <q-input
                                  dense
                                  filled
                                  autofocus
                                  v-model="dataVal.title"
                                />
                              </q-popup-edit>
                            </div>

                            <div class="cursor-pointer q-pa-xs q-mt-xs">
                              Date: {{ dataVal.date }}
                              <q-popup-edit
                                buttons
                                v-model="dataVal.date"
                                @hide="updateAtHide"
                              >
                                <q-input
                                  dense
                                  filled
                                  autofocus
                                  v-model="dataVal.date"
                                />
                              </q-popup-edit>
                            </div>

                            <div class="cursor-pointer q-pa-xs q-mt-xs">
                              Description: <br>
                              <pre>{{ dataVal.description }}</pre>

                              <q-popup-edit
                                buttons
                                v-model="dataVal.description"
                                @hide="updateAtHide"
                              >
                                <q-input
                                  dense
                                  filled
                                  autofocus
                                  autogrow
                                  v-model="dataVal.description"
                                />
                              </q-popup-edit>
                            </div>

                            <div>
                              <q-checkbox
                                label="Hidden:"
                                left-label
                                v-model="dataVal.hidden"
                                @input="updateAtHide"
                              />
                            </div>

                            <div align="right" class="q-gutter-sm" >
                              <q-btn
                                dense round flat
                                color="accent" icon="delete"
                                @click="deleteLog(dataInd, ind)"
                              />
                              <q-btn
                                dense round flat
                                color="accent" icon="reply"
                                @click="replyLog(ind, dataVal)"
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

              </q-tab-panel>

              <!-- -------------------- Attachments -------------------- -->
              <q-tab-panel name="attachments">
                <div
                  class="shadow-2 q-pa-md"
                  style="
                    margin: auto;
                    max-width: 1000px;
                    min-width: 800px;
                    border-radius: 3px;
                  "
                >
                  <div v-if="childMode === 'preview'">
                    Preview Attachments...
                    <hr>
                  </div>

                  <div v-else-if="childMode === 'edit'">
                    Edit Attachments...
                    <hr>
                  </div>

                  <li
                    v-for="(val, key, ind) in curData.files"
                    :key="ind"
                  >
                    {{ key }}:
                    <dir>
                      {{ val }}
                    </dir>
                  </li>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </template>

        </q-splitter>

        <!-- -------------------- Buttons -------------------- -->
        <q-page-sticky
          position="top-right"
          :offset="[30, 18]"
        >
          <q-btn
            round
            size="sm"
            class="q-mr-xs"
            color="accent"
            icon="attach_file"
            @click="fileAttachmentDialog = true"
          >
            <q-tooltip
              content-class="bg-indigo" :offset="[10, 10]"
            >
              Attach Files
            </q-tooltip>
          </q-btn>

          <q-btn
            round
            size="sm"
            class="q-mr-xs"
            color="accent"
            icon="settings"
            @click="popupAdvancedSettingsDialog"
          >
            <q-tooltip
              content-class="bg-indigo" :offset="[10, 10]"
            >
              Settings
            </q-tooltip>
          </q-btn>

          <q-btn
            round
            size="sm"
            color="accent"
            type="submit"
            :icon="(childMode === 'edit') ? 'search' : 'edit'"
            @click="submitMode = 'view'"
          >
            <q-tooltip
              v-if="childMode === 'edit'"
              content-class="bg-indigo"
            >
              Preview Mode
            </q-tooltip>

            <q-tooltip
              v-else
              content-class="bg-indigo"
            >
              Edit Mode
            </q-tooltip>
          </q-btn>

          <q-btn
            round
            size="sm"
            :disabled="!updated"
            class="q-ml-xs"
            :color="updated ? 'secondary' : 'accent'"
            icon="done"
            type="submit"
            @click="submitMode = 'database'"
          >
            <q-tooltip content-class="bg-indigo" :offset="[10, 10]">
              Submit
            </q-tooltip>
          </q-btn>

          <q-btn
            round
            size="sm"
            class="q-ml-xs"
            color="accent"
            icon="clear"
            @click="emitClose"
          >
            <q-tooltip content-class="bg-indigo" :offset="[10, 10]">
              Close
            </q-tooltip>
          </q-btn>
        </q-page-sticky>
      </q-form>

      <!-- -------------------- Advanced Settings -------------------- -->
      <q-dialog
        persistent
        v-model="advancedDialog"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card style="width: 55%; min-width: 300px;">
          <!-- -------------- Advanced Settings Title ----------------- -->
          <q-card-section class="bg-accent text-white">
            <div class="text-h6">Advanced Settings</div>
          </q-card-section>

          <q-card-section class="q-mt-md q-pa-md">
            <!-- ----------- Advanced Settings Hide Project ---------------- -->
            <div>
              <div class="row q-pa-sm q-mb-sm">
                <strong>Hide Project:</strong>
                <q-space />
                <q-checkbox
                  dense
                  style="padding-right: 2px;"
                  v-model="curData.hidden"
                />
              </div>
            </div>
            <q-separator color="secondary" />

            <!-- ------------ Advanced Settings URL Alias ---------------- -->
            <div>
              <strong
                class="q-mt-sm"
                style="font-size: 18px;"
              >
                URL:
              </strong>

              <div class="q-pa-sm q-mb-sm">
                <div class="row">
                  <strong>UID:</strong>
                  <q-space />
                  <div class="q-mr-sm">
                    {{ curData.uuid }}
                  </div>
                </div>

                <div class="row">
                  <strong class="col">Alias:</strong>
                  <div
                    class="col-9 cursor-pointer"
                    align="right"
                    style="
                      border: solid 1px;
                      border-radius: 10px;
                      overflow: hidden;
                    "
                  >
                    <div
                      v-if="aliasVals.includes(curData.uuid)"
                      class="q-mr-sm"
                      style="height: 100%;"
                    >
                      {{ aliasKeys[aliasVals.indexOf(curData.uuid)] }}
                      <q-popup-edit
                        buttons
                        v-model="aliasKeys[aliasVals.indexOf(curData.uuid)]"
                        :validate="aliasValidation"
                        @hide="aliasEditObj.error = false"
                      >
                        <q-input
                          dense
                          autofocus
                          hide-bottom-space
                          v-model="aliasKeys[aliasVals.indexOf(curData.uuid)]"
                          :error="aliasEditObj.error"
                          :error-message="aliasEditObj.message"
                        />
                      </q-popup-edit>
                    </div>
                    <div
                      v-else
                      class="q-mr-sm"
                      @click="addToAliasKeys"
                    >
                      {{ curData.uuid }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <q-separator color="secondary" />
          </q-card-section>

          <q-card-actions
            align="right"
            class="text-teal"
          >
            <q-btn
              v-close-popup
              flat no-caps
              label="Cancel"
              @click="advancedSettingsCancel"
            />

            <q-btn
              v-close-popup
              flat
              label="Set"
              no-caps
              @click="advancedSettingSet"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- -------------------- File Attachments -------------------- -->
      <q-dialog
        persistent
        v-model="fileAttachmentDialog"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card style="width: 55%; min-width: 300px;">
          <!-- Advanced Settings Title -->
          <q-card-section class="bg-accent text-white">
            <div class="text-h6">File Uploader</div>
          </q-card-section>

          <q-card-section class="q-mt-md q-pa-md">
            <div>
              <uploadGUI
                :uid="curData.uuid"
                @close="updateAttachments"
              />
            </div>
          </q-card-section>

          <q-card-actions
            align="right"
            class="text-teal"
          >
            <q-btn
              v-close-popup
              flat
              label="Exit"
              no-caps
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-layout>
  </div>
</template>

<script>
import productionDb, { productionStorage } from '../firebase/init_production'
import testingDb, { testingStorage } from '../firebase/init_testing'
import firebase from 'firebase/app'
import 'firebase/firestore'

import uploadGUI from '../components/Upload'

export default {
  name: 'Edit_And_Preview_Project',
  props: {
    projectId: String,
    mode: String
  },
  created () {
    this.getDb().then(res => {
      // fetech data from database
      this.getInformation()
      this.getConfig()
    })
  },
  data () {
    return {
      // Reference for the database
      db: null,
      storage: null,
      userEmailToObjMap: {},
      // "Alias URL" related variables
      aliasMap: {},
      aliasKeys: [],
      aliasVals: [],
      aliasEditObj: {
        error: false,
        message: ''
      },
      // "Advanced Settings" dialog proctor
      advancedDialog: false,
      oldAdvancedSettings: {},
      // "File Attachment" dialog proctor
      fileAttachmentDialog: false,
      // "Edit Mode" related variables
      newKeyword: '', // not used currently
      configData: {},
      chipType: '',
      bodyType: '',
      keywordsOptions: [],
      addedChip: false,
      addedContent: false,
      // childMode represent either 'Edit' or 'Preview' Mode
      childMode: '',
      // submitMode let us know, either to switch between Preview/Edit or push to DB
      submitMode: '',
      mainImage: {
        prev: '',
        cur: '',
        file: ''
      },
      // Variable to see if page was updated // TODO
      updated: false,
      // Chip Dialog variables
      fixedDialog: false,
      dialogJSON: {
        title: '',
        message: ''
      },
      // Page Data variables
      loading: false,
      data: {},
      curData: {},
      // Page Splitter variables
      pageTab: 'main',
      splitterModel: 15
    }
  },
  methods: {
    updateAttachments: function (data) {
      for (let aliasName in data) {
        if (!(aliasName in this.curData.files)) {
          this.curData.files[aliasName] = data[aliasName].val
        }
      }

      this.fileAttachmentDialog = false
    },
    updateAtHide: function (entry) {
      if (entry) {
        if (entry[0] === 'index') {
          this.curData.logs[entry[1]].index = parseInt(entry[2])
        }
      }

      this.updated = true

      this.$forceUpdate()
    },
    invokeFilePicker: function () {
      this.$refs.imageInput.click()
    },
    filePickerOnChange: function (e) {
      const file = e.target.files[0]

      if (file) {
        this.mainImage.cur = URL.createObjectURL(file)
        this.mainImage.file = file
        this.updated = true
      } else {
        this.mainImage.cur = this.mainImage.prev
        this.mainImage.file = ''
        // this.updated = false // removed for persistance
      }
    },
    // Form functions
    onSubmit: function () {
      // edit, preview, and submit handler
      if (this.submitMode === 'view') {
        this.childMode = (this.childMode === 'preview') ? 'edit' : 'preview'
      } else if (this.submitMode === 'database') {
        // pushing data to database
        if (this.curData.keywords.length > 1) {
          let tbdIndex = this.curData.keywords.indexOf('tbd')
          if (tbdIndex > -1) {
            this.curData.keywords.splice(tbdIndex, 1)
          }
        } else {
          if (this.curData.keywords.length === 0) {
            this.curData.keywords.push('tbd')
          }
        }

        let timeOfUpdate = new Date(Date.now()).toISOString()

        let tmpMembers = []
        this.curData.members.forEach(member => {
          tmpMembers.push({
            uuid: member.uuid || member.email,
            role: member.role
          })
        })

        let tocContent = {
          project: this.curData.project,
          description: this.curData.description,
          members: tmpMembers,
          keywords: this.curData.keywords,
          progress: this.curData.progress,
          created: this.curData.created || this.curData.timestamp,
          timestamp: timeOfUpdate
        }

        this.db.collection('projects').doc('ToC').set({
          [this.curData.uuid]: tocContent
        }, { merge: true })

        if (this.mainImage.file) {
          this.curData.webpage.imgURL = `projects/${this.curData.uuid}/main/${this.mainImage.file.name}`
          // update the file to storage
          this.storage.ref()
            .child(this.curData.webpage.imgURL)
            .put(this.mainImage.file)
            .then(res => {
              // TODO: actually put the dl_link
              /* console.log(`Uploaded main image for ${this.curData.uuid}.`) */
              /* // console.log(res) */
            })
        }

        this.db.collection('projects').doc(this.curData.uuid).set({
          webpage: this.curData.webpage || {}, // obj
          logs: this.curData.logs || [], // array of obj
          files: this.curData.files || {} // obj
        })

        this.emitClose()
        // TODO: notify that the process was performed
      }
    },
    // Database calls
    getDb: function () {
      if (this.$q.localStorage.has('boundless_db')) {
        let sessionDb = this.$q.localStorage.getItem('boundless_db')
        return new Promise((resolve, reject) => {
          if (sessionDb === 'testing') {
            this.db = testingDb
            this.storage = testingStorage
          } else {
            this.db = productionDb
            this.storage = productionStorage
          }
          resolve('Database fetch complete...')
        })
      } else {
        return new Promise((resolve, reject) => {
          productionDb.collection('config').doc('project').get()
            .then(doc => {
              if (doc.exists) {
                if (doc.data().db === 'testing') {
                  this.db = testingDb
                  this.$q.localStorage.set('boundless_db', 'testing')
                } else {
                  this.db = productionDb
                  this.$q.localStorage.set('boundless_db', 'production')
                }
                resolve('Database fetch complete...')
              } else {
                reject('"/config/project" path does not exists in the database...')
              }
            })
            .catch(err => {
              reject(err)
            })
        })
      }
    },
    getConfig: function () {
      this.db.collection('config').doc('project').get()
        .then(doc => {
          if (doc.exists) {
            let data = doc.data()

            for (let key in data['keywords']) {
              this.keywordsOptions.push({
                label: key,
                value: data['keywords'][key]
              })
            }

            this.configData = data
            this.configData.customChips = this.configData.customChips || []
            // this.allowedDomain = data['allowedDomain'] // TODO
          }
        })
        .catch(error => {
          if (error) {
            // error
          }
        })
    },
    getInformation: function () {
      this.loading = true

      let promises = []
      promises.push(this.db.collection('projects').doc(this.projectId).get())
      promises.push(this.db.collection('projects').doc('ToC').get())
      promises.push(this.db.collection('users').doc('ToC').get())

      Promise.all(promises)
        .then(res => {
          for (let objField in res[0].data()) {
            this.data[objField] = res[0].data()[objField]
          }

          for (let objField in res[1].data()[this.projectId]) {
            this.data[objField] = res[1].data()[this.projectId][objField]
          }

          for (let objField in res[2].data()) {
            this.userEmailToObjMap[res[2].data()[objField].email] = res[2].data()[objField]
          }

          this.sortBody()

          this.curData = this.deepObjCopy(this.data)
          this.childMode = this.mode
          this.data = {} // to save memory

          // seamless fix to from old members data to new member data
          let tmpMembers = []
          if (this.curData.members[0].email) {
            let newMembersDataType = []
            this.curData.members.forEach(member => {
              newMembersDataType.push({
                uuid: member.email,
                role: member.role
              })
              tmpMembers.push({
                ...res[2].data()[member.email],
                role: member.role
              })
            })

            // this.db.collection('projects').doc('ToC').set({
            //   [this.curData.uuid]: {
            //     members: newMembersDataType
            //   }
            // }, { merge: true })
          } else {
            this.curData.members.forEach(member => {
              tmpMembers.push({
                ...res[2].data()[member.uuid],
                role: member.role
              })
            })
          }
          this.curData.members = tmpMembers

          // loading imgURL
          if (!this.curData.webpage.imgURL) {
            this.mainImage.cur = this.getMainPhoto()
            this.mainImage.prev = this.mainImage.cur
          } else {
            // get photo from storage
            this.storage.ref().child(this.curData.webpage.imgURL).getDownloadURL()
              .then(url => {
                this.mainImage.cur = url
                this.mainImage.prev = url
              })
              .catch(err => {
                if (err) {
                  /* console.log(err) */
                }
                this.mainImage.cur = this.getMainPhoto()
                this.mainImage.prev = this.mainImage.cur
              })
          } // gonna ignore the load time it takes

          this.aliasMap = res[1].data().alias || {}
          this.aliasKeys = Object.keys(this.aliasMap)
          this.aliasVals = Object.values(this.aliasMap)

          setTimeout(() => {
            this.loading = false
          }, 100)
        })
        .catch(error => {
          if (error) {
            /* console.log(error) */
          }
        })
    },
    // Advanced Settings functions
    popupAdvancedSettingsDialog: function () {
      this.advancedDialog = true
      this.oldAdvancedSettings.hidden = this.curData.hidden
    },
    advancedSettingsCancel: function () {
      this.aliasKeys = Object.keys(this.aliasMap)
      this.aliasVals = Object.values(this.aliasMap)
      this.curData.hidden = this.oldAdvancedSettings.hidden
      this.oldAdvancedSettings = {}
    },
    advancedSettingSet: function () {
      let alias = ''
      let oldAlias = this.curData.alias
      if (this.aliasVals.includes(this.curData.uuid)) {
        alias = this.aliasKeys[this.aliasVals.indexOf(this.curData.uuid)]
        this.curData.alias = alias
      }

      let tmpAliasMap = {}
      if (this.aliasKeys.length > 0) {
        tmpAliasMap = Object.assign(...this.aliasKeys.map((k, i) => ({ [k]: this.aliasVals[i] })))
      }

      if (typeof oldAlias !== 'undefined') {
        if (oldAlias !== '') {
          tmpAliasMap[oldAlias] = firebase.firestore.FieldValue.delete()
        }
      }

      let tmpTocContent = {
        hidden: this.curData.hidden,
        alias: alias
      }

      this.db.collection('projects').doc('ToC').set({
        [this.curData.uuid]: tmpTocContent,
        alias: tmpAliasMap
      }, { merge: true })

      this.emitAdded()
    },
    addToAliasKeys: function () {
      let initName = this.curData.project.split(' ').join('_').toLowerCase()
      this.aliasKeys.push(initName)
      this.aliasVals.push(this.curData.uuid)
    },
    aliasValidation: function (val) {
      if (val === '') {
        this.aliasEditObj.error = true
        this.aliasEditObj.message = 'Cannot be empty!'
        return false
      } else if (val.includes('.')) {
        this.aliasEditObj.error = true
        this.aliasEditObj.message = 'Please replace "." with either "-" or "_"!'
        return false
      } else if (this.aliasKeys.includes(val)) {
        let count = -1
        for (let i = 0; i < this.aliasKeys.length; i++) {
          if (this.aliasKeys[i] === val) {
            count = count + 1
            if (count > 0) {
              this.aliasEditObj.error = true
              this.aliasEditObj.message = 'Alias already exist!'
              return false
            }
          }
        }
      } else if (this.aliasVals.includes(val)) {
        this.aliasEditObj.error = true
        this.aliasEditObj.message = 'Alias cannot be UID!'
        return false
      }
      this.aliasEditObj.error = false
      this.aliasEditObj.message = ''
      return true
    },
    // Log Forum functions
    deleteLogThread: function (index) {
      this.curData.logs.splice(index, 1)

      this.updated = true

      this.$forceUpdate()
    },
    createLogThread: function () {
      this.$q.dialog({
        dark: true,
        title: 'Description...',
        message: 'Please enter description for the thread.',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (data) {
          let newLogThread = {
            title: 'New Log Family 0!',
            description: data,
            data: [],
            index: 0,
            hidden: false
          }

          if (this.curData.logs) {
            let size = this.curData.logs.length
            newLogThread['title'] = `New Log Family ${size}!`

            this.curData.logs.push(newLogThread)
          } else {
            this.curData.logs = [newLogThread]
          }

          this.updated = true

          this.$forceUpdate()
        } else {
          this.$q.notify({
            message: 'Not a valid input!',
            color: 'negative',
            icon: 'report_problem'
          })
        }
      }).onCancel(() => {
        // nothing goes here
      }).onDismiss(() => {
        // nothing goes here
      })
    },
    addLog: function (index) {
      this.$q.dialog({
        dark: true,
        title: 'Description...',
        message: 'Please enter description for the log.',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (data) {
          let tmpLog = {
            title: '',
            date: Date(),
            description: data,
            hidden: false
          }

          if (this.curData.logs[index].data) {
            tmpLog.title = `Child Thread ${this.curData.logs[index].data.length}!`
            this.curData.logs[index].data.push(tmpLog)
          } else {
            tmpLog.title = 'Child Thread 0!'
            this.curData.logs[index].data = [tmpLog]
          }

          this.updated = true
          // can be removed when the datamodel from database is updated
          this.$forceUpdate()
        } else {
          this.$q.notify({
            message: 'Not a valid input!',
            color: 'negative',
            icon: 'report_problem'
          })
        }
      }).onCancel(() => {
        // nothing goes here
      }).onDismiss(() => {
        // nothing goes here
      })
    },
    deleteLog: function (index, parent) {
      /* // console.log(index, parent) */
      this.curData.logs[parent].data.splice(index, 1)

      this.updated = true

      this.$forceUpdate()
    },
    replyLog: function (familyIndex, responseObj) {
      this.$q.dialog({
        dark: true,
        title: 'Response...',
        message: '<strong>Please enter your response.</strong><br><br><p class="text-red">Note: Your reponse cannot be empty!</p>',
        html: true,
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (data) {
          let tmpLog = {
            title: `In respones to: "${responseObj.title}"!`,
            date: Date(),
            description: `>>>>>>>>>>\n${responseObj.description}\n>>>>>>>>>>\n${data}`,
            hidden: false
          }

          // let size = this.curData.logs[familyIndex].data.length

          this.curData.logs[familyIndex].data.push(tmpLog)
          // let size = this.curData.logs[index].data.length
          this.updated = true

          this.$forceUpdate()
        } else {
          this.$q.notify({
            message: 'Not a valid response!',
            color: 'negative',
            icon: 'report_problem'
          })
        }
      }).onCancel(() => {
        // nothing goes here
      }).onDismiss(() => {
        // nothing goes here
      })
    },
    // Edit Mode functions
    projectNameValidation: function (val) {
      if (val === '') {
        return false
      }
      return true
    },
    addCustomField: function () {
      let tmpBody = {}

      if (this.bodyType.value === 'TEXT_BOX') {
        tmpBody = {
          index: this.curData.webpage.body.length + 1,
          content: {
            type: this.bodyType.value
          }
        }
      } else if (this.bodyType.value === 'UNORDERED_LIST') {
        tmpBody = {
          index: this.curData.webpage.body.length + 1,
          content: {
            type: this.bodyType.value,
            list: [
              {}
            ]
          }
        }
      } else if (this.bodyType.value === 'ORDERED_LIST') {
        tmpBody = {
          index: this.curData.webpage.body.length + 1,
          content: {
            type: this.bodyType.value,
            list: [
              {
                index: 1
              }
            ]
          }
        }
      } else {
        tmpBody = {
          index: this.curData.webpage.body.length + 1,
          content: {
            type: this.bodyType.value,
            list: [
              {}
            ]
          }
        }
      }
      tmpBody['hidden'] = false
      this.curData.webpage.body.push(tmpBody)
      this.updated = true
    },
    addChip: function () {
      let tmpChip = {}

      if (this.chipType.value === 'SOURCE') {
        tmpChip = {
          index: this.curData.webpage.chips.length + 1,
          content: {
            label: this.chipType.label,
            type: this.chipType.value,
            icon: 'code'
          }
        }
      } else if (this.chipType.value === 'VIDEO') {
        tmpChip = {
          index: this.curData.webpage.chips.length + 1,
          content: {
            label: this.chipType.label,
            type: this.chipType.value,
            icon: 'movie'
          }
        }
      } else {
        tmpChip = {
          index: this.curData.webpage.chips.length + 1,
          content: {
            label: '',
            type: this.chipType.value,
            icon: null
          }
        }
      }
      tmpChip['hidden'] = false
      this.curData.webpage.chips.push(tmpChip)
      this.updated = true
    },
    displayMembers: function (entry) {
      let retMembers = ''
      entry.forEach(member => {
        retMembers += ', ' + member.name
      })
      return retMembers.substring(1, retMembers.length)
    },
    popDialog: function (entry) {
      if (entry === 'awards') {
        this.dialogJSON['title'] = 'Impact Awards'
      } else {
        this.dialogJSON['title'] = entry.charAt(0).toUpperCase() + entry.slice(1)
      }

      if (entry === 'keywords' && this.curData[entry].length > 1) {
        let tmpArr = []
        this.curData[entry].forEach(key => {
          if (key !== 'tbd') {
            tmpArr.push(key)
          }
        })
        this.dialogJSON['message'] = tmpArr
      } else {
        this.dialogJSON['message'] = this.curData[entry]
      }

      this.fixedDialog = true
    },
    getMainPhoto: function () {
      let max = 5
      let photoId = Math.floor(Math.random() * (max - 1 + 1)) + 1
      return 'statics/images/project-img-' + photoId + '.jpg'
    },
    progressCountUp: function () {
      if (this.curData.progress === 5) {
        this.curData.progress = 0
      } else {
        this.curData.progress += 1
      }
      this.updated = true
    },
    progressCountDown: function () {
      if (this.curData.progress === 0) {
        this.curData.progress = 5
      } else {
        this.curData.progress -= 1
      }
      this.updated = true
    },
    addProjectMember: function () {
      let itemOptions = []

      for (let email in this.userEmailToObjMap) {
        let foundIn = false
        this.curData.members.forEach(member => {
          if (member.email === email) {
            foundIn = true
          }
        })

        if (!foundIn) {
          itemOptions.push({
            label: `${this.userEmailToObjMap[email].name} (${email})`,
            value: {
              ...this.userEmailToObjMap[email],
              role: 'member'
            }
          })
        }
      }

      this.$q.dialog({
        title: 'Add Members',
        options: {
          type: 'checkbox',
          model: [],
          items: itemOptions
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        // console.log('>>>> OK, received', [...data, ...this.curData.members])
        this.curData.members = [...this.curData.members, ...data]
        this.updated = true
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    // Child functions
    emitClose: function () {
      this.$emit('close')
    },
    emitAdded: function () {
      this.$emit('added')
    },
    // Helper functions
    sortBody: function () {
      this.data.webpage.body.sort((a, b) => {
        return a.index - b.index
      })

      this.data.webpage.body.forEach(webContent => {
        if (webContent.content.type === 'ORDERED_LIST') {
          webContent.content.list.sort((a, b) => {
            return a.index - b.index
          })
        }
      })
    },
    openNewTab: function (entry) {
      window.open(entry, '_blank')
    },
    deepObjCopy: function (aObject) {
      // https://stackoverflow.com/questions/4459928/how-to-deep-clone-in-javascript/34624648#34624648
      if (!aObject) {
        return aObject
      }

      let v
      let bObject = Array.isArray(aObject) ? [] : {}
      for (const k in aObject) {
        v = aObject[k]
        bObject[k] = (typeof v === 'object') ? this.deepObjCopy(v) : v
      }

      return bObject
    },
    notifyError: function () {
      this.$q.notify({
        color: 'negative',
        message: 'Field is required!',
        icon: 'warning',
        closeBtn: 'Close'
      })
      return ''
    }
  },
  components: {
    uploadGUI
  }
}
</script>

<style lang="stylus" scoped>
hr.newLine {
  border: 1px solid #ce2029;
}

hr.newLine2 {
  display: block; height: 1px;
  border: 1; border-top: 1px solid #ccc;
  margin: 0em; padding: 0em;
}

br.small {
  display: block; /* makes it have a width */
  content: "";    /* clears default height */
  margin-top: 0em;  /* change this to whatever height you want it */
}

h4 {
  font-size: 2.0em;
  /* background-color: #ccc; width: 80%; */
  margin: 10px;
  padding: 10px;
}

.project-img {
  border: 3px solid #ddd;
  border-radius: 4px;
  padding: 5px
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

ul {
  list-style: none; /* Remove default bullets */
}

ul li::before {
  content: "\25A0";       // Add content: \25A0 is the CSS Code/unicode for a block bullet
  color: $secondary;      // Set the color
  font-weight: bold;
  display: inline-block;  // add space between the bullet and the text
  width: 1em; // space between bullet and text
  margin-left: -2em; // space between bullet and margin
}

.overviewCSS {
  max-height: 240px;
  overflow: auto;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
}

.toggle-label {
  margin-top: 5px;
  font-size: 10.5px;
}
</style>
