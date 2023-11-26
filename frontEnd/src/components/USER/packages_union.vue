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
                  max="20000"
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
                  label="Bandwidth (MBPS)"
                  min="0"
                  max="100"
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

    <!-- show User packages -->
    <v-row v-if="!isLoading" justify="center">
      <div class="container col-lg-5" v-for="(pkg, i) in pkgs" :key="i">
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

            <div>
              ISP: <strong>{{ pkg.packageCreator }}</strong>
            </div>

            <v-chip-group
              active-class="deep-purple accent-4 white--text"
              column
            >
              <v-chip>{{ pkg.bandwidth }} MBPS</v-chip>
              <v-chip v-if="pkg.isRealIp"> Real IP </v-chip>
            </v-chip-group>

            <div>
              {{ pkg.bandwidth }} MBPS speed relentless speed of unlimited
              traffic with 24/7 service.
            </div>
          </v-card-text>

          <v-card-actions>
            <v-col></v-col>
            <v-col>
              <v-btn
                color="deep-purple lighten-2"
                @click="detailsPressed(i)"
                text
              >
                Details
              </v-btn>
            </v-col>
            <v-col></v-col>
            <v-col>
              <v-btn
                :disabled="!allPkgs[i].ongoing || !allPkgs[i].status"
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
    </v-row>

    <!-- details -->
    <v-row v-if="currPkgIdx !== -1" justify="center">
      <v-dialog v-model="dialog2" max-width="70%">
        <v-card>
          <v-card-title class="text-h5">
            {{ allPkgs[currPkgIdx].name }}
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
                    <td>{{ allPkgs[currPkgIdx].name }}</td>
                  </tr>
                  <tr>
                    <td>Base Price</td>
                    <td>Tk. {{ allPkgs[currPkgIdx].price }}</td>
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
                    </td>
                  </tr>
                  <tr>
                    <td>Real IP</td>
                    <td>
                      {{ myPackageList[currPkgIdx].isRealIp ? "Yes" : "No" }}
                    </td>
                  </tr>
                  <tr>
                    <td>Bandwidth</td>
                    <td>{{ allPkgs[currPkgIdx].bandwidth }} MBPS</td>
                  </tr>
                  <tr>
                    <td>Upload Speed</td>
                    <td>{{ allPkgs[currPkgIdx].up_speed }} MBPS</td>
                  </tr>
                  <tr>
                    <td>Download Speed</td>
                    <td>{{ allPkgs[currPkgIdx].down_speed }} MBPS</td>
                  </tr>
                  <tr>
                    <td>Data Limit</td>
                    <td>Unlimited</td>
                  </tr>
                  <tr>
                    <td>Estimated Down Time</td>
                    <td>{{ allPkgs[currPkgIdx].downTime }} hrs</td>
                  </tr>
                  <tr>
                    <td>Estimated Response Time</td>
                    <td>{{ allPkgs[currPkgIdx].responseTime }} milliseconds</td>
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
                  !allPkgs[currPkgIdx].ongoing || !allPkgs[currPkgIdx].status
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
      isLoading: true,
      currPkgIdx: -1,
      valid: false,
      dialog2: false,
      showPayment: false,
      selectedPkg: {},

      showSnackbar: false,
      pageInfo: "",
      allOffers: [],
      validOffers: [],
      allPkgs: [],
      pkgs: [],
      filterPrice: [0, 20000],
      filterBW: [1, 100],
      filterDuration: [1, 24],
      sortedItems: [
        "Name 🔺",
        "Name 🔻",
        "Price 🔺",
        "Price 🔻",
        "Bandwidth 🔺",
        "Bandwidth 🔻",
      ],
    };
  },

  computed: {
    ...mapGetters(["getUserData", "getSelectedPkg"]),
  },

  mounted() {
    this.fetchUnionAllOffers();
    this.fetchUnionAllPackages();
    this.showPayment = false;
  },

  methods: {
    ...mapMutations(["setSelectedPkg"]),

    fetchUnionAllPackages() {
      this.isLoading = true;

      axios
        .post("/api/package/fetchUnionUserPackage", {
          union: this.getUserData.union,
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            // console.log(res.data);
            this.allPkgs = res.data;
            this.pkgs = this.allPkgs;
            this.isLoading = false;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchUnionAllOffers() {
      axios
        .post("/api/offer/fetchUnionOffer", {
          union: this.getUserData.union,
        })
        .then((res) => {
          // console.log(res.data);
          if (res.status === 200) {
            this.allOffers = res.data;
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

    findIdx(myPkg) {
      this.currPkgIdx = -1;
      for (let i in this.allPkgs) {
        if (this.allPkgs[i]._id === myPkg._id) {
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
      // console.log(this.getSelectedPkg);
      this.$router.push("/ISP/payments");
      // this.showPayment = true;
    },

    detailsPressed(i) {
      this.currPkgIdx = i;
      this.dialog2 = true;
      // console.log(this.currPkgIdx);
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
      // console.log(offerId);
      let percentage = 0;
      if (!offerId) {
        return price;
      }
      for (let i in this.allOffers) {
        if (this.allOffers[i]._id === offerId) {
          percentage = this.allOffers[i].reduction;
          // console.log(price);
          // console.log(this.allOffers[i].name);
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

    doSort(item) {
      if (item == "Price 🔺") {
        this.pkgs.sort(this.orderByPriceAscending);
      } else if (item == "Bandwidth 🔺") {
        this.pkgs.sort(this.orderByBandwidthAscending);
      } else if (item == "Name 🔺") {
        this.pkgs.sort(this.orderByNameAscending);
      } else if (item == "Price 🔻") {
        this.pkgs.sort(this.orderByPriceDescending);
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
      this.filterPrice = [0, 20000];
      this.filterBW = [1, 100];
      this.filterDuration = [1, 24];
      this.pkgs = this.allPkgs;
    },
  },
};
</script>
