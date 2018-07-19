import Vue from 'vue'
import Vuex from 'vuex'
import Axios from '@/plugins/axios';

Vue.use(Vuex)

const mutationsTypes = {
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  REGISTER_PENDING: 'REGISTER_PENDING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGIN_PENDING: 'LOGIN_PENDING',
  REFRESH_ACCESS_TOKEN: 'REFRESH_ACCESS_TOKEN',
};

export default new Vuex.Store({
  state: {
    registerPending: false,
    registerError: null,
    refreshToken: null,
    accessToken: null,
    accessTokenExpiresAt: null,
    loginPending: false,
    loginError: null,
  },
  mutations: {
    [mutationsTypes.REGISTER_FAILURE]({ state }, error) {
      // on stocke l'erreur dans le state pour l'afficher dans notre component
      state.registerError = error;
    },
    [mutationsTypes.REGISTER_PENDING]({ state }, value) {
      // on met à jour la clés registerPending pour afficher ou non un loader
      state.registerPending = value;
    },
    [mutationsTypes.LOGIN_SUCCESS]({ state }, { accessToken, refreshToken, accessTokenExpiresAt }) {
      state.error = null;
      state.refreshToken = refreshToken;
      state.accessToken = accessToken;
      state.accessTokenExpiresAt = accessTokenExpiresAt;
    },
    [mutationsTypes.LOGIN_FAILURE]({ state }, error) {
      state.refreshToken = null;
      state.accessToken = null;
      state.accessTokenExpiresAt = null;
      // on sauvegarde l'erreur dans le store pour l'afficher dans notre component
      state.loginError = error;
    },
    [mutationsTypes.LOGIN_PENDING]({ state }, value) {
      state.loginPending = value;
    },
    [mutationsTypes.REFRESH_ACCESS_TOKEN]({ state }, { accessToken, accessTokenExpiresAt }) {
      // on remplace le token actuel car il est expiré
      state.accessToken = accessToken;
      // et on met à jour sa date d'expiration pour pouvoir le renouveler à temps
      state.accessTokenExpiresAt = accessTokenExpiresAt;
    },
  },
  actions: {
    async register({ commit }, { email, password }) {
      try {
        // on indique qu'il faut afficher le loader
        commit(mutationsTypes.REGISTER_PENDING, true);
        const { data } = await Axios.post('http://localhost:3000/register', {
          email,
          password,
        });

        // et on n'oublie de désactiver le loader
        commit(mutationsTypes.REGISTER_PENDING, false);
      } catch (error) {
        commit(mutationsTypes.REGISTER_FAILURE, error);
        commit(mutationsTypes.REGISTER_PENDING, false);
        throw error;
      }
    },
    async login({ commit }, { email, password }) {
      try {
        // indique qu'il faut afficher le loader
        commit(mutationsTypes.LOGIN_PENDING, true);
        const { data } = await Axios.post('http://localhost:3000/login', {
          email,
          password,
          grantType: 'password',
        });

        // on appelle LOGIN_SUCCESS pour enregistrer nos tokens dans le store 
        commit(mutationsTypes.LOGIN_SUCCESS, data);
      } catch (error) {
        // en cas d'erreur, on appelle la mutation LOGIN_FAILURE
        commit(mutationsTypes.LOGIN_FAILURE, error);
      }
      // et pour finir, on désactive le loader
      commit(mutationsTypes.LOGIN_PENDING, false);
    }
  },
  getters: {
    registerPending: state => state.registerPending,
    registerError: state => state.registerError,
    refreshToken: state => state.refreshToken,
    accessToken: state => state.accessToken,
    accessTokenExpiresAt: state => state.accessTokenExpiresAt,
    // retourne true si le token est bien défini et qu'il n'a pas expiré
    isAuthenticated: (state, getters) =>
      getters.accessTokenExpiresAt !== null && getters.accessToken !== null
      && new Date().getTime() < getters.accessTokenExpiresAt,
    loginPending: state => state.loginPending,
    loginError: state => state.loginError,
  },
});
