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

    <!-- show own packages -->
    <v-row v-if="!isLoading">
      <h2 v-if="!myPackageList.length">No Package Yet</h2>
      <template v-if="!!myPackageList.length">
        <div class="col-lg-5" v-for="(myPackage, i) in myPackageList" :key="i">
          <v-card>
            <v-img height="250" src="./../../assets/images.jpg"></v-img>

            <v-card-title>
              {{ myPackage.data.name }} &nbsp;
              <v-chip v-if="!myPackage.data.ongoing" color="red">
                Disabled
              </v-chip>
            </v-card-title>

            <v-card-text>
              <div class="my-4 text-subtitle-1">
                Taka
                <span v-if="!myPackage.data.offerId">
                  {{ myPackage.data.price }}
                </span>
                <template v-if="!!myPackage.data.offerId">
                  <s>{{ myPackage.data.price }}</s>
                  <span>
                    &nbsp;
                    {{
                      calculateReducedPrice(
                        myPackage.data.price,
                        myPackage.data.offerId
                      )
                    }}
                  </span>
                  <v-chip color="deep-purple">
                    <span style="color:white">
                      {{ getOfferName(myPackage.data.offerId) }}
                    </span>
                  </v-chip>
                </template>
              </div>
              <v-chip-group
                active-class="deep-purple accent-4 white--text"
                column
              >
                <v-chip>{{ myPackage.data.bandwidth }} MBPS</v-chip>
                <v-chip v-if="myPackage.data.isRealIp"> Real IP </v-chip>
              </v-chip-group>

              <div>
                {{ myPackage.data.bandwidth }} MBPS speed relentless speed of
                unlimited traffic with 24/7 service.
              </div>

              <div>
                <strong>Expiration date:</strong>
                {{ myPackage.expirationTime.slice(0, 10) }}
              </div>
            </v-card-text>
            <v-card-actions>
              <v-row>
                <v-col></v-col>
                <v-col>
                  <v-btn
                    color="deep-purple lighten-2"
                    @click="
                      currPkgIdx = 0;
                      dialog2 = true;
                    "
                    text
                  >
                    Details
                  </v-btn>
                </v-col>
                <v-col></v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </div>
      </template>
    </v-row>

    <!-- <span> {{ getUserData }} </span> -->

    <!-- details -->
    <v-row v-if="currPkgIdx !== -1" justify="center">
      <v-dialog v-model="dialog2" max-width="70%">
        <v-card>
          <v-card-title class="text-h5">
            {{ myPackageList[currPkgIdx].data.name }}
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
                    <td>{{ myPackageList[currPkgIdx].data.name }}</td>
                  </tr>
                  <tr>
                    <td>Price</td>
                    <td>Tk. {{ myPackageList[currPkgIdx].data.price }}</td>
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
                    <td>{{ myPackageList[currPkgIdx].data.bandwidth }} MBPS</td>
                  </tr>
                  <tr>
                    <td>Duration</td>
                    <td>
                      {{ myPackageList[currPkgIdx].data.duration }} months
                    </td>
                  </tr>
                  <tr>
                    <td>Upload Speed</td>
                    <td>{{ myPackageList[currPkgIdx].data.up_speed }} MBPS</td>
                  </tr>
                  <tr>
                    <td>Download Speed</td>
                    <td>
                      {{ myPackageList[currPkgIdx].data.down_speed }} MBPS
                    </td>
                  </tr>
                  <tr>
                    <td>Data Limit</td>
                    <td>Unlimited</td>
                  </tr>
                  <tr>
                    <td>Estimated Down Time</td>
                    <td>{{ myPackageList[currPkgIdx].data.downTime }} hrs</td>
                  </tr>
                  <tr>
                    <td>Estimated Response Time</td>
                    <td>
                      {{ myPackageList[currPkgIdx].data.responseTime }}
                      milliseconds
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
                  !myPackageList[currPkgIdx].data.ongoing ||
                    !myPackageList[currPkgIdx].status
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
      currPkgIdx: -1,
      isLoading: true,
      valid: false,
      dialog2: false,
      showPayment: false,
      selectedPkg: {},

      showSnackbar: false,
      pageInfo: "",
      myInfo: {},
      myPackageList: [],
      allOffers: [],
      validOffers: [],
      allPkgs: [],
      pkgs: [],
      filterPrice: [0, 1000000],
      filterBW: [1, 200],
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
    ...mapGetters(["getUserID", "getUserData", "getSelectedPkg"]),
  },

  mounted() {
    this.fetchAllOffers();
    this.fetchAllPackages();
    this.fetchOwnPackage();
    this.currPkgIdx = -1;
    this.showPayment = false;
  },

  methods: {
    ...mapMutations(["setSelectedPkg"]),

    fetchOwnPackage() {
      this.isLoading = true;
      axios
        .post("/api/user/fetchOwnPackageArray", {
          id: this.getUserID,
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            this.myPackageList = res.data;
            // console.log(this.myPackageList);
            this.isLoading = false;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchAllPackages() {
      axios
        .post("/api/package/fetchByQueryWithStatus", {
          type: 3,
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
          creator: this.getUserData.ispId,
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
  },
};
</script>
