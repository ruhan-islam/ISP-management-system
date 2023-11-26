<template>
  <div>
    <!-- <topbar></topbar> -->

    <div class="container mt-5">
      <!-- contents here  -->
      <v-row>
        <v-col justify="center">
          <h1>
            ERROR 404! <br />
            Page NOT Found!
          </h1>
        </v-col>
      </v-row>
    </div>
  </div>

  <!-- <bottombar></bottombar> -->
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.$router.push("/");
  },
  methods: {},
  computed: {},
};
</script>
