import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux';
import Dilogue from '../../../Shared/Components/Dilogue'

export default function LockNoteDilogue({password, setPassword, onOkPress, onCancelPress, visible}) {
    const theme = useSelector(state => state.theme)
    const {colors} = theme;
    const [retypePass, setRetypePass] = useState("");
    const [errText, setErrText] = useState("");


    const lockNote = () => {
        password === retypePass ? onOkPress() : setErrText("Password does not match!!")
    }

    const retypePassword = (text) => {
        setRetypePass(text);
        if(text === password)setErrText("")
        else setErrText("Password does not match!!")
    }
    return (
        <Dilogue transparentBackColor={"#0008"} dilogueVisible={visible} closeDilogue={onCancelPress} dilogueBackground={colors.backOne} cancellable={true}>
            <Text style={[styles.headTxt,{color: colors.textOne}]}>Lock note</Text>
            <Text style={[styles.subHeadTxt,{color: colors.textOne}]}>Remember this password, if you forget this password, you will never be able to access this data.</Text>
            <TextInput placeholder={"Password"} secureTextEntry placeholderTextColor={colors.textTwo} style={[styles.textInput, {backgroundColor: colors.backTwo, color: colors.textOne}]} value={password} onChangeText={text => setPassword(text)} />
            <TextInput placeholder={"Retype password"} secureTextEntry placeholderTextColor={colors.textTwo} style={[styles.textInput, {backgroundColor: colors.backTwo, color: colors.textOne}]} value={retypePass} onChangeText={text => retypePassword(text)} />
            {errText.length > 0 ? <Text style={[styles.errTxt,{color: colors.primaryErrColor}]}>{errText}</Text> : null}
            <View style={styles.buttonsView}>
                <TouchableOpacity style={{padding: 15}} onPress={onCancelPress}>
                    <Text style={[styles.btnTxt,{color: colors.textOne}]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{padding: 15}} onPress={lockNote}>
                    <Text style={[styles.btnTxt,{color: colors.primaryColor}]}>Lock note</Text>
                </TouchableOpacity>
            </View>
        </Dilogue>
    )
}

const styles = StyleSheet.create({
    headTxt: {fontSize: 20, fontWeight: "700", marginTop: 5, marginLeft: 5},
    subHeadTxt: {fontSize: 16, marginVertical: 10, marginLeft: 5},
    errTxt: {fontSize: 14, marginBottom: 10, marginLeft: 10},
    buttonsView: {
        flexDirection: "row",
        justifyContent: "space-between", paddingHorizontal: 25,
        alignItems: "center",
    },
    btnTxt: {fontSize: 16, fontWeight: "700"},
    textInput: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        margin: 5
    }
})
