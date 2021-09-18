import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { useForm } from 'src/components/FormGenerator/hooks'
import { otherIndividualForm } from "src/data/forms";

const index = () => {
    const { formik, handleSubmit, formGenerator, disabledSubmit } = useForm({
        fields: otherIndividualForm(v => v),
        i18n: v => v,
        onSubmit: values => console.log(values),
    });
    return (
        <View style={{ paddingHorizontal: 8 }}>
            {formGenerator().map((item,index) => (
                <View key={index} style={{ marginVertical: 8 }}>{item}</View>
            ))}
            <Button
                onPress={() => handleSubmit()}
                disabled={disabledSubmit}
                title="subumit"
            ></Button>
        </View>
    );
}

export default index

const styles = StyleSheet.create({})
