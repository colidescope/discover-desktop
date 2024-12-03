export {};

declare global {
  interface Window {
    electronAPI: {
      writeToDesktop: (localPath: string, content: string) => void;
      onDisplayMessage: (
        callback: (event: any, message: string) => void
      ) => void;
      onConnect: (callback: (event: any, message: string) => void) => void;
    };
  }
}
