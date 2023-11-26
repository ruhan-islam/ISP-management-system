<template>
  <div>
    <topbar></topbar>

    <!-- init Load -->
    <div class="container" v-if="initLoading">
      <v-progress-linear
        style="margin:20% 0"
        color="deep-purple accent-4"
        indeterminate
        rounded
        height="6"
      ></v-progress-linear>
    </div>

    <div v-if="!initLoading" class="ma-12 mb-12 container-flow">
      <!-- contents here  -->

      <!-- create new offer -->
      <v-row class="ma-12 mb-12" justify="center">
        <v-dialog v-model="dialog" persistent max-width="80%">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              max-width="95%"
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Create new Offer
            </v-btn>
          </template>

          <v-card style="padding: 30px">
            <h2>New Offer</h2>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <template v-slot:default="{ open }">
                      <v-row no-gutters>
                        <v-col cols="4"> Offer Name </v-col>
                        <v-col cols="8" class="text--secondary">
                          <v-fade-transition leave-absolute>
                            <span v-if="open" key="0">
                              Enter the name of the offer
                            </span>
                            <span v-else key="1">
                              {{ offerName }}
                            </span>
                          </v-fade-transition>
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-text-field
                      placeholder="e.g. Super_cheap"
                      v-model="offerName"
                      :counter="nameLen"
                      :rules="offerNameRules"
                      label="Offer Name"
                      required
                    ></v-text-field>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <template v-slot:default="{ open }">
                      <v-row no-gutters>
                        <v-col cols="4"> Reduction(%) </v-col>
                        <v-col cols="8" class="text--secondary">
                          <v-fade-transition leave-absolute>
                            <span v-if="open" key="0">
                              Enter the reduced percentage
                            </span>
                            <span v-else key="1">
                              {{ reduction }}
                            </span>
                          </v-fade-transition>
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-slider
                      v-model="reduction"
                      :min="1"
                      :max="100"
                      label="Reduction (%)"
                      thumb-label="always"
                    >
                    </v-slider>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-header v-slot="{ open }">
                    <v-row no-gutters>
                      <v-col cols="4"> Start and end dates </v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open"
                            >When do you want to start the offer?</span
                          >
                          <v-row v-else no-gutters style="width: 100%">
                            <v-col cols="6">
                              Start date: {{ dates[0] || "Not set" }}
                            </v-col>
                            <v-col cols="6">
                              End date: {{ dates[1] || "Not set" }}
                            </v-col>
                          </v-row>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <v-row>
                      <v-menu
                        v-model="menu"
                        :close-on-content-click="false"
                        :close-on-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="dateRangeText"
                            label="Date range"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="dateRules"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="dates"
                          :min="getToday"
                          @input="menu = dates.length === 2 ? false : true"
                          year-icon="mdi-calendar-blank"
                          prev-icon="mdi-skip-previous"
                          next-icon="mdi-skip-next"
                          range
                        ></v-date-picker>
                      </v-menu>
                    </v-row>
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
                    @click="submitPressed"
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

      <!-- loading -->
      <v-progress-linear
        v-if="isLoading"
        style="margin:20% 0"
        color="deep-purple accent-4"
        indeterminate
        rounded
        height="6"
      ></v-progress-linear>

      <!-- showing offers -->
      <v-row v-if="!isLoading">
        <div class="col-lg-4" v-for="(offer, i) in allOffers" :key="i">
          <v-badge :content="0" :value="0" color="red" overlap icon="mdi-home">
            <v-card class="mx-auto" max-width="344">
              <v-img src="./../../assets/offer.jpg" height="200px"></v-img>

              <v-card-title>
                {{ offer.name }} &nbsp;
                <v-chip v-if="!offer.status" color="red"> Expired </v-chip>
              </v-card-title>

              <v-card-subtitle>
                <h2 style="color:red">{{ offer.reduction }}% off</h2>
              </v-card-subtitle>

              <v-expand-transition>
                <div>
                  <v-divider></v-divider>

                  <v-card-text>
                    <v-timeline align-top dense>
                      <v-timeline-item color="green" small>
                        <div>
                          <div class="font-weight-normal">
                            <strong>Start Time</strong> @
                            {{ offer.startTime.slice(0, 10) }}
                          </div>
                        </div>
                      </v-timeline-item>
                      <v-timeline-item color="red" small>
                        <div>
                          <div class="font-weight-normal">
                            <strong>Expiry Time</strong> @
                            {{ offer.expirationTime.slice(0, 10) }}
                          </div>
                        </div>
                      </v-timeline-item>
                    </v-timeline>
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </v-badge>
        </div>
      </v-row>
    </div>

    <bottombar></bottombar>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import axios from "axios";
import topbar from "./topbar.vue";
import bottombar from "./bottombar.vue";

export default {
  components: {
    topbar,
    bottombar,
  },

  data() {
    return {
      initLoading: true,
      isLoading: true,
      valid: false,
      show: false,

      ispList: [],
      ispNameList: [],
      ispName: "",
      ispNameRules: [
        (v) => !!v || "Name is required",
        (v) => !(v && !this.ispNameList.includes(v.trim())) || "ISP not found",
        // (v) =>
        //   (v && v.length <= this.nameLen) ||
        //   `Name must be less than ${this.nameLen} characters`,
      ],

      subject: "",
      subjectRules: [(v) => !!v || "Subject is required"],

      details: "",
      detailsRules: [(v) => !!v || "Details is required"],

      offerName: "",
      nameLen: 20,
      offerNameList: [],
      offerNameRules: [
        (v) => !!v || "Name is required",
        (v) =>
          !(v && this.offerNameList.includes(v.trim())) ||
          "Name already in use",
        (v) =>
          (v && v.length <= this.nameLen) ||
          `Name must be less than ${this.nameLen} characters`,
      ],

      reduction: "",
      dialog: false,
      pageInfo: "",
      allOffers: [],
      showSnackbar: false,

      menu: "",
      dates: [],
      dateRules: [
        (v) => !!v || "Date is required",
        (v) => !(v && this.dates.length === 1) || "Must select two dates",
      ],
    };
  },

  computed: {
    ...mapGetters(["getUserID", "getUserName", "getUserData"]),

    getToday() {
      let today = new Date();
      today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
      return today.toISOString().slice(0, 10);
    },

    isInOffer() {
      return this.pageInfo === "offers";
    },

    dateRangeText() {
      return this.dates.join(" ~ ");
    },

    isSendDisabled() {
      return !(this.ispName && this.subject && this.details && this.valid);
    },

    isSubmitDisabled() {
      return !(this.offerName && this.dates.length === 2 && this.valid);
    },

    isResetDisabled() {
      return !(this.offerName || this.reduction > 1 || this.dates.length > 0);
    },
  },

  mounted() {
    axios
      .post("/api/isp/fetchOwnData", {
        id: this.getUserID,
      })
      .then((res) => {
        if (res.status === 200) {
          this.setUserData(res.data);
          // data fetch begins
          this.fetchOffers();
          // data fetch terminates
          this.initLoading = false;
        } else {
          this.error = true;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  methods: {
    ...mapMutations(["setUserData", "decNtfCount"]),

    fetchOffers() {
      this.isLoading = true;
      axios
        .post("/api/offer/fetchByQuery", {
          creator: this.getUserName,
        })
        .then((res) => {
          if (res.status === 200) {
            this.allOffers = res.data.data.reverse();
            this.offerNameList = [];
            for (let i in this.allOffers) {
              this.offerNameList.push(this.allOffers[i].name);
            }
            this.isLoading = false;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });

      this.pageInfo = "offers";
    },

    resetPressed() {
      this.$refs.form.reset();
      this.dates = [];
    },

    submitPressed() {
      // console.log("submit pressed");

      let newOffer = {
        name: this.offerName,
        status: true,
        reduction: this.reduction,
        startTime: this.dates[0],
        expirationTime: this.dates[1],
        creator: this.getUserName,
        union: this.getUserData.union,
        // minPrice: this.minPrice,
      };

      axios
        .post("/api/offer/insert", newOffer)
        .then((res) => {
          if (res.status === 201) {
            this.allOffers.push(newOffer);
            // console.log(this.allOffers);
            this.offerNameList = [];
            this.offerNameList.push(newOffer.name);
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });

      this.dialog = false;
    },
  },
};
</script>
