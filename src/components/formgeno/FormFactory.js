import React from 'react'
import { flatten, get, isFunction, isNil, trimEnd } from "lodash";
import { View,Text } from "react-native";

const oneLine = (components, formik, i18n) => {
    return (
        <View style={{
            alignItems:"center",
            display:"flex"
        }}>
            {components.map((item, index) => (
                <View key={index} style={{
                    marginLeft=index !== 0 ? 1 : 0,
                    flex:1
                }}>
                    {formikMapper(item, formik, i18n)}
                </View>
            ))}
        </View>
    );
};

const UndefinedView = (props)=><View><Text style={{textAlign: "center"}}>Undefined views of type:{props.type}</Text></View>
const UndefinedForm = (props)=><View><Text style={{textAlign: "center"}}>Undefined forms of type:{props.type}</Text></View>

export default class FormFactory {
    constructor(viewComponents={}, formComponents={},viewLayoutComponents=["divider", "title"]) {
        this.viewComponents = {
            ...viewComponents,
            'undefined':UndefinedForm
        };
        this.formComponents = {
            ...formComponents,
            'undefined':UndefinedView
        };
        this.viewLayoutComponents = viewLayoutComponents
    }
    formikFormMapper({field,formik,i18n,index,...other}){
        if(Array.isArray(field)){
            return oneLine(field, formik, i18n);
        }else{
            if (hide && hide(formik)){
                return null
            }
            const MatchedComponent = get(this.formComponents,field.type,this.viewComponents['undefined'])
            return <MatchedComponent {...field} formik={formik} i18n={i18n} index={index} {...other}/>
        }
    }
    formikViewMapper({field,formik,i18n,index,...other}){
        // const { label, title, type } = field
        // const displayTitle = title || (label && isFunction(label)? label(data):label) || i18n(name);
        // const formatTitle = trimStar
        //     ? trimEnd(trimEnd(displayTitle, "*"))
        //     : displayTitle;
        const MatchedComponent = get(this.viewComponents,field.type,this.viewComponents['undefined'])
        return <MatchedComponent {...field} formik={formik} i18n={i18n} index={index} {...other}/>
    }
    
    buildFormGenerator({fields, formik, i18n}) {
        return fields.map((field, index) => formikFormMapper({field,formik,i18n,index}));
    }

    buildViewerGenerator({i18n,data,fields,keepFormat=false,trimStar=false}) {
        const filterField = keepFormat
            ? flatten(fields)
            : flatten(fields).filter(field => !this.viewLayoutComponents.includes(field.type));
        return filterField
                .filter(({ name }) => (keepFormat ? true : (!isNil(data[name]) && data[name]!=='')))
                .map((field, index) => formikViewMapper({field,formik,i18n,trimStar,index}));
    }
}
