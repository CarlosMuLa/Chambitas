import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Home: undefined;
    Main: undefined;
    Login: undefined;
    OfferDetails: { title: string; timeStamp: number; imageUrl: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;


declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}