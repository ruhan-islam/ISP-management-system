<template>
  <div>
    <topbar></topbar>

    <div class="ma-12 mb-12 container-flow">
      <v-row>
        <v-col cols="4">
          <v-card width="400">
            <v-img
              height="150px"
              src="https://previews.123rf.com/images/kentoh/kentoh0901/kentoh090100278/4167332-blue-technology-internet-connected-background-abstract-wallpaper.jpg"
            >
              <v-chip color="blue" style="margin:40px">
                <span class="white--text text-h5">NTTN</span>
              </v-chip>
            </v-img>
            <v-card-text style="padding:40px">
              <v-row>
                <h6><v-icon>mdi-license</v-icon>License ID: F255-9215-0094</h6>
              </v-row>
              <v-row>
                <h6>
                  <v-icon>mdi-google-maps</v-icon>Active Region: Whole Country
                </h6>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card
            class="mx-auto text-center"
            color="green"
            dark
            max-width="1500"
          >
            <v-card-text>
              <v-sheet color="rgba(0, 0, 0, .12)" elevation="5">
                <v-sparkline
                  :labels="labels"
                  :value="value"
                  color="white"
                  line-width="1"
                  padding="16"
                  auto-draw
                  :smooth="5"
                >
                </v-sparkline>
              </v-sheet>
            </v-card-text>

            <v-card-text>
              <div class="text-h4 font-weight-thin">
                Total Earned: {{ value[value.length - 1] }} Taka
              </div>
            </v-card-text>

            <!-- <v-card-actions class="justify-center">
              <v-btn block router-link to="/ISP/payments">
                See Full Report
              </v-btn>
            </v-card-actions> -->
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-container class="grey lighten-4" fluid>
          <h3 style="text-align:center;padding-top:30px">Coverage Area</h3>

          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="4">
              <v-hover v-slot="{ hover }">
                <v-card style="margin:10%">
                  <v-img src="./../../assets/div/dhaka.svg" height="500px">
                    <v-expand-transition>
                      <div
                        v-if="hover && regionISPNo.length && regionPkgNo.length"
                        class="transition-fast-in-fast-out green v-card text-h6 white--text"
                        style="height: 100%;padding:30% 10%"
                      >
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="whie--text"
                              >mdi-map-marker-radius-outline</v-icon
                            >
                          </v-col>
                          <v-col> Region: <u>Dhaka</u> </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-account-search</v-icon
                            >
                          </v-col>
                          <v-col> Total ISP: {{ regionISPNo[0].val }} </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-package-variant</v-icon
                            >
                          </v-col>
                          <v-col> Total Packages: {{ pkgVal[0] }} </v-col>
                        </v-row>
                      </div>
                    </v-expand-transition>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>

            <v-col cols="4">
              <v-hover v-slot="{ hover }">
                <v-card style="margin:10%">
                  <v-img src="./../../assets/div/rajshahi.svg" height="500px">
                    <v-expand-transition>
                      <div
                        v-if="hover && regionISPNo.length && regionPkgNo.length"
                        class="transition-fast-in-fast-out green v-card text-h6 white--text"
                        style="height: 100%;padding:30% 10%"
                      >
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="whie--text"
                              >mdi-map-marker-radius-outline</v-icon
                            >
                          </v-col>
                          <v-col> Region: <u>Rajshahi</u> </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-account-search</v-icon
                            >
                          </v-col>
                          <v-col> Total ISP: {{ regionISPNo[1].val }} </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-package-variant</v-icon
                            >
                          </v-col>
                          <v-col> Total Packages: {{ pkgVal[1] }} </v-col>
                        </v-row>
                      </div>
                    </v-expand-transition>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="4">
              <v-hover v-slot="{ hover }">
                <v-card style="margin:10%">
                  <v-img src="./../../assets/div/chattogram.png" height="500px">
                    <v-expand-transition>
                      <div
                        v-if="hover && regionISPNo.length && regionPkgNo.length"
                        class="transition-fast-in-fast-out green v-card text-h6 white--text"
                        style="height: 100%;padding:30% 10%"
                      >
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="whie--text"
                              >mdi-map-marker-radius-outline</v-icon
                            >
                          </v-col>
                          <v-col> Region: <u>Chittagong</u> </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-account-search</v-icon
                            >
                          </v-col>
                          <v-col> Total ISP: {{ regionISPNo[2].val }} </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-package-variant</v-icon
                            >
                          </v-col>
                          <v-col> Total Packages: {{ pkgVal[2] }} </v-col>
                        </v-row>
                      </div>
                    </v-expand-transition>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="4">
              <v-hover v-slot="{ hover }">
                <v-card style="margin:10%">
                  <v-img src="./../../assets/div/mymensingh.png" height="500px">
                    <v-expand-transition>
                      <div
                        v-if="hover && regionISPNo.length && regionPkgNo.length"
                        class="transition-fast-in-fast-out green v-card text-h6 white--text"
                        style="height: 100%;padding:30% 10%"
                      >
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="whie--text"
                              >mdi-map-marker-radius-outline</v-icon
                            >
                          </v-col>
                          <v-col> Region: <u>Mymensingh</u> </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-account-search</v-icon
                            >
                          </v-col>
                          <v-col> Total ISP: {{ regionISPNo[3].val }} </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-package-variant</v-icon
                            >
                          </v-col>
                          <v-col> Total Packages: {{ pkgVal[3] }} </v-col>
                        </v-row>
                      </div>
                    </v-expand-transition>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="4">
              <v-hover v-slot="{ hover }">
                <v-card style="margin:10%">
                  <v-img src="./../../assets/div/khulna.png" height="500px">
                    <v-expand-transition>
                      <div
                        v-if="hover && regionISPNo.length && regionPkgNo.length"
                        class="transition-fast-in-fast-out green v-card text-h6 white--text"
                        style="height: 100%;padding:30% 10%"
                      >
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="whie--text"
                              >mdi-map-marker-radius-outline</v-icon
                            >
                          </v-col>
                          <v-col> Region: <u>Khulna</u> </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-account-search</v-icon
                            >
                          </v-col>
                          <v-col> Total ISP: {{ regionISPNo[4].val }} </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-package-variant</v-icon
                            >
                          </v-col>
                          <v-col> Total Packages: {{ pkgVal[4] }} </v-col>
                        </v-row>
                      </div>
                    </v-expand-transition>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="4">
              <v-hover v-slot="{ hover }">
                <v-card style="margin:10%">
                  <v-img src="./../../assets/div/barishal.svg" height="500px">
                    <v-expand-transition>
                      <div
                        v-if="hover && regionISPNo.length && regionPkgNo.length"
                        class="transition-fast-in-fast-out green v-card text-h6 white--text"
                        style="height: 100%;padding:30% 10%"
                      >
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="whie--text"
                              >mdi-map-marker-radius-outline</v-icon
                            >
                          </v-col>
                          <v-col> Region: <u>Barishal</u> </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-account-search</v-icon
                            >
                          </v-col>
                          <v-col> Total ISP: {{ regionISPNo[5].val }} </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-package-variant</v-icon
                            >
                          </v-col>
                          <v-col> Total Packages: {{ pkgVal[5] }} </v-col>
                        </v-row>
                      </div>
                    </v-expand-transition>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="4">
              <v-hover v-slot="{ hover }">
                <v-card style="margin:10%">
                  <v-img src="./../../assets/div/sylhet.png" height="500px">
                    <v-expand-transition>
                      <div
                        v-if="hover && regionISPNo.length && regionPkgNo.length"
                        class="transition-fast-in-fast-out green v-card text-h6 white--text"
                        style="height: 100%;padding:30% 10%"
                      >
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="whie--text"
                              >mdi-map-marker-radius-outline</v-icon
                            >
                          </v-col>
                          <v-col> Region: <u>Sylhet</u> </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-account-search</v-icon
                            >
                          </v-col>
                          <v-col> Total ISP: {{ regionISPNo[6].val }} </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-package-variant</v-icon
                            >
                          </v-col>
                          <v-col> Total Packages: {{ pkgVal[6] }} </v-col>
                        </v-row>
                      </div>
                    </v-expand-transition>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="4">
              <v-hover v-slot="{ hover }">
                <v-card style="margin:10%">
                  <v-img src="./../../assets/div/rangpur.svg" height="500px">
                    <v-expand-transition>
                      <div
                        v-if="hover && regionISPNo.length && regionPkgNo.length"
                        class="transition-fast-in-fast-out green v-card text-h6 white--text"
                        style="height: 100%;padding:30% 10%"
                      >
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="whie--text"
                              >mdi-map-marker-radius-outline</v-icon
                            >
                          </v-col>
                          <v-col> Region: <u>Rangpur</u> </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-account-search</v-icon
                            >
                          </v-col>
                          <v-col> Total ISP: {{ regionISPNo[7].val }} </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="1">
                            <v-icon class="white--text"
                              >mdi-package-variant</v-icon
                            >
                          </v-col>
                          <v-col> Total Packages: {{ pkgVal[7] }} </v-col>
                        </v-row>
                      </div>
                    </v-expand-transition>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-container>
      </v-row>
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
      //nasjDnfsjJFJsf
      valid: false,
      show: false,
      isLoading: true,

      labels: [],
      value: [],
      items: [],
      allOffers: [],

      regionPkgNo: [],
      regionISPNo: [],

      pkgVal: [],
    };
  },

  computed: {
    getToday() {
      let today = new Date();
      today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
      return today.toISOString().slice(0, 10);
    },
  },

  mounted() {
    this.fetchAllIspPayments();
    this.fetchRegionISPNum();
    this.fetchRegionPackages();
  },

  methods: {
    getImage() {
      const min = 550;
      const max = 560;

      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    showOffers() {
      axios
        .post("/api/offer/fetchByQuery", {
          creator: "Nttn",
        })
        .then((res) => {
          if (res.status === 200) {
            this.allOffers = res.data.data;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });

      this.pageInfo = "offers";
    },

    fetchAllIspPayments() {
      this.isLoading = true;
      axios
        .post("/api/payment/fetchAllIspPayment")
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            // console.log(res.data);
            this.items = res.data.reverse();
            for (let i in this.items) {
              this.items[i].payment_time = new Date(this.items[i].payment_time);
              this.items[i].payment_time = this.items[i].payment_time
                .toString()
                .slice(0, 24);

              let year = this.items[i].payment_time.slice(13, 15);
              let month = this.items[i].payment_time.slice(4, 7);
              let date = month + "/" + year;
              this.labels.push(date);

              // this.labels.push(this.items[i].payment_time.slice(4, 15));
              if (i === 0) {
                this.value.push(this.items[i].amount);
              } else {
                if (!this.value[i - 1]) this.value.push(this.items[i].amount);
                else this.value.push(this.items[i].amount + this.value[i - 1]);
              }
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

    fetchRegionISPNum() {
      axios
        .get("/api/isp/ispInRegion")
        .then((res) => {
          if (res.status === 200) {
            // console.log(res.data);
            this.regionISPNo = res.data;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchRegionPackages() {
      axios
        .get("/api/package/packageInRegion")
        .then((res) => {
          if (res.status === 200) {
            // console.log(res.data);
            this.regionPkgNo = res.data;
            for (let i = 0; i < 8; i++) {
              this.pkgVal.push(this.regionPkgNo[0].val);
            }

            for (let i = 0; i < 8; i++) {
              this.pkgVal[i] += this.regionPkgNo[i + 1].val;
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
  },
};
</script>
