<template>
  <div class="survey">
    <h2>Survey Questions</h2>
    <div class="qa" v-for="t in 15">
      <p>What is what is {{ t }} is..?</p>
      <input type="text" placeholder="Type your answer here..." />
    </div>
    <button @click="emit('update')">Save</button>
    <button @click="emit('cancel')">Cancel</button>
  </div>
</template>

<script setup>
const emit = defineEmits(["cancel"]);
</script>

<style lang="scss" scoped>
.survey {
  display: flex;
  align-items: center;
  flex-direction: column;
  // justify-content: center;

  color: #fcfcfc;

  max-height: 90vh;

  padding: 20px 0;
  width: calc(100% - 30px);

  position: absolute;

  top: 200%;
  left: 50%;

  transform: translate(-50%, -50%);

  background: #141414;

  transition: 0.5s;

  border-radius: 10px;
  border: 1px solid #333;

  overflow: auto;

  h2 {
    margin-bottom: 20px;
  }

  .qa {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    height: 100%;
    width: 100%;

    // min-height: 100px;

    p {
      margin-bottom: 10px;
      width: 90%;
    }

    input {
      width: 90%;
      padding: 5px;
      margin-bottom: 10px;
      background: transparent;
      outline: none;
      border: none;
      border-bottom: 1px solid #333;
      color: #fcfcfc;
    }
  }
}

.active {
  top: 50%;
}
</style>
