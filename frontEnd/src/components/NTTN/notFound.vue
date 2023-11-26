<template>
  <div>
    <topbar></topbar>

    <div class="ma-12 mb-12 container-flow">
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

    <bottombar></bottombar>
  </div>
</template>

<script>
import topbar from "./topbar.vue";
import bottombar from "./bottombar.vue";

export default {
  components: { topbar, bottombar },

  data() {
    return {};
  },
  methods: {},
  computed: {},
};
</script>
