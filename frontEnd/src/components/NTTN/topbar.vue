<template>
  <div style="margin-bottom:8%">
    <v-app-bar :fixed="true" grow dark>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrsHome }">
          <v-btn
            v-bind="attrsHome"
            v-on="on"
            router-link
            to="/NTTN/home"
            exact
            elevation="0"
          >
            <span> Home </span>
            <v-icon> mdi-home </v-icon>
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
            to="/NTTN/packages"
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
            to="/NTTN/offers"
            exact
            elevation="0"
          >
            <span> Offers </span>
            <v-icon> mdi-widgets </v-icon>
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
            to="/NTTN/payments"
            exact
            elevation="0"
          >
            <span> Payments </span>
            <v-icon> mdi-credit-card </v-icon>
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
            to="/NTTN/notifications"
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
            to="/NTTN/notify"
            exact
            elevation="0"
          >
            <span> Notify </span>
            <v-icon> mdi-widgets </v-icon>
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
            to="/NTTN/tickets"
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
            to="/NTTN/dashboard"
            exact
            elevation="0"
          >
            <span> Dashboard </span>
            <v-icon> mdi-widgets </v-icon>
          </v-btn>
        </template>
        <span> Dashboard </span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrsLogout }">
          <v-btn v-bind="attrsLogout" v-on="on" elevation="0" @click="logOut()">
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
    };
  },

  mounted() {
    if (this.getUserType !== "NTTN") {
      this.$router.go(-1);
    }
    this.setUserData({
      name: "Nttn",
    });
    this.fetchUnseenCount();
    this.intervalID = setInterval(this.fetchUnseenCount, 2000);
  },

  computed: {
    ...mapGetters([
      "getLoginState",
      "getAuthToken",
      "getNtfCount",
      "getTktCount",
      "getUserType",
      "getUserData",
    ]),
  },

  methods: {
    ...mapMutations([
      "setUserType",
      "setUserData",
      "setLoginState",
      "setAuthToken",
      "setNtfCount",
      "setTktCount",
    ]),

    fetchUnseenCount() {
      axios
        .post("/api/ticket/unseenCount", {
          receiverId: "Nttn",
          receiverType: 1, // for NTTN
        })
        .then((res) => {
          if (res.status === 200) {
            this.setNtfCount(res.data.unseenNotification);
            this.setTktCount(res.data.unseenTicket);
            // console.log(res.data.unseenTicket);
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    logOut() {
      axios
        .post("/api/nttn/logout", {
          token: this.getAuthToken,
        })
        .then((res) => {
          //console.log(res);
          if (res.status == 200) {
            clearInterval(this.intervalID);
            this.setLoginState(false);
            this.setNtfCount(0);
            this.setUserType("");
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
