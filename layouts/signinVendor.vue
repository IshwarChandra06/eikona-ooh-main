<template>
  <v-app dark>
    <Logo />
    <v-main class="d-flex justify-center align-center">
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Logo from '~/components/Logo.vue'
export default {
  components: {
    Logo
  },
  data() {
    return {}
  }
}
</script>
