<template>
  <div style="margin-bottom:8%">
    <v-app-bar @click="`clearInterval(intervalID)`" :fixed="true" grow dark>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrsHome }">
          <v-btn
            v-bind="attrsHome"
            v-on="on"
            router-link
            to="/ISP/home"
            exact
            elevation="0"
          >
            <v-icon> mdi-home </v-icon>
            <span> Home </span>
          </v-btn>
        </template>
        <span> Home </span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrsPackages }">
          <v-btn
            v-bind="attrsPackages"
            v-on="on"
            router-link
            to="/ISP/packages"
            exact
            elevation="0"
          >
            <span> Packages </span>
            <v-icon> mdi-package-variant </v-icon>
          </v-btn>
        </template>
        <span> Packages </span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrsOffer }">
          <v-btn
            v-bind="attrsOffer"
            v-on="on"
            router-link
            to="/ISP/offers"
            exact
            elevation="0"
          >
            <span> Offers </span>
            <v-icon> mdi-offer </v-icon>
          </v-btn>
        </template>
        <span> Offer </span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrsPayments }">
          <v-btn
            v-bind="attrsPayments"
            v-on="on"
            router-link
            to="/ISP/payments"
            exact
            elevation="0"
          >
            <span> Payments </span>
            <v-icon> mdi-credit-card </v-icon>
            <v-badge
              color="purple"
              offset-x="10"
              offset-y="0"
              v-if="getPayNotification"
            >
            </v-badge>
          </v-btn>
        </template>
        <span> Payments </span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrsNotifications }">
          <v-btn
            v-bind="attrsNotifications"
            v-on="on"
            router-link
            to="/ISP/notifications"
            exact
            elevation="0"
          >
            <span> Notifications </span>
            <v-icon> mdi-bell </v-icon>
            <v-badge
              offset-x="10"
              offset-y="0"
              v-if="getNtfCount !== 0"
              :content="getNtfCount"
            >
            </v-badge>
          </v-btn>
        </template>
        <span> Notifications </span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrsNotify }">
          <v-btn
            v-bind="attrsNotify"
            v-on="on"
            router-link
            to="/ISP/notify"
            exact
            elevation="0"
          >
            <span> Notify </span>
            <v-icon> mdi-antenna </v-icon>
          </v-btn>
        </template>
        <span> Notify </span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrsTickets }">
          <v-btn
            v-bind="attrsTickets"
            v-on="on"
            router-link
            to="/ISP/tickets"
            exact
            elevation="0"
          >
            <span> Tickets </span>
            <v-icon> mdi-ticket </v-icon>
            <v-badge
              color="error"
              offset-x="10"
              offset-y="0"
              v-if="getTktCount !== 0"
              :content="getTktCount"
            >
            </v-badge>
          </v-btn>
        </template>
        <span> Tickets </span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrsDashboard }">
          <v-btn
            v-bind="attrsDashboard"
            v-on="on"
            router-link
            to="/ISP/dashboard"
            exact
            elevation="0"
          >
            <span> Dashboard </span>
            <v-icon> mdi-tablet-dashboard </v-icon>
          </v-btn>
        </template>
        <span> Dashboard </span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrsLogout }">
          <v-btn v-bind="attrsLogout" v-on="on" @click="logOut()" elevation="0">
            <span> Signout </span>
            <v-icon> mdi-logout </v-icon>
          </v-btn>
        </template>
        <span> Signout </span>
      </v-tooltip>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      intervalID: "",
      init: false,
    };
  },

  mounted() {
    if (this.getUserType !== "ISP") {
      this.$router.go(-1);
    }

    axios
      .post("/api/isp/fetchOwnData", {
        id: this.getUserID,
      })
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          // console.log(res.data);
          this.setUserData(res.data);
          // console.log(this.userData);
          this.init = true;
        } else {
          this.error = true;
        }
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .post("/api/ticket/unseenCount", {
        receiverId: this.getUserName,
        receiverType: 2, // for ISP
      })
      .then((res) => {
        if (res.status === 200) {
          // console.log(res);
          // console.log(res.data.unseenCount);
          this.setNtfCount(res.data.unseenNotification);
          this.setTktCount(res.data.unseenTicket);
        } else {
          this.error = true;
        }
      })
      .catch((err) => {
        console.log(err);
      });

    this.intervalID = setInterval(this.fetchUnseenCount, 2000);
  },

  computed: {
    ...mapGetters([
      "getLoginState",
      "getAuthToken",
      "getNtfCount",
      "getTktCount",
      "getUserType",
      "getUserID",
      "getUserName",
      "getUserData",
    ]),

    getPayNotification() {
      if (!this.init) return false;
      let date = new Date();
      date.setDate(date.getDate() + 7);
      for (let i in this.getUserData.packages) {
        if (new Date(this.getUserData.packages[i].terminationTime) < date) {
          return true;
        }
      }
      return false;
    },
  },

  methods: {
    ...mapMutations([
      "setUserType",
      "setLoginState",
      "setAuthToken",
      "setNtfCount",
      "setTktCount",
      "setUserID",
      "setUserName",
      "setUserData",
    ]),

    fetchOwnData() {
      axios
        .post("/api/isp/fetchOwnData", {
          id: this.getUserID,
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            // console.log(res.data);
            this.setUserData(res.data);
            // console.log(this.userData);
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchUnseenCount() {
      axios
        .post("/api/ticket/unseenCount", {
          receiverId: this.getUserName,
          receiverType: 2, // for ISP
        })
        .then((res) => {
          if (res.status === 200) {
            // console.log(res);
            // console.log(res.data.unseenCount);
            this.setNtfCount(res.data.unseenNotification);
            this.setTktCount(res.data.unseenTicket);
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    updateInfo() {
      this.fetchOwnData();
      this.fetchUnseenCount();
    },

    logOut() {
      axios
        .post("/api/isp/logout", {
          token: this.getAuthToken,
        })
        .then((res) => {
          //console.log(res);
          if (res.status == 200) {
            clearInterval(this.intervalID);
            this.setLoginState(false);
            this.setNtfCount(0);
            this.setTktCount(0);
            this.setUserType("");
            this.setUserID("");
            this.setUserName("");
            this.setUserData("");
            this.setAuthToken("");
            this.$router.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.v-btn {
  margin: 0px 0.6%;
}
</style>
