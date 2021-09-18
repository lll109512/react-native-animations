import React,{useMemo} from "react";
import StyledBtn from "components/Common/StyledBtn";
import CheckCircle from "components/Icons/CheckCircle";
import { CircularProgress, Box } from "@material-ui/core";

import i18n from "gx-web-ui/i18n";

import { Formik, Field, Form, ErrorMessage, FieldArray, useFormik } from "formik";
import * as yup from "yup";

import pick from 'lodash/pick'
import flatten from 'lodash/flatten'
import { formikGenerator } from "components/Forms/FormGenerater";

const FormTempate = props => {
    const { onSubmit,key, defaultValues = {}, fields, customerSubmitBtn, onCancel, formRootStyle,  } = props;
    const APP_TEXT = i18n.useI18n("app");
    const filterField = flatten(fields).filter(c => !["divider", "title"].includes(c.type));
    const validationSchema = yup.object(
        filterField.reduce((prev, curr) => {
            return { ...prev, [curr.name]: curr?.yup?.nullable() };
        }, {})
    );
    return (
        <div key={key}>
            <Formik
                initialValues={{
                    ...filterField.reduce((prev, curr) => {
                        let initValue;
                        switch (curr.type) {
                            case "text":
                            case "file":
                            case "number":
                            case "dropDown":
                            case "radio":
                                initValue = "";
                                break;
                            case "date":
                                initValue = null;
                                break;
                            case "checkBox":
                                initValue = false;
                            default:
                                break;
                        }
                        return { ...prev, [curr.name]: initValue };
                    }, {}),
                    ...pick(
                        defaultValues,
                        filterField.map(o => o.name)
                    ),
                }}
                validationSchema={validationSchema}
                onSubmit={async values => {
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
                }}
            >
                {formik => (
                    <Form>
                        <Box style={formRootStyle}>{formikGenerator(fields, formik, APP_TEXT)}</Box>
                        <Box display="flex" alignItems="center">
                            <Box flex={1}>
                                {customerSubmitBtn ? (
                                    customerSubmitBtn(formik)
                                ) : (
                                    <StyledBtn
                                        variant="contained"
                                        type="submit"
                                        fullWidth
                                        style={{ marginTop: 16 }}
                                        disabled={formik.isSubmitting}
                                    >
                                        {formik.isSubmitting ? (
                                            <CircularProgress
                                                color="secondary"
                                                size={12}
                                                style={{ marginRight: 8 }}
                                            />
                                        ) : (
                                            <CheckCircle
                                                fill="white"
                                                height={18}
                                                height={18}
                                                style={{ marginRight: 8 }}
                                            />
                                        )}
                                        {APP_TEXT(formik.isSubmitting ?'processing':"submit")}
                                    </StyledBtn>
                                )}
                            </Box>
                            {onCancel && (
                                <Box flex={1} ml={2}>
                                    <StyledBtn
                                        variant="contained"
                                        fullWidth
                                        color="secondary"
                                        style={{ marginTop: 16 }}
                                        onClick={onCancel}
                                    >
                                        <React.Fragment>{APP_TEXT("cancel")}</React.Fragment>
                                    </StyledBtn>
                                </Box>
                            )}
                        </Box>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FormTempate;
