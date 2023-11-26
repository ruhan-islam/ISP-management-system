<template>
  <div>
    <topbar></topbar>

    <div
      style="margin-bottom:15%"
      class="container"
      v-if="isLoadingMyPackageList"
    >
      <v-progress-linear
        style="margin:20% 0"
        color="deep-purple accent-4"
        indeterminate
        rounded
        height="6"
      ></v-progress-linear>
    </div>

    <div v-if="!isLoadingMyPackageList" class="ma-12 mb-12 container-flow">
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
                  Account Status: Active ⛄
                </h5>
              </v-row>
              <v-divider></v-divider>

              <v-row>
                <h6>
                  <v-icon>mdi-license</v-icon>NID:
                  {{ getUserData.nid }}
                </h6>
              </v-row>
              <v-row>
                <h6>
                  <v-icon>mdi-google-maps</v-icon>Active Region:
                  {{ getUserData.union }}
                </h6>
              </v-row>
              <v-divider></v-divider>
              <v-row
                ><h5>
                  <v-icon>mdi-wallet</v-icon>Available Balance:
                  {{ getUserData.balance }} BDT
                </h5>
              </v-row>
            </v-card-text>
          </v-card>

          <h5 style="margin-top:50px">Subscribed Package</h5>

          <v-simple-table
            dark
            style="margin:50px 30px"
            v-if="myPackageList.length"
          >
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Feature
                  </th>
                  <th class="text-left">
                    Availibility
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{{ myPackageList[0].data.name }}</td>
                </tr>
                <tr>
                  <td>Bandwidth</td>
                  <td>{{ myPackageList[0].data.bandwidth }} MBPS</td>
                </tr>
                <tr>
                  <td>Expiration Date</td>
                  <td>{{ myPackageList[0].expirationTime.slice(0, 10) }}</td>
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
                  auto-draw
                  :smooth="10"
                >
                </v-sparkline>
              </v-sheet>
            </v-card-text>

            <v-card-text>
              <div class="text-h4 font-weight-thin">
                Bandwith Usage in Current Month{{ totalUsage }} GB
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
      labels: [],
      value: [],
      pageInfo: "",
      myPackageList: [],
      isLoadingMyPackageList: true,

      totalUsage: 0,
    };
  },

  mounted() {
    this.fetchOwnData();
  },

  computed: {
    ...mapGetters(["getUserID", "getUserData", "getUserName"]),
  },

  methods: {
    ...mapMutations(["setUserData"]),

    fetchOwnData() {
      axios
        .post("/api/user/fetchOwnData", {
          id: this.getUserID,
        })
        .then((res) => {
          if (res.status === 200) {
            // console.log(res.data);
            this.setUserData(res.data);
            this.fetchMyPackageList();
            // console.log(this.userData);
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
        .post("/api/user/fetchOwnPackageArray", {
          id: this.getUserID,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            this.myPackageList = res.data;
            // console.log(this.myPackageList);
            this.isLoadingMyPackageList = false;

            let sVal = parseInt(this.myPackageList[0].startTime.slice(8, 10));
            let fVal = parseInt(this.getToday());
            // let sMonth = parseInt(this.myPackageList[0].startTime.slice(6, 8));
            // let fMonth = parseInt(this.getMonth());

            // if (sMonth <= fMonth) sVal = 1;
            sVal = 1;

            for (let i = sVal; i <= fVal; i++) {
              this.labels.push(i);
              let tem = Math.random() * 10;
              this.value.push(tem);
              this.totalUsage += tem;
            }

            this.totalUsage = Math.ceil(this.totalUsage);
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
      return today.toISOString().slice(8, 10);
    },

    getMonth() {
      let today = new Date();
      today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
      return today.toISOString().slice(6, 8);
    },

    showTickets() {
      this.pageInfo = "myTickets";
    },
  },
};
</script>
