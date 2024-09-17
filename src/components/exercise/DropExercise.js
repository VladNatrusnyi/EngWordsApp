import React, { useState, useRef, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    SafeAreaView,
    Platform,
    Modal
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import {AppButton} from "../appUI/AppButton";
import {COLORS} from "../../COLORS";
import {useNavigation} from "@react-navigation/native";

const headerHeight = 60;

const staticMarginIOS = 60 + headerHeight;
const staticMarginAndroid = headerHeight;

const DraggableWord = ({ id, word, onDrop, onDrag, isDragging }) => {
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);

    const onGestureEvent = (event) => {
        setTranslateX(event.nativeEvent.translationX);
        setTranslateY(event.nativeEvent.translationY);
        onDrag(event.nativeEvent.absoluteX, event.nativeEvent.absoluteY, id, word);
    };

    const onHandlerStateChange = (event) => {
        if (event.nativeEvent.state === State.END) {
            onDrop(event.nativeEvent.absoluteX, event.nativeEvent.absoluteY, { id, word });
            setTranslateX(0);
            setTranslateY(0);
        }
    };

    return (
      <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
          <View
            style={[
                styles.word,
                {
                    transform: [{ translateX }, { translateY }],
                    zIndex: isDragging ? 1000 : 1,
                    opacity: isDragging ? 0 : 1,
                },
            ]}
          >
              <Text style={styles.wordText}>{word}</Text>
          </View>
      </PanGestureHandler>
    );
};

const MatchWords = ({ words, updateCurrentTopics }) => {

    const navigation = useNavigation();

    const shuffleArray = (array) => {
        let newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const [remainingWords, setRemainingWords] = useState(shuffleArray(words));
    const [matches, setMatches] = useState(Array(words.length).fill(null));
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const [highlightedWordList, setHighlightedWordList] = useState(false);
    const [draggingWord, setDraggingWord] = useState(null);
    const [draggingWordProps, setDraggingWordProps] = useState(null);
    const definitionsRef = useRef([]);
    const containerRef = useRef(null);
    const safeAreaRef = useRef(null);
    const containerLayout = useRef({});

    const [results, setResults] = useState([]);

    const isAllWordFilled = useMemo(() => {
        return matches.every(el => !!el);
    }, [matches])

    const [modalVisible, setModalVisible] = useState(false);

    const createResultObg = () => {

        const resArr = matches.map(el => {
            if (el.wordId === el.descriptionId) {
                return {
                    id: el.descriptionId,
                    isCorrect: true,
                    initialData: words.find((item) => item.id === el.descriptionId),
                }
            } else {
                return {
                    id: el.descriptionId,
                    isCorrect: false,
                    initialData: words.find((item) => item.id === el.descriptionId),
                    unCorrectAnswerData: {
                        word: words.find((item) => item.id === el.wordId).word,
                        description: words.find((item) => item.id === el.descriptionId).description
                    }
                }
            }
        })
        setResults(resArr)

        setModalVisible(true)

        console.log('resArr',resArr)
    }


    const handleDrop = (x, y, wordObj) => {
        setDraggingWord(null);
        setDraggingWordProps(null);
        const { id, word } = wordObj;
        const isIOS = Platform.OS === 'ios';

        definitionsRef.current.forEach((ref, index) => {
            ref.measure((fx, fy, width, height, px, py) => {
                const condition = isIOS ? py : py - staticMarginAndroid;

                if (x >= px && x <= px + width && y >= condition && y <= condition + height && !matches[index]) {
                    setMatches((prev) => {
                        const newMatches = [...prev];
                        const oldIndex = newMatches.findIndex((item) => item && item.wordId === id);
                        if (oldIndex !== -1) {
                            newMatches[oldIndex] = null;
                        }
                        const descriptionId = words[index].id;
                        newMatches[index] = { wordId: id, word, descriptionId };
                        return newMatches;
                    });

                    setRemainingWords((prev) => prev.filter((item) => item.id !== id));
                }
            });
        });

        const screenWidth = Dimensions.get('window').width;
        if (x < screenWidth * 0.3) {
            setMatches((prev) => {
                const newMatches = [...prev];
                const oldIndex = newMatches.findIndex((item) => item && item.wordId === id);
                if (oldIndex !== -1) {
                    newMatches[oldIndex] = null;
                }
                return newMatches;
            });

            setRemainingWords((prev) => {
                if (!prev.some((item) => item.id === id)) {
                    return [...prev, { id, word }];
                }
                return prev;
            });
        }

        setHighlightedIndex(null);
        setHighlightedWordList(false);
    };

    const handleDrag = (x, y, id, word) => {
        setDraggingWord(id);
        let highlighted = false;
        const isIOS = Platform.OS === 'ios';

        definitionsRef.current.forEach((ref, index) => {
            ref.measure((fx, fy, width, height, px, py) => {
                const condition = isIOS ? py : py - staticMarginAndroid;

                if (x >= px && x <= px + width && y >= condition && y <= condition + height && !matches[index]) {
                    setHighlightedIndex(index);
                    highlighted = true;
                }
            });
        });

        const screenWidth = Dimensions.get('window').width;
        if (x < screenWidth * 0.3 && !highlighted) {
            setHighlightedWordList(true);
        } else {
            setHighlightedWordList(false);
        }

        setDraggingWordProps({ x, y, word });
    };

    const onContainerLayout = (event) => {
        containerLayout.current = event.nativeEvent.layout;
    };

    const closeModal = async () => {
        setModalVisible(false)
        navigation.goBack()
        if (results.every(item => item.isCorrect)) {
            await updateCurrentTopics({isMatchingCompleted: true})
        }
    }

    return (
      <>
          <ResultModal results={results} visible={modalVisible} onClose={closeModal} />
          <GestureHandlerRootView style={{ flex: 1 }}>
              <SafeAreaView style={styles.container} ref={safeAreaRef}>
                  <View style={{ flex: 1, flexDirection: 'row' }} onLayout={onContainerLayout} ref={containerRef}>
                      <ScrollView style={[styles.scrollContainer, highlightedWordList && styles.highlightedWordList]}>
                          <View style={styles.column}>
                              {remainingWords.map((item) => (
                                <View key={item.id} style={{ marginBottom: 10 }}>
                                    <DraggableWord
                                      id={item.id}
                                      word={item.word}
                                      onDrop={handleDrop}
                                      onDrag={handleDrag}
                                      isDragging={draggingWord === item.id}
                                    />
                                </View>
                              ))}
                          </View>
                      </ScrollView>
                      <ScrollView style={styles.scrollContainer2}>
                          <View style={styles.column2}>
                              {words.map((item, index) => (
                                <View key={item.id} style={styles.definitionContainer}>
                                    <View
                                      style={[
                                          styles.dropZone,
                                          highlightedIndex === index && styles.highlightedDropZone,
                                          matches[index] && styles.occupiedDropZone,
                                      ]}
                                      ref={(el) => (definitionsRef.current[index] = el)}
                                    >
                                        {matches[index] && (
                                          <DraggableWord
                                            key={matches[index].wordId}
                                            id={matches[index].wordId}
                                            word={matches[index].word}
                                            onDrop={handleDrop}
                                            onDrag={handleDrag}
                                            isDragging={draggingWord === matches[index].wordId}
                                          />
                                        )}
                                    </View>
                                    <View style={styles.definition}>
                                        <Text>{item.description}</Text>
                                    </View>
                                </View>
                              ))}
                          </View>
                      </ScrollView>
                      {draggingWordProps && (
                        <View
                          style={[
                              styles.draggingWord,
                              {
                                  top: Platform.OS === 'ios'
                                    ? draggingWordProps.y - containerLayout.current.y - staticMarginIOS
                                    : draggingWordProps.y - (containerLayout.current.y + staticMarginAndroid),
                                  left: Platform.OS === 'ios'
                                    ? draggingWordProps.x - containerLayout.current.x - 60
                                    : draggingWordProps.x - (containerLayout.current.x + staticMarginAndroid),
                              },
                          ]}
                        >
                            <Text>{draggingWordProps.word}</Text>
                        </View>
                      )}
                  </View>
              </SafeAreaView>

              {
                isAllWordFilled &&
                <AppButton
                  title="Control"
                  onPress={createResultObg}
                  color={COLORS.light}
                  backgroundColor={COLORS.primary}
                  borderRadius={10}
                  height={60}
                  textStyle={{ fontSize: 18 }}
                  containerStyle={{ marginTop: 10 }}
                  disabled={false}
                />
              }

          </GestureHandlerRootView>
      </>
    );
};

const ResultModal = ({results, visible, onClose }) => {
    return (
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
      >
          <View style={styles.modalOverlay}>

              <View style={styles.modalContent}>
                  <ScrollView>
                      <Text style={styles.modalTitle}>Results</Text>

                      <Text style={styles.ratingText}>{results.filter(el => el.isCorrect).length} / {results.length}</Text>

                      <View>
                          {
                              results.map(res => {
                                  return (
                                    <View
                                      style={styles.answerWrapper}
                                      key={res.id}>
                                        {
                                            res.isCorrect
                                              ? <View style={styles.correctWrapper}>
                                                  <Text style={styles.answerText}><Text style={styles.answerTextTerm}>{res.initialData.word}</Text> - {res.initialData.description}</Text>
                                              </View>
                                              : <View>
                                                  <View style={styles.wrongWrapper}>
                                                      <Text style={styles.answerText}><Text style={styles.answerTextTerm}>{res.unCorrectAnswerData.word}</Text> - {res.unCorrectAnswerData.description}</Text>
                                                  </View>
                                                  <View style={{
                                                      padding: 10
                                                  }}>
                                                      <Text style={{
                                                          color: COLORS.dark,
                                                          marginBottom: 5
                                                      }}>Correct answer</Text>
                                                      <Text style={styles.answerText}><Text style={styles.answerTextTerm}>{res.initialData.word}</Text> - {res.initialData.description}</Text>
                                                  </View>
                                              </View>
                                        }
                                    </View>
                                  )
                              }, [])
                          }

                      </View>

                      <AppButton
                        title="Close"
                        onPress={onClose}
                        color={COLORS.light}
                        backgroundColor={COLORS.primary}
                        borderRadius={10}
                        height={60}
                        textStyle={{ fontSize: 18 }}
                        containerStyle={{ marginTop: 10 }}
                      />
                  </ScrollView>
              </View>
          </View>
      </Modal>
    );
};

export const DropExercise = ({updateCurrentTopics, words}) => {

    return  (<>
        <MatchWords updateCurrentTopics={updateCurrentTopics} words={words} />
    </>)
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        width: 120,
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 10
    },
    highlightedWordList: {
        borderColor: COLORS.dark,
        borderWidth: 2,
    },
    scrollContainer2: {
    },
    column: {
        paddingTop: 10,
        alignItems: 'center',
    },
    column2: {
    },
    word: {
        width: 100,
        padding: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        zIndex: 0,
    },
    wordText: {
        color: COLORS.light,
        fontWeight: '600'
    },
    definitionContainer: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    dropZone: {
        width: 110,
        minHeight: 50,
        paddingVertical: 10,
        borderColor: '#bbb',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    highlightedDropZone: {
        borderColor: COLORS.dark,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    occupiedDropZone: {
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center'
    },
    definition: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        width: '40%',
        alignItems: 'center',
    },
    draggingWord: {
        position: 'absolute',
        zIndex: 1000,
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },


    //modal
    openButton: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    openButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        maxHeight: 600,
        // minHeight: 600,
        width: '80%',
        padding: 20,
        backgroundColor: COLORS.light,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 26,
        textAlign: 'center',
        fontWeight: 'bold',
        color: COLORS.primary
    },
    ratingText: {
        fontSize: 26,
        textAlign: 'center',
        fontWeight: 'bold',
        color: COLORS.dark
    },

    answerWrapper: {
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.primary,
        marginVertical: 10,
        // borderRadius: 10
    },
    correctWrapper: {
        // borderRadius: 10,
        backgroundColor: 'lightgreen',
        padding: 10
    },
    answerText: {
        fontSize: 16,
        color: COLORS.dark
    },
    answerTextTerm: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.primary
    },
    wrongWrapper: {
        // borderRadius: 10,
        backgroundColor: 'rgba(195,25,25,0.29)',
        padding: 10
    },
});

export default DropExercise;
