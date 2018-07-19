<template>
  <div/>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "app-login",
  data: () => ({
    form: {
      login: "",
      password: ""
    }
  }),
  actions: {
    ...mapActions(["login"]),
    async submit() {}
  },
  computed: {
    ...mapGetters(["loginError", "loginPending"])
  }
};
</script>
