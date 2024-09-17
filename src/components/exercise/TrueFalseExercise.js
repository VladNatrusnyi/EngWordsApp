
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, Modal, Button } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { COLORS } from "../../COLORS";
import * as Progress from 'react-native-progress';
import {AppButton} from "../appUI/AppButton";
import FlashMessage, {showMessage} from "react-native-flash-message";
import {useNavigation} from "@react-navigation/native";

const { width, height } = Dimensions.get('window');

const shuffleTerms = (data) => {

    const terms = JSON.parse(JSON.stringify(data))
    const halfLength = Math.floor(terms.length / 2);
    const correctTerms = terms.slice(0, halfLength);
    const incorrectTerms = terms.slice(halfLength);

    // Shuffle incorrect terms' descriptions
    for (let i = incorrectTerms.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [incorrectTerms[i].description, incorrectTerms[j].description] = [incorrectTerms[j].description, incorrectTerms[i].description];
    }

    return [...correctTerms, ...incorrectTerms].sort(() => Math.random() - 0.5);
};

export const TrueFalseExercise = ({ updateCurrentTopics, words }) => {

    const navigation = useNavigation();

    const shuffledTerms = useMemo(() => shuffleTerms(words.terms), [words])
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [results, setResults] = useState([]);
    const [correctCount, setCorrectCount] = useState(0);
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;


    useEffect(() => {
        if (currentWordIndex < shuffledTerms.length) {
            Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
        }
    }, [currentWordIndex]);

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationX: translateX } }],
        { useNativeDriver: true }
    );

    const onHandlerStateChange = ({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
            if (nativeEvent.translationX > 100) {
                handleSwipe(true);
            } else if (nativeEvent.translationX < -100) {
                handleSwipe(false);
            } else {
                Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
            }
        }
    };

    const handleSwipe = (isTrue) => {
        const currentTerm = shuffledTerms[currentWordIndex];
        const originalTerm = words.terms.find(term => term.word === currentTerm.word);
        const isCorrectCombination = currentTerm.description === originalTerm.description;
        const isCorrect = (isCorrectCombination && isTrue) || (!isCorrectCombination && !isTrue);

        if (isCorrect) {
            showMessage({
                message: "TRUE",
                description: "Your choice is correct",
                type: "success",
            });
        } else {
            showMessage({
                message: "Wrong",
                description: "Your choice is wrong",
                type: "danger",
            });
        }

        setCorrectCount(prevCount => prevCount + (isCorrect ? 1 : 0));

        const newResults = [...results, {
            word: currentTerm.word,
            description: currentTerm.description,
            userChoice: isTrue ? 'Right' : 'Wrong',
            correctAnswer: isCorrect ? 'Correct' : 'Incorrect'
        }];
        setResults(newResults);

        const direction = isTrue ? width : -width;

        Animated.parallel([
            Animated.timing(translateX, { toValue: direction, duration: 300, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true })
        ]).start(() => {
            if (currentWordIndex < shuffledTerms.length - 1) {
                setCurrentWordIndex(currentWordIndex + 1);
                setProgress((currentWordIndex + 1) / shuffledTerms.length);
                translateX.setValue(0);
                opacity.setValue(1);
            } else {
                setProgress(1);
                setModalVisible(true);
            }
        });
    };

    const rotate = translateX.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
    });


    const closeModal = async () => {
        setModalVisible(false);
        navigation.goBack()

        if (correctCount === shuffledTerms.length) {
            await updateCurrentTopics({isTrueFalseCompleted: true});
        }
    };

    return (
        <View style={styles.container}>
            <FlashMessage style={{
                borderRadius: 10,
                height: 90,
                zIndex: 10000
            }} position="top" />
            <View>
                <Progress.Bar color={COLORS.primary} progress={progress} width={width - 40} />
                <Text style={styles.title}>{words.title}</Text>
                <Text style={styles.wordIndex}><Text style={styles.wordNumber}>{currentWordIndex + 1}</Text> / <Text style={styles.wordNumber}>{shuffledTerms.length}</Text></Text>
            </View>
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={styles.sideWrapperLeft}>
                    <Text style={styles.sideWrapperLeftText}>WRONG</Text>
                </View>
                <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
                    <Animated.View style={[styles.card, { transform: [{ translateX }, { rotate }], opacity }]}>
                        <Text style={styles.cardTitle}>{shuffledTerms[currentWordIndex].word}</Text>
                        <Text style={styles.description}>{shuffledTerms[currentWordIndex].description}</Text>
                    </Animated.View>
                </PanGestureHandler>
                <View style={styles.sideWrapperRight}>
                    <Text style={styles.sideWrapperRightText}>RIGHT</Text>
                </View>
            </View>

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View>
                            <Text style={styles.modalText}>
                                Results
                            </Text>
                            <Text style={styles.modalText2}>
                                Correct answer
                            </Text>
                            <Text style={styles.span}>{correctCount} / {shuffledTerms.length}</Text>
                        </View>

                        <AppButton
                            title="Close"
                            onPress={closeModal}
                            color={COLORS.light}
                            backgroundColor={COLORS.primary}
                            borderRadius={10}
                            height={60}
                            textStyle={{ fontSize: 18 }}
                            containerStyle={{ marginTop: 10}}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginVertical: 20,
        textAlign: "center",
        fontWeight: 'bold',
        color: COLORS.primary
    },
    wordIndex: {
        fontSize: 42,
        marginBottom: 10,
        justifyContent: 'center',
        textAlign: 'center',
        color: COLORS.dark
    },
    wordNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary
    },
    sideWrapperLeft: {
        width: 150,
        borderRightWidth: 3,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        borderColor: COLORS.dark,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: 10,
        height: '100%',
    },
    sideWrapperLeftText: {
        textAlign: 'right',
        transform: [{ rotate: '90deg' }],
        color: COLORS.dark,
        fontWeight: '600'
    },
    sideWrapperRight: {
        width: 150,
        borderLeftWidth: 3,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        borderColor: COLORS.dark,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginLeft: 10,
        height: '100%',
    },
    sideWrapperRightText: {
        textAlign: 'left',
        transform: [{ rotate: '-90deg' }],
        color: COLORS.dark,
        fontWeight: '600'
    },
    card: {
        width: width - 100,
        padding: 20,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 10,
        backgroundColor: COLORS.light,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        zIndex: 100
    },
    cardTitle: {
        fontSize: 24,
        marginBottom: 5,
        fontWeight: 'bold',
        color: COLORS.dark
    },
    description: {
        fontSize: 18,
        textAlign: 'center',
        color: COLORS.dark
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 18,
        marginVertical: 5,
    },

    modalText: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: COLORS.dark
    },

    modalText2: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
        color: COLORS.dark,
        fontWeight: '600'
    },
    span: {
        fontSize: 34,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
    }
});
