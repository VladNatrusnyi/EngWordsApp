import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {ModulesPage} from "../pages/ModulesPage";
import {BeginPage} from "../pages/BeginPage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useDispatch, useSelector} from "react-redux";
import {
    setCurrentTopics,
    setIsPretestLoading, setModules,
} from "../store/termSlice";
import {useEffect} from "react";
import {TopicChooseExercisePage} from "../pages/TopicChooseExercisePage";
import {ExercisePage} from "../pages/ExercisePage";
import {TopicLearnPage} from "../pages/TopicLearnPage";
import axios from "axios";
import {MODULES} from "../MODULES";



const Stack = createStackNavigator();

const navTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent',
    },
};

const opacityStyleEl = ({ current }) => ({
    cardStyle: {
        opacity: current.progress,
    },
});


export const AppNavigator = () => {

    const dispatch = useDispatch();

    const {pretestData, pretestStatus, isPretestLoading, isPretestError} = useSelector(state => state.term)

    const getCurrentTopics = async () => {
        try {
            const currentTopics = await AsyncStorage.getItem('currentTopics');

            if (currentTopics) {
                dispatch(setCurrentTopics(JSON.parse(currentTopics)))
            } else {
                await AsyncStorage.setItem('currentTopics', JSON.stringify([]));
            }
        } catch (error) {
            console.error('Error checking or saving currentTopics:', error);
        }
    };


    const fetchModules = async (dispatch) => {
        dispatch(setIsPretestLoading(true));
        try {
            const modules = Object.values(MODULES);
            if (modules) dispatch(setModules(modules));
        } catch (error) {
            console.error('Error during data and status fetch:', error);
        } finally {
            dispatch(setIsPretestLoading(false));
        }
    };

    useEffect(() => {
        fetchModules(dispatch);
        getCurrentTopics()
    }, [dispatch]);

    return (
        <>
            {
                <NavigationContainer theme={navTheme}>
                    <Stack.Navigator
                        initialRouteName={'BeginPage'}
                        screenOptions={{
                            headerShown: false,
                            cardStyleInterpolator: opacityStyleEl,
                        }}
                    >
                        <Stack.Screen name="BeginPage" component={BeginPage} />
                        <Stack.Screen name="ModulesPage" component={ModulesPage} />
                        <Stack.Screen name="TopicChooseExercisePage" component={TopicChooseExercisePage} />
                        <Stack.Screen name="TopicLearnPage" component={TopicLearnPage} />
                        <Stack.Screen name="ExercisePage" component={ExercisePage} />
                    </Stack.Navigator>
                </NavigationContainer>
            }

        </>

    )
}
