<template>
  <div>
    <topbar></topbar>

    <!-- init Load -->
    <div
      class="container"
      v-if="initLoading || isLoadingMyPaymentList || isLoadingUserPaymentList"
    >
      <v-progress-linear
        style="margin:20% 0"
        color="deep-purple accent-4"
        indeterminate
        rounded
        height="6"
      ></v-progress-linear>
    </div>

    <div
      v-if="
        !initLoading && !isLoadingMyPaymentList && !isLoadingUserPaymentList
      "
      class="ma-12 mb-12 container-flow"
    >
      <v-row>
        <v-col cols="4">
          <v-card width="400">
            <v-img
              height="150px"
              src="https://previews.123rf.com/images/kentoh/kentoh0901/kentoh090100278/4167332-blue-technology-internet-connected-background-abstract-wallpaper.jpg"
            >
              <v-chip color="blue" style="margin:40px">
                <span class="white--text text-h5">{{ getUserName }}</span>
              </v-chip>
            </v-img>
            <v-card-text style="padding:40px">
              <v-row>
                <h5>
                  <v-icon>mdi-account-convert</v-icon>
                  Account Status: {{ getUserData.connection_status }}
                </h5>
              </v-row>
              <v-divider></v-divider>

              <v-row>
                <h6>
                  <v-icon>mdi-license</v-icon>License ID:
                  {{ getUserData.license_id }}
                </h6>
              </v-row>
              <v-row>
                <h6>
                  <v-icon>mdi-google-maps</v-icon>Active Region:
                  {{ getUserData.union }} , {{ getUserData.region }}
                </h6>
              </v-row>
              <v-divider></v-divider>
              <v-row
                ><h5>
                  <v-icon>mdi-wallet</v-icon>Available Balance:
                  {{ getUserData.balance }} BDT
                </h5>
              </v-row>
              <v-divider></v-divider>
              <v-row>
                <h6>
                  <v-icon>mdi-package-down</v-icon>Package Subscribed:
                  {{ myPackageList.length }}
                </h6></v-row
              >
              <v-row>
                <h6>
                  <v-icon>mdi-package-up</v-icon>Package Created:
                  {{ userPackageList.length }}
                </h6>
              </v-row>
            </v-card-text>
          </v-card>

          <h5 style="margin-top:50px">Subscribed Packages</h5>

          <v-simple-table dark style="margin:50px 30px">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Package Name
                  </th>
                  <th class="text-left">
                    Expiry Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in myPackageList" :key="i">
                  <td>{{ item.data.name }}</td>
                  <td>{{ item.expirationTime.slice(0, 10) }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
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
                >
                </v-sparkline>
              </v-sheet>
            </v-card-text>

            <v-card-text>
              <div class="text-h4 font-weight-thin">
                Total Cost {{ value.length ? value[value.length - 1] : 0 }} BDT
              </div>
            </v-card-text>
          </v-card>
          <v-card
            class="mx-auto text-center"
            color="blue"
            dark
            max-width="1500"
          >
            <v-card-text>
              <v-sheet color="rgba(0, 0, 0, .12)" elevation="5">
                <v-sparkline
                  :labels="labels2"
                  :value="value2"
                  color="white"
                  line-width="1"
                  padding="16"
                >
                </v-sparkline>
              </v-sheet>
            </v-card-text>

            <v-card-text>
              <div class="text-h4 font-weight-thin">
                Total Earned
                {{ value2.length ? value2[value2.length - 1] : 0 }} BDT
              </div>
            </v-card-text>

            <v-divider></v-divider>

            <!-- <v-card-actions class="justify-center">
              <v-btn block router-link to="/ISP/payments">
                See Full Report
              </v-btn>
            </v-card-actions> -->
          </v-card>
        </v-col>
      </v-row>

      <!-- <v-row style="margin-top:200px">{{ getUserData}}</v-row> -->
    </div>

    <bottombar></bottombar>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";
import topbar from "./topbar.vue";
import bottombar from "./bottombar.vue";
// import myOffers from "./offers.vue";

export default {
  components: {
    topbar,
    bottombar,
  },

  data() {
    return {
      initLoading: true,
      labels: [],
      value: [],
      labels2: [],
      value2: [],
      //alkfnaslhdfjlhes
      isLoadingMyPaymentList: true,
      isLoadingUserPaymentList: true,
      isLoadingMyPackageList: true,
      isLoadingUserPackageList: true,
      myPaymentList: [],
      userPaymentList: [],
      myPackageList: [],
      userPackageList: [],
    };
  },

  mounted() {
    axios
      .post("/api/isp/fetchOwnData", {
        id: this.getUserID,
      })
      .then((res) => {
        if (res.status === 200) {
          this.setUserData(res.data);
          this.fetchMyPackageList();
          this.fetchUserPackageList();
          this.fetchMyPaymentList();
          this.fetchUserPaymentList();
          this.initLoading = false;
        } else {
          this.error = true;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  computed: {
    ...mapGetters(["getUserID", "getUserName", "getUserData"]),
  },

  methods: {
    ...mapMutations(["setUserData"]),

    fetchOwnData() {
      axios
        .post("/api/isp/fetchOwnData", {
          id: this.getUserID,
        })
        .then((res) => {
          if (res.status === 200) {
            // console.log(res.data);
            // console.log(this.userData);
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchUserPackageList() {
      this.isLoadingUserPackageList = true;
      axios
        .post("/api/package/fetchByQuery", {
          packageCreator: this.getUserName,
        })
        .then((res) => {
          if (res.status === 200) {
            this.userPackageList = res.data.data;
            this.isLoadingUserPackageList = false;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchUserPaymentList() {
      this.isLoadingUserPaymentList = true;
      axios
        .post("/api/payment/fetchAllUserOfIspPayment", {
          id: this.getUserID,
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            // console.log(res.data);
            this.userPaymentList = res.data;
            for (let i in this.userPaymentList) {
              this.userPaymentList[i].payment_time = new Date(
                this.userPaymentList[i].payment_time
              );
              this.userPaymentList[i].payment_time = this.userPaymentList[
                i
              ].payment_time
                .toString()
                .slice(0, 24);

              let year = this.userPaymentList[i].payment_time.slice(13, 15);
              let month = this.userPaymentList[i].payment_time.slice(4, 7);
              let date = month + "/" + year;
              this.labels2.push(date);
              if (i === 0) {
                this.value2.push(this.userPaymentList[i].amount);
              } else {
                if (!this.value2[i - 1])
                  this.value2.push(this.userPaymentList[i].amount);
                else
                  this.value2.push(
                    this.userPaymentList[i].amount + this.value2[i - 1]
                  );
              }
            }

            this.isLoadingUserPaymentList = false;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchMyPackageList() {
      this.isLoadingMyPackageList = true;
      axios
        .post("/api/isp/fetchOwnPackageArray", {
          id: this.getUserID,
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            this.myPackageList = res.data;
            // console.log(this.myPackageList);
            this.isLoadingMyPackageList = false;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchMyPaymentList() {
      this.isLoadingMyPaymentList = true;
      axios
        .post("/api/payment/fetchIspOwnPayment", {
          id: this.getUserID,
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            // console.log(res.data);
            this.myPaymentList = res.data;
            for (let i in this.myPaymentList) {
              this.myPaymentList[i].payment_time = new Date(
                this.myPaymentList[i].payment_time
              );
              this.myPaymentList[i].payment_time = this.myPaymentList[
                i
              ].payment_time
                .toString()
                .slice(0, 24);

              let year = this.myPaymentList[i].payment_time.slice(13, 15);
              let month = this.myPaymentList[i].payment_time.slice(4, 7);
              let date = month + "/" + year;
              this.labels.push(date);
              if (i === 0) {
                this.value.push(this.myPaymentList[i].amount);
              } else {
                if (!this.value[i - 1])
                  this.value.push(this.myPaymentList[i].amount);
                else
                  this.value.push(
                    this.myPaymentList[i].amount + this.value[i - 1]
                  );
              }
            }
            this.isLoadingMyPaymentList = false;
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
