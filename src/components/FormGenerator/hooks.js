import { isFunction, flatten, pick,isNil, isEmpty } from "lodash"
import { useFormik } from "formik"
import { formContext } from "./ContextProvider";
import { useContext } from "react";
import * as yup from "yup";

export const useForm = ({ fields, i18n, defaultValues, onSubmit }) => {
    if(isNil(fields)){
        return {
            formik:null,
            handleSubmit: ()=>{},
            formGenerator: () => null,
        };
    }
    const { factory, viewLayoutComponents, formComponents } = useContext(formContext);

    const filterField = flatten(fields).filter(field => !viewLayoutComponents.includes(field.type));
    const validationSchema = yup.object(
        filterField.reduce((prev, curr) => {
            return { ...prev, [curr.name]: curr?.yup?.nullable() };
        }, {})
    );

    const formik = useFormik({
        initialValues: {
            ...filterField.reduce((prev, curr) => {
                const initValue = formComponents[curr]?.defaultValue || null;
                return { ...prev, [curr.name]: initValue };
            }, {}),
            ...pick(
                defaultValues,
                filterField.map(o => o.name)
            ),
        },
        validationSchema: validationSchema,
        onSubmit: async values => {
            const formik = { values };
            // only return input unhidden value
            const names = filterField
                .filter(item => {
                    if (item.hide) {
                        return !item.hide(formik);
                    } else {
                        return true;
                    }
                })
                .map(item => item.name);
            const picked = pick(values, names);
            await onSubmit(picked);
        },
    });

    return {
        formik,
        handleSubmit: formik.handleSubmit,
        formGenerator: () => factory.buildForm({ fields, formik, i18n }),
        disabledSubmit: !formik.isValid||isEmpty(formik.touched)
    };
};

export const useFormView = ({fields,i18n,data,keepFormat,trimStar})=>{
    if (isNil(fields) || isNil(data)) {
        return {
            viewGenerator: () => [],
        };
    }
    const { factory } = useContext(formContext);
    return {
        viewGenerator: () =>
            factory.buildView({ fields, i18n, keepFormat, trimStar, data }),
    };
}