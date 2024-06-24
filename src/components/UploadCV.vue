<template>
  <div class="cvup">
    <h1>Upload your CV</h1>

    <div class="input-file">
      <!-- <label class="button" for="cv">Choose a file</label> -->
      <!-- <input type="file" accept=".pdf" id="cv" @change="handleFile" /> -->
      <button @click="pickFile">Pick File</button>
      <p>{{ fileName ? "Uploaded : " + fileName : "No file selected" }}</p>
    </div>

    <button @click="upload" :disabled="loading">
      <div class="loader" v-if="loading"></div>
      <p v-else>Upload</p>
    </button>
    <button @click="emit('cancel')">Cancel</button>
  </div>
</template>

<script setup>
import axios from "axios";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { useRouter } from "vue-router";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { b64toBlob } from "@/utils";

const emit = defineEmits(["cancel"]);
const db = useFirestore();
const router = useRouter();

const props = defineProps({
  uid: String,
});

const inputFile = ref(null);
const fileName = ref("");
const loading = ref(false);

const pickFile = async () => {
  const result = await FilePicker.pickFiles({
    types: ["application/pdf"],
    readData: true,
  });

  inputFile.value = result.files[0];
  fileName.value = result.files[0].name;
  console.log(inputFile.value.data);
};

const upload = async () => {
  loading.value = true;
  const formData = new FormData();
  if (!inputFile.value) {
    loading.value = false;
    alert("Please select a file");
    return;
  }
  let file = inputFile.value;

  // convert base64 to blob
  const blob = b64toBlob(file.data, "application/pdf");
  // blob to file
  const rawFile = new File([blob], file.name, { type: "application/pdf" });

  formData.append("file", rawFile, file.name);
  formData.append("uid", props.uid);

  localStorage.setItem("resume", file.data);

  console.log("Sending file");
  let res = await axios.post(
    "https://nuxi.anupamkris.tech/api/uploadPDF",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  // console.log("Uploaded", res.data);
  let { content } = await res.data;

  await updateDoc(doc(db, "AppData", props.uid), {
    resume: content,
  });

  loading.value = false;
  // console.log("Uploaded", content);

  router.push("/resume");
};
</script>

<style lang="scss" scoped>
.cvup {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  color: #fcfcfc;

  height: 350px;
  width: calc(100% - 30px);

  position: absolute;

  top: 200%;
  left: 50%;

  transform: translate(-50%, -50%);

  background: #141414;

  transition: 0.5s;

  border-radius: 10px;
  border: 1px solid #333;

  .input-file {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    label {
      cursor: pointer;
    }

    input {
      display: none;
    }

    p {
      margin: 10px 0;
    }
  }
}

/* HTML: <div class="loader"></div> */
.loader {
  width: 20px;
  padding: 4px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--text-primary);
  --_m:
    conic-gradient(#0000 10%, #000),
    linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: l3 1s infinite linear;
}

@keyframes l3 {
  to {
    transform: rotate(1turn)
  }
}

.active {
  top: 50%;
}
</style>
