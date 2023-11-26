<template>
  <div>
    <topbar></topbar>

    <div class="ma-12 mb-12 container-flow">
      <!-- contents here  -->
      <v-card style="margin:0% 0% 20% 0%">
        <v-toolbar flat dark>
          <v-toolbar-title> Manage Tickets </v-toolbar-title>
        </v-toolbar>
        <v-tabs vertical>
          <v-tab @click="fetchIspTickets">
            <v-row>
              <v-col>
                <v-icon left>
                  mdi-ticket-account
                </v-icon>
                ISP Tickets
              </v-col>
              <v-col></v-col>
            </v-row>
          </v-tab>

          <v-tab>
            <v-row>
              <v-col>
                <v-icon left>
                  mdi-cash-refund
                </v-icon>
                Refund
              </v-col>
              <v-col></v-col>
            </v-row>
          </v-tab>

          <v-tab-item>
            <!-- loading -->
            <v-progress-linear
              v-if="isLoadingIsps"
              style="margin:20% 0"
              color="deep-purple accent-4"
              indeterminate
              rounded
              height="6"
            ></v-progress-linear>

            <template v-if="!isLoadingIsps">
              <div style="text-align:center" v-if="!selectedIspTickets.length">
                <h2>No Ticket Found</h2>
              </div>
              <div style="margin:4% 5%">
                <v-row justify="center">
                  <v-radio-group v-model="ticketType" row>
                    <v-col>
                      <v-radio
                        @click="filterAll"
                        label="All"
                        value="all"
                      ></v-radio>
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
                      >
                      </v-radio>
                    </v-col>
                    <v-col>
                      <v-radio
                        @click="filterResolved"
                        label="Resolved"
                        value="onlyResolveds"
                      >
                      </v-radio>
                    </v-col>
                    <v-col>
                      <v-radio
                        @click="filterUnresolved"
                        label="Unresolved"
                        value="onlyUnresolveds"
                      >
                      </v-radio>
                    </v-col>
                  </v-radio-group>
                </v-row>

                <v-row justify="center">
                  <v-expansion-panels v-model="panel" inset>
                    <v-expansion-panel
                      v-for="(ticket, i) in selectedIspTickets"
                      :key="i"
                    >
                      <v-expansion-panel-header
                        @click="expandClicked(i)"
                        disable-icon-rotate
                      >
                        <strong>
                          {{ ticket.category }} from {{ ticket.senderId }}
                        </strong>
                        &nbsp;
                        <small class="text-right">
                          @
                          {{ ticket.arrivalTime.toString().slice(0, 24) }}
                        </small>
                        <template v-if="ticket.seenStatus" v-slot:actions>
                          <v-icon v-if="ticket.resolveStatus" color="teal">
                            mdi-check-all
                          </v-icon>
                          <v-icon v-else color="teal">
                            mdi-check
                          </v-icon>
                        </template>
                      </v-expansion-panel-header>

                      <v-expansion-panel-content>
                        <v-checkbox
                          @click="resolvePressed(i)"
                          :disabled="ticket.resolveStatus"
                          v-model="ticket.resolveStatus"
                          :label="ticket.details"
                        >
                        </v-checkbox>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-row>
              </div>
            </template>
          </v-tab-item>

          <v-tab-item>
            <div class="container" justify-center>
              <v-form ref="form" v-model="refundValid" lazy-validation>
                <div style="width:80%">
                  <v-select
                    v-model="refundCategory"
                    :items="categories"
                    label="Category"
                    solo
                  ></v-select>

                  <v-text-field
                    v-model="username"
                    :rules="usernameRules"
                    label="ISP name"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="amount"
                    :rules="amountRules"
                    label="Amount (BDT)"
                    required
                  ></v-text-field>

                  <v-textarea
                    color="teal"
                    v-model="refundDetails"
                    :rules="refundDetailsRules"
                    label="Details"
                    required
                  >
                  </v-textarea>

                  <v-card-actions class="justify-center">
                    <v-btn
                      :disabled="isRefundDisabled"
                      color="success"
                      class="mr-4"
                      @click="refundPressed"
                    >
                      Refund
                    </v-btn>
                  </v-card-actions>

                  <v-snackbar :value="showSnackbarRefund">
                    Refund Done
                  </v-snackbar>
                </div>
              </v-form>
            </div>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </div>

    <bottombar></bottombar>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";
import topbar from "./topbar.vue";
import bottombar from "./bottombar.vue";

export default {
  components: { topbar, bottombar },

  data() {
    return {
      initLoading: true,
      valid: false,
      panel: "",
      ticketType: "",
      checkbox: "",
      ispList: [],
      ispNameList: [],

      refundValid: false,
      refundCategory: "",
      details: "",
      detailsRules: [(v) => !!v || "Details is required"],
      username: "",
      usernameRules: [
        (v) => !!v || "ISP name is required",
        (v) => !(v && !this.ispNameList.includes(v.trim())) || "ISP not found",
      ],
      amount: "",
      amountRules: [
        (v) => !!v || "Amount is required",
        (v) => /^\d*$/.test(v) || "Amount must be valid",
        (v) => v > 0 || "Amount must be valid",
      ],
      refundDetails: "",
      refundDetailsRules: [(v) => !!v || "Details is required"],
      showSnackbarRefund: false,

      showSnackbar: false,
      userTickets: [],
      myTickets: [],

      category: "",
      categories: [
        "Speed Problem",
        "Network Problem",
        "Billing Problem",
        "Misc Problem",
      ],

      isLoadingOwn: true,
      searchOwn: "",
      headersOwn: [
        { text: "Category", value: "category" },
        { text: "Details", value: "details" },
        { text: "Resolved", value: "resolveStatus" },
        // { text: "Resolved", value: "resolveStatus ? 'Yes' : 'No'" },
        { text: "Sending Time", value: "arrivalTime" },
      ],
      itemsOwn: [
        // {
        //   ispName: "Frozen Yogurt",
        //   packageName: 159,
        //   amount: 6.0,
        //   method: 24,
        //   trxID: "1%",
        //   payTime: "1%",
        // },
      ],

      isLoadingIsps: true,
      allIspTickets: [],
      selectedIspTickets: [],
    };
  },

  mounted() {
    this.fetchIspTickets();
    this.fetchIspNameList();
  },

  // updated() {
  //   this.fetchIspTickets();
  // },

  computed: {
    ...mapGetters([
      // "getAuthToken",
      // "getNtfCount",
      "getUserID",
      "getUserName",
      "getUserData",
    ]),

    isRefundDisabled() {
      return !(
        this.username &&
        this.amount &&
        this.refundCategory &&
        this.refundDetails &&
        this.refundValid
      );
    },
  },

  methods: {
    ...mapMutations(["decTktCount"]),

    fetchIspNameList() {
      axios
        .post("/api/isp/fetchIspOfNttnByQuery")
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            // console.log(res.data);
            this.ispList = res.data;
            this.ispNameList = [];
            for (let i in this.ispList) {
              this.ispNameList.push(this.ispList[i].name);
            }
            // console.log(this.ispNameList);
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    refundPressed() {
      // console.log(this.ispNameList);
      axios
        .post("/api/ticket/refund", {
          type: 2, // for ISP
          name: this.username,
          resolver: this.getUserName,
          amount: this.amount,
          message: this.refundDetails,
          category: this.refundCategory,
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            this.$refs.form.reset();
            this.showSnackbarRefund = true;
            setTimeout(() => {
              this.showSnackbarRefund = false;
            }, 2000);
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchIspTickets() {
      this.isLoadingIsps = true;
      axios
        .post("/api/ticket/fetchByQuery", {
          receiverType: 1,
          receiverId: "Nttn",
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            // console.log(res.data.data);
            this.allIspTickets = res.data.data.reverse();
            for (let i in this.allIspTickets) {
              this.allIspTickets[i].arrivalTime = new Date(
                this.allIspTickets[i].arrivalTime
              );
              this.allIspTickets[i].arrivalTime = this.allIspTickets[
                i
              ].arrivalTime
                .toString()
                .slice(0, 24);
            }
            this.selectedIspTickets = this.allIspTickets;
            this.isLoadingIsps = false;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    filterAll() {
      this.selectedIspTickets = this.allIspTickets;
    },

    filterSeen() {
      this.selectedIspTickets = [];
      for (let i in this.allIspTickets) {
        if (this.allIspTickets[i].seenStatus) {
          this.selectedIspTickets.push(this.allIspTickets[i]);
        }
      }
    },

    filterUnseen() {
      this.selectedIspTickets = [];
      for (let i in this.allIspTickets) {
        if (!this.allIspTickets[i].seenStatus) {
          this.selectedIspTickets.push(this.allIspTickets[i]);
        }
      }
    },

    filterResolved() {
      this.selectedIspTickets = [];
      for (let i in this.allIspTickets) {
        if (this.allIspTickets[i].resolveStatus) {
          this.selectedIspTickets.push(this.allIspTickets[i]);
        }
      }
    },

    filterUnresolved() {
      this.selectedIspTickets = [];
      for (let i in this.allIspTickets) {
        if (!this.allIspTickets[i].resolveStatus) {
          this.selectedIspTickets.push(this.allIspTickets[i]);
        }
      }
    },

    sendPressed() {
      // console.log("send pressed");

      let newTicket = {
        senderId: this.getUserName,
        receiverId: "Nttn",
        senderType: 2,
        receiverType: 1,
        category: this.category,
        details: this.details,
        arrivalTime: new Date(),
      };

      // console.log(newNotification);

      axios
        .post("/api/ticket/insert", newTicket)
        .then((res) => {
          // console.log(res);
          if (res.status === 201) {
            this.$refs.form.reset();
            this.showSnackbar = true;
            setTimeout(() => {
              this.showSnackbar = false;
            }, 2000);
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    resolvePressed(i) {
      axios
        .post("/api/ticket/updateResolveStatus", {
          id: this.selectedIspTickets[i]._id,
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            this.selectedIspTickets[i].resolveStatus = true;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    expandClicked(i) {
      if (!this.selectedIspTickets[i].seenStatus) {
        axios
          .post("/api/ticket/updateSeenStatus", {
            id: this.selectedIspTickets[i]._id,
          })
          .then((res) => {
            // console.log(res);
            if (res.status === 200) {
              this.selectedIspTickets[i].seenStatus = true;
              this.decTktCount(true);
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
