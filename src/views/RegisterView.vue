<template>
  <div class="login">
    <h1>Register</h1>
    <InputField label="Username" id="username" v-model="state.username" name="username" />

    <InputField label="Email" id="email" v-model="state.email" name="email" />

    <InputField type="password" name="password" label="Password" id="password" v-model="state.password" />
    <InputField type="password" name="password" label="Repeat Password" id="repassword" v-model="state.repassword"
      @enter="register" />

    <p>Already have an account? <router-link to="/login">Login</router-link></p>
    <button @click="register">Register</button>
    <Alert :show="showAlert" :text="alertText" />
  </div>
</template>

<script setup>
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateCurrentUser,
  updateProfile,
} from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore";
import { useRouter } from "vue-router";
import {
  getCurrentUser,
  useCurrentUser,
  useFirebaseAuth,
  useFirestore,
} from "vuefire";

const auth = useFirebaseAuth();
const db = useFirestore();
const router = useRouter();
const currentUser = await getCurrentUser();

const showAlert = ref(false);
const alertText = ref("");

const showAlertMessage = () => {
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
    alertText.value = "";
  }, 3000);
};

const state = reactive({
  username: "",
  email: "",
  password: "",
  repassword: "",
});

const register = async () => {
  const { email, password, username } = state;
  if (state.username === "" || state.email === "" || password === "") {
    alertText.value = "Please enter the details";
    showAlertMessage();
    return;
  } else if (password !== state.repassword) {
    alertText.value = "Passwords do not match";
    showAlertMessage();
    return;
  }
  try {

    const user = await createUserWithEmailAndPassword(auth, email, password);
    if (user.user) {
      console.log("User created successfully");
      await setDoc(doc(db, "AppData", user.user.uid), {
        username,
        email,
      });

      await updateProfile(user.user, { displayName: username });

      router.push("/");
    } else {
      console.log("Error creating user");
    }
  } catch (error) {
    alertText.value = "Error creating user";
    showAlertMessage();
    return;
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

  h1 {
    margin-bottom: 20px;
  }

  p {
    margin: 10px 0;
    font-size: 0.8rem;

    a {
      color: #cb9eff;
    }
  }
}
</style>
