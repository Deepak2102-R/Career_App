<template>
  <div class="inputfield">

    <input :type="showPassword ? 'text' : type" :id="id" v-model="model" placeholder=" " @keyup.enter="emit('enter')" />
    <label :for="id">{{ label }}</label>
    <div class="show-icon" v-if="type === 'password'" @click="showPassword = !showPassword">
      <ion-icon name="eye-outline" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  id: String,
  type: String,
});

const model = defineModel();
const emit = defineEmits(["enter"]);

const showPassword = ref(false);
</script>

<style lang="scss" scoped>
.inputfield {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  position: relative;
  height: 40px;
  width: 100%;

  color: #b1b1b1;

  label {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    font-size: 0.9rem;
    transition: 0.3s;
  }

  input {
    height: 40px;
    padding: 10px;
    border: none;
    border-bottom: 1px solid #ccc;

    background: transparent;

    width: 100%;
    outline: none;

    transition: 0.3s;

    color: #ffffff;

    &:focus {
      border-bottom: 1px solid #ffffff;
    }

    &:focus+label,
    &:not(:placeholder-shown)+label {
      color: #919191;
      font-size: 0.8rem;
      left: 10px;
      transform: translateY(-100%);
    }
  }

  .show-icon {
    position: absolute;

    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
}
</style>
