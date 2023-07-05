<template>
  <div class="text-center page">
    <v-pagination
      v-if="totalPages && totalPages"
      v-model="currentPage"
      :length="totalPages && totalPages"
      @input="clicked"
      circle
      class="custom"
    >
    </v-pagination>
    <div v-if="totalPages && totalPages" class="caption grey--text">
      Page {{ currentPage }} of {{ totalPages && totalPages }}
    </div>
  </div>
</template>
<script>
export default {
  props: ["page"],
  data() {
    return {
      currentPage: this.$route.query.page
        ? parseInt(this.$route.query.page)
        : 1,
    };
  },
  computed: {
    totalPages() {
      console.log("page in pagination", this.page);
      if (this.page && this.page == "mediaListNew") {
        if (
          this.$store.state.campaignMedia &&
          this.$store.state.campaignMedia.totalPages
        ) {
          console.log(
            "toatal pages",
            this.$store.state.campaignMedia.totalPages
          );
        }
        return (
          this.$store.state.campaignMedia &&
          this.$store.state.campaignMedia.totalPages
        );
      }
      if (this.page && this.page == "mediaList") {
        if (this.$store.state.media && this.$store.state.media.totalPages) {
          console.log("toatal pages", this.$store.state.media.totalPages);
        }
        return this.$store.state.media && this.$store.state.media.totalPages;
      }
      return null;
      return 10;
    },
  },
  methods: {
    clicked(page) {
      this.currentPage = page;

      this.$emit("changePage", page);
      this.$router.push(`?page=${page}`);
    },
  },
  watch: {
    $route(to, from) {
      if (to.fullPath === "/") {
        console.log("watching in pagination");
        this.currentPage = 1;
      }
    },
  },
};
</script>
