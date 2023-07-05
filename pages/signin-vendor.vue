<template>
  <v-row justify="center">
    <v-col cols="12" sm="10" md="8" lg="6">
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
          ></v-text-field>
          <div class="pt-3 text-right">
            <v-btn
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
  layout: 'signin',
  data() {
    return {
      valid: true,
      username: '',
      usernameRules: [
        (v) => !!v || 'Username is required'
      ],
      show1: false,
      password: '',
      rules: {
        required: (value) => !!value || 'Password Required.',
        min: (v) => v.length >= 5 || 'Min 5 characters',
        emailMatch: () => `The username and password you entered don't match`
      }
    }
  },
  mounted () {
    let self = this
    window.addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        self.validate()
      }
    })
  },
  methods: {
    async validate() {
      this.$refs.form.validate()
      try {
        await this.$auth.loginWith('local', {
          data: { username: this.username, password: this.password }
        })
        this.$router.push('/')
        this.$showSuccessToast(this, 'Login Success')
      } catch (e) {
        if (e.response && e.response.status === 501) {
          this.showVerfication = true
          this.$showErrorToast(this, e.response.data.message)
        } else if (e.response && e.response.data && e.response.data.message)
          this.$showErrorToast(this, e.response.data.message)
        else this.$showErrorToast(this, 'Login Failure')
      }
    },
    clear() {
      this.username = ''
      this.password = ''
    }
  }
}
</script>
