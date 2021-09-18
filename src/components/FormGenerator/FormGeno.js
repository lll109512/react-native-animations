import TextInput from './formComponent/TextInput'
import {NumberInput,PhoneInput,EmailInput} from './formComponent/PresetInputs'
import TextViewer from './viewerComponent/TextViewer';

export const viewComponents = {
    textInput:{
        component:TextViewer,
        placeholderValue: "",
    },
    phoneInput:{
        component:TextViewer,
        placeholderValue: "",
    },
    numberInput:{
        component:TextViewer,
        placeholderValue: "",
    },
    emailInput:{
        component:TextViewer,
        placeholderValue: ""
    },
};

export const formComponents = {
    textInput: {
        component: TextInput,
        defaultValue: "",
    },
    phoneInput: {
        component: PhoneInput,
        defaultValue: "",
    },
    numberInput: {
        component: NumberInput,
        defaultValue: "",
    },
    emailInput: {
        component: EmailInput,
        defaultValue: ""
    },
};