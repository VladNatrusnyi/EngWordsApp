import { AppContainer } from "../containers/AppContainer";
import { Image, View, Text, Dimensions, StyleSheet } from "react-native";
import { AppButton } from "../components/appUI/AppButton";
import { COLORS } from "../COLORS";
import { useNavigation } from "@react-navigation/native";

export const BeginPage = () => {

  const navigation = useNavigation();

  const { width } = Dimensions.get("window");

  return (
    <AppContainer>
      <View style={styles.container}>
        <Image
          style={[styles.logo, { width: width - 40, height: width - 40 }]}
          source={require('../../assets/img/BigLogo.png')}
          resizeMode={'contain'}
        />

        <Text style={styles.description}>
          Immerse Yourself in the Vast World of Financial Knowledge and Gain Priceless Investment Insights
        </Text>

        <AppButton
          title="Start learning"
          onPress={() => { navigation.navigate('ModulesPage') }}
          color={COLORS.light}
          backgroundColor={COLORS.primary}
          borderRadius={10}
          height={60}
          textStyle={styles.buttonText}
          containerStyle={styles.buttonContainer}
          disabled={false}
        />
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  logo: {
    borderRadius: 1000,
  },
  description: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
