<template>
  <NavBar />
  <Suspense>
    <RouterView />
  </Suspense>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useCurrentUser } from "vuefire";
import { App } from "@capacitor/app";

const user = useCurrentUser();
const router = useRouter();
const route = useRoute();

const isCurrentRouteAuthenticated = (route) => {
  return route.meta.requiresAuth;
};

watch(user, async (currentUser, previousUser) => {
  // redirect to login if they logout and the current
  // route is only for authenticated users
  if (!currentUser && previousUser && isCurrentRouteAuthenticated(route)) {
    return router.push({ name: "login" });
  }
  // redirect the user if they are logged in but were
  // rejected because the user wasn't ready yet, logged in
  // then got back to this page
  if (currentUser && typeof route.query.redirect === "string") {

    return router.push(route.query.redirect);
  }
});

onMounted(() => {
  App.addListener("backButton", () => {
    if (route.name === "login" || route.name === "register" || route.name === "home") {
      App.exitApp();
    }
    router.back();
  });
});
</script>

<style lang="scss" scoped></style>
