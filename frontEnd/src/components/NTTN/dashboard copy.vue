<template>
  <div>
    <topbar></topbar>

    <div class="ma-12 mb-12 container-flow">
      <!-- contents here  -->
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

  methods: {
    sendNotification() {
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

      this.pageInfo = "notify";
    },

    showTickets() {
      this.pageInfo = "tickets";
    },

    showOffers() {
      axios
        .post("/api/offer/fetchByQuery", {
          creator: "Nttn",
        })
        .then((res) => {
          if (res.status === 200) {
            this.allOffers = res.data.data;
            this.offerNameList = [];
            for (let i in this.allOffers) {
              this.offerNameList.push(this.allOffers[i].name);
            }
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
      };

      // console.log(newNotification);

      axios
        .post("/api/notification/insert", newNotification)
        .then((res) => {
          // console.log(res);
          if (res.status === 201) {
            this.$refs.form.reset();
            this.showSnackbar = true;
          } else {
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });

      setTimeout(() => {
        this.showSnackbar = false;
      }, 2000);
    },

    submitPressed() {
      // console.log("submit pressed");

      let newOffer = {
        name: this.offerName,
        status: true,
        reduction: this.reduction,
        startTime: this.dates[0],
        expirationTime: this.dates[1],
        creator: "Nttn",
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
