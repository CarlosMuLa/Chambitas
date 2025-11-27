import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Home: undefined;
    Profile: { username?: string };
    Main: undefined;
    Login: undefined;
    Chats: { username: string };
    OfferDetails: { id: string };
    MakingOffer: { id: string, sub?: string, title?: string };
    CreateOffer: undefined;
    SignUp: undefined;
    ConfirmationCode: { username: string, password: string  };
    ChatDetail: { conversationId: string; name?: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;


declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}