import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Home: undefined;
    Profile: { username?: string };
    Main: undefined;
    Login: undefined;
    Chats: { username: string };
    OfferDetails: { title: string; timeStamp: number; imageUrl: string };
    MakingOffer: { id: string };
    CreateOffer: undefined;
    SignUp: undefined;
    ConfirmationCode: { username: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;


declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}