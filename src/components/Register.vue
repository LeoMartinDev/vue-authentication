<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>Register</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <form>
        <v-text-field
          v-validate="'required|min:3|max:10'"
          :error-messages="errors.collect('login')"
          v-model="form.login" :counter="10"
          name="login"
          label="Login"
        />
        <v-text-field
          v-validate="'required|min:5'"
          v-model="form.password"
          :error-messages="errors.collect('password')"
          :append-icon="passwordVisible ? 'visibility_off' : 'visibility'"
          :append-icon-cb="() => (passwordVisible = !passwordVisible)"
          :type="passwordVisible ? 'text' : 'password'"
          name="password"
          label="Password"
        />
        <v-text-field
          v-validate="'required|confirmed:password'"
          v-model="confirmPassword"
          :error-messages="errors.collect('confirmPassword')"
          :append-icon="passwordVisible ? 'visibility_off' : 'visibility'"
          :append-icon-cb="() => (passwordVisible = !passwordVisible)"
          :type="passwordVisible ? 'text' : 'password'"
          name="confirmPassword"
          label="Confirm password"
        />
      </form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        :loading="registerPending"
        :disabled="registerPending || errors.any() || !isComplete"
        @click="submit()">
        Register
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "app-register",
  data: () => ({
    form: {
      login: "",
      password: ""
    },
    confirmPassword: "",
    passwordVisible: false,
  }),
  actions: {
    ...mapActions(["register"]),
    async submit() {
      try {
        // on appelle notre action register avec en parametre le login & password
        await this.register(this.form);
        // s'il n'y a pas d'erreur, on redirige sur la page de login et on pré-remplit le champs login
        this.$router.push({ name: "login", query: { login: this.form.login } });
      } catch (error) {
        console.error(error);
      }
    }
  },
  computed: {
    ...mapGetters(["registerError", "registerPending"]),
    // permet de désactiver le boutton submit si la form est vide
    isComplete() {
      return this.form.login !== '' && this.form.password !== '';
    }
  }
};
</script>
