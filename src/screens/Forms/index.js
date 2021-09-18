import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useForm } from 'src/components/FormGenerator/hooks'
import { otherIndividualForm } from "src/data/forms";

const index = () => {
    const { formik, handleSubmit, formGenerator } = useForm({
        fields: otherIndividualForm(v => v),
        i18n: v => v,
        onSubmit: values => console.log(values),
    });
    return (
        <View>
            <Text>123</Text>
        </View>
    )
}

export default index

const styles = StyleSheet.create({})
