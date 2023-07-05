<template>
  <div>
    <v-chip class="ma-2" close>
      Closable:
      <v-text-field
        class="pt-3"
        v-model="search"
        label="Enter key"
        single-line
        clearable
        @click:clear="clearRecord"
        @click:append="searchRecord"
      >
      </v-text-field>
    </v-chip>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
