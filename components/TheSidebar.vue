<template>
  <div>
    <v-list class="pt-0">
      <v-list-item class="px-2">
        <v-list-item-action class="my-0">
          <img src="../assets/images/logo.png" height="40px" />
        </v-list-item-action>

        <v-list-item-title></v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>
      <div v-if="selectedItem == 'index'">
        <v-list-item router to="/" exact nuxt>
          <v-list-item-action>
            <v-tooltip right color="#c72027">
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">mdi-view-dashboard</v-icon>
              </template>
              <span>Dashboard</span>
            </v-tooltip>
          </v-list-item-action>
          
        </v-list-item>
      </div>
      <div
        v-else-if="
          selectedItem == 'media' ||
          selectedItem == 'media-view-id' ||
          selectedItem == 'media-view-block-id' ||
          selectedItem == 'organization' ||
          selectedItem == 'reports'
        "
      >
        <span v-for="(item, i) in mediaItems" :key="i">
          <v-list-item
            :to="item.to"
            v-if="
              userPrivileges[item.name] &&
              userPrivileges[item.name].includes('view')
            "
            router
            exact
            nuxt
          >
            <v-list-item-action>
              <v-tooltip right color="#c72027">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">{{ item.icon }}</v-icon>
                </template>
                <span>{{ item.title }}</span>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>
        </span>
      </div>
      <div
        v-else-if="
          selectedItem == 'campaign' ||
          selectedItem == 'campaign-view-id' ||
          selectedItem == 'report-campaign' ||
          selectedItem == 'report-campaign-date'
        "
      >
        <span v-for="(item, i) in campaignItems" :key="i">
          <v-list-item
            :to="item.to"
            v-if="
              userPrivileges[item.name] &&
              userPrivileges[item.name].includes('view')
            "
            router
            exact
            nuxt
          >
            <v-list-item-action>
              <v-tooltip right color="#c72027">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">{{ item.icon }}</v-icon>
                </template>
                <span>{{ item.title }}</span>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>
        </span>
      </div>
      <div
        v-else-if="
          selectedItem == 'user-management' ||
          selectedItem == 'privileges' ||
          selectedItem == 'roles'
        "
      >
        <span v-for="(item, i) in userItems" :key="i">
          <v-list-item
            :to="item.to"
            v-if="
              userPrivileges[item.name] &&
              userPrivileges[item.name].includes('view')
            "
            router
            exact
            nuxt
          >
            <v-list-item-action>
              <v-tooltip right color="#c72027">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">{{ item.icon }}</v-icon>
                </template>
                <span>{{ item.title }}</span>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>
        </span>
      </div>
    </v-list>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: ["selectedItem", "selectedRoute"],
  data() {
    return {
      items: [
        {
          icon: "mdi-view-dashboard",
          title: "Dashboard",
          to: "/",
          name: "dashboard",
        },
      ],
      mediaItems: [
        {
          icon: "mdi-view-dashboard",
          title: "Dashboard",
          to: "/",
          name: "dashboard",
        },
        {
          icon: "mdi-play-box-outline",
          title: "Media",
          to: "/media",
          name: "media",
        },
        {
          icon: "mdi-chemical-weapon",
          title: "Organization",
          to: "/organization",
          name: "organization",
        },
        {
          icon: "mdi-file-video",
          title: "Media Monthly Report",
          to: "/reports",
          name: "reports",
        },
      ],
      campaignItems: [
        {
          icon: "mdi-view-dashboard",
          title: "Dashboard",
          to: "/",
          name: "dashboard",
        },
        {
          icon: "mdi-routes",
          title: "Campaign",
          to: "/campaign",
          name: "campaign",
        },
        {
          icon: "mdi-file-video",
          title: "Campaign Media Report",
          to: "/report-campaign",
          name: "report-campaign",
        },
        {
          icon: "mdi-calendar-text",
          title: "Campaign Daily Report",
          to: "/report-campaign-date",
          name: "report-campaign-date",
        },
      ],
      userItems: [
        {
          icon: "mdi-view-dashboard",
          title: "Dashboard",
          to: "/",
          name: "dashboard",
        },
        {
          icon: "mdi-account-network",
          title: "Users",
          to: "/user-management",
          name: "user-management",
        },
        {
          icon: "mdi-account-key",
          title: "Privileges",
          to: "/privileges",
          name: "privileges",
        },
        {
          icon: "mdi-account-plus",
          title: "Roles",
          to: "/roles",
          name: "roles",
        },
      ],
    };
  },
  watch: {
    selectedItem(va) {
     
      switch (va) {
        case "index":
        case "dashboard":
          this.$router.push("/");
          break;
        default:
          console.log("selectedItem", va);
          console.log("selectedRoute", this.selectedRoute);
          if (va) {
            this.$router.push(this.selectedRoute);
          } else {
            this.$router.push("/");
          }
      }
    },
   
  },
  computed: {
    role() {
      let role = this.$auth.user.role;
      return role;
    },
    name() {
      let name = this.$auth.user.username;
      return name;
    },
    ...mapState({
      userPrivileges: (state) => state.userPrivileges,
    }),
  },
  methods: {},
};
</script>
<style scoped>
.v-list .v-list-item--active .v-icon {
  color: #c72027 !important;
}
</style>
