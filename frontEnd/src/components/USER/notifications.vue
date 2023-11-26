<template>
  <div>
    <topbar></topbar>

    <div style="margin-bottom:15%" class="container" v-if="initLoading">
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
      <!-- loading -->
      <div style="margin-bottom:15%" class="container" v-if="isLoading">
        <v-progress-linear
          v-if="isLoading"
          style="margin:20% 0"
          color="deep-purple accent-4"
          indeterminate
          rounded
          height="6"
        ></v-progress-linear>
      </div>

      <template v-if="!isLoading">
        <v-row>
          <v-col>
            <v-radio-group v-model="notificationType" row>
              <v-col></v-col>
              <v-col></v-col>
              <v-col></v-col>
              <v-col>
                <v-radio @click="filterAll" label="All" value="all"></v-radio>
              </v-col>
              <v-col>
                <v-radio
                  @click="filterSeen"
                  label="Seen"
                  value="onlySeens"
                ></v-radio>
              </v-col>
              <v-col>
                <v-radio
                  @click="filterUnseen"
                  label="Unseen"
                  value="onlyUnseens"
                ></v-radio>
              </v-col>
              <v-col></v-col>
              <v-col></v-col>
              <v-col></v-col>
            </v-radio-group>
          </v-col>
          <!-- <v-col>
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
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dates"
                  @input="menu = dates.length === 2 ? false : true"
                  year-icon="mdi-calendar-blank"
                  prev-icon="mdi-skip-previous"
                  next-icon="mdi-skip-next"
                  range
                ></v-date-picker>
              </v-menu>
              <v-btn @click="filterByDates" :disabled="dates.length < 2">
                Filter
              </v-btn>
            </v-row>
          </v-col> -->
        </v-row>

        <v-row justify="center">
          <v-expansion-panels v-model="panel" inset>
            <v-expansion-panel
              v-for="(notification, i) in selectedNotifications"
              :key="i"
            >
              <v-expansion-panel-header
                @click="expandClicked(i)"
                disable-icon-rotate
              >
                <strong> {{ notification.subject }} </strong> &nbsp;
                <small class="text-right">
                  @
                  {{
                    notification.notificationArrivalTime.toString().slice(0, 24)
                  }}
                </small>
                <template v-if="notification.seenStatus" v-slot:actions>
                  <v-icon color="teal">
                    mdi-check
                  </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                {{ notification.details }}
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </template>
    </div>

    <bottombar></bottombar>
  </div>
</template>

<script>
import axios from "axios";
import { mapMutations, mapGetters } from "vuex";
import topbar from "./topbar.vue";
import bottombar from "./bottombar.vue";

export default {
  components: { topbar, bottombar },

  data() {
    return {
      initLoading: true,
      menu: "",
      dates: [],
      isLoading: true,
      notificationType: "",
      panel: "",
      allNotifications: [],
      selectedNotifications: [],
    };
  },

  computed: {
    ...mapGetters(["getUserID", "getUserName", "getUserData"]),

    // dateRangeText() {
    //   return this.dates.join(" ~ ");
    // },
  },

  mounted() {
    axios
      .post("/api/user/fetchOwnData", {
        id: this.getUserID,
      })
      .then((res) => {
        if (res.status === 200) {
          this.setUserData(res.data);
          // data fetch begins
          this.fetchNotifications();
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

  updated() {
    this.fetchNotifications();
  },

  methods: {
    ...mapMutations(["setUserData", "decNtfCount"]),

    fetchNotifications() {
      // this.isLoading = true;
      axios
        .post("/api/notification/fetchByQuery", {
          receiverID: this.getUserName,
          receiverType: 3, // for USER
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            this.allNotifications = res.data.data.reverse();
            // console.log(this.allNotifications);
            for (let i in this.allNotifications) {
              this.allNotifications[i].notificationArrivalTime = new Date(
                this.allNotifications[i].notificationArrivalTime
              );
            }
            if (!this.notificationType) {
              this.selectedNotifications = this.allNotifications;
            }
            if (this.isLoading) {
              this.isLoading = false;
            }
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // filterByDates() {
    //   let minDate = this.dates[0];
    //   let maxDate = this.dates[1];
    //   if (maxDate < minDate) {
    //     minDate = maxDate;
    //     maxDate = this.dates[0];
    //   }

    //   this.dateFilteredNotifications = [];
    //   for (let i in this.allNotifications) {
    //     if (
    //       this.allNotifications[0].notificationArrivalTime.toISOString() >=
    //         minDate &&
    //       this.allNotifications[0].notificationArrivalTime.toISOString() <=
    //         maxDate
    //     ) {
    //       this.dateFilteredNotifications.push(this.allNotifications[i]);
    //     }
    //   }

    //   console.log(this.notificationType);
    //   if (this.notificationType === "onlySeens") {
    //     this.filterSeen();
    //   } else if (this.notificationType === "onlyUnseens") {
    //     this.filterUnseen();
    //   } else {
    //     this.selectedNotifications = this.dateFilteredNotifications;
    //   }
    // },

    filterAll() {
      this.selectedNotifications = this.allNotifications;
    },

    filterSeen() {
      this.selectedNotifications = [];
      for (let i in this.allNotifications) {
        if (this.allNotifications[i].seenStatus) {
          this.selectedNotifications.push(this.allNotifications[i]);
        }
      }
    },

    filterUnseen() {
      this.selectedNotifications = [];
      for (let i in this.allNotifications) {
        if (!this.allNotifications[i].seenStatus) {
          this.selectedNotifications.push(this.allNotifications[i]);
        }
      }
    },

    expandClicked(i) {
      if (!this.selectedNotifications[i].seenStatus) {
        axios
          .post("/api/notification/updateSeenStatus", {
            id: this.selectedNotifications[i]._id,
          })
          .then((res) => {
            // console.log(res);
            if (res.status === 200) {
              this.selectedNotifications[i].seenStatus = true;
              this.decNtfCount(true);
            } else {
              this.error = true;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>
