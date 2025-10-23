import { View, StyleSheet, Text } from "react-native";
import { YStack, H2, Paragraph, Label, Input, Button, Avatar } from "tamagui";



const NewUser = () => {
    return (
        <YStack  gap="$2">
            <Button></Button>
            <Avatar circular size="$20">
                <Avatar.Image source={{ uri: "https://randomuser.me/api/portraits/women/28.jpg" }} />
            </Avatar>
        </YStack>
    )
}


export default NewUser;