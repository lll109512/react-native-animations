import TextInput from './formComponent/TextInput'
import {NumberInput,PhoneInput,EmailInput} from './formComponent/PresetInputs'

export const viewComponents = {
};

export const formComponents = {
    textInput: {
        component: TextInput,
        default: "",
    },
    phoneInput: {
        component: PhoneInput,
        default: "",
    },
    numberInput: {
        component: NumberInput,
        default: "",
    },
    emailInput: {
        component: EmailInput,
        default: ""
    },
};