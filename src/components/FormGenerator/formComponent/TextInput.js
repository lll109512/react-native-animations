import { ErrorMessage } from 'formik';
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
                }}
            >
                {!renderTitle &&
                <Text numberOfLines={1} style={{ width: 50, marginRight: 8 }}>
                    {renderLabel || i18n(name)}
                </Text>
                }
                <TextInput
                    testID={`${name}Input`}
                    key={name}
                    value={formik.vlaues[name]}
                    onChangeText={value => formik.setFieldValue(name, value)}
                    onBlur={async () => {
                        if (serverValidator) {
                            const { valid, message } = await serverValidator(formik.values[name]);
                            if (!valid) {
                                formik.errors[name] = message;
                            } else {
                                formik.errors[name] = null;
                            }
                        } else {
                            formik.setFieldTouched(name);
                        }
                    }}
                    {...inputProps}
                />
            </View>
            <ErrorMessage name={name}>
                {error => <Text style={{ color: "red" }}>{error}</Text>}
            </ErrorMessage>
        </View>
    );
}

export default Input;

const styles = StyleSheet.create({})
