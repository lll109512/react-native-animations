import TextInput from './formComponent/TextInput'
import {NumberInput,PhoneInput,EmailInput} from './formComponent/PresetInputs'
import TextViewer from './viewerComponent/TextViewer';

export const viewComponents = {
    textInput:{
        component:TextViewer,
        placeholderValue: "No data",
    },
    phoneInput:{
        component:TextViewer,
        placeholderValue: "No data",
    },
    numberInput:{
        component:TextViewer,
        placeholderValue: "No data",
    },
    emailInput:{
        component:TextViewer,
        placeholderValue: "No data"
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