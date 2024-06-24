<template>
  <div class="home page">
    <button @click="mode = 'upload'">Upload your CV</button>
    <!-- <button @click="mode = 'survey'">Take a Survey</button> -->
    <button @click="router.push('/chat')">Chat with AI</button>
    <button @click="router.push('/resume')">Resume</button>

    <UploadCV :class="{ active: mode === 'upload' }" @cancel="mode = ''" :uid="currentUser.uid" />
    <Survey :class="{ active: mode === 'survey' }" @cancel="mode = ''" />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { getCurrentUser } from "vuefire";

const mode = ref("");
const currentUser = await getCurrentUser();

const router = useRouter();
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: relative;

  overflow: hidden;
}
</style>
