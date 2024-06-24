<template>
  <div class="resume">
    <div class="card">
      <div class="buttons" v-if="userDoc?.resume">
        <button @click="viewResume">View Resume</button>
        <button @click="viewSuggestions">View Suggestions</button>
      </div>
      <div class="wrapper" v-if="userDoc?.resume">
        <VuePDF v-if="showPdf" :pdf="pdf" class="pdf" />

        <div class="jobs" v-else>
          <div class="option" v-for="(job, index) in jobList" v-if="jobList" @click="selectedJob = job">
            <p>{{ index + 1 }}</p>
            <span>{{ job.title }}</span>
          </div>
          <div class="loader" v-if="jobList.length == 0">
          </div>
        </div>
      </div>
      <div class="wrapper cen" v-else>
        <p>Resume not uploaded. Please upload your resume to access this feature.</p>
      </div>

      <div class="job-bk" v-if="selectedJob" @click="selectedJob = null">
        <div class="job-card">
          <h1>{{ selectedJob.title }}</h1>

          <span>Job Description</span>
          <p>{{ selectedJob.description }}</p>
          <span>Why you should pursue this job</span>
          <p>{{ selectedJob.why }}</p>
        </div>
      </div>

      <!-- {{ userDoc?.resume }} -->

      <!-- <PDFViewer
        :source="pdfUrl"
        style="height: 100vh; width: 100vw"
        v-if="pdfUrl"
      /> -->
    </div>

  </div>
</template>

<script setup>
import "@tato30/vue-pdf/style.css";

import { getCurrentUser } from "vuefire";
import { VuePDF, usePDF } from "@tato30/vue-pdf";

import { useDocument, useFirestore } from "vuefire";
import { doc, updateDoc } from "firebase/firestore";
import { b64toBlob } from "@/utils";
import axios from "axios";

import PDFViewer from "pdf-viewer-vue";

const db = useFirestore();
const currentUser = await getCurrentUser();
const selectedJob = ref(null);
let fileContent = localStorage.getItem("resume");


const blob = b64toBlob(fileContent, "application/pdf");

const url = URL.createObjectURL(blob);
const { pdf, pages, info } = await usePDF(url);


const userDoc = useDocument(doc(db, "AppData", currentUser.uid));
const pdfUrl = ref("");
const showPdf = ref(true);
const jobList = ref([]);

const viewResume = async () => {
  showPdf.value = true;
};

const viewSuggestions = async () => {
  showPdf.value = false;

  // get resume content from firestore
  console.log(userDoc.value.resume);

  let response = await axios.post("https://nuxi.anupamkris.tech/api/summarize", {
    content: userDoc.value.resume,
  });

  console.log(response.data.summary.jobs);
  jobList.value = response.data.summary.jobs;
  // updateDoc(doc(db, "AppData", currentUser.uid), {
  //   jobList: response.data.summary.jobs,
  // });
};
</script>

<style lang="scss" scoped>
.resume {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: relative;

  overflow: hidden;

  color: white;

  .wrapper {
    width: 100%;
    height: 70vh;

    display: flex;
    justify-content: center;
    // align-items: center;

    .jobs {
      display: flex;
      flex-direction: column;
      align-items: center;

      gap: 10px;
      width: 100%;

      padding: 25px;

      .option {
        width: 100%;

        height: 65px;
        background: #202020;
        border-radius: 10px;

        padding: 10px;

        display: flex;
        align-items: center;

        gap: 15px;

        p {
          width: 35px;
          height: 35px;
          background: #141414;
          border-radius: 50%;

          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }

  .cen {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 50px;
    text-align: center;

  }

  .card {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-top: 10px;

    button {
      width: fit-content;
    }

    .buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
    }

    .job-bk {
      height: 100%;
      width: 100%;

      position: fixed;
      top: 0;
      left: 0;
      z-index: 1;

      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);

      display: flex;
      justify-content: center;
      align-items: center;

      .job-card {
        width: calc(100% - 50px);

        background: #141414;
        border-radius: 20px;
        padding: 20px;

        display: flex;
        flex-direction: column;
        max-height: calc(100% - 50px);
        overflow-y: auto;

        h1 {
          margin-bottom: 20px;
          color: var(--text-secondary);
        }

        span {
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 5px;
          margin-top: 15px;
          display: flex;

          color: var(--text-primary);
        }

        p {
          text-align: justify;
          font-size: 16px;
          color: #c7c7c7;
        }
      }
    }
  }
}

/* HTML: <div class="loader"></div> */
/* HTML: <div class="loader"></div> */
.loader {

  margin-top: 50px;
  transform: scale(1);

  --c: no-repeat linear-gradient(#a85bff77 0 0);
  background:
    var(--c), var(--c), var(--c),
    var(--c), var(--c), var(--c),
    var(--c), var(--c), var(--c);
  background-size: 16px 16px;
  animation:
    l32-1 1s infinite,
    l32-2 1s infinite;
}

@keyframes l32-1 {

  0%,
  100% {
    width: 45px;
    height: 45px
  }

  35%,
  65% {
    width: 65px;
    height: 65px
  }
}

@keyframes l32-2 {

  0%,
  40% {
    background-position: 0 0, 0 50%, 0 100%, 50% 100%, 100% 100%, 100% 50%, 100% 0, 50% 0, 50% 50%
  }

  60%,
  100% {
    background-position: 0 50%, 0 100%, 50% 100%, 100% 100%, 100% 50%, 100% 0, 50% 0, 0 0, 50% 50%
  }
}
</style>

<style lang="scss">
.pdf {
  height: 100%;
  width: 100%;

  canvas {
    height: 100% !important;
    width: 100% !important;
  }
}
</style>
