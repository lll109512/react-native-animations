import React, { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { useForm, useFormView } from 'src/components/FormGenerator/hooks'
import { otherIndividualForm } from "src/data/forms";

const index = () => {
    const [savedData, setSavedData] = useState(null)
    const { formik, handleSubmit, formGenerator, submitDisabled } = useForm({
        fields: otherIndividualForm(v => v),
        i18n: v => v,
        onSubmit: values => {
            console.log(values)
            setSavedData(values)
        },
    });
    const { viewGenerator } = useFormView({
        fields: otherIndividualForm(v => v),
        data: savedData,
        i18n: v => v,
        trimStar:true
    });
    return (
        <View style={{ paddingHorizontal: 8 }}>
            {formGenerator().map((item, index) => (
                <View key={index} style={{ marginVertical: 8 }}>
                    {item}
                </View>
            ))}
            <Button onPress={() => handleSubmit()} disabled={submitDisabled} title="subumit" />
            {viewGenerator().map((item, index) => (
                <View key={index} style={{ marginVertical: 8 }}>
                    {item}
                </View>
            ))}
        </View>
    );
}

export default index

const styles = StyleSheet.create({})
