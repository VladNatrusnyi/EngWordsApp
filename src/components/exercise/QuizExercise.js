
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Modal, TouchableOpacity, ScrollView } from 'react-native';
import * as Progress from 'react-native-progress';
import { COLORS } from "../../COLORS";
import { AppButton } from "../appUI/AppButton";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

const getRandomOptions = (terms, correctTerm) => {
    const options = [correctTerm];
    while (options.length < 4) {
        const randomTerm = terms[Math.floor(Math.random() * terms.length)];
        if (!options.includes(randomTerm)) {
            options.push(randomTerm);
        }
    }
    return options.sort(() => Math.random() - 0.5);
};

export const QuizExercise = ({ updateCurrentTopics, words }) => {
    const navigation = useNavigation();

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [results, setResults] = useState([]);
    const [finalModalVisible, setFinalModalVisible] = useState(false);
    const [shuffledTerms, setShuffledTerms] = useState([]);

    useEffect(() => {
        setShuffledTerms([...words.terms].sort(() => Math.random() - 0.5));
    }, [words.terms]);

    const currentTerm = shuffledTerms[currentWordIndex];
    const options = currentTerm ? getRandomOptions(words.terms, currentTerm) : [];

    const handleOptionPress = (option) => {
        const correct = option.id === currentTerm.id;
        setSelectedOption(option);
        setIsCorrect(correct);
        setModalVisible(true);

        if (correct) {
            setCorrectCount(correctCount + 1);
        } else {
            setResults([...results, { term: currentTerm, selected: option }]);
        }
    };

    const handleNext = () => {
        setModalVisible(false);
        if (currentWordIndex < shuffledTerms.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1);
            setProgress((currentWordIndex + 1) / shuffledTerms.length);
        } else {
            setFinalModalVisible(true);
        }
    };

    const closeModal = async () => {
        setFinalModalVisible(false);
        navigation.goBack();

        if (correctCount === shuffledTerms.length) {
            await updateCurrentTopics({ isQuizCompleted: true });
        }
    };

    if (!currentTerm) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View>
                <Progress.Bar color={COLORS.primary} progress={progress} width={width - 40} />
                <Text style={styles.title}>{words.title}</Text>
                <Text style={styles.wordIndex}>
                    <Text style={styles.wordNumber}>{currentWordIndex + 1}</Text> / <Text style={styles.wordNumber}>{shuffledTerms.length}</Text>
                </Text>
            </View>
            <View style={styles.quizContainer}>
                <Text style={styles.description}>{currentTerm.description}</Text>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={styles.optionButton}
                        onPress={() => handleOptionPress(option)}
                    >
                        <Text style={styles.optionText}>{option.word}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Modal visible={modalVisible} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{isCorrect ? "TRUE!" : "Wrong!"}</Text>
                        {!isCorrect && (
                            <View>
                                <Text style={styles.correctAnswer}>Correct answer:</Text>
                                <Text style={styles.correctAnswerWord}>{currentTerm.word}</Text>
                            </View>
                        )}
                        <AppButton
                            title={currentWordIndex < shuffledTerms.length - 1 ? "Next" : "Finish"}
                            onPress={handleNext}
                            color={COLORS.light}
                            backgroundColor={COLORS.primary}
                            borderRadius={10}
                            height={60}
                            textStyle={{ fontSize: 18 }}
                            containerStyle={{ marginTop: 10 }}
                        />
                    </View>
                </View>
            </Modal>

            <Modal visible={finalModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Exam Completed!</Text>
                        <Text style={styles.correctCount}>Correct answer: <Text style={styles.correctCountNumber}>{correctCount}</Text></Text>

                        {
                            correctCount !== shuffledTerms.length &&
                            <Text style={styles.correctCount}>Wrong answers:</Text>
                        }

                        <ScrollView style={styles.resultsContainer}>
                            {results.map((result, index) => (
                                <View key={index} style={styles.resultItem}>
                                    <Text style={styles.resultText}>
                                        <Text style={styles.resultTextKey}>Question:</Text> {result.term.description}
                                    </Text>
                                    <Text style={styles.resultText}>
                                        <Text style={styles.resultTextKey}>Your answer:</Text> {result.selected.word}
                                    </Text>
                                    <Text style={styles.resultText}>
                                        <Text style={styles.resultTextKey}>Correct answer:</Text> {result.term.word}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                        <AppButton
                            title="Close"
                            onPress={closeModal}
                            color={COLORS.light}
                            backgroundColor={COLORS.primary}
                            borderRadius={10}
                            height={60}
                            textStyle={{ fontSize: 18 }}
                            containerStyle={{ marginTop: 10 }}
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
        fontSize: 48,
        marginBottom: 10,
        textAlign: 'center',
        color: COLORS.dark
    },
    wordNumber: {
        fontSize: 38,
        fontWeight: 'bold',
        color: COLORS.primary
    },
    quizContainer: {
        marginVertical: 20,
        alignItems: 'center'
    },
    description: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        color: COLORS.dark,
        marginBottom: 20
    },
    optionButton: {
        backgroundColor: COLORS.light,
        padding: 15,
        borderRadius: 10,
        borderColor: COLORS.primary,
        borderWidth: 2,
        marginVertical: 5,
        width: width - 60,
        alignItems: 'center'
    },
    optionText: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.dark
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: COLORS.light,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 24,
        marginBottom: 10,
        color: COLORS.dark,
        fontWeight: '600',
        textAlign: 'center'
    },
    correctAnswer: {
        fontSize: 18,
        marginBottom: 10,
        color: COLORS.dark,
        textAlign: 'center'
    },
    correctAnswerWord: {
        fontSize: 22,
        marginBottom: 10,
        color: COLORS.primary,
        textAlign: 'center',
        fontWeight: '600',
    },
    correctCount: {
        fontSize: 20,
        marginBottom: 10,
        color: COLORS.dark,
        textAlign: 'center'
    },
    correctCountNumber: {
        fontSize: 24,
        fontWeight: '600',
        color: COLORS.primary
    },
    resultsContainer: {
        marginTop: 0,
        maxHeight: 300,
    },
    resultItem: {
        marginBottom: 10,
        borderWidth: 2,
        borderColor: COLORS.dark,
        padding: 10,
        borderRadius: 10,
    },
    resultText: {
        fontSize: 16,
        color: COLORS.dark,
        fontWeight: '400',
        marginBottom: 5
    },
    resultTextKey: {
        fontSize: 18,
        color: COLORS.primary,
        fontWeight: '600'
    }
});
