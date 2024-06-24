<template>
  <div class="alert" :class="{ show }">
    <ion-icon name="alert-circle-outline" />
    <p>{{ text }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  text: String,
  show: Boolean,
})
</script>

<style lang="scss" scoped>
.alert {
  position: fixed;
  top: -100%;
  width: calc(100% - 20px);
  left: 10px;

  background: #750c1eb4;
  border: 1px solid #ff3a5bdc;
  color: white;
  z-index: 100;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 15px 10px;
  border-radius: 10px;

  transition: 0.3s;

  p {
    width: 100%;
    text-align: center;
    font-size: 16px;
  }

  ion-icon {
    font-size: 32px;
  }
}

.show {
  top: 10px;
}
</style>