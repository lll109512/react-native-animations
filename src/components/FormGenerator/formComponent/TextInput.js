import { isFunction } from 'lodash';
import React from 'react'
import { StyleSheet, Text, View, TextInput } from "react-native";

const Input = (props) => {
    const { formik, i18n, index, name, label, title, serverValidator, inputProps } = props;
    const renderLabel = isFunction(label) ? label(formik.values) : label;
    const renderTitle = isFunction(title) ? title(formik.values) : title;

    return (
        <View key={name}>
            {renderTitle && (
                <Text numberOfLines={1} adjustsFontSizeToFit style={{ marginBottom: 4 }}>
                    {renderTitle}
                </Text>
            )}
            <View
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                }}
            >
                {!renderTitle && (
                    <Text numberOfLines={1} style={{ width: 100, marginRight: 8 }}>
                        {renderLabel || i18n(name)}
                    </Text>
                )}
                <TextInput
                    testID={`${name}Input`}
                    key={name}
                    value={formik.values[name]}
                    onChangeText={value => formik.setFieldValue(name, value)}
                    onBlur={async () => {
                        if (serverValidator) {
                            const { valid, message } = await serverValidator(formik.values[name]);
                            if (!valid) {
                                formik.setFieldError(name, message);
                            } else {
                                formik.setFieldError(name, null);
                            }
                        } else {
                            console.log("onBlure");
                            formik.setFieldTouched(name);
                        }
                    }}
                    placeholder="Text here"
                    {...inputProps}
                />
            </View>
            {Boolean(formik.errors[name]) && Boolean(formik.touched[name])  && (
                <Text style={{ color: "red" }}>{formik.errors[name]}</Text>
            )}
        </View>
    );
}

export default Input;

const styles = StyleSheet.create({})
