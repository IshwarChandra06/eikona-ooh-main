<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="mini"
      :mini-variant.sync="mini"
      permanent
      app
      color="#efefef"
      width="56"
    >
      <TheSidebar :selectedItem="selectedItem" :selectedRoute="selectedRoute" />
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      dense
      app
      color="#c72027"
      elevation="2"
    >
      <div class="d-flex justify-start flex-nowrap d-top-menu">
        <div
          class="d-top-menu-list"
          :class="{ active: selectedItem === 'index' }"
          @click="selectedMenu('index')"
        >
          Home
        </div>
        <div
          v-if="
            hasAccess('media') ||
            hasAccess('media-view-id') ||
            hasAccess('media-view-block-id') ||
            hasAccess('organization') ||
            hasAccess('reports')
          "
          class="d-top-menu-list"
          :class="{
            active:
              selectedItem === 'media' ||
              selectedItem === 'media-view-id' ||
              selectedItem === 'media-view-block-id' ||
              selectedItem === 'organization' ||
              selectedItem === 'reports',
          }"
          @click="
            selectedMenu(
              hasAccess('media')
                ? 'media'
                : hasAccess('organization')
                ? 'organization'
                : hasAccess('reports')
                ? 'reports'
                : 'media'
            )
          "
        >
          Media
        </div>
        <div
          v-if="
            hasAccess('campaign') ||
            hasAccess('campaign-view-id') ||
            hasAccess('report-campaign') ||
            hasAccess('report-campaign-date')
          "
          class="d-top-menu-list"
          :class="{
            active:
              selectedItem === 'campaign' ||
              selectedItem === 'campaign-view-id' ||
              selectedItem === 'report-campaign' ||
              selectedItem === 'report-campaign-date',
          }"
          @click="
            selectedMenu(
              hasAccess('campaign')
                ? 'campaign'
                : hasAccess('report-campaign')
                ? 'report-campaign'
                : hasAccess('report-campaign-date')
                ? 'report-campaign-date'
                : 'campaign'
            )
          "
        >
          Campaign
        </div>
        <div
          v-if="
            hasAccess('user-management') ||
            hasAccess('privileges') ||
            hasAccess('roles')
          "
          class="d-top-menu-list"
          :class="{
            active:
              selectedItem === 'user-management' ||
              selectedItem === 'privileges' ||
              selectedItem === 'roles',
          }"
          @click="
            selectedMenu(
              hasAccess('user-management')
                ? 'user-management'
                : hasAccess('privileges')
                ? 'privileges'
                : hasAccess('roles')
                ? 'roles'
                : 'user-management'
            )
          "
        >
          Users
        </div>
      </div>
      <v-spacer />
      <v-card-title class="white--text">Welcome! {{ name }} </v-card-title>

      <!-- dropDown Menu start -->
      <v-menu
        bottom
        left
        offset-y
        :close-on-content-click="closeOnContentClick"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <template>
              <v-row justify="center">
                <v-dialog v-model="dialog" persistent max-width="600px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn text v-bind="attrs" v-on="on">
                      Reset Password
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">Reset Password</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="oldPass"
                              label="Old Password*"
                              required
                              :type="show1 ? 'text' : 'password'"
                              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                              @click:append="show1 = !show1"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="newPass"
                              label="New Password*"
                              :rules="[newPassRule.required, newPassRule.min]"
                              :type="show2 ? 'text' : 'password'"
                              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                              @click:append="show2 = !show2"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="confirmPass"
                              label="Confirm Password**"
                              :rules="confirmRule"
                              required
                              :type="show3 ? 'text' : 'password'"
                              :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                              @click:append="show3 = !show3"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red darken-1" text @click="cancelButton">
                        Cancel
                      </v-btn>
                      <v-btn
                        color="red darken-1"
                        text
                        @click="restPass"
                        :disabled="
                          !(
                            oldPass &&
                            newPass &&
                            newPass.length >= 5 &&
                            confirmPass
                          )
                        "
                      >
                        Reset
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-row>
            </template>
          </v-list-item>
          <v-list-item>
            <v-btn text @click="logoutUser">LogOut</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu left bottom white v-if="$vuetify.breakpoint.xsOnly">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="() => {}" class="flex-column">
            <v-list-item-title>
              <div
                class="d-top-menu-list"
                :class="{ active: selectedItem === 'index' }"
                @click="selectedMenu('index')"
              >
                Home
              </div>
            </v-list-item-title>
            <v-list-item-title>
              <div
                v-if="
                  (userPrivileges['mediasite'] &&
                    userPrivileges['mediasite'].includes('view')) ||
                  (userPrivileges['campaign'] &&
                    userPrivileges['campaign'].includes('view')) ||
                  (userPrivileges['mediareport'] &&
                    userPrivileges['mediareport'].includes('view'))
                "
                class="d-top-menu-list"
                :class="{ active: selectedItem === 'media' }"
                @click="selectedMenu('media')"
              >
                Media
              </div>
            </v-list-item-title>
            <v-list-item-title> option 1 </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <PageLoader />
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer padless>
      <v-col class="text-center" cols="12">
        Copyright © {{ new Date().getFullYear() }} —
        <strong>
          <a class="footer-link" href="" target="_blank">Eikona</a></strong
        >
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import TheSidebar from "~/components/TheSidebar.vue";
import PageLoader from "@/components/PageLoader";
export default {
  middleware: "isAdmin",
  components: {
    TheSidebar,
    PageLoader,
  },
  data() {
    return {
      closeOnContentClick: true,
      userRole: "Super Admin",
      valid: true,

      clipped: false,
      drawer: false,
      fixed: false,
      right: true,
      mini: true,
      title: "Eikona",
      name: "",
      selectedItem: "index",
      selectedRoute: "/index",
      active: null,
      user: null,
      dialog: false,
      oldPass: "",
      newPass: "",
      confirmPass: "",
      show1: false,
      show2: false,

      show3: false,

      newPassRule: {
        required: (value) => !!value || "Password Required.",
        min: (v) => v.length >= 5 || "Min 5 characters",
      },
      confirmRule: [(value) => !!value || "Please confirm password."],
      resetPayload: {
        oldPassword: "string",
        newPassword: "string",
        confirmNewPassword: "string",
      },
    };
  },
  computed: {
    role() {
      let role = this.$auth.user.role;
      return role;
    },
    ...mapState({
      userPrivileges: (state) => state.userPrivileges,
      resetData: (state) => state.userManagement.resetData,
    }),
  },
  async mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();
      setTimeout(() => this.$nuxt.$loading.finish(), 2000);
      this.$store.dispatch("fetchUserPrivileges");
      this.$store.dispatch("fetchAllOrgRoles");
      let user =
        this.$store.state.auth &&
        this.$store.state.auth.user &&
        this.$store.state.auth.user.username;
      this.name = user;
    });
    this.selectedRoute = this.$route.path;
    this.selectedItem = this.$route.name;
    console.log("auth", this.$auth);
    this.user = this.$auth.$state.user;
    if (!this.user) {
      this.$router.push("/signin");
    }
  },
  methods: {
    async logoutUser() {
      try {
        await this.$auth.logout();
        this.$router.push("/signin");
      } catch (error) {
        console.error(error);
        this.$router.push("/signin");
      }
    },
    selectedMenu(val) {
      this.selectedRoute = "/" + val;
      this.selectedItem = val;
    },
    hasAccess(page) {
      return (
        this.userPrivileges[page] && this.userPrivileges[page].includes("view")
      );
    },
    cancelButton() {
      this.oldPass = "";
      this.newPass = "";
      this.confirmPass = "";
      this.dialog = false;
    },
    restPass(evt) {
      this.resetPayload.oldPassword = this.oldPass;
      this.resetPayload.newPassword = this.newPass;
      this.resetPayload.confirmNewPassword = this.confirmPass;

      this.$store
        .dispatch("userManagement/resetPassword", this.resetPayload)
        .then(() => {
          this.$showSuccessToast(this, "Reset Success");
          this.dialog = false;
        })
        .catch((err) => {
          if (this.newPass !== this.confirmPass) {
            this.$showErrorToast(this, "Password Mismatch");
            return;
          } else {
            this.$showErrorToast(this, "Reset Failed");
            return;
          }
        });
    },
  },
};
</script>
<style scoped>
.container {
  max-width: 100% !important;
}
.d-top-menu .d-top-menu-list {
  padding-right: 20px;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
}
.d-top-menu .d-top-menu-list:hover,
.d-top-menu .d-top-menu-list.active {
  font-weight: 700;
}
.footer-link {
  text-decoration: none;
  cursor: pointer;
}
.footer-link:hover {
  color: #000;
}
.page-enter-active {
  animation: acrossIn 0.45s ease-out both;
}

.page-leave-active {
  animation: acrossOut 0.65s ease-in both;
}

@keyframes acrossIn {
  0% {
    transform: translate3d(-100%, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes acrossOut {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(100%, 0, 0);
  }
}
</style>
