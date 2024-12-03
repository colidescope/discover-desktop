<template>
  <div v-if="connection.localPath">
    <div v-if="connection.fileName" class="message-display">
      {{ `Connected to file: ${connection.fileName}` }}
    </div>
    <button @click="writeToDesktop">Write File</button>
  </div>
  <div v-if="message" class="message-display">
    {{ message }}
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useConnectionStore } from "../stores/connection";
import { formatTime } from "../utils";

// Access the Pinia store
const connection = useConnectionStore();
const message = ref("");

// Function to write to desktop
const writeToDesktop = () => {
  const timestamp = new Date().toISOString(); // ISO 8601 timestamp
  const content = `${timestamp}\ttest`;
  window.electronAPI.writeToDesktop(connection.localPath, content); // Send to Electron API
};

// Set up event listeners when the component is mounted
onMounted(() => {
  window.electronAPI.onDisplayMessage((event: any, msg: string) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `${formatTime(timestamp)} --> ${msg}`;
    message.value = formattedMessage; // Update the local reference
  });

  window.electronAPI.onConnect((event: any, path: string) => {
    console.log(event, path);
    const timestamp = new Date().toISOString();
    const formattedMessage = `${formatTime(timestamp)} --> ${path}`;
    console.log(formattedMessage);

    connection.setLocalPath(path); // Update Pinia store
    message.value = "";
  });
});
</script>

<style>
.message-display {
  margin-top: 10px;
  font-size: 1.2rem;
  color: #333;
}
</style>
