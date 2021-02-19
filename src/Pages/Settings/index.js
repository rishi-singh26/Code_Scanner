import React from 'react'
import { SafeAreaView, Text } from 'react-native'
import { useSelector } from 'react-redux'
import ListTile from './Components/ListTile'

export default function Settings() {
    const theme = useSelector(state => state.theme);
    const {colors} = theme;
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: colors.backThree}}>
            <ListTile tileText={"Log-out"} rightIcon={"log-out"} />
            <ListTile tileText={"Enable dark mode"} rightIcon={"sunrise"} />
            <ListTile tileText={"Lock notes"} rightIcon={"lock"} />
        </SafeAreaView>
    )
}
