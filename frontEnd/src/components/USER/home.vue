<template>
  <div>
    <topbar></topbar>

    <!-- <div class="ma-12 mb-12 container-flow"> -->
    <div style="margin-bottom:15%" v-if="isLoading" class="container">
      <v-progress-linear
        style="margin:20% 0"
        color="deep-purple accent-4"
        indeterminate
        rounded
        height="6"
      ></v-progress-linear>
    </div>

    <div v-if="!isLoading" style="padding:0px 200px 50px 200px">
      <H1 style="padding-bottom:50px">Welcome to Amader Internet</H1>
      <div
        id="carouselExampleCaptions"
        class="carousel slide"
        data-bs-ride="carousel"
      >
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img
              style="height: 500px"
              src="https://ak.picdn.net/shutterstock/videos/28588675/thumb/1.jpg"
              class="d-block w-100"
              alt="..."
            />
            <div class="carousel-caption d-none d-md-block">
              <v-row>
                <h2>Get Exciting Packages with Lightning Speed</h2>
              </v-row>
            </div>
          </div>
          <div class="carousel-item">
            <img
              style="height: 500px"
              src="https://ak.picdn.net/shutterstock/videos/28588675/thumb/1.jpg"
              class="d-block w-100"
              alt="..."
            />
            <div class="carousel-caption d-none d-md-block">
              <v-row>
                <v-col cols="5" style="padding-top:10%">
                  <v-card v-if="pkgs.length > 0">
                    <v-img height="250" src="./../../assets/images.jpg"></v-img>

                    <v-card-title>
                      {{ pkgs[0].name }}
                    </v-card-title>

                    <v-card-text>
                      <v-chip-group
                        active-class="deep-purple accent-4 white--text"
                        column
                      >
                        <v-chip>{{ pkgs[0].bandwidth }} MBPS</v-chip>
                      </v-chip-group>
                      <div>
                        {{ pkgs[0].bandwidth }} MBPS speed relentless speed of
                        unlimited traffic with 24/7 service.
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col style="padding-top:20%">
                  <v-simple-table dark>
                    <template v-if="pkgs.length > 0" v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Features</th>
                          <th class="text-left">Availibility</th>
                        </tr>
                      </thead>
                      <tbody>
                        <!-- <tr v-for="item in pkgDetails" :key="item.name"> -->
                        <tr>
                          <td>Package Name</td>
                          <td>{{ pkgs[0].name }}</td>
                        </tr>
                        <tr>
                          <td>Price (Taka)</td>
                          <td>Tk. {{ pkgs[0].price }}</td>
                        </tr>
                        <tr>
                          <td>Bandwidth (MBPS)</td>
                          <td>{{ pkgs[0].bandwidth }} MBPS</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                  <!-- <v-btn
                    color="white"
                    router-link
                    to="/USER/packages"
                    style="margin:50px 0px 0px 190px"
                  >
                    Get Now...
                  </v-btn> -->
                </v-col>
              </v-row>
            </div>
          </div>

          <div class="carousel-item">
            <img
              style="height: 500px"
              src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
              class="d-block w-100"
              alt="..."
            />
            <div class="carousel-caption d-none d-md-block">
              <v-row>
                <v-col cols="5" style="padding-top:10%">
                  <v-card
                    v-if="validOffers.length > 0"
                    class="mx-auto"
                    max-width="344"
                  >
                    <v-img
                      src="./../../assets/offer.jpg"
                      height="200px"
                    ></v-img>

                    <v-card-title> {{ validOffers[0].name }} </v-card-title>

                    <v-card-subtitle>
                      <h2 style="color:red">
                        {{ validOffers[0].reduction }}% off
                      </h2>
                    </v-card-subtitle>

                    <v-expand-transition>
                      <div>
                        <v-divider></v-divider>
                      </div>
                    </v-expand-transition>
                  </v-card>
                </v-col>
                <v-col style="padding-top:20%">
                  <h3>
                    Get our excited offers on the packages (limited time only)
                  </h3>
                  <!-- <v-btn
                    color="white"
                    router-link
                    to="/USER/offers"
                    style="margin:50px 0px 0px 190px"
                  >
                    Claim Now...
                  </v-btn> -->
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
    <!-- </div> -->

    <bottombar></bottombar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import topbar from "./topbar.vue";
import bottombar from "./bottombar.vue";

export default {
  components: { topbar, bottombar },

  data() {
    return {
      isLoading: true,
      allPkgs: [],
      pkgs: [],
      allOffers: [],
      validOffers: [],
    };
  },

  computed: {
    ...mapGetters(["getUserID", "getUserData"]),
  },

  mounted() {
    this.isLoading = true;
    this.fetchOffers();
    this.fetchPackages();
  },

  methods: {
    fetchOffers() {
      axios
        .post("/api/offer/fetchByQuery", {
          creator: this.getUserData.ispId,
        })
        .then((res) => {
          if (res.status === 200) {
            this.allOffers = res.data.data;
            this.validOffers = [];
            for (let i in this.allOffers) {
              if (
                this.allOffers[i].expirationTime.slice(0, 10) >= this.getToday()
              ) {
                this.validOffers.push(this.allOffers[i]);
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchPackages() {
      axios
        .post("/api/package/fetchByQuery", {
          packageCreator: this.getUserData.ispId,
        })
        .then((res) => {
          this.allPkgs = res.data.data;
          for (let i in this.allPkgs) {
            if (this.allPkgs[i].ongoing) {
              this.pkgs.push(this.allPkgs[i]);
            }
          }
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getToday() {
      let today = new Date();
      today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
      return today.toISOString().slice(0, 10);
    },
  },
};
</script>
