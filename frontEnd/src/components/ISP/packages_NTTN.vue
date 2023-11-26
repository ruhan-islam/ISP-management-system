<template>
  <div class="ma-12 mb-12 container-flow">
    <!-- contents here  -->

    <!-- loading -->
    <v-progress-linear
      v-if="isLoading"
      style="margin:20% 0"
      color="deep-purple accent-4"
      indeterminate
      rounded
      height="6"
    ></v-progress-linear>

    <!-- suggestions -->
    <v-container
      v-if="!isLoading && !getUserData.packages.length"
      class="mb-12"
    >
      <v-dialog v-model="dialog" persistent max-width="80%">
        <template v-slot:activator="{ on, attrs }">
          <v-row>
            <v-col cols="1">
              <v-btn
                color="deep-purple lighten-2"
                dark
                v-bind="attrs"
                v-on="on"
                max-width="100%"
                fab
              >
                <v-icon>mdi-robot</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <h5 style="margin-top:15px">Start Tour</h5>
            </v-col>
          </v-row>
        </template>

        <v-card v-if="pageSeq === 1" style="padding: 30px">
          <h2>New to the system? Just start here...</h2>
          <v-form ref="form" v-model="valid2" lazy-validation>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <template v-slot:default="{ open }">
                    <v-row no-gutters>
                      <v-col cols="4">
                        Estimated Number of End Connections
                      </v-col>
                      <v-col cols="8" class="text--secondary">
                        <span v-if="open" key="0">
                          Give us an estimation to the number of your end
                          subscriber
                        </span>
                        <span key="1" v-if="!open && noCon > 0">
                          {{ noCon }} end connections estimated
                        </span>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-text-field
                    v-model="noCon"
                    :rules="noConRules"
                    label="End Connections (Number)"
                    required
                    placeholder="e.g. 10000"
                  ></v-text-field>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <template v-slot:default="{ open }">
                    <v-row no-gutters>
                      <v-col cols="4"> Your desired duration(month) </v-col>
                      <v-col cols="8" class="text--secondary">
                        <span v-if="open" key="0">
                          Enter your desired duration for the package
                        </span>
                        <span key="1" v-if="!open && duration > 0">
                          {{ duration }}
                        </span>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-header>

                <v-expansion-panel-content>
                  <v-slider
                    v-model="duration"
                    :min="3"
                    :step="1"
                    :max="24"
                    label="Duration (month)"
                    class="align-center"
                    thumb-label="always"
                    placeholder="e.g. 6"
                  >
                  </v-slider>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <template v-slot:default="{ open2 }">
                    <v-row no-gutters>
                      <v-col cols="4"> Expected maximum downtime (hour) </v-col>
                      <v-col cols="8" class="text--secondary">
                        <span v-if="open2" key="0">
                          Enter your maximum expected downtime in hour
                        </span>
                        <span key="1" v-if="downTime > 0">
                          {{ downTime }}
                        </span>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-header>

                <v-expansion-panel-content>
                  <v-slider
                    v-model="downTime"
                    :min="0.5"
                    :step="0.5"
                    :max="2.5"
                    label="Maximum Downtime (hour)"
                    class="align-center"
                    thumb-label="always"
                    placeholder="e.g. 6"
                  >
                  </v-slider>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-card-actions>
                <v-btn color="green darken-1" text @click="dialog = false">
                  Cancel
                </v-btn>
                <v-btn
                  :disabled="
                    !(
                      this.valid2 &&
                      this.downTime &&
                      this.noCon &&
                      this.duration
                    )
                  "
                  color="success"
                  class="mr-4"
                  @click="suggestPressed"
                >
                  Suggest
                </v-btn>
              </v-card-actions>
            </v-expansion-panels>
          </v-form>
        </v-card>

        <v-card v-if="pageSeq === 2" style="padding: 30px">
          <v-row v-if="!isLoading" justify="center">
            <div
              class="container col-lg-5"
              v-for="(pkg, i) in suggestedPkgs"
              :key="i"
            >
              <v-card>
                <v-img height="250" src="./../../assets/images.jpg"></v-img>

                <v-card-title>
                  {{ pkg.data.name }} &nbsp;
                  <v-chip v-if="!pkg.data.ongoing" color="red">
                    Disabled
                  </v-chip>
                </v-card-title>

                <v-card-text>
                  <div class="my-4 text-subtitle-1">
                    Taka
                    <span v-if="!pkg.data.offerId"> {{ pkg.data.price }} </span>
                    <template v-if="!!pkg.data.offerId">
                      <s>{{ pkg.data.price }}</s>
                      <span>
                        &nbsp;
                        {{
                          calculateReducedPrice(
                            pkg.data.price,
                            pkg.data.offerId
                          )
                        }}
                      </span>
                      <v-chip color="deep-purple">
                        <span style="color:white">
                          {{ getOfferName(pkg.data.offerId) }}
                        </span>
                      </v-chip>
                    </template>
                  </div>
                  <v-chip-group
                    active-class="deep-purple accent-4 white--text"
                    column
                  >
                    <v-chip v-for="(area, i) in pkg.data.areas" :key="i"
                      >{{ area }}
                    </v-chip>
                  </v-chip-group>
                  <v-chip-group
                    active-class="deep-purple accent-4 white--text"
                    column
                  >
                    <v-chip>{{ pkg.data.bandwidth }} GBPS</v-chip>
                    <v-chip>{{ pkg.data.duration }} months</v-chip>
                  </v-chip-group>

                  <div>
                    {{ pkg.bandwidth }} GBPS speed relentless speed of unlimited
                    traffic with 24/7 service.
                  </div>
                </v-card-text>

                <v-card-actions>
                  <v-col>
                    <v-btn
                      color="deep-purple lighten-2"
                      @click="suggestDetailsPressed(i)"
                      text
                    >
                      Details
                    </v-btn>
                  </v-col>

                  <v-col>
                    <v-btn
                      :disabled="
                        idxList.length >= maxCompareCount &&
                          !idxList.includes(i)
                      "
                      color="deep-purple lighten-2"
                      @click="suggestToggleComparePressed(i)"
                      text
                    >
                      <span v-if="!idxList.includes(i)">
                        Compare
                      </span>
                      <span v-if="idxList.includes(i)"> Remove </span>
                    </v-btn>
                  </v-col>

                  <v-col>
                    <v-btn
                      :disabled="
                        !suggestedPkgs[i].data.ongoing ||
                          !suggestedPkgs[i].status
                      "
                      color="deep-purple lighten-2"
                      @click="suggestSelectPressed(i)"
                      text
                    >
                      Select
                    </v-btn>
                  </v-col>
                  <v-col></v-col>
                </v-card-actions>
              </v-card>
            </div>

            <div>
              <v-row>
                <v-col cols="8"></v-col>
                <v-col>
                  <v-btn color="error" @click="clearCompare" dark>
                    Clear
                  </v-btn>
                </v-col>

                <v-col>
                  <v-badge
                    :content="messages"
                    :value="messages"
                    color="red"
                    overlap
                  >
                    <v-btn
                      color="deep-purple lighten-2"
                      @click="comparePkg"
                      dark
                    >
                      Compare
                    </v-btn>
                  </v-badge>

                  <v-dialog
                    v-model="dialogCompare"
                    fullscreen
                    hide-overlay
                    transition="dialog-bottom-transition"
                  >
                    <v-card>
                      <v-toolbar dark color="primary">
                        <v-btn
                          icon
                          dark
                          @click="
                            dialogCompare = false;
                            messages = 0;
                            idxList = [];
                            compareList = [];
                          "
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Package Comparison</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                          <v-btn
                            dark
                            text
                            @click="
                              dialogCompare = false;
                              messages = 0;
                              idxList = [];
                              compareList = [];
                            "
                          >
                            Done
                          </v-btn>
                        </v-toolbar-items>
                      </v-toolbar>

                      <!-- <v-divider></v-divider> -->

                      <v-card
                        style="
                    margin: 20px 20px;
                    padding: 20px 0px 20px 50px;
                    background-color: #171010;
                    color: white;
                  "
                        elevation="20"
                      >
                        <h4 style="margin-bottom: 50px">Package Comparison</h4>

                        <v-row
                          style="background-color: #595260; margin-right: 40px"
                        >
                          <v-col><h5>Features</h5></v-col>
                          <v-col v-for="(p, j) in compareList" :key="j">
                            <h5 style="margin-left:25px">{{ p.data.name }}</h5>
                          </v-col>
                        </v-row>
                        <v-row style="margin-right: 40px">
                          <v-col>Price(BDT)</v-col>
                          <v-col
                            v-for="(p, j) in compareList"
                            :key="j"
                            style="margin-left:100px"
                            >{{ p.data.price }}</v-col
                          >
                        </v-row>
                        <v-row
                          style="background-color: #595260; margin-right: 40px"
                        >
                          <v-col>Bandwidth(GBPS)</v-col>
                          <v-col
                            v-for="(p, j) in compareList"
                            :key="j"
                            style="margin-left:100px"
                            >{{ p.data.bandwidth }}</v-col
                          >
                        </v-row>
                        <v-row style="margin-right: 40px">
                          <v-col>Duration(months)</v-col>
                          <v-col
                            v-for="(p, j) in compareList"
                            :key="j"
                            style="margin-left:100px"
                            >{{ p.data.duration }}</v-col
                          >
                        </v-row>
                        <v-row
                          style="background-color: #595260; margin-right: 40px"
                        >
                          <v-col>Upload Speed(GBPS)</v-col>
                          <v-col
                            v-for="(p, j) in compareList"
                            :key="j"
                            style="margin-left:100px"
                            >{{ p.data.up_speed }}</v-col
                          >
                        </v-row>
                        <v-row style="margin-right: 40px">
                          <v-col>Download Speed(GBPS)</v-col>
                          <v-col
                            v-for="(p, j) in compareList"
                            :key="j"
                            style="margin-left:100px"
                            >{{ p.data.down_speed }}</v-col
                          >
                        </v-row>
                        <v-row style="margin-right: 40px">
                          <v-col>Estimated Down Time(hrs)</v-col>
                          <v-col
                            v-for="(p, j) in compareList"
                            :key="j"
                            style="margin-left:100px"
                            >{{ p.data.downTime }}</v-col
                          >
                        </v-row>
                        <v-row
                          style="background-color: #595260; margin-right: 40px"
                        >
                          <v-col>Response Time(milliseconds)</v-col>
                          <v-col
                            v-for="(p, j) in compareList"
                            :key="j"
                            style="margin-left:100px"
                            >{{ p.data.responseTime }}</v-col
                          >
                        </v-row>
                      </v-card>
                    </v-card>
                  </v-dialog>

                  <v-dialog
                    v-model="dialogZero"
                    persistent
                    max-width="40%"
                    transition="dialog-bottom-transition"
                  >
                    <v-card>
                      <v-card-title class="text-h5">
                        Not Sufficient Package
                      </v-card-title>
                      <v-card-text
                        >Sufficient amount of package was not selected. Please
                        select at least two packages to compare.</v-card-text
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="green darken-1"
                          text
                          @click="dialogZero = false"
                        >
                          Close
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
            </div>
          </v-row>
          <v-form ref="form" v-model="valid2" lazy-validation>
            <v-expansion-panels>
              <v-card-actions>
                <v-btn color="green darken-1" text @click="pageSeq = 1">
                  Back
                </v-btn>

                <v-btn
                  color="green darken-1"
                  text
                  @click="
                    dialog = false;
                    pageSeq = 1;
                  "
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-expansion-panels>
          </v-form>
        </v-card>
      </v-dialog>
    </v-container>

    <!-- package filters  -->
    <v-row v-if="!isLoading" justify="center">
      <v-card style="padding:0px 20px">
        <v-card-title>Search ISP Packages</v-card-title>
        <v-expansion-panels>
          <v-col>
            Price Range:
            <v-expansion-panel>
              <v-expansion-panel-header>
                <template v-slot:default="{ open }">
                  <v-row no-gutters>
                    <v-col class="text--secondary">
                      <v-fade-transition leave-absolute>
                        <span v-if="open">Select the max and min price:</span>
                        <v-row v-else no-gutters style="width: 100%">
                          <v-col cols="6" style="color: green">
                            Min Cost:
                            {{ filterPrice[0] }}
                          </v-col>
                          <v-col cols="6" style="color: red">
                            Max Cost: {{ filterPrice[1] }}
                          </v-col>
                        </v-row>
                      </v-fade-transition>
                    </v-col>
                  </v-row>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-range-slider
                  v-model="filterPrice"
                  label="Price (Taka)"
                  min="0"
                  max="1000000"
                  step="1000"
                >
                </v-range-slider>
                <label style="color: rgb(97, 91, 91)"
                  >price(min): {{ filterPrice[0] }} <br />
                  price(max): {{ filterPrice[1] }}</label
                >
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-col>
        </v-expansion-panels>

        <v-expansion-panels>
          <v-col>
            Bandwidth Range:
            <v-expansion-panel>
              <v-expansion-panel-header>
                <template v-slot:default="{ open }">
                  <v-row no-gutters>
                    <v-col class="text--secondary">
                      <v-fade-transition leave-absolute>
                        <span v-if="open"
                          >Select the max and min bandwidth:</span
                        >
                        <v-row v-else no-gutters style="width: 100%">
                          <v-col cols="6" style="color: green">
                            Min BW:
                            {{ filterBW[0] }}
                          </v-col>
                          <v-col cols="6" style="color: red">
                            Max BW: {{ filterBW[1] }}
                          </v-col>
                        </v-row>
                      </v-fade-transition>
                    </v-col>
                  </v-row>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-range-slider
                  v-model="filterBW"
                  label="Bandwidth (GBPS)"
                  min="0"
                  max="100"
                  thumb-label="always"
                >
                </v-range-slider>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-col>
          <v-col>
            Duration Range(months):
            <v-expansion-panel>
              <v-expansion-panel-header>
                <template v-slot:default="{ open }">
                  <v-row no-gutters>
                    <v-col class="text--secondary">
                      <v-fade-transition leave-absolute>
                        <span v-if="open"
                          >Select the max and min duration:</span
                        >
                        <v-row v-else no-gutters style="width: 100%">
                          <v-col cols="6" style="color: green">
                            Min Period:
                            {{ filterDuration[0] }}
                          </v-col>
                          <v-col cols="6" style="color: red">
                            Max Period: {{ filterDuration[1] }}
                          </v-col>
                        </v-row>
                      </v-fade-transition>
                    </v-col>
                  </v-row>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-range-slider
                  v-model="filterDuration"
                  label="Duration (Months)"
                  min="0"
                  max="24"
                  thumb-label="always"
                >
                </v-range-slider>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-col>
        </v-expansion-panels>

        <v-card-actions>
          <v-row align="center" justify="end">
            <v-col cols="6"></v-col>
            <v-col>
              <v-btn
                color="deep-purple lighten-2"
                @click="doFilter"
                dark
                max-width="80%"
                margin="10px"
              >
                Filter <v-icon>mdi-filter</v-icon>
              </v-btn>
            </v-col>

            <v-col>
              <v-btn
                color="deep-purple lighten-2"
                @click="clearFilter"
                dark
                margin="10px"
              >
                Clear Filter
              </v-btn>
            </v-col>

            <v-col>
              <v-menu offset-y>
                <template v-slot:activator="{ attrs, on }">
                  <v-btn
                    color="deep-purple lighten-2"
                    class="white--text ma-5"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Sort <v-icon>mdi-sort</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item v-for="item in sortedItems" :key="item" link>
                    <v-list-item-title
                      v-text="item"
                      @click="doSort(item)"
                    ></v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-row>

    <!-- show ISP packages -->
    <v-row v-if="!isLoading" justify="center">
      <div class="container col-lg-5" v-for="(pkg, i) in pkgs" :key="i">
        <v-card>
          <v-img height="250" src="./../../assets/images.jpg"></v-img>

          <v-card-title>
            {{ pkg.data.name }} &nbsp;
            <v-chip v-if="!pkg.data.ongoing" color="red"> Disabled </v-chip>
          </v-card-title>

          <v-card-text>
            <div class="my-4 text-subtitle-1">
              Taka
              <span v-if="!pkg.data.offerId"> {{ pkg.data.price }} </span>
              <template v-if="!!pkg.data.offerId">
                <s>{{ pkg.data.price }}</s>
                <span>
                  &nbsp;
                  {{ calculateReducedPrice(pkg.data.price, pkg.data.offerId) }}
                </span>
                <v-chip color="deep-purple">
                  <span style="color:white">
                    {{ getOfferName(pkg.data.offerId) }}
                  </span>
                </v-chip>
              </template>
            </div>
            <v-chip-group
              active-class="deep-purple accent-4 white--text"
              column
            >
              <v-chip v-for="(area, i) in pkg.data.areas" :key="i"
                >{{ area }}
              </v-chip>
            </v-chip-group>
            <v-chip-group
              active-class="deep-purple accent-4 white--text"
              column
            >
              <v-chip>{{ pkg.data.bandwidth }} GBPS</v-chip>
              <v-chip>{{ pkg.data.duration }} months</v-chip>
            </v-chip-group>

            <div>
              {{ pkg.bandwidth }} GBPS speed relentless speed of unlimited
              traffic with 24/7 service.
            </div>
          </v-card-text>

          <v-card-actions>
            <v-col>
              <v-btn
                color="deep-purple lighten-2"
                @click="detailsPressed(i)"
                text
              >
                Details
              </v-btn>
            </v-col>

            <v-col>
              <v-btn
                :disabled="
                  idxList.length >= maxCompareCount && !idxList.includes(i)
                "
                color="deep-purple lighten-2"
                @click="toggleComparePressed(i)"
                text
              >
                <span v-if="!idxList.includes(i)">
                  Compare
                </span>
                <span v-if="idxList.includes(i)"> Remove </span>
              </v-btn>
            </v-col>

            <v-col>
              <v-btn
                :disabled="!pkgs[i].data.ongoing || !pkgs[i].status"
                color="deep-purple lighten-2"
                @click="selectPressed(i)"
                text
              >
                Select
              </v-btn>
            </v-col>
            <v-col></v-col>
          </v-card-actions>
        </v-card>
      </div>

      <div>
        <v-row>
          <v-col cols="8"></v-col>
          <v-col>
            <v-btn
              :disabled="!compareList.length"
              color="error"
              @click="clearCompare"
              dark
            >
              Clear Compare
            </v-btn>
          </v-col>
          <v-col>
            <v-badge :content="messages" :value="messages" color="red" overlap>
              <v-btn color="deep-purple lighten-2" @click="comparePkg" dark>
                Compare
              </v-btn>
            </v-badge>
          </v-col>
        </v-row>
        <v-row>
          <!-- <v-col> -->
          <v-dialog
            v-model="dialogCompare"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <v-card>
              <v-toolbar dark color="primary">
                <v-btn
                  icon
                  dark
                  @click="
                    dialogCompare = false;
                    messages = 0;
                    idxList = [];
                    compareList = [];
                  "
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Package Comparison</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn
                    dark
                    text
                    @click="
                      dialogCompare = false;
                      messages = 0;
                      idxList = [];
                      compareList = [];
                    "
                  >
                    Done
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>

              <!-- <v-divider></v-divider> -->

              <v-card
                style="
                    margin: 20px 20px;
                    padding: 20px 0px 20px 50px;
                    background-color: #171010;
                    color: white;
                  "
                elevation="20"
              >
                <h4 style="margin-bottom: 50px">Package Comparison</h4>

                <v-row style="background-color: #595260; margin-right: 40px">
                  <v-col><h5>Features</h5></v-col>
                  <v-col v-for="(p, j) in compareList" :key="j">
                    <h5 style="margin-left:25px">{{ p.data.name }}</h5>
                  </v-col>
                </v-row>
                <v-row style="margin-right: 40px">
                  <v-col>Price(BDT)</v-col>
                  <v-col
                    v-for="(p, j) in compareList"
                    :key="j"
                    style="margin-left:100px"
                    >{{ p.data.price }}</v-col
                  >
                </v-row>
                <v-row style="background-color: #595260; margin-right: 40px">
                  <v-col>Bandwidth(GBPS)</v-col>
                  <v-col
                    v-for="(p, j) in compareList"
                    :key="j"
                    style="margin-left:100px"
                    >{{ p.data.bandwidth }}</v-col
                  >
                </v-row>
                <v-row style="margin-right: 40px">
                  <v-col>Duration(months)</v-col>
                  <v-col
                    v-for="(p, j) in compareList"
                    :key="j"
                    style="margin-left:100px"
                    >{{ p.data.duration }}</v-col
                  >
                </v-row>
                <v-row style="background-color: #595260; margin-right: 40px">
                  <v-col>Upload Speed(GBPS)</v-col>
                  <v-col
                    v-for="(p, j) in compareList"
                    :key="j"
                    style="margin-left:100px"
                    >{{ p.data.up_speed }}</v-col
                  >
                </v-row>
                <v-row style="margin-right: 40px">
                  <v-col>Download Speed(GBPS)</v-col>
                  <v-col
                    v-for="(p, j) in compareList"
                    :key="j"
                    style="margin-left:100px"
                    >{{ p.data.down_speed }}</v-col
                  >
                </v-row>
                <v-row style="margin-right: 40px">
                  <v-col>Estimated Down Time(hrs)</v-col>
                  <v-col
                    v-for="(p, j) in compareList"
                    :key="j"
                    style="margin-left:100px"
                    >{{ p.data.downTime }}</v-col
                  >
                </v-row>
                <v-row style="background-color: #595260; margin-right: 40px">
                  <v-col>Response Time(milliseconds)</v-col>
                  <v-col
                    v-for="(p, j) in compareList"
                    :key="j"
                    style="margin-left:100px"
                    >{{ p.data.responseTime }}</v-col
                  >
                </v-row>
              </v-card>
            </v-card>
          </v-dialog>

          <v-dialog
            v-model="dialogZero"
            persistent
            max-width="40%"
            transition="dialog-bottom-transition"
          >
            <v-card>
              <v-card-title class="text-h5">
                Not Sufficient Package
              </v-card-title>
              <v-card-text
                >Sufficient amount of package was not selected. Please select at
                least two packages to compare.</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialogZero = false">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- </v-col> -->
        </v-row>
      </div>
    </v-row>

    <!-- details -->
    <v-row v-if="currPkgIdx !== -1" justify="center">
      <v-dialog v-model="dialog2" max-width="70%">
        <v-card>
          <v-card-title class="text-h5">
            {{ allPkgs[currPkgIdx].data.name }}
          </v-card-title>

          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Features</th>
                    <th class="text-left">Availibility</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Package Name</td>
                    <td>{{ allPkgs[currPkgIdx].data.name }}</td>
                  </tr>
                  <tr>
                    <td>Base Price</td>
                    <td>Tk. {{ allPkgs[currPkgIdx].data.price }} /ISP</td>
                  </tr>
                  <tr v-if="!!allPkgs[currPkgIdx].data.offerId">
                    <td>Reduced Price</td>
                    <td>
                      Tk.
                      {{
                        calculateReducedPrice(
                          allPkgs[currPkgIdx].data.price,
                          allPkgs[currPkgIdx].data.offerId
                        )
                      }}
                      /ISP
                    </td>
                  </tr>
                  <tr>
                    <td>Bandwidth</td>
                    <td>{{ allPkgs[currPkgIdx].data.bandwidth }} GBPS</td>
                  </tr>
                  <tr>
                    <td>Duration</td>
                    <td>{{ allPkgs[currPkgIdx].data.duration }} months</td>
                  </tr>
                  <tr>
                    <td>Coverage Area</td>
                    <td>{{ allPkgs[currPkgIdx].data.areas }}</td>
                  </tr>
                  <tr>
                    <td>Upload Speed</td>
                    <td>{{ allPkgs[currPkgIdx].data.up_speed }} GBPS</td>
                  </tr>
                  <tr>
                    <td>Download Speed</td>
                    <td>{{ allPkgs[currPkgIdx].data.down_speed }} GBPS</td>
                  </tr>
                  <tr>
                    <td>Data Limit</td>
                    <td>Unlimited</td>
                  </tr>
                  <tr>
                    <td>Estimated Down Time</td>
                    <td>{{ allPkgs[currPkgIdx].data.downTime }} hrs</td>
                  </tr>
                  <tr>
                    <td>Estimated Response Time</td>
                    <td>
                      {{ allPkgs[currPkgIdx].data.responseTime }} milliseconds
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>

          <v-card-actions>
            <v-col></v-col>
            <v-col>
              <v-btn
                color="green darken-1"
                text
                @click="
                  dialog2 = false;
                  currPkgIdx = -1;
                "
              >
                Close
              </v-btn>
            </v-col>
            <v-col></v-col>
            <v-col>
              <v-btn
                :disabled="
                  !allPkgs[currPkgIdx].data.ongoing ||
                    !allPkgs[currPkgIdx].status
                "
                color="deep-purple lighten-2"
                @click="selectPressed(currPkgIdx)"
                text
              >
                Select
              </v-btn>
            </v-col>
            <v-col></v-col>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";
// import payments from "./payments";

export default {
  // components: { payments },

  data() {
    return {
      pageSeq: 1,
      downTime: 0,
      key: "",
      valid2: false,
      selectedOpt: "nttn",
      dialog: false,
      noCon: 0,
      duration: 0,
      suggestedPkgs: [],
      suggestIdxList: [],

      noConRules: [
        (v) => !!v || "Please enter your estimated number",
        (v) => /^\d*$/.test(v) || "Number should be valid2",
        (v) => v <= 80000 || "Too much end users!!",
      ],

      maxCompareCount: 3,
      dialogCompare: false,
      dialogZero: false,
      idxList: [],
      compareList: [],
      compareDisable: false,
      messages: 0,

      isLoading: true,
      valid: false,
      dialog2: false,
      showPayment: false,
      selectedPkg: {},

      showSnackbar: false,
      pageInfo: "",
      myPackageList: [],
      allOffers: [],
      validOffers: [],
      allPkgs: [],
      pkgs: [],
      currPkgIdx: -1,
      filterPrice: [0, 1000000],
      filterBW: [1, 100],
      filterDuration: [1, 24],
      sortedItems: [
        "Name 🔺",
        "Name 🔻",
        "Price 🔺",
        "Price 🔻",
        "Duration 🔺",
        "Duration 🔻",
        "Bandwidth 🔺",
        "Bandwidth 🔻",
      ],
    };
  },

  computed: {
    ...mapGetters(["getUserID", "getUserData", "getSelectedPkg"]),
  },

  mounted() {
    this.fetchAllOffers();
    this.fetchAllPackages();
  },

  methods: {
    ...mapMutations(["setUserData", "setSelectedPkg"]),

    fetchAllPackages() {
      this.isLoading = true;

      axios
        .post("/api/package/fetchByQueryWithStatus", {
          type: 2,
          id: this.getUserID,
        })
        .then((res) => {
          if (res.status === 200) {
            // console.log(res.data);
            this.allPkgs = res.data;
            for (let i in this.allPkgs) {
              // console.log(this.allPkgs[i].areas);
              if (
                this.allPkgs[i].data.areas.includes("Nation-wide") ||
                this.allPkgs[i].data.areas.includes(this.getUserData.region)
              ) {
                // console.log("in");
                this.pkgs.push(this.allPkgs[i]);
              }
            }
            this.allPkgs = this.pkgs;
            this.isLoading = false;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchAllOffers() {
      axios
        .post("/api/offer/fetchByQuery", {
          creator: "Nttn",
        })
        .then((res) => {
          if (res.status === 200) {
            this.allOffers = res.data.data;
            // console.log(this.allOffers);
            this.validOffers = [];
            for (let i in this.allOffers) {
              if (
                this.allOffers[i].expirationTime.slice(0, 10) >= this.getToday()
              ) {
                this.validOffers.push(this.allOffers[i]);
              }
            }
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    suggestPressed() {
      this.suggestedPkgs = [];
      this.suggestIdxList = [];
      for (let i in this.allPkgs) {
        if (
          this.allPkgs[i].data.bandwidth >= this.noCon / 1000 &&
          this.allPkgs[i].data.duration >= this.duration - 3 &&
          this.allPkgs[i].data.duration <= this.duration + 3 &&
          this.allPkgs[i].data.downTime <= this.downTime
        ) {
          this.suggestIdxList.push(i);
          this.suggestedPkgs.push(this.allPkgs[i]);
        }
      }
      this.suggestedPkgs.sort(this.orderByPriceAscending);
      this.messages = 0;
      this.idxList = [];
      this.compareList = [];
      this.pageSeq = 2;
    },

    suggestSelectPressed(i) {
      // console.log(i);
      this.setSelectedPkg(this.allPkgs[this.suggestIdxList[i]].data);
      this.$router.push("/ISP/payments");
      // this.showPayment = true;
    },

    suggestDetailsPressed(i) {
      this.currPkgIdx = this.suggestIdxList[i];
      this.dialog2 = true;
      // console.log(this.currPkgIdx);
    },

    suggestToggleComparePressed(i) {
      console.log(this.suggestIdxList);
      let idx = this.idxList.indexOf(i);

      if (idx > -1) {
        this.compareList.splice(idx, 1);
        this.idxList.splice(idx, 1);
        this.messages--;
      } else {
        this.idxList.push(i);
        this.compareList.push(this.allPkgs[this.suggestIdxList[i]]);
        this.messages++;
      }
    },

    computeCompareState(i) {
      if (this.idxList.includes(i)) {
        return false;
      }
      return true;
    },

    findIdx(myPkg) {
      this.currPkgIdx = -1;
      for (let i in this.allPkgs) {
        if (this.allPkgs[i].data._id === myPkg._id) {
          this.currPkgIdx = i;
          break;
        }
      }
      if (this.currPkgIdx !== -1) {
        this.dialog2 = true;
      }
    },

    selectPressed(i) {
      // console.log(i);
      this.setSelectedPkg(this.allPkgs[i].data);
      this.$router.push("/ISP/payments");
      // this.showPayment = true;
    },

    detailsPressed(i) {
      this.currPkgIdx = i;
      this.dialog2 = true;
      // console.log(this.currPkgIdx);
    },

    toggleComparePressed(i) {
      let idx = this.idxList.indexOf(i);

      if (idx > -1) {
        this.compareList.splice(idx, 1);
        this.idxList.splice(idx, 1);
        this.messages--;
      } else {
        this.idxList.push(i);
        this.compareList.push(this.allPkgs[i]);
        this.messages++;
      }
    },

    comparePkg() {
      if (this.compareList.length < 2) {
        this.dialogZero = true;
      } else {
        this.dialogCompare = true;
        this.compareDisable = false;
      }
    },

    clearCompare() {
      this.compareDisable = false;
      this.idxList = [];
      this.compareList = [];
      this.messages = 0;
    },

    isProceedDisabled() {
      return !(this.valid && this.amount);
    },

    getOfferName(offerId) {
      if (!offerId) {
        return;
      }
      for (let i in this.allOffers) {
        if (this.allOffers[i]._id === offerId) {
          return this.allOffers[i].name;
        }
      }
    },

    calculateReducedPrice(price, offerId) {
      let percentage = 0;
      if (!offerId) {
        return price;
      }
      for (let i in this.allOffers) {
        if (this.allOffers[i]._id === offerId) {
          percentage = this.allOffers[i].reduction;
          break;
        }
      }
      return price - (price * percentage) / 100.0;
    },

    getToday() {
      let today = new Date();
      today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
      return today.toISOString().slice(0, 10);
    },

    resetPressed() {
      this.noCon = 0;
      this.duration = 0;
    },

    isSubmitDisabled() {
      return !(this.valid2 && this.noCon && this.duration);
    },

    isResetDisabled() {
      return !(this.noCon || this.duration);
    },

    doSort(item) {
      if (item == "Price 🔺") {
        this.pkgs.sort(this.orderByPriceAscending);
      } else if (item == "Duration 🔺") {
        this.pkgs.sort(this.orderByDurationAscending);
      } else if (item == "Bandwidth 🔺") {
        this.pkgs.sort(this.orderByBandwidthAscending);
      } else if (item == "Name 🔺") {
        this.pkgs.sort(this.orderByNameAscending);
      } else if (item == "Price 🔻") {
        this.pkgs.sort(this.orderByPriceDescending);
      } else if (item == "Duration 🔻") {
        this.pkgs.sort(this.orderByDurationDescending);
      } else if (item == "Bandwidth 🔻") {
        this.pkgs.sort(this.orderByBandwidthDescending);
      } else if (item == "Name 🔻") {
        this.pkgs.sort(this.orderByNameDescending);
      }
    },

    orderByNameAscending(a, b) {
      if (a.data.name.toUpperCase() < b.data.name.toUpperCase()) {
        return -1;
      }
      if (a.data.name.toUpperCase() > b.data.name.toUpperCase()) {
        return 1;
      }
      return 0;
    },

    orderByPriceAscending(a, b) {
      if (a.data.price < b.data.price) {
        return -1;
      }
      if (a.data.price > b.data.price) {
        return 1;
      }
      return 0;
    },

    orderByBandwidthAscending(a, b) {
      if (a.data.bandwidth < b.data.bandwidth) {
        return -1;
      }
      if (a.data.bandwidth > b.data.bandwidth) {
        return 1;
      }
      return 0;
    },

    orderByDurationAscending(a, b) {
      if (a.data.duration < b.data.duration) {
        return -1;
      }
      if (a.data.duration > b.data.duration) {
        return 1;
      }
      return 0;
    },

    orderByNameDescending(a, b) {
      if (a.data.name.toUpperCase() > b.data.name.toUpperCase()) {
        return -1;
      }
      if (a.data.name.toUpperCase() < b.data.name.toUpperCase()) {
        return 1;
      }
      return 0;
    },

    orderByPriceDescending(a, b) {
      if (a.data.price > b.data.price) {
        return -1;
      }
      if (a.data.price < b.data.price) {
        return 1;
      }
      return 0;
    },

    orderByBandwidthDescending(a, b) {
      if (a.data.bandwidth > b.data.bandwidth) {
        return -1;
      }
      if (a.data.bandwidth < b.data.bandwidth) {
        return 1;
      }
      return 0;
    },

    orderByDurationDescending(a, b) {
      if (a.data.duration > b.data.duration) {
        return -1;
      }
      if (a.data.duration < b.data.duration) {
        return 1;
      }
      return 0;
    },

    doFilter() {
      let minPrice =
        this.filterPrice[0] < this.filterPrice[1]
          ? this.filterPrice[0]
          : this.filterPrice[1];
      let maxPrice =
        this.filterPrice[0] > this.filterPrice[1]
          ? this.filterPrice[0]
          : this.filterPrice[1];
      let minBandwidth =
        this.filterBW[0] < this.filterBW[1]
          ? this.filterBW[0]
          : this.filterBW[1];
      let maxBandwidth =
        this.filterBW[0] > this.filterBW[1]
          ? this.filterBW[0]
          : this.filterBW[1];
      let minDuration =
        this.filterDuration[0] < this.filterDuration[1]
          ? this.filterDuration[0]
          : this.filterDuration[1];
      let maxDuration =
        this.filterDuration[0] > this.filterDuration[1]
          ? this.filterDuration[0]
          : this.filterDuration[1];
      this.pkgs = [];
      // console.log(minPrice, maxPrice);
      for (let pkg in this.allPkgs) {
        if (
          this.allPkgs[pkg].data.price >= minPrice &&
          this.allPkgs[pkg].data.price <= maxPrice &&
          this.allPkgs[pkg].data.bandwidth >= minBandwidth &&
          this.allPkgs[pkg].data.bandwidth <= maxBandwidth &&
          this.allPkgs[pkg].data.duration >= minDuration &&
          this.allPkgs[pkg].data.duration <= maxDuration
        ) {
          this.pkgs.push(this.allPkgs[pkg]);
        }
      }
      this.markVal = 0;
    },

    clearFilter() {
      this.filterPrice = [0, 1000000];
      this.filterBW = [1, 100];
      this.filterDuration = [1, 24];
      this.pkgs = this.allPkgs;
    },
  },
};
</script>
