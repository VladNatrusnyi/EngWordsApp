import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export const AppButton = ({
                    title,
                    onPress,
                    color = '#FFFFFF',
                    backgroundColor = '#007BFF',
                    disabled = false,
                    loading = false,
                    borderRadius = 5,
                    width = '100%',
                    height = 50,
                    textStyle = {},
                    containerStyle = {}
                }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor, borderRadius, width, height },
                disabled && styles.disabledButton,
                containerStyle
            ]}
            onPress={!disabled && !loading ? onPress : null}
            activeOpacity={0.7}
            disabled={disabled}
        >
            {loading ? (
                <ActivityIndicator size="small" color={color} />
            ) : (
                <Text style={[styles.text, { color }, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.6,
    },
});

