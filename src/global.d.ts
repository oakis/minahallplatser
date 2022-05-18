declare global {
  interface Window {
    timeStart: (value: string) => void;
    timeEnd: (value: string) => void;
    log: (...messages: string[]) => void;
  }
  interface Global {
    performance: Record<string, () => number>;
  }
}

export interface MiniMenuItem {
  icon: string;
  content: string;
  onPress: () => void;
}
