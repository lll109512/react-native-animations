import { TextInput } from "./TextInput";

export const PhoneInput = ({ inputProps, ...other }) => (
    <TextInput
        {...other}
        {...{
            keyboardType:'phone-pad',
            ...inputProps,
        }}
    />
);

export const NumberInput = ({ inputProps, ...other }) => (
    <TextInput
        {...other}
        {...{
            keyboardType: "number-pad",
            ...inputProps,
        }}
    />
);
export const EmailInput = ({ inputProps, ...other }) => (
    <TextInput
        {...other}
        {...{
            keyboardType: "email-address",
            ...inputProps,
        }}
    />
);