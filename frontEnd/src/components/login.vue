<template>
  <div class="container" style="padding:15% 30%">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-select v-model="type" :items="items" label="Login As" solo></v-select>

      <v-text-field
        v-model="username"
        :rules="nameRules"
        label="Username"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        autocomplete="on"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[rules.required, rules.min]"
        :type="show1 ? 'text' : 'password'"
        label="Password"
        hint="At least 6 characters"
        @click:append="show1 = !show1"
      ></v-text-field>

      <v-checkbox v-model="checkbox" label="Remember me"></v-checkbox>

      <v-btn
        :disabled="!valid || password === '' || type === ''"
        color="success"
        @click="validateLogin"
      >
        Login
      </v-btn>
      <label v-show="error" class="red--text">
        invalid username or password, try again
      </label>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      valid: false,
      username: "",
      password: "",
      error: false,
      items: ["NTTN", "ISP", "USER"],
      checkbox: true,
      type: "",

      nameRules: [
        (v) => !!v || "username is required",
        (v) =>
          (v && v.length <= 10) ||
          "usernameame must be less than 10 characters",
      ],

      show1: false,
      rules: {
        required: (value) => !!value || "password is required.",
        min: (v) => v.length >= 6 || "Min 6 characters",
      },
    };
  },

  computed: {
    ...mapGetters([
      "getLoginState",
      "getAuthToken",
      "getNtfCount",
      "getUserType",
    ]),
  },

  mounted() {
    if (this.getLoginState) {
      this.$router.push("/" + this.getUserType + "/home");
    }

    this.show1 = false;
    this.valid = false;
  },

  methods: {
    ...mapMutations([
      "setLoginState",
      "setAuthToken",
      "setUserType",
      "setUserID",
      "setUserName",
      "setUserData",
    ]),

    validateLogin() {
      let api = "/api/" + this.type.toLowerCase() + "/login";
      let dest = "/" + this.type + "/home";

      axios
        .post(api, {
          name: this.username,
          password: this.password,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 201) {
            if (this.username === "nttn") {
              this.username = "Nttn";
            } else {
              this.setUserID(res.data.user._id);
            }

            this.setLoginState(true);
            this.setAuthToken(res.data.token);
            this.setUserType(this.type.toUpperCase());
            this.setUserName(this.username);
            this.setUserData(res.data.user);
            this.$router.push(dest);
            this.$router.go();
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

<style></style>
