<template>
  <div>
    <v-row justify="start" align="center">
      <v-col
        v-for="item in campaignData"
        :key="item.id"
        col="12"
        xs="12"
        sm="6"
        md="4"
        lg="3"
        @click="navigate(item)"
      >
        <v-hover v-slot="{ hover }" open-delay="200">
          <v-card
            height="150px"
            color="item.color"
            :elevation="hover ? 16 : 2"
            :class="{ 'on-hover': hover }"
            class="card-sensor"
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="text-h5 text-ellipsis font-weight-bold">{{
                  item.id
                }}</v-card-title>

                <v-card-subtitle class="py-1 pb-0 font-weight-bold"
                  >{{item.name}}</v-card-subtitle
                >
             
              </div>
            </div>
            <v-icon class="ico-sensor" color="#c72027">mdi-blur</v-icon>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: ["campaignData"],
  data() {
    return {};
  },
  watch: {
    campaignData(val) {
    },
  },

  methods: {
    navigate(data) {     
      this.$router.push({ name: 'campaign-view-id', params: { id: data.id }})
    },
  },
};
</script>
<style scoped>
.text-ellipsis {
  white-space: nowrap;
  word-break: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-sensor {
  overflow: hidden;
  cursor: pointer;
}
.ico-sensor {
  position: absolute;
  font-size: 150px;
  top: 6px;
  right: -40px;
  transition: transform 0.5s ease;
}
.v-card:hover .ico-sensor {
  transform: scale(1.5);
}
.v-card:hover .v-btn {
  background-color: #000 !important;
}

</style>
