<template>
  <div>
    <topbar></topbar>

    <div class="ma-12 mb-12 container-flow">
      <!-- create new package  -->
      <v-progress-linear
        v-if="isLoading"
        style="margin:20% 0"
        color="deep-purple accent-4"
        indeterminate
        rounded
        height="6"
      ></v-progress-linear>

      <template v-if="!isLoading">
        <v-row justify="start">
          <v-dialog v-model="dialog" persistent max-width="80%">
            <template v-slot:activator="{ on, attrs }">
              <v-col cols="1">
                <v-btn
                  color="deep-purple lighten-2"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  max-width="100%"
                  fab
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <h5 style="margin-top:15px">Create New Package</h5>
              </v-col>
            </template>

            <v-card style="padding: 30px">
              <h2>New Package</h2>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      <template v-slot:default="{ open }">
                        <v-row no-gutters>
                          <v-col cols="4"> Package Name </v-col>
                          <v-col cols="8" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="open" key="0">
                                Enter a name for new package
                              </span>
                              <span v-else key="1">
                                {{ packageName }}
                              </span>
                            </v-fade-transition>
                          </v-col>
                        </v-row>
                      </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-text-field
                        placeholder="e.g. Ultra_premium"
                        v-model="packageName"
                        :counter="nameLen"
                        :rules="nameRules"
                        label="Package Name"
                        required
                      ></v-text-field>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      <template v-slot:default="{ open }">
                        <v-row no-gutters>
                          <v-col cols="4"> Price(BDT) </v-col>
                          <v-col cols="8" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="open" key="0">
                                Enter price of the package
                              </span>
                              <span v-else key="1">
                                {{ price }}
                              </span>
                            </v-fade-transition>
                          </v-col>
                        </v-row>
                      </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-text-field
                        v-model="price"
                        :rules="priceRules"
                        label="Price (BDT)"
                        required
                      ></v-text-field>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel>
                    <v-expansion-panel-header v-slot="{ open }">
                      <v-row no-gutters>
                        <v-col cols="4"> Coverage Area </v-col>
                        <v-col cols="8" class="text--secondary">
                          <v-fade-transition leave-absolute>
                            <span v-if="open" key="0">
                              Select package coverage areas
                            </span>
                            <span v-else key="1">
                              {{ areas.length === 0 ? "" : areas }}
                            </span>
                          </v-fade-transition>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row no-gutters>
                        <v-spacer></v-spacer>
                        <v-autocomplete
                          v-model="areas"
                          :items="areaList"
                          label="Coverage Area"
                          :rules="areaRules"
                          multiple
                        ></v-autocomplete>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      <template v-slot:default="{ open }">
                        <v-row no-gutters>
                          <v-col cols="4"> Bandwidth(GBPS) </v-col>
                          <v-col cols="8" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="open" key="0">
                                Enter bandwidth of the package
                              </span>
                              <span v-else key="1">
                                {{ bandwidth }}
                              </span>
                            </v-fade-transition>
                          </v-col>
                        </v-row>
                      </template>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                      <v-slider
                        v-model="bandwidth"
                        :min="minBW"
                        :max="maxBW"
                        label="Bandwidth (GBPS)"
                        class="align-center"
                        thumb-label="always"
                      >
                      </v-slider>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      <template v-slot:default="{ open }">
                        <v-row no-gutters>
                          <v-col cols="4"> Duration(month) </v-col>
                          <v-col cols="8" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="open" key="0">
                                Enter bandwidth of the package
                              </span>
                              <span v-else key="1">
                                {{ duration }}
                              </span>
                            </v-fade-transition>
                          </v-col>
                        </v-row>
                      </template>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                      <v-slider
                        v-model="duration"
                        :min="minDur"
                        :step="stepDur"
                        :max="maxDur"
                        label="Duration (month)"
                        class="align-center"
                        thumb-label="always"
                      >
                      </v-slider>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      <template v-slot:default="{ open }">
                        <v-row no-gutters>
                          <v-col cols="4"> Download Speed(GBPS) </v-col>
                          <v-col cols="8" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="open" key="0">
                                Enter download speed of the package
                              </span>
                              <span v-else key="1">
                                {{ downSpeed }}
                              </span>
                            </v-fade-transition>
                          </v-col>
                        </v-row>
                      </template>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                      <v-slider
                        v-model="downSpeed"
                        :min="minBW"
                        :max="maxBW"
                        label="Download speed (GBPS)"
                        thumb-label="always"
                        :rules="speedRules"
                      >
                      </v-slider>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      <template v-slot:default="{ open }">
                        <v-row no-gutters>
                          <v-col cols="4"> Upload Speed(GBPS) </v-col>
                          <v-col cols="8" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="open" key="0">
                                Enter upload speed of the package
                              </span>
                              <span v-else key="1">
                                {{ upSpeed }}
                              </span>
                            </v-fade-transition>
                          </v-col>
                        </v-row>
                      </template>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                      <v-slider
                        v-model="upSpeed"
                        :min="minBW"
                        :max="maxBW"
                        label="Upload speed (GBPS)"
                        thumb-label="always"
                        :rules="speedRules"
                      >
                      </v-slider>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      <template v-slot:default="{ open }">
                        <v-row no-gutters>
                          <v-col cols="4">Estimated Down Time(hours) </v-col>
                          <v-col cols="8" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="open" key="0">
                                Enter estimated down time of the package
                              </span>
                              <span v-else key="1">
                                {{ downTime }}
                              </span>
                            </v-fade-transition>
                          </v-col>
                        </v-row>
                      </template>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                      <v-slider
                        v-model="downTime"
                        :min="minDT"
                        :step="stepDT"
                        :max="maxDT"
                        label="Down-time (hour)"
                        thumb-label="always"
                      >
                      </v-slider>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      <template v-slot:default="{ open }">
                        <v-row no-gutters>
                          <v-col cols="4"> Response Time(milliseconds) </v-col>
                          <v-col cols="8" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="open" key="0">
                                Enter response time of the package
                              </span>
                              <span v-else key="1">
                                {{ responseTime }}
                              </span>
                            </v-fade-transition>
                          </v-col>
                        </v-row>
                      </template>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                      <v-slider
                        v-model="responseTime"
                        :min="minRT"
                        :step="stepRT"
                        :max="maxRT"
                        label="Response Time (milliseconds)"
                        thumb-label="always"
                      >
                      </v-slider>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-card-actions>
                    <v-btn
                      :disabled="isResetDisabled"
                      color="error"
                      class="mr-4"
                      @click="resetPressed"
                    >
                      Reset
                    </v-btn>

                    <v-btn
                      :disabled="isSubmitDisabled"
                      color="success"
                      class="mr-4"
                      @click="newPkgConfirmPressed"
                    >
                      Confirm
                    </v-btn>
                    <v-btn color="green darken-1" text @click="dialog = false">
                      Cancel
                    </v-btn>
                  </v-card-actions>
                </v-expansion-panels>
              </v-form>
            </v-card>
          </v-dialog>
        </v-row>

        <!-- package filters  -->
        <v-row class="ma-1" justify="center">
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
                            <span v-if="open"
                              >Select the max and min price:</span
                            >
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
                      :min="minPrice"
                      :max="maxPrice"
                      :step="stepPrice"
                    >
                    </v-range-slider>
                    <label style="color: rgb(97, 91, 91)"
                      >price(min): {{ filterPrice[0] }} <br />
                      price(max): {{ filterPrice[1] }}</label
                    >
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-col>
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
                      :min="minBW"
                      :max="maxBW"
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
                      :min="minDur"
                      :max="maxDur"
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

        <v-row justify="center">
          <v-btn color="deep-purple lighten-2" text> ISP Packages </v-btn>
        </v-row>

        <!-- showing packages -->
        <v-row>
          <div class="col-6" v-for="(pkg, i) in pkgs" :key="i">
            <v-badge
              :content="0"
              :value="markVal"
              color="green"
              overlap
              icon="mdi-check"
            >
              <v-card>
                <v-img height="250" src="./../../assets/images.jpg"></v-img>

                <v-card-title>
                  {{ pkg.name }} &nbsp;
                  <v-chip v-if="!pkg.ongoing" color="red"> Disabled </v-chip>
                </v-card-title>

                <v-card-text>
                  <div class="my-4 text-subtitle-1">
                    Taka
                    <span v-if="!pkg.offerId"> {{ pkg.price }} </span>
                    <template v-if="!!pkg.offerId">
                      <s>{{ pkg.price }}</s>
                      <span>
                        &nbsp;
                        {{ calculateReducedPrice(pkg.price, pkg.offerId) }}
                      </span>
                      <v-chip color="deep-purple">
                        <span style="color:white">
                          {{ getOfferName(pkg.offerId) }}
                        </span>
                      </v-chip>
                    </template>
                  </div>
                  <v-chip-group
                    active-class="deep-purple accent-4 white--text"
                    column
                  >
                    <v-chip>{{ pkg.bandwidth }} GBPS</v-chip>
                    <v-chip>{{ pkg.duration }} months</v-chip>
                  </v-chip-group>
                  <div>
                    {{ pkg.bandwidth }} GBPS speed relentless speed of unlimited
                    traffic with 24/7 service.
                  </div>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    color="deep-purple lighten-2"
                    @click="detailsPressed(i)"
                    text
                  >
                    Details
                  </v-btn>

                  <v-btn
                    @click="toggleOfferPressed(i)"
                    color="deep-purple lighten-2"
                    text
                  >
                    <span v-if="!pkg.offerId"> Add Offer </span>
                    <span v-if="!!pkg.offerId"> Remove Offer </span>
                  </v-btn>

                  <v-btn
                    @click="toggleStatusPressed(i)"
                    color="deep-purple lighten-2"
                    text
                  >
                    <span v-if="pkg.ongoing"> Disable </span>
                    <span v-if="!pkg.ongoing"> Enable </span>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-badge>
          </div>
        </v-row>

        <!-- details & offer -->
        <v-row v-if="currPkgIdx != -1" justify="center">
          <!-- package details -->
          <v-dialog v-model="dialog2" max-width="40%" dark>
            <v-card>
              <v-card-title class="text-h5">
                {{ allPkgs[currPkgIdx].name }}
              </v-card-title>

              <v-card-text>
                <!-- object: {{ allPkgs[currPkgIdx] }} <br />
              name: {{ allPkgs[currPkgIdx].name }} <br />
              bandwidth: {{ allPkgs[currPkgIdx].bandwidth }} GBPS <br />-->

                <v-simple-table dark>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Features</th>
                        <th class="text-left">Availibility</th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- <tr v-for="item in pkgDetails" :key="item.name"> -->
                      <tr>
                        <td>Package Name</td>
                        <td>{{ allPkgs[currPkgIdx].name }}</td>
                      </tr>
                      <tr>
                        <td>Base Price (Taka)</td>
                        <td>Tk. {{ allPkgs[currPkgIdx].price }} /ISP</td>
                      </tr>
                      <tr v-if="!!allPkgs[currPkgIdx].offerId">
                        <td>Reduced Price</td>
                        <td>
                          Tk.
                          {{
                            calculateReducedPrice(
                              allPkgs[currPkgIdx].price,
                              allPkgs[currPkgIdx].offerId
                            )
                          }}
                          /ISP
                        </td>
                      </tr>
                      <tr>
                        <td>Bandwidth (GBPS)</td>
                        <td>{{ allPkgs[currPkgIdx].bandwidth }} GBPS</td>
                      </tr>
                      <tr>
                        <td>Duration (months)</td>
                        <td>{{ allPkgs[currPkgIdx].duration }} months</td>
                      </tr>
                      <tr>
                        <td>Coverage Area</td>
                        <td>{{ allPkgs[currPkgIdx].areas }}</td>
                      </tr>
                      <tr>
                        <td>Upload Speed (GBPS)</td>
                        <td>{{ allPkgs[currPkgIdx].up_speed }} GBPS</td>
                      </tr>
                      <tr>
                        <td>Download Speed (GBPS)</td>
                        <td>{{ allPkgs[currPkgIdx].down_speed }} GBPS</td>
                      </tr>
                      <tr>
                        <td>Data Limit</td>
                        <td>Unlimited</td>
                      </tr>
                      <tr>
                        <td>Estimated Down Time (hours)</td>
                        <td>{{ allPkgs[currPkgIdx].downTime }} hrs</td>
                      </tr>
                      <tr>
                        <td>Estimated Response Time (milliseconds)</td>
                        <td>{{ allPkgs[currPkgIdx].responseTime }} ms</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>

              <v-card-actions>
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
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- offer -->
          <v-dialog v-model="dialog3" max-width="50%" dark>
            <v-card>
              <v-card-title class="text-h5"> Offer List </v-card-title>

              <v-card-text>
                <!-- object: {{ allPkgs[currPkgIdx] }} <br />
              name: {{ allPkgs[currPkgIdx].name }} <br />
              bandwidth: {{ allPkgs[currPkgIdx].bandwidth }} GBPS <br />-->
                <!-- :label="`Radio ${n}`" -->
                <!-- <v-radio-group mandatory v-model="selectedOffer">
                  <v-radio
                    v-for="(offer, i) in validOffers"
                    :key="i"
                    :label="
                      `${offer.name} -- Reduction: ${
                        offer.reduction
                      }% -- Duration (From ${offer.startTime.slice(
                        0,
                        10
                      )} To ${offer.expirationTime.slice(0, 10)} )`
                    "
                    :value="offer._id"
                  >
                  </v-radio>
                </v-radio-group> -->
                <v-radio-group mandatory v-model="selectedOffer">
                  <v-radio
                    v-for="(offer, i) in validOffers"
                    :key="i"
                    :label="`${offer.name} -- Reduction: ${offer.reduction}%`"
                    :value="offer._id"
                  >
                  </v-radio>
                </v-radio-group>
              </v-card-text>

              <v-card-actions>
                <v-btn color="green darken-1" text @click="offerConfirmPressed">
                  Confirm
                </v-btn>
                <v-btn
                  color="green darken-1"
                  text
                  @click="
                    dialog3 = false;
                    currPkgIdx = -1;
                  "
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>

        <v-snackbar :value="showSuccessOverlay">
          Package Successfully Added!
        </v-snackbar>
      </template>
    </div>

    <bottombar></bottombar>
  </div>
</template>

<script>
import axios from "axios";
import topbar from "./topbar.vue";
import bottombar from "./bottombar.vue";
export default {
  components: { topbar, bottombar },
  data() {
    return {
      isLoading: true,
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

      valid: false,
      dialog: false,
      dialog2: false,
      dialog3: false,
      currPkgIdx: -1,
      showSuccessOverlay: false,
      selectedOffer: "",
      areas: [],

      areaList: [
        "Nation-wide",
        "Dhaka",
        "Rajshahi",
        "Chittagong",
        "Mymensingh",
        "Khulna",
        "Barishal",
        "Sylhet",
        "Rangpur",
      ],

      areaRules: [
        (v) => !!v.length || "This field is required",
        (v) =>
          !(v.length > 1 && this.areas.includes(this.areaList[0])) ||
          "Invalid combination",
      ],

      packageName: "",
      nameLen: 20,

      nameRules: [
        (v) => !!v || "Name is required",
        (v) => !this.pkgNameList.includes(v.trim()) || "Name already in use",
        (v) =>
          (v && v.length <= this.nameLen) ||
          `Name must be less than ${this.nameLen} characters`,
      ],
      price: "",

      priceRules: [
        (v) => !!v || "price is required",
        (v) => /^\d*$/.test(v) || "price must be valid",
      ],

      bandwidth: "",
      upSpeed: "",
      downSpeed: "",
      minBW: 1,
      maxBW: 100,
      speedRules: [(v) => v <= this.bandwidth || "must be less than bandwidth"],
      duration: "",
      minDur: 3,
      stepDur: 3,
      maxDur: 24,
      downTime: "",
      minDT: 0,
      stepDT: 0.5,
      maxDT: 12,
      responseTime: "",
      minRT: 1,
      stepRT: 1,
      maxRT: 2000,
      allPkgs: [],
      pkgs: [],
      dummyPkg: "",
      pkgNameList: [],
      allOffers: [],
      validOffers: [],
      minPrice: 0,
      maxPrice: 1000000,
      stepPrice: 10000,
      filterPrice: [0, 1000000],
      filterBW: [0, 100],
      filterDuration: [0, 24],
      markVal: 0,
      selectallTitle: "Select All",
    };
  },

  computed: {
    isSubmitDisabled() {
      return !(
        this.valid &&
        this.packageName &&
        this.bandwidth &&
        this.duration &&
        this.downSpeed &&
        this.upSpeed &&
        this.responseTime &&
        this.downTime &&
        this.price &&
        this.areas.length
      );
    },

    isResetDisabled() {
      return !(
        this.packageName ||
        this.price ||
        this.areas.length ||
        this.bandwidth > this.minBW ||
        this.duration > this.minDur ||
        this.upSpeed > this.bandwidth ||
        this.downSpeed > this.bandwidth ||
        this.downTime > 0 ||
        this.responseTime > this.minRT
      );
    },
  },

  mounted() {
    this.isLoading = true;
    this.fetchOfers();
    this.fetchPackages();
  },

  methods: {
    fetchOfers() {
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
                this.allOffers[i].startTime.slice(0, 10) <= this.getToday() &&
                this.allOffers[i].expirationTime.slice(0, 10) >= this.getToday()
              ) {
                this.validOffers.push(this.allOffers[i]);
              }
            }
            this.allOffers = this.validOffers;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchPackages() {
      axios
        .post("/api/package/fetchByQuery", {
          packageCreator: "Nttn",
        })
        .then((res) => {
          if (res.status === 200) {
            this.allPkgs = res.data.data;
            this.pkgs = this.allPkgs;
            this.pkgNameList = [];
            this.markVal = 0;
            for (let i in this.pkgs) {
              this.pkgNameList.push(this.allPkgs[i].name);
            }
            this.isLoading = false;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getToday() {
      let today = new Date();
      today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
      return today.toISOString().slice(0, 10);
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

    newPkgConfirmPressed() {
      this.dialog = false;
      // console.log("submit pressed");
      let newPkg = {
        name: this.packageName,
        package_type: 0,
        bandwidth: this.bandwidth,
        up_speed: this.upSpeed,
        down_speed: this.downSpeed,
        duration: this.duration,
        price: this.price,
        ongoing: true,
        isRealIp: true,
        downTime: this.downTime,
        responseTime: this.responseTime,
        areas: this.areas,
      };
      axios
        .post("/api/package/insert", newPkg)
        .then((res) => {
          if (res.status === 201) {
            // this.$refs.form.reset();
            this.resetPressed();
            this.allPkgs.push(newPkg);
            this.pkgs = this.allPkgs;
            this.pkgNameList.push(newPkg.name);
            this.filterPrice = [0, 1000000];
            this.filterBW = [0, 100];
            this.filterDuration = [0, 24];
            this.showSuccessOverlay = true;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    offerConfirmPressed() {
      // console.log(this.selectedOffer);
      this.dialog3 = false;
      axios
        .post("/api/package/addOffer", {
          name: this.pkgs[this.currPkgIdx].name,
          packageCreator: "Nttn",
          offerId: this.selectedOffer,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            this.pkgs[this.currPkgIdx].offerId = this.selectedOffer;
            this.currPkgIdx = -1;
            this.selectedOffer = "";
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    toggleOfferPressed(i) {
      this.currPkgIdx = i;
      // console.log(this.currPkgIdx);
      if (!this.allPkgs[i].offerId) {
        this.dialog3 = true;
      } else {
        this.selectedOffer = null; // for removing offer
        axios
          .post("/api/package/addOffer", {
            name: this.pkgs[this.currPkgIdx].name,
            packageCreator: "Nttn",
            offerId: this.selectedOffer,
          })
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              this.pkgs[this.currPkgIdx].offerId = this.selectedOffer;
              this.currPkgIdx = -1;
              this.selectedOffer = "";
            } else {
              this.error = true;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    toggleStatusPressed(i) {
      axios
        .post("/api/package/updateStatus", {
          name: this.pkgs[i].name,
          packageCreator: "Nttn",
          ongoing: !this.pkgs[i].ongoing,
        })
        .then((res) => {
          if (res.status === 200) {
            this.pkgs[i].ongoing = !this.pkgs[i].ongoing;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    detailsPressed(i) {
      this.currPkgIdx = i;
      this.dialog2 = true;
      // console.log(this.currPkgIdx);
    },

    resetPressed() {
      // this.$refs.form.reset();
      this.packageName = "";
      this.price = "";
      this.areas = [];
      this.bandwidth = "";
      this.duration = "";
      this.downSpeed = "";
      this.upSpeed = "";
      this.downTime = "";
      this.responseTime = "";
    },

    selectallMethod() {
      this.markVal = 1 - this.markVal;
      if (this.selectallTitle == "Select All")
        this.selectallTitle = "Unselect All";
      else this.selectallTitle = "Select All";
    },

    doSort(item) {
      // ["price 🔺", "price 🔻", "duraation 🔺","duraation 🔻",
      //           "bandwidth 🔺","bandwidth 🔻"],
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
      if (a.name.toUpperCase() < b.name.toUpperCase()) {
        return -1;
      }
      if (a.name.toUpperCase() > b.name.toUpperCase()) {
        return 1;
      }
      return 0;
    },

    orderByPriceAscending(a, b) {
      if (a.price < b.price) {
        return -1;
      }
      if (a.price > b.price) {
        return 1;
      }
      return 0;
    },

    orderByBandwidthAscending(a, b) {
      if (a.bandwidth < b.bandwidth) {
        return -1;
      }
      if (a.bandwidth > b.bandwidth) {
        return 1;
      }
      return 0;
    },

    orderByDurationAscending(a, b) {
      if (a.duration < b.duration) {
        return -1;
      }
      if (a.duration > b.duration) {
        return 1;
      }
      return 0;
    },

    orderByNameDescending(a, b) {
      if (a.name.toUpperCase() > b.name.toUpperCase()) {
        return -1;
      }
      if (a.name.toUpperCase() < b.name.toUpperCase()) {
        return 1;
      }
      return 0;
    },

    orderByPriceDescending(a, b) {
      if (a.price > b.price) {
        return -1;
      }
      if (a.price < b.price) {
        return 1;
      }
      return 0;
    },

    orderByBandwidthDescending(a, b) {
      if (a.bandwidth > b.bandwidth) {
        return -1;
      }
      if (a.bandwidth < b.bandwidth) {
        return 1;
      }
      return 0;
    },

    orderByDurationDescending(a, b) {
      if (a.duration > b.duration) {
        return -1;
      }
      if (a.duration < b.duration) {
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
          this.allPkgs[pkg].price >= minPrice &&
          this.allPkgs[pkg].price <= maxPrice &&
          this.allPkgs[pkg].bandwidth >= minBandwidth &&
          this.allPkgs[pkg].bandwidth <= maxBandwidth &&
          this.allPkgs[pkg].duration >= minDuration &&
          this.allPkgs[pkg].duration <= maxDuration
        ) {
          this.pkgs.push(this.allPkgs[pkg]);
        }
      }
      this.markVal = 0;
    },

    clearFilter() {
      this.filterPrice = [0, 1000000];
      this.filterBW = [0, 100];
      this.filterDuration = [0, 24];
      this.pkgs = this.allPkgs;
    },
  },
};
</script>
