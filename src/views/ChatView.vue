<template>
  <div class="chat-ai">
    <div class="chat" v-if="userDoc">
      <div class="chat-box">
        <div class="welcome" v-if="chats.length <= 2">
          <p class="grad">Hi, {{ userDoc.username }}...</p>
          <p>
            <VueWriter :array="['How can I help you?']" :typeSpeed="50" :eraseSpeed="50" />

          </p>
        </div>
        <div class="chat-message" v-for="(chat, index) in chats" :key="index" :class="chat.role">
          <template v-if="index > 1">
            <span>{{ chat.role == "model" ? "AI" : "U" }}</span>
            <p>
            <pre v-html="formatText(chat.text)"></pre>
            </p>
          </template>
        </div>
        <div class="chat-message" v-if="modelRunning">
          <span>AI</span>
          <p>
          <div class="loader"></div>
          </p>
        </div>
      </div>
      <div class="chat-input">
        <button @click="clearChat">
          <ion-icon name="refresh-outline"></ion-icon>
        </button>
        <input @keyup.enter="sendChat" type="text" placeholder="Type your message here..." v-model="inputValue" />
        <button @click="sendChat">
          <ion-icon name="send"></ion-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted } from "vue";
import { getCurrentUser, useFirestore, useDocument } from "vuefire";
import { doc } from "firebase/firestore";

const chats = ref([]);
const currentUser = await getCurrentUser();
const db = useFirestore();
const userDoc = useDocument(doc(db, "AppData", currentUser.uid));
const modelRunning = ref(false);

const inputValue = ref("");

const sendChat = async () => {
  modelRunning.value = true;
  let sendInput = inputValue.value;
  chats.value.push({ role: "user", text: sendInput });
  inputValue.value = "";
  const res = await axios.post("https://nuxi.anupamkris.tech/api/chat", {
    uid: currentUser.uid,
    message: sendInput,
  });
  modelRunning.value = false;
  chats.value = res.data;
};

const formatText = (text) => {
  text = text.replace(/```(.*?)```/gs, '<div class="code">$1</div>');
  // replace ** with bold
  text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  // replace lines that start with * with <ion-icon name="radio-button-on-outline"></ion-icon>
  text = text.replace(/^\* (.*)$/gm, '<li>$1</li>');

  return text;
};

const clearChat = async () => {
  await axios.post("https://nuxi.anupamkris.tech/api/clearChat", {
    uid: currentUser.uid,
  });
  chats.value = [];
  getChats();
};

onMounted(() => {
  getChats();
});

const getChats = async () => {
  const res = await axios.post("https://nuxi.anupamkris.tech/api/getChatHistory", {
    uid: currentUser.uid,
  });
  chats.value = res.data;
  if (res.data.length == 0) {

    await axios.post("https://nuxi.anupamkris.tech/api/startChat", {
      uid: currentUser.uid,
      resume: userDoc.value.resume ? userDoc.value.resume : "Resume Not Uploaded yet",
    });
  }
}
</script>

<style lang="scss" scoped>
.loader {
  width: 60px;
  aspect-ratio: 2;
  --_g: no-repeat radial-gradient(circle closest-side, #fff 90%, #0000);
  background: var(--_g) 0% 50%, var(--_g) 50% 50%, var(--_g) 100% 50%;
  background-size: calc(100% / 3) 50%;
  animation: l3 1s infinite linear;
  transform: scale(0.6);
}

@keyframes l3 {
  20% {
    background-position: 0% 0%, 50% 50%, 100% 50%;
  }

  40% {
    background-position: 0% 100%, 50% 0%, 100% 50%;
  }

  60% {
    background-position: 0% 50%, 50% 100%, 100% 0%;
  }

  80% {
    background-position: 0% 50%, 50% 50%, 100% 100%;
  }
}

.chat-ai {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: calc(100% - 70px);
  width: 100%;

  // padding: 0 30px;

  color: #fcfcfc;

  h1 {
    margin-bottom: 20px;
  }

  .chat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    max-width: 500px;
    height: 100%;

    .chat-box {
      padding-top: 10px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;

      gap: 10px;

      width: 100%;
      height: calc(100% - 60px);

      overflow: auto;

      .welcome {
        height: 100%;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        // text-align: center;

        padding-left: 20px;

        font-size: 3rem;

        p {
          width: 100%;
          color: #969696;
        }

        .grad {

          background: -webkit-linear-gradient(180deg, #3e8bff, var(--primary), #ff95ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

      }

      .chat-message {
        display: flex;
        // align-items: center;
        justify-content: flex-start;

        width: 100%;
        gap: 10px;
        padding: 0 10px;


        span {
          // margin-right: 10px;
          width: 40px;
          min-width: 40px;
          height: 40px;
          font-weight: bold;

          display: flex;
          justify-content: center;
          align-items: center;

          border-radius: 50%;
          background: #7746ff80;


        }

        p {
          padding: 10px;
          // margin: 5px 0;

          background: #333;
          border-radius: 10px;
          font-size: 14px;

          overflow-x: auto;


        }
      }

      .user {
        flex-direction: row-reverse;
      }
    }

    .chat-input {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;

      width: 100%;

      padding: 0 10px;

      input {
        width: calc(100% - 60px);
        padding: 10px;
        margin: 10px 0;

        border: 1px solid #333;
        border-radius: 10px;

        height: 50px;
        border-radius: 20px;

        background: transparent;
        outline: none;
        color: #fcfcfc;
      }

      button {
        margin: 0;

        height: 50px;
        border-radius: 25px;
        font-size: 20px;
      }
    }
  }
}
</style>


<style lang="scss">
pre {
  white-space: pre-wrap;

  li {
    list-style: none;


    &::before {
      content: "\2023";
      color: var(--primary);
      font-weight: bold;
      margin-right: 8px;
    }
  }

  .code {
    background: #111111;
    padding: 10px;
    border-radius: 10px;
    overflow-x: auto;
    white-space: pre;

  }
}
</style>