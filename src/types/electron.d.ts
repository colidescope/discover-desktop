export {};

declare global {
  interface Window {
    electronAPI: {
      writeToDesktop: (content: string) => void;
    };
  }
}
