import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {COLORS} from "../../COLORS";

export const AppInput = ({ placeholder, icon, value, setValue, autoFocus = false }) => {

    const handleClear = () => {
        setValue('');
    };

    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={24} color="gray" style={styles.iconLeft} />
            <TextInput
                autoFocus={autoFocus}
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={setValue}
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={handleClear} style={styles.iconRight}>
                    <Ionicons name="close-circle" size={24} color="gray" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.dark,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 10,
    },
    iconLeft: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.dark
    },
    iconRight: {
        marginLeft: 10,
    },
});

