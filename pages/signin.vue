<template>
  <v-row justify="center">
    <v-col
      cols="12"
      sm="12"
      md="5"
      lg="4"
      xs="12"
      class="d-flex justify-content-center mt-0"
      style="justify-content: center"
    >
      <v-avatar :size="imageSize" tile>
        <v-img :src="signImg" contain> </v-img>
      </v-avatar>
    </v-col>
    <v-col class="hide-col" cols="12" sm="12" md="2" lg="2" xs="12"> </v-col>
    <v-col cols="12" sm="12" md="5" lg="6" xs="12">
      <v-card class="mx-auto pa-5" max-width="600">
        <v-card-title class="text-h4 font-weight-bold">Sign in</v-card-title>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="username"
            type="text"
            required
            :rules="usernameRules"
            label="Username"
            prepend-icon="mdi-account"
            full-width
            class="small-pading"
          ></v-text-field>
          <v-text-field
            v-model="password"
            prepend-icon="mdi-lock"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            hint="At least 5 characters"
            full-width
            @click:append="show1 = !show1"
            required
            class="small-pading"
          ></v-text-field>
          <div class="pt-3 text-right">
            <v-btn
              :small="$vuetify.breakpoint.smAndDown"
              :disabled="!valid"
              color="primary"
              class="mr-4"
              @click="validate"
            >
              Submit
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  layout: "signin",
  data() {
    return {
      signImg: require("@/assets/images/logo_wall_dark.png"),
      valid: true,
      username: "",
      usernameRules: [(v) => !!v || "Username is required"],
      show1: false,
      password: "",
      rules: {
        required: (value) => !!value || "Password Required.",
        min: (v) => v.length >= 5 || "Min 5 characters",
        emailMatch: () => `The username and password you entered don't match`,
      },
    };
  },
  mounted() {
    let self = this;
    window.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        self.validate();
      }
    });
  },
  computed: {
    imageSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "110";
        case "sm":
          return "200";
        case "md":
          return "340";
        case "lg":
          return "400";
        case "xl":
          return "500";
      }
    },
  },
  methods: {
    async validate() {
      this.$refs.form.validate();
      try {
        await this.$auth.loginWith("local", {
          data: { username: this.username, password: this.password },
        });
        this.$store.dispatch("fetchUserPrivileges");
        this.$router.push("/");
        this.$showSuccessToast(this, "Login Success");
      } catch (e) {
        if (e.response && e.response.status === 501) {
          this.showVerfication = true;
          this.$showErrorToast(this, e.response.data.message);
        } else if (e.response && e.response.data && e.response.data.message)
          this.$showErrorToast(this, e.response.data.message);
        else this.$showErrorToast(this, "Login Failure");
      }
    },
    clear() {
      this.username = "";
      this.password = "";
    },
  },
};
</script>
<style scoped>
@media only screen and (max-width: 768px) {
  .bg-image .v-image__image {
    background-size: 50% 50%;
    display: flex;
  }
}
@media (max-width: 480px) {
  .text-h4 {
    padding: 8px;
    padding-top: 0;
    font-size: 22px !important;
  }

  .small-pading {
    padding: 4px;
  }
}
</style>
