import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {COLORS} from "../COLORS";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";

export const AppHeader = ({title}) => {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color={COLORS.dark} />
                </TouchableOpacity>

                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.divider}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        paddingBottom: 10,
        justifyContent: "space-between"
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.dark,
    },
    title2: {
        alignSelf: 'flex-start',
    },
    divider: {
        borderBottomWidth: 1,
        borderColor: COLORS.primary
    }
})
