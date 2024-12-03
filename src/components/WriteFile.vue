<!-- HelloWorld.vue -->
<template>
  <div>
    <button @click="writeToDesktop">Write File</button>
    <div v-if="message" class="message-display">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { formatTime } from "../utils";

export default {
  data() {
    return {
      message: "", // Message to display
    };
  },
  methods: {
    writeToDesktop() {
      // Get the current timestamp
      const timestamp = new Date().toISOString(); // Format as ISO 8601 string
      const message = "test";
      const fileContent = `${timestamp}\t${message}`;

      // Send the content to Electron API
      window.electronAPI.writeToDesktop(fileContent);
    },
  },
  mounted() {
    // Listen for the 'display-message' event from the main process
    window.electronAPI.onDisplayMessage((event, message) => {
      const timestamp = new Date().toISOString(); // Format as ISO 8601 string
      const formattedMessage = `${formatTime(timestamp)} --> ${message}`;
      this.message = formattedMessage;
    });
  },
};
</script>
