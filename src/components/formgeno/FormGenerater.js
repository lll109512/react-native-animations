import React, { useState, useEffect } from "react";
import StyledBtn from "components/Common/StyledBtn";
import CheckCircle from "components/Icons/CheckCircle";
import FileUpload from "components/Common/FileUpload";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Divider from '@material-ui/core/Divider'
import Box from "@material-ui/core/Box";
import { hBox, vBox } from "utils/flex";
import RenderCountryItem from "components/Inputs/RenderCountryItem";
import RenderNormalItem from "components/Inputs/RenderNormalItem";
import RenderCurrencyItem from "components/Inputs/RenderCurrencyItem";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    TextField,
    CircularProgress,
    ButtonBase,
    IconButton,
    InputLabel,
    Typography,
    Checkbox,
} from "@material-ui/core";
import SelectInput from "components/Inputs/SelectInput";
import { ReactComponent as Trash } from "assets/icons/trash-can-outline.svg";
import { BlobServiceClient } from "@azure/storage-blob";

import { compose } from "recompose";
import { inject, observer } from "mobx-react";

import i18n from "gx-web-ui/i18n";

import { Formik, Field, Form, ErrorMessage, FieldArray, useFormik } from "formik";
import * as yup from "yup";
import isFunction from 'lodash/isFunction'

//pickers
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { localeMap } from "utils/date";


export const MikDropdown = ({formik, name, label, value, i18n, placeholder,options, title, dataType="normal",disabled, ...other })=>{
    const styles = useStyles();
    const renderLabel = isFunction(label) ? label(formik.values) : label;
    const addedOptions = [
        {
            label: renderLabel || i18n(name),
            value: "",
        },
        ...options,
    ];
    const renderValueMapper = {
        normal: RenderNormalItem,
        country: RenderCountryItem,
        currency: RenderCurrencyItem,
    };
    return (
        <Box style={{ marginTop: 12 }}>
            {title && (
                <Typography variant="body1" style={{ color: "#44546AB3", fontSize: 14 }}>
                    {title}
                </Typography>
            )}
            <SelectInput
                fullWidth
                key={name}
                size="small"
                id={name}
                name={name}
                value={value || formik.values[name]}
                onChange={value => formik.setFieldValue(name, value)}
                //label={label || i18n(name)}
                style={{ height: 40 }}
                options={addedOptions}
                error={formik.touched[name] && Boolean(formik.errors[name])}
                helperText={formik.touched[name] && formik.errors[name]}
                disabled={disabled}
                renderValue={value => {
                    const Render = renderValueMapper[dataType];
                    if (Render) {
                        return (
                            <Render
                                value={value}
                                options={options}
                                placeholder={label || i18n(name)}
                            />
                        );
                    } else {
                        return null;
                    }
                }}
            />
            <ErrorMessage name={name}>
                {error => (
                    <Typography variant="caption" className={styles.errorText}>
                        {error}
                    </Typography>
                )}
            </ErrorMessage>
        </Box>
    );
}

export const MikCountryDropdown = (props)=>{
    return <MikDropdown dataType='country' {...props}/>
}
export const MikCurrencyDropdown = props => {
    return <MikDropdown dataType="currency" {...props} />;
};


export const MikDateField = compose(inject('appStore'),observer)(({ formik, name, label, value, i18n,appStore, ...other }) => {
        const renderLabel = isFunction(label) ? label(formik.values) : label;
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils} key={name} locale={localeMap[appStore.locale]}>
                <KeyboardDatePicker
                    autoOk
                    key={name}
                    size="small"
                    fullWidth
                    id={name}
                    name={name}
                    label={renderLabel || i18n(name)}
                    value={value||formik.values[name]}
                    error={formik.touched[name] && Boolean(formik.errors[name])}
                    helperText={formik.touched[name] && formik.errors[name]}
                    variant="inline"
                    format="yyyy-MM-dd"
                    inputVariant="outlined"
                    onChange={value => formik.setFieldValue(name, value)}
                    style={{ marginTop: 12 }}
                    {...other}
                />
            </MuiPickersUtilsProvider>
        );
    })

export const MikTextField = ({
           formik,
           name,
           label,
           value,
           i18n,
           title,
           serverValidator,
           ...other
       }) => {
           const [serverError, setServerError] = useState(null);
           const renderLabel = isFunction(label) ? label(formik.values) : label;
           return (
               <div key={name} style={{ marginTop: 12 }}>
                   {title && (
                       <Typography variant="body1" style={{ color: "#44546AB3", fontSize: 14 }}>
                           {title}
                       </Typography>
                   )}
                   <TextField
                       key={name}
                       size="small"
                       variant="outlined"
                       fullWidth
                       id={name}
                       name={name}
                       label={title ? null : renderLabel || i18n(name)}
                       value={value || formik.values[name]}
                       onChange={formik.handleChange}
                       error={formik.touched[name] && Boolean(formik.errors[name])}
                       helperText={formik.touched[name] && formik.errors[name]}
                       onBlur={async () => {
                           if (serverValidator) {
                               const { valid, message } = await serverValidator(
                                   formik.values[name]
                               );
                               if (!valid) {
                                   setServerError(message);
                                   formik.errors[name] = i18n(message); //?
                               } else {
                                   setServerError(null);
                                   formik.errors[name] = null;
                               }
                           }
                       }}
                       //style={{ marginTop: 4 }}
                       {...other}
                   />
               </div>
           );
       };

export const MikRadioGroup = ({ formik, name, options, label, value, i18n, style, ...other }) => {
    const styles = useStyles();
    const { disabled,direction="row" } = other;
    const renderLabel = isFunction(label) ? label(formik.values) : label;
    return (
        <FormControl
            key={name}
            component="fieldset"
            style={{ width: "100%", marginTop: 12, ...style }}
            error={formik.touched[name] && Boolean(formik.errors[name])}
            disabled={disabled}
        >
            <FormLabel
                component="legend"
                style={{ marginBottom: 12, color: "#44546AB3", fontSize: 14 }}
            >
                {renderLabel || i18n(name)}
            </FormLabel>
            <RadioGroup
                name={name}
                value={formik.values[name] || value || ""}
                onChange={formik.handleChange}
                row={direction === "row"}
            >
                {options.map((option, index) => (
                    <FormControlLabel
                        control={<Radio />}
                        label={option.label}
                        key={option.value}
                        value={option.value}
                    />
                ))}
            </RadioGroup>
            <ErrorMessage name={name}>
                {error => (
                    <Typography variant="caption" className={styles.errorText}>
                        {error}
                    </Typography>
                )}
            </ErrorMessage>
        </FormControl>
    );
};

export const MikCheckBox = ({ formik, name, options, label, value, i18n, style, ...other }) => {
    const { disabled, helperText } = other;
    const styles = useStyles();
    const theme = useTheme()
    const parsedText = isFunction(helperText)?helperText(formik):helperText
    const renderLabel = isFunction(label) ? label(formik.values) : label;
    return (
        <div key={name}>
            <FormControlLabel
                key={name}
                control={
                    <Checkbox
                        // color="primary"
                        style={{
                            color: (formik.values[name] || value) && theme.palette.secondary.main,
                        }}
                        name={name}
                        checked={formik.values[name] || value}
                        onChange={e => formik.setFieldValue(name, e.target.checked)}
                        disabled={disabled}
                    />
                }
                label={`${renderLabel || i18n(name)} ${parsedText ? `(${parsedText})` : ""}`}
            />
            <ErrorMessage name={name}>
                {error => (
                    <Typography variant="caption" className={styles.errorText}>
                        {error}
                    </Typography>
                )}
            </ErrorMessage>
        </div>
    );
};

export const MikNumber = (props) => {
    return <MikTextField {...props} type='number'/>;
};

export const MikFileUpload = compose(inject('appStore'))(({appStore ,formik, name, label, value, i18n, style, ...other})=>{
    const uploadedFile = formik.values[name]
    const styles = useStyles()
    const renderLabel = isFunction(label) ? label(formik.values) : label;
    
    const uploadFile_ = async file => {
        // return "http://img-arch.pconline.com.cn/images/upload/upc/tx/photoblog/1210/26/c2/14676275_14676275_1351218242935_mthumb.jpg";

        const suffix = file.name.slice(file.name.lastIndexOf("."));
        const filename = new Date().getTime() + suffix;

        const customerId = appStore?.loggedInUser.cid || "temp";
        const { url } = await appStore.userApi.getBlobSasUrl_();
        const blobServiceClient = new BlobServiceClient(url);
        const containerClient = blobServiceClient.getContainerClient("kfstore");
        const blockBlobClient = containerClient.getBlockBlobClient(
            `customer/${customerId}/voi/${filename}`
        );
        const res = await blockBlobClient.uploadData(file);
        const returnUrl = `https://kfstore.blob.core.windows.net/kfstore/customer/${customerId}/voi/${filename}`;
        return returnUrl;
    };

    return (
        <div style={{ marginTop: 12, marginBottom: 12 }}>
            <Typography variant="h2" className={styles.uploadHeader}>
                {renderLabel||i18n(name)}
            </Typography>
            {uploadedFile ? (
                <div className={styles.fileContainer}>
                    <ButtonBase
                        className={styles.recordBtn}
                        disableRipple
                        onClick={() => window.open(uploadedFile, "_blank")}
                    >
                        {i18n(name)}
                    </ButtonBase>
                    <IconButton onClick={() => formik.setFieldValue(name, "")}>
                        <Trash fill={"red"} height={20} width={20} />
                    </IconButton>
                </div>
            ) : (
                <FileUpload
                    hint={i18n("uploadHint")}
                    uploadFunc={uploadFile_}
                    accpet=".png,.jpg"
                    onUploadFinished={url => formik.setFieldValue(name, url)}
                />
            )}
            <ErrorMessage name={name}>
                {error => (
                    <Typography variant="caption" className={styles.errorText}>
                        {error}
                    </Typography>
                )}
            </ErrorMessage>
        </div>
    );
})

const oneLine = (components, formik, i18n) => {
    return (
        <Box alignItems="center" display="flex">
            {components.map((item, index) => (
                <Box key={index} flex={1} ml={index !== 0 ? 1 : 0}>
                    {formikMapper(item, formik, i18n)}
                </Box>
            ))}
        </Box>
    );
};

export const formikMapper = (field, formik, i18n) => {
    if(Array.isArray(field)){
        return oneLine(field, formik, i18n);
    }else{
        const { type, name, options, props, label, title, hide, disabled,...other } = field;
        if (hide && hide(formik)){
            return null
        }
        return type === "text" ? (
            <MikTextField
                name={name}
                formik={formik}
                label={label}
                i18n={i18n}
                disabled={disabled}
                title={title}
                {...props}
                {...other}
            />
        ) : type === "radio" ? (
            <MikRadioGroup
                name={name}
                formik={formik}
                label={label}
                options={options}
                i18n={i18n}
                title={title}
                disabled={disabled}
                {...props}
                {...other}
            />
        ) : type === "file" ? (
            <MikFileUpload
                name={name}
                formik={formik}
                label={label}
                i18n={i18n}
                title={title}
                {...props}
                {...other}
            />
        ) : type === "date" ? (
            <MikDateField
                name={name}
                formik={formik}
                label={label}
                i18n={i18n}
                title={title}
                {...props}
                {...other}
            />
        ) : type === "number" ? (
            <MikNumber
                name={name}
                formik={formik}
                label={label}
                i18n={i18n}
                title={title}
                {...props}
                {...other}
            />
        ) : type === "dropDown" ? (
            <MikDropdown
                name={name}
                formik={formik}
                label={label}
                i18n={i18n}
                title={title}
                options={options}
                disabled={disabled}
                {...props}
                {...other}
            />
        ) : type === "countryDropDown" ? (
            <MikCountryDropdown
                name={name}
                formik={formik}
                label={label}
                i18n={i18n}
                title={title}
                options={options}
                disabled={disabled}
                {...props}
                {...other}
            />
        ) : type === "currencyDropDown" ? (
            <MikCurrencyDropdown
                name={name}
                formik={formik}
                label={label}
                i18n={i18n}
                title={title}
                options={options}
                disabled={disabled}
                {...props}
                {...other}
            />
        ) : type === "divider" ? (
            <Divider style={{ marginTop: 8, marginBottom: 8 }} />
        ) : type === "title" ? (
            <Typography
                variant="subtitle1"
                style={{
                    marginTop: 16,
                    marginBottom: 10,
                    textTransform: "none",
                }}
            >
                {title}
            </Typography>
        ) : type === "checkBox" ? (
            <MikCheckBox
                name={name}
                formik={formik}
                label={label}
                options={options}
                i18n={i18n}
                title={title}
                disabled={disabled}
                {...props}
                {...other}
            />
        ) : null;
    }
    
};

export const formikGenerator = (fields, formik, i18n) => {
    return fields.map((field, index) => formikMapper(field,formik,i18n));
};

const useStyles = makeStyles(theme => ({
    fileContainer: {
        padding: "8px 24px",
        backgroundColor: "#F0F2F5",
        borderRadius: 5,
        borderStyle: "dashed",
        borderWidth: 1,
        borderColor: theme.palette.primary.main,
        ...hBox("center", "space-between"),
    },
    recordBtn: {
        textDecoration: "underline",
    },
    uploadField: {
        marginTop: 16,
    },
    spaceBetween: {
        ...hBox("center", "space-between"),
    },
    strongTitle: {
        fontWeight: 600,
        fontSize: 16,
        fontColor: theme.palette.primary.color,
    },
    btn: {
        fontSize: 14,
        fontColor: theme.palette.primary.color,
    },
    errorText: {
        color: theme.palette.error.main,
        marginTop: 8,
        marginLeft: 14,
        fontSize: "0.75rem",
    },
    uploadHeader: {
        marginBottom: 12,
        fontSize: "1rem",
        color: `rgba(0, 0, 0, 0.54)`,
    },
}));