export const state = () => ({
  userPrivileges: {},
  allOrgRoles: []
})

export const mutations = {
  SET_USER_PRIVILEGES(state: any, data: any) {
    state.userPrivileges = data;
  },
  SET_ORG_ROLES(state: any, data: any) {
    state.allOrgRoles = data;
  },
}

export const actions = {
  async fetchUserPrivileges({ commit, state }: any, payload: any) {
    try {

      if (state.auth && state.auth.user) {
        let priv = state.auth.user.privileges;

        var privileges: any = {};
        for (var i = 0; priv && i <= priv.length; i++) {
          if (priv[i]) {
            let page = priv[i].split('_')[0];
            let opr = priv[i].split('_')[1];
            if (privileges[page]) {
              privileges[page].push(opr)
            } else {
              privileges[page] = [];
              privileges[page].push(opr)
            }
          }

        }
        commit('SET_USER_PRIVILEGES', privileges)
      }
    } catch (err) {
      console.error("fetch privilege failed: " + err);
      return Promise.reject(err);
    }

  },
  async fetchAllOrgRoles({ commit }: any) {
    try {
      const response = await (this as any).$axios.$get(`api/roles/getorgroles`);
      commit("SET_ORG_ROLES", response);
    } catch (err) {
      console.error("fetch Roles: " + err);
      return Promise.reject(err);
    }
  }
}

export const getters = {
  isAuthenticated(state: any) {
    return state.auth.loggedIn
  },

  loggedInUser(state: any) {
    return state.auth.user
  },

  getOrgId(state: any) {
    return state.auth.user.orgId
  },
  getAllOrgRoles(state: any) {
    return state.allOrgRoles
  }

}
