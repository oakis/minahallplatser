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
  interface MiniMenuItem {
    icon?: string;
    content: string;
    onPress: () => void;
  }
  interface IDeparture {
    fgColor: string;
    stop: string;
    booking: false;
    direction: string;
    JourneyDetailRef: {
      ref: string;
    };
    track: string;
    rtTrack: string;
    sname: string;
    type: string;
    date: string;
    bgColor: string;
    stroke: string;
    rtDate: string;
    time: string;
    name: string;
    rtTime: string;
    night: false;
    stopid: string;
    journeyid: string;
    accessibility: string;
  }
  interface IStop {
    id: string;
    lon: string;
    idx: string;
    weight: string;
    name: string;
    track: string;
    lat: string;
    icon: string;
    parent: string;
    busStop: string;
  }
  interface ISettingsProps {
    timeFormat: string;
    favoriteOrder: undefined | 'busStop' | 'opened';
    allowedGPS: boolean;
  }
  interface IFavoritesProps {
    favorites: IStop[];
    lines: IDeparture[];
    linesLocal: IDeparture[];
    loading: boolean;
  }
  interface ISearchProps {
    busStop: string;
    departureList: IStop[];
    stops: IStop[];
    loading: boolean;
    gpsLoading: boolean;
  }
  interface IErrorProps {
    error: string;
  }
  interface IStateProps {
    settings: ISettingsProps;
    errors: IErrorProps;
    fav: IFavoritesProps;
    search: ISearchProps;
  }
}

export {};
