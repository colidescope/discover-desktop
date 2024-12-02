<!-- HelloWorld.vue -->
<template>
  <div>
    <button @click="writeToDesktop">Write File to Desktop</button>
  </div>
</template>

<script>
export default {
  methods: {
    writeToDesktop() {
      window.electronAPI.writeToDesktop(
        "This is the content of the text file!"
      );
    },
  },
};
</script>
