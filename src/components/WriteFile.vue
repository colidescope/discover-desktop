<!-- HelloWorld.vue -->
<template>
  <div>
    <button @click="writeToDesktop">Write File</button>
  </div>
</template>

<script>
export default {
  methods: {
    writeToDesktop() {
      // Get the current timestamp
      const timestamp = new Date().toISOString(); // Format as ISO 8601 string
      const fileContent = `${timestamp}`;

      // Send the content to Electron API
      window.electronAPI.writeToDesktop(fileContent);
    },
  },
};
</script>
