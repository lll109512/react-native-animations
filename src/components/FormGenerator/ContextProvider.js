import React from 'react'
import FormFactory from './FormFactory';
export const formContext = React.createContext({
    factory: null,
    viewComponents: {},
    formComponents: {},
    viewLayoutComponents: [],
});

export const FormProvider = (props) => {
    const factory = new FormFactory(
        props.viewComponents,
        props.formComponents,
        props.viewLayoutComponents
    );
    const initValue = {
        factory,
        viewComponents: props.viewComponents || {},
        formComponents: props.formComponents || {},
        viewLayoutComponents: props.viewLayoutComponents || [],
    };
    return <formContext.Provider value={initValue}>{props.children}</formContext.Provider>;
};
