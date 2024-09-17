import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView, Dimensions
} from 'react-native';
import {COLORS} from "../../COLORS";
import {AppInput} from "../appUI/AppInput";
import {AppButton} from "../appUI/AppButton";
import {useNavigation} from "@react-navigation/native";
import * as Progress from 'react-native-progress';

export const WriteExercise = ({ updateCurrentTopics, words }) => {

    const navigation = useNavigation();

    const {width, height} = Dimensions.get("window");

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [results, setResults] = useState([]);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    const currentWord = words.terms[currentWordIndex];

    const progress = useMemo(() => {
        const allAmount = words.terms.length
        return ( (1 / allAmount) * (currentWordIndex + 1))
    }, [words, currentWordIndex])


    const handleCheckAnswer = () => {
        const correct = inputValue.trim().toLowerCase() === currentWord.word.toLowerCase();
        setIsCorrect(correct);
        setResults(prevResults => [...prevResults, { word: currentWord.word, correct }]);
        if (currentWordIndex < words.terms.length - 1) {
            setShowModal(true);
        } else {
            setIsQuizFinished(true);
            setShowModal(true);
        }
    };

    const handleNextWord = () => {
        setShowModal(false);
        setInputValue('');
        if (currentWordIndex < words.terms.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1);
        }
    };

    const handleFinish = async () => {
        setShowModal(false);
        navigation.goBack()
        if (!results.filter(r => !r.correct).length) {
            await updateCurrentTopics({isWritingCompleted: true});
        }
    };


    return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                enabled={true}
            >
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        <View>
                            <Progress.Bar color={COLORS.primary} progress={progress} width={width - 40} />
                            <Text style={styles.title}>{words.title}</Text>
                            <Text style={styles.wordIndex}><Text style={styles.wordNumber}>{currentWordIndex + 1}</Text> / <Text style={styles.wordNumber}>{words.terms.length}</Text></Text>
                        </View>
                        <Text style={styles.description}>{currentWord.description}</Text>


                        <AppInput
                            autoFocus={true}
                            value={inputValue}
                            setValue={setInputValue}
                            placeholder="Wtite the word"
                            icon="document-text-outline"
                        />

                        <AppButton
                            title="Check"
                            onPress={handleCheckAnswer}
                            color={COLORS.light}
                            backgroundColor={COLORS.primary}
                            borderRadius={10}
                            height={60}
                            textStyle={{ fontSize: 18 }}
                            containerStyle={{ marginTop: 10}}
                            disabled={!inputValue.trim()}
                        />


                        <Modal
                            transparent={true}
                            visible={showModal}
                            onRequestClose={() => setShowModal(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                    {!isQuizFinished ? (
                                        <>
                                            <View>
                                                {
                                                    isCorrect
                                                        ? <Text style={styles.modalText}>
                                                          TRUE!
                                                        </Text>
                                                        : <View>
                                                            <Text style={styles.modalText}>
                                                                Wrong!
                                                            </Text>
                                                            <Text style={styles.modalText2}>
                                                                The correct word was <Text style={styles.span}>"{currentWord.word}"</Text>.
                                                            </Text>
                                                        </View>
                                                }

                                            </View>

                                            <AppButton
                                                title="Next"
                                                onPress={handleNextWord}
                                                color={COLORS.light}
                                                backgroundColor={COLORS.primary}
                                                borderRadius={10}
                                                height={60}
                                                textStyle={{ fontSize: 18 }}
                                                containerStyle={{ marginTop: 10}}
                                            />

                                        </>
                                    ) : (
                                        <>
                                            <View>
                                                <Text style={styles.modalText}>
                                                    Writing is over!
                                                </Text>
                                                <Text style={styles.modalText2}>
                                                    Correct answer:  <Text style={styles.span}>{results.filter(r => r.correct).length}</Text>
                                                </Text>
                                            </View>

                                            {results.filter(r => !r.correct).length > 0 && (
                                                <View>
                                                    <Text style={styles.modalTextFinis2}>Wrong words:</Text>
                                                    {
                                                        results.filter(r => !r.correct).map((item, index) => {
                                                            return (
                                                                <Text key={index} style={styles.modalTextFinish}> - {item.word}</Text>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            )}


                                            <AppButton
                                                title="To end"
                                                onPress={handleFinish}
                                                color={COLORS.light}
                                                backgroundColor={COLORS.primary}
                                                borderRadius={10}
                                                height={60}
                                                textStyle={{ fontSize: 18 }}
                                                containerStyle={{ marginTop: 10}}
                                            />
                                        </>
                                    )}
                                </View>
                            </View>
                        </Modal>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
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
    description: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: COLORS.dark
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '80%',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: COLORS.light,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: COLORS.dark
    },

    modalText2: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: COLORS.dark
    },

    modalTextFinis2: {
        fontSize: 24,
        marginBottom: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        color: COLORS.dark
    },
    modalTextFinish: {
        fontSize: 17,
        color: COLORS.dark
    },
    span: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary
    }
});
