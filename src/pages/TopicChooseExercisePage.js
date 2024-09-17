import { AppHeader } from "../components/AppHeader";
import { AppContainer } from "../containers/AppContainer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../COLORS";
import { FontAwesome5, Octicons } from "@expo/vector-icons";
import { useState } from "react";
import { useSelector } from "react-redux";

export const TopicChooseExercisePage = () => {

    const navigation = useNavigation();
    const { topicData } = useRoute().params;
    const { currentTopics } = useSelector(state => state.term);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setDimensions({ width, height });
    };

    const itemSize = (dimensions.width / 2) - 5;

    return (
      <AppContainer>
          <AppHeader title={'EngWordsApp'} />
          <Text style={styles.title}>
              {topicData.title}
          </Text>

          <View style={styles.wordsList}>
              <View style={styles.wordsWrapper}>
                  {
                      topicData.terms.map(term => {
                          return (
                            <View
                              key={term.id}
                              style={styles.termRow}>
                                <Octicons name="dot-fill" size={20} color={COLORS.dark} />
                                <Text style={styles.termText} key={term.id}>{term.word}</Text>
                            </View>
                          );
                      })
                  }
              </View>
          </View>

          <View
            onLayout={onLayout}
            style={styles.exerciseButtonsContainer}
          >

              <TouchableOpacity style={[styles.button, { width: itemSize, height: itemSize }]}
                                onPress={() => {
                                    navigation.navigate('ExercisePage', { wordsArr: topicData, type: 'quiz' });
                                }}
              >
                  {
                    currentTopics.find(el => el.id === topicData.id).isQuizCompleted &&
                    <View style={styles.checkmark}>
                        <FontAwesome5 name="check-circle" size={28} color={COLORS.light} />
                    </View>
                  }
                  <Text style={styles.buttonText}>
                      Quiz
                  </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, { width: itemSize, height: itemSize }]}
                                onPress={() => {
                                    navigation.navigate('ExercisePage', { wordsArr: topicData, type: 'truefalse' });
                                }}
              >
                  {
                    currentTopics.find(el => el.id === topicData.id).isTrueFalseCompleted &&
                    <View style={styles.checkmark}>
                        <FontAwesome5 name="check-circle" size={28} color={COLORS.light} />
                    </View>
                  }
                  <Text style={styles.buttonText}>
                      True or false
                  </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, { width: itemSize, height: itemSize }]}
                                onPress={() => {
                                    navigation.navigate('ExercisePage', { wordsArr: topicData, type: 'write' });
                                }}
              >
                  {
                    currentTopics.find(el => el.id === topicData.id).isWritingCompleted &&
                    <View style={styles.checkmark}>
                        <FontAwesome5 name="check-circle" size={28} color={COLORS.light} />
                    </View>
                  }
                  <Text style={styles.buttonText}>
                      Writing
                  </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, { width: itemSize, height: itemSize }]}
                                onPress={() => {
                                    navigation.navigate('ExercisePage', { wordsArr: topicData, type: 'drop' });
                                }}>
                  {
                    currentTopics.find(el => el.id === topicData.id).isMatchingCompleted &&
                    <View style={styles.checkmark}>
                        <FontAwesome5 name="check-circle" size={28} color={COLORS.light} />
                    </View>
                  }
                  <Text style={styles.buttonText}>
                      Matching
                  </Text>
              </TouchableOpacity>
          </View>
      </AppContainer>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        textAlign: 'center',
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 20
    },
    wordsList: {
        borderWidth: 2,
        borderRadius: 20,
        padding: 10,
        borderColor: COLORS.primary,
        marginBottom: 20
    },
    wordsWrapper: {
        height: 130,
        flexWrap: 'wrap',
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'center'
    },
    termRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: '50%',
    },
    termText: {
        fontSize: 16,
        color: COLORS.dark,
    },
    exerciseButtonsContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    buttonText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.light,
    },
    checkmark: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});
