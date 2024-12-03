import { defineStore } from "pinia";
import { splitPath } from "../utils";

export const useConnectionStore = defineStore("connection", {
  state: () => {
    return { localPath: "" as string, fileName: "" as string };
  },
  actions: {
    setLocalPath(newPath: string) {
      const { directory, fileName } = splitPath(newPath);
      this.localPath = directory;
      this.fileName = fileName;
      console.log(this.localPath, this.fileName);
    },
  },
});
