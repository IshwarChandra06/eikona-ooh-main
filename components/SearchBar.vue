<template>
  <div>
    <v-combobox
      v-model="select"
      :items="items"
      label="Search by field"
      multiple
      chips
    >
      
      <template v-slot:selection="data">
        <v-chip
          :key="JSON.stringify(data.item)"
          @click="activateSearch"
          @blur="deActivateSearch"
          :disabled="data.disabled"
          close
          @click:close="data.parent.selectItem(data.item)"
        >
          {{ data.item }} :

          <v-text-field
            v-if="isSearch"
            class="pt-3"
            v-model="search"
            label="Search"
            single-line
            clearable
            color="white"
            dark
          ></v-text-field>
        </v-chip>
      </template>
    </v-combobox>
  </div>
</template>

<script>
export default {
  data() {
    return {
      select: ["Vuetify", "Programming"],
      items: ["Programming", "Design", "Vue", "Vuetify"],
      selctedKey: null,
      rules: [
        (value) => !!value || "Required.",
        (value) => (value || "").length <= 20 || "Max 20 characters",
        (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      ],
      search:null,
      isSearch: false
    };
  },
  methods: {
      activateSearch(){
          this.isSearch= true
      },
      deActivateSearch(){
          this.isSearch= false
      }
  }
};
</script>
