export interface PersonalBests {
  data: Run[];
}

export interface Run {
  place: number;
  run: {
    videos: {
      links: URI[];
    };
    times: {
      primary_t: number;
    };
    values: {
      [key: string]: string;
    };
  };
}

export interface URI {
  uri: string;
}
