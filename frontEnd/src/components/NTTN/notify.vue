<template>
  <div>
    <topbar></topbar>

    <div class="ma-12 mb-12 container-flow">
      <!-- contents here  -->
      <div class="container" justify-center>
        <v-form ref="form" v-model="valid" lazy-validation>
          <div style="width:80%">
            <v-text-field
              v-model="ispName"
              :rules="ispNameRules"
              label="ISP name"
              required
            ></v-text-field>
            <v-text-field
              v-model="subject"
              :rules="subjectRules"
              label="Subject"
              required
            ></v-text-field>
            <v-textarea
              color="teal"
              v-model="details"
              :rules="detailsRules"
              label="Details"
              required
            >
            </v-textarea>

            <v-card-actions class="justify-center">
              <v-btn
                :disabled="isSendDisabled"
                color="success"
                class="mr-4"
                @click="sendPressed"
              >
                Send
              </v-btn>
            </v-card-actions>

            <v-snackbar :value="showSnackbar">
              Notification Sent
            </v-snackbar>
          </div>
        </v-form>
      </div>
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
  components: {
    topbar,
    bottombar,
  },

  data() {
    return {
      valid: false,

      ispList: [],
      ispNameList: [],
      ispName: "",
      ispNameRules: [
        (v) => !!v || "Name is required",
        (v) => !(v && !this.ispNameList.includes(v.trim())) || "ISP not found",
      ],

      subject: "",
      subjectRules: [(v) => !!v || "Subject is required"],

      details: "",
      detailsRules: [(v) => !!v || "Details is required"],

      showSnackbar: false,
    };
  },

  mounted() {
    this.fetchIspNameList();
  },

  computed: {
    ...mapGetters([
      // "getAuthToken",
      // "getNtfCount",
      "getUserData",
    ]),

    isSendDisabled() {
      return !(this.ispName && this.subject && this.details && this.valid);
    },
  },

  methods: {
    ...mapMutations([
      // "setNtfCount",
    ]),

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

    sendPressed() {
      // console.log("send pressed");

      let newNotification = {
        senderId: "Nttn",
        receiverID: this.ispName,
        senderType: 1,
        receiverType: 2,
        subject: this.subject,
        details: this.details,
        category: "",
        notificationArrivalTime: new Date(),
      };

      console.log(newNotification);

      axios
        .post("/api/notification/insert", newNotification)
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
  },
};
</script>
