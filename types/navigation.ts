// src/types/navigation.ts
export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Timer: undefined;
  Profile: undefined;
  Stats: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
