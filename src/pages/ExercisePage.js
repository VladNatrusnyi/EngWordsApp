import {AppContainer} from "../containers/AppContainer";
import {AppHeader} from "../components/AppHeader";
import {useRoute} from "@react-navigation/native";
import DropExercise from "../components/exercise/DropExercise";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {setCurrentTopics} from "../store/termSlice";
import {useDispatch} from "react-redux";
import {WriteExercise} from "../components/exercise/WriteExercise";
import {TrueFalseExercise} from "../components/exercise/TrueFalseExercise";
import {QuizExercise} from "../components/exercise/QuizExercise";

export const ExercisePage = () => {

    const dispatch = useDispatch();
    const {wordsArr, type} = useRoute().params;

    const updateCurrentTopics = async (params = {}) => {
        try {
            const currentTopics = await AsyncStorage.getItem('currentTopics');
            if (currentTopics) {
                const parsedData = JSON.parse(currentTopics);

                let res = parsedData;

                if (parsedData.some(el => el.id === wordsArr.id)) {
                    res = parsedData.map(el => {
                        if (el.id === wordsArr.id) {
                            return {
                                ...el,
                                ...params
                            };
                        } else {
                            return el;
                        }
                    });
                }

                await AsyncStorage.setItem('currentTopics', JSON.stringify(res));
                dispatch(setCurrentTopics(res));
            } else {
                console.warn('No currentTopics data found to update.');
            }
        } catch (error) {
            console.error('Error updating currentTopics data:', error);
        }
    };

    const renderExercise = () => {
        switch (type) {
            case 'drop':
                return <DropExercise updateCurrentTopics={updateCurrentTopics} words={wordsArr.terms} />;
            case 'write':
                return <WriteExercise updateCurrentTopics={updateCurrentTopics} words={wordsArr} />;
            case 'truefalse':
                return <TrueFalseExercise updateCurrentTopics={updateCurrentTopics} words={wordsArr} />;
            case 'quiz':
                return <QuizExercise updateCurrentTopics={updateCurrentTopics} words={wordsArr} />;
            default:
                return null;
        }
    };

    return (
        <AppContainer>
            <AppHeader title={'EngWordsApp'} />
            {renderExercise()}
        </AppContainer>
    );
};
