declare global {
  interface Window {
    timeStart: (value: string) => void;
    timeEnd: (value: string) => void;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    log: (...messages: any[]) => void;
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
