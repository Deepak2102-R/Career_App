<template>
  <nav v-if="!['login', 'register'].includes(route.name)">
    <p>{{ capitalizedRouteName }}</p>

    <div class="logout">
      <button @click="logout">
        <ion-icon name="power-outline" />
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useFirebaseAuth } from "vuefire";
import { signOut } from "firebase/auth";

const auth = useFirebaseAuth();
const route = useRoute();

const capitalizedRouteName = computed(() => {
  return route.name
    ? route.name.charAt(0).toUpperCase() + route.name.slice(1)
    : "";
});

const logout = () => {
  signOut(auth);
};
</script>

<style lang="scss" scoped>
nav {
  height: 70px;
  background: #1b1b1b;
  border-bottom: 1px solid #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  color: #ececec;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 15px;

  .logout {
    height: 40px;
    width: 40px;
    button {
      margin: 0;

      height: 100%;
      width: 100%;

      border-radius: 50%;

      padding: 0;
      font-size: 18px;

      color: #ececec;
    }
  }
}
</style>
