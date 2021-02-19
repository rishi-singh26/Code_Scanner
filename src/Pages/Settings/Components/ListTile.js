import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'

export default function ListTile({tileText, rightIcon, style}) {
    const theme = useSelector(state => state.theme)
    const {colors} = theme;
    return (
        <View style={[styles.tileContainer, {backgroundColor: colors.backTwo}, style ? style : null]}>
            <Text style={[styles.tileText, {color: colors.textOne}]}>{tileText}</Text>
            <Feather name={rightIcon} size={20} color={colors.textOne} />
        </View>
    )
}

const styles = StyleSheet.create({
    tileContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20, paddingVertical: 15, marginBottom: 10
    },
    tileText: {
        fontSize: 17
    }
})
