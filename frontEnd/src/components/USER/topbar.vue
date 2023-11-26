<template>
  <div style="margin-bottom:8%">
    <v-app-bar :fixed="true" dark>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            router-link
            to="/USER/home"
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
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            router-link
            to="/USER/packages"
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
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            router-link
            to="/USER/payments"
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
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            router-link
            to="/USER/notifications"
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
        <template v-slot:activator="{ on, attrsTickets }">
          <v-btn
            v-bind="attrsTickets"
            v-on="on"
            router-link
            to="/USER/tickets"
            exact
            elevation="0"
          >
            <span> Tickets </span>
            <v-icon> mdi-widgets </v-icon>
          </v-btn>
        </template>
        <span> Tickets </span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            router-link
            to="/USER/dashboard"
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
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" @click="logOut()" elevation="0">
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
    if (this.getUserType !== "USER") {
      this.$router.go(-1);
    }
    axios
      .post("/api/user/fetchOwnData", {
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
      .post("/api/notification/unseenNotificationCount", {
        receiverID: this.getUserName,
        receiverType: 3, // for USER
      })
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          // console.log(res.data.unseenCount);
          this.setNtfCount(res.data.unseenCount);
        } else {
          this.error = true;
        }
      })
      .catch((err) => {
        console.log(err);
      });

    this.intervalID = setInterval(this.updateInfo, 2000);
  },

  computed: {
    ...mapGetters([
      "getLoginState",
      "getAuthToken",
      "getNtfCount",
      "getUserID",
      "getUserName",
      "getUserData",
      "getUserType",
    ]),

    getPayNotification() {
      if (!this.init) return false;
      let date = new Date();
      date.setDate(date.getDate() + 7);
      // console.log(this.getUserData);
      if (new Date(this.getUserData.packages[0].terminationTime) < date) {
        return true;
      }
      return false;
    },
  },

  methods: {
    ...mapMutations([
      "setLoginState",
      "setAuthToken",
      "setNtfCount",
      "setUserType",
      "setUserData",
    ]),

    updateInfo() {
      axios
        .post("/api/user/fetchOwnData", {
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

      axios
        .post("/api/notification/unseenNotificationCount", {
          receiverID: this.getUserName,
          receiverType: 3, // for USER
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            // console.log(res.data.unseenCount);
            this.setNtfCount(res.data.unseenCount);
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
        .post("/api/user/logout", {
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
  margin: 0px 2%;
}
</style>
