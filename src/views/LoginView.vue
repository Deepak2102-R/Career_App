<template>
  <div class="login">
    <h1>Login</h1>
    <InputField label="Email" id="username" v-model="state.username" />
    <InputField label="Password" id="password" type="password" v-model="state.password" @enter="login" />
    <button @click="login">Login</button>
    <p>
      Dont have an account? <router-link to="/register">Register</router-link>
    </p>
  </div>
  <Alert :show="showAlert" :text="alertText" />
</template>

<script setup>
import { signInWithEmailAndPassword } from "firebase/auth";
import { getCurrentUser } from "vuefire";
import { useFirebaseAuth } from "vuefire";
import { useRouter } from "vue-router";

const currentUser = await getCurrentUser();
const auth = useFirebaseAuth();
const router = useRouter();
const showAlert = ref(false);
const alertText = ref("");

const state = reactive({
  username: "",
  password: "",
});

const showAlertMessage = () => {
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
    alertText.value = "";
  }, 3000);
};

const login = async () => {
  if (state.username === "" || state.password === "") {
    alertText.value = "Please enter username and password";
    showAlertMessage();
    return;
  }

  try {
    const user = await signInWithEmailAndPassword(
      auth,
      state.username,
      state.password
    );
    if (user.user) {
      router.push("/");
    }
  } catch (error) {
    alertText.value = "Invalid credentials!";
    showAlertMessage();
  }

};

onMounted(async () => {
  if (currentUser) {
    router.push("/");
  }


});
</script>

<style lang="scss" scoped>
.login {
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 0 30px;

  color: #fcfcfc;

  p {
    margin: 10px 0;
    font-size: 0.8rem;

    a {
      color: #cb9eff;
    }
  }

  button {
    margin-top: 20px;
  }
}
</style>
