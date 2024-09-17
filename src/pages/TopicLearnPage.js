
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    Animated,
    TouchableWithoutFeedback
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import { COLORS } from "../COLORS";
import Carousel, { Pagination } from 'react-native-snap-carousel-v4';
import { AppHeader } from "../components/AppHeader";
import { AppContainer } from "../containers/AppContainer";
import {AppButton} from "../components/appUI/AppButton";

const { width } = Dimensions.get('window');

const FlipCard = ({ item }) => {

    const [flipped, setFlipped] = useState(false);
    const animatedValue = useState(new Animated.Value(0))[0];
    const value = useState(0)[0];

    animatedValue.addListener(({ value }) => {
        value = value;
    });

    const flipCard = () => {
        if (flipped) {
            Animated.spring(animatedValue, {
                toValue: 0,
                friction: 8,
                tension: 10,
                useNativeDriver: true,
            }).start();
            setFlipped(false);
        } else {
            Animated.spring(animatedValue, {
                toValue: 180,
                friction: 8,
                tension: 10,
                useNativeDriver: true,
            }).start();
            setFlipped(true);
        }
    };

    const frontInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
        transform: [{ rotateX: frontInterpolate }],
    };

    const backAnimatedStyle = {
        transform: [{ rotateX: backInterpolate }],
    };

    return (
        <TouchableWithoutFeedback onPress={flipCard}>
            <View>
                {!flipped ? (
                    <Animated.View style={[styles.card, frontAnimatedStyle]}>
                        <Text style={styles.cardTextWord}>{item.word}</Text>
                    </Animated.View>
                ) : (
                    <Animated.View style={[styles.card, backAnimatedStyle]}>
                        <Text style={styles.cardText}>{item.description}</Text>
                    </Animated.View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

export const TopicLearnPage = () => {

    const navigation = useNavigation();
    const { params: { topicData } } = useRoute();
    const { terms, title } = topicData;
    const [activeSlide, setActiveSlide] = useState(0);

    const renderItem = ({ item }) => <FlipCard item={item} />;

    const pagination = (
        <Pagination
            dotsLength={terms.length}
            activeDotIndex={activeSlide}
            dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: COLORS.primary
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
        />
    );

    return (
        <AppContainer>
            <AppHeader title={'EngWordsApp'} />
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <View>
                    <Carousel
                        data={terms}
                        renderItem={renderItem}
                        sliderWidth={width - 40}
                        itemWidth={width - 120}
                        layout={'default'}
                        onSnapToItem={(index) => setActiveSlide(index)}
                    />
                </View>
                <View>
                    {pagination}
                </View>

                <AppButton
                    title="Start learning"
                    onPress={() => navigation.navigate('TopicChooseExercisePage', {topicData: topicData})}
                    color={COLORS.light}
                    backgroundColor={COLORS.primary}
                    borderRadius={10}
                    height={60}
                    textStyle={{ fontSize: 18 }}
                    containerStyle={{ marginTop: 10}}
                />

                <FlatList
                    style={{
                        paddingVertical: 15
                    }}
                    data={terms}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}><Text style={styles.listItemTextTerm}>{item.word}</Text> - {item.description}</Text>
                        </View>
                    )}
                />
            </View>
        </AppContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: COLORS.dark,
    },
    card: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        backfaceVisibility: 'hidden',
        borderRadius: 10,
        marginVertical: 10,
        padding: 10
    },
    cardTextWord: {
        fontSize: 22,
        color: COLORS.light,
        fontWeight: 'bold'
    },
    cardText: {
        fontSize: 20,
        color: COLORS.light,
    },
    listItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark,
    },
    listItemText: {
        fontSize: 18,
        color: COLORS.dark,
    },
    listItemTextTerm: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.primary
    }
});



