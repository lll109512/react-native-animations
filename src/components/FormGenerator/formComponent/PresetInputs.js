import React from 'react'
import TextInput from "./TextInput";

export const PhoneInput = ({ inputProps, ...other }) => {
    return <TextInput
        {...other}
        inputProps={{
            keyboardType:'phone-pad',
            ...inputProps,
        }}
    />
}

export const NumberInput = ({ inputProps, ...other }) => (
    <TextInput
        {...other}
        inputProps={{
            keyboardType: "number-pad",
            ...inputProps,
        }}
    />
);
export const EmailInput = ({ inputProps, ...other }) => (
    <TextInput
        {...other}
        inputProps={{
            keyboardType: "email-address",
            ...inputProps,
        }}
    />
);