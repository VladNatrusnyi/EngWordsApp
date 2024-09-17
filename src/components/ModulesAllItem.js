import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {COLORS} from "../COLORS";
import {Entypo, FontAwesome5, Octicons} from "@expo/vector-icons";
import {useDispatch, useSelector} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {setCurrentTopics} from "../store/termSlice";
import {useMemo} from 'react'
import {useNavigation} from "@react-navigation/native";
import {TopicLearnPage} from "../pages/TopicLearnPage";


export const ModulesAllItem = ({module}) => {

    const navigation = useNavigation();

    const dispatch = useDispatch();

    const {currentTopics} = useSelector(state => state.term)

    const isCurrentTopic = useMemo(() => {
        return currentTopics.some(el => el.id === module.id)
    }, [currentTopics])

    const isTopicFullCompleted = useMemo(() => {
        const data = currentTopics.find(el => el.id === module.id);
        if (data) {
            return data.isQuizCompleted && data.isMatchingCompleted && data.isTrueFalseCompleted && data.isWritingCompleted;
        }
        return false;
    }, [currentTopics, module.id]);

    const updateCurrentTopics = async (topicId) => {
        try {
            const currentTopics = await AsyncStorage.getItem('currentTopics');
            if (currentTopics) {
                const parsedData = JSON.parse(currentTopics);

                let res = parsedData

                if (parsedData.some(el => el.id === topicId)) {
                    res = parsedData.filter(item => item.id !== topicId);
                } else {
                    res = [...parsedData, {
                        id: topicId,
                        isQuizCompleted: false,
                        isMatchingCompleted: false,
                        isTrueFalseCompleted: false,
                        isWritingCompleted: false,
                    }]
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

    const goToLearningPage = () => {
        if (isCurrentTopic) {
            navigation.navigate('TopicLearnPage', {topicData: module})
        }
    }

    return (
        <View style={styles.container}>

            <TouchableOpacity
                onPress={goToLearningPage}
                style={styles.headWrapper}>
                {
                    isTopicFullCompleted &&
                    <View>
                        <FontAwesome5 name="check-square" size={24} color={COLORS.light} />
                    </View>
                }

                <Text style={styles.headTitle}>{module.title}</Text>
                <TouchableOpacity
                    onPress={() => updateCurrentTopics(module.id)}
                >
                    {
                        isCurrentTopic
                            ? <Entypo name="minus" size={32} color={COLORS.light} />
                            : <Entypo name="plus" size={32} color={COLORS.light} />
                    }
                </TouchableOpacity>


            </TouchableOpacity>
            {
                !isCurrentTopic &&
                <View style={{
                    height: 130,
                    flexWrap: 'wrap',
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    justifyContent: 'center'
                }}>
                    {
                        module.terms.map(term => {
                            return (
                                <View
                                    key={term.id}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 10,
                                        width: '50%'
                                    }}>
                                    <Octicons name="dot-fill" size={20} color={COLORS.dark} />
                                    <Text style={{
                                        fontSize: 16,
                                        color: COLORS.dark
                                    }} key={term.id}>{term.word}</Text>
                                </View>

                            )
                        })
                    }
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        backgroundColor: COLORS.light,
        borderRadius: 10
    },
    headWrapper: {
        padding: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headTitle: {
        width: '70%',
        fontSize: 18,
        color: COLORS.light,
        fontWeight: 'bold',
    }
})
