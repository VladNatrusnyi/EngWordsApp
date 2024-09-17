import {Platform, SafeAreaView, StyleSheet, Text, View} from "react-native";
import {COLORS} from "../COLORS";


export const AppContainer = ({children}) => {

    return (
        <View style={styles.wrapper}>
            <SafeAreaView style={styles.container}>
                {children}
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: COLORS.light
    },
    container: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: Platform.OS === 'ios' ? 0 : 60,

    },

});
