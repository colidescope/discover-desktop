import { defineStore } from "pinia";

export const useConnectionStore = defineStore("connection", {
  state: () => {
    return { localPath: "" as string, fileName: "" as string };
  },
  actions: {
    setLocalPath(newPath: string) {
      const lastSlashIndex = newPath.lastIndexOf("\\");
      this.localPath =
        lastSlashIndex !== -1 ? newPath.slice(0, lastSlashIndex) : ""; // Directory path
      this.fileName =
        lastSlashIndex !== -1 ? newPath.slice(lastSlashIndex + 1) : newPath; // File name
      console.log(this.localPath, this.fileName);
    },
  },
});
