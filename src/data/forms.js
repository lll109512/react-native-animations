import * as yup from "yup";
// import startsWith from "lodash/startsWith";
// import find from "lodash/find";
// import { isMobilePhone } from "validator";
// import { titles } from "variables/titles";
// import isChinese from "is-chinese";

// const vaildPhoneNumber = value => value && isMobilePhone(value);
// const swiftRegex = /^([A-Z]{6}[A-Z2-9][A-NP-Z1-9])(X{3}|[A-WY-Z0-9][A-Z0-9]{2})?$/;
// const bsbRegex = /\d{3}-?\d{3}/;
// const ibanRegex =
//     /^AL\d{10}[0-9A-Z]{16}$|^AD\d{10}[0-9A-Z]{12}$|^AT\d{18}$|^BH\d{2}[A-Z]{4}[0-9A-Z]{14}$|^BE\d{14}$|^BA\d{18}$|^BG\d{2}[A-Z]{4}\d{6}[0-9A-Z]{8}$|^HR\d{19}$|^CY\d{10}[0-9A-Z]{16}$|^CZ\d{22}$|^DK\d{16}$|^FO\d{16}$|^GL\d{16}$|^DO\d{2}[0-9A-Z]{4}\d{20}$|^EE\d{18}$|^FI\d{16}$|^FR\d{12}[0-9A-Z]{11}\d{2}$|^GE\d{2}[A-Z]{2}\d{16}$|^DE\d{20}$|^GI\d{2}[A-Z]{4}[0-9A-Z]{15}$|^GR\d{9}[0-9A-Z]{16}$|^HU\d{26}$|^IS\d{24}$|^IE\d{2}[A-Z]{4}\d{14}$|^IL\d{21}$|^IT\d{2}[A-Z]\d{10}[0-9A-Z]{12}$|^[A-Z]{2}\d{5}[0-9A-Z]{13}$|^KW\d{2}[A-Z]{4}22!$|^LV\d{2}[A-Z]{4}[0-9A-Z]{13}$|^LB\d{6}[0-9A-Z]{20}$|^LI\d{7}[0-9A-Z]{12}$|^LT\d{18}$|^LU\d{5}[0-9A-Z]{13}$|^MK\d{5}[0-9A-Z]{10}\d{2}$|^MT\d{2}[A-Z]{4}\d{5}[0-9A-Z]{18}$|^MR13\d{23}$|^MU\d{2}[A-Z]{4}\d{19}[A-Z]{3}$|^MC\d{12}[0-9A-Z]{11}\d{2}$|^ME\d{20}$|^NL\d{2}[A-Z]{4}\d{10}$|^NO\d{13}$|^PL\d{10}[0-9A-Z]{,16}n$|^PT\d{23}$|^RO\d{2}[A-Z]{4}[0-9A-Z]{16}$|^SM\d{2}[A-Z]\d{10}[0-9A-Z]{12}$|^SA\d{4}[0-9A-Z]{18}$|^RS\d{20}$|^SK\d{22}$|^SI\d{17}$|^ES\d{22}$|^SE\d{22}$|^CH\d{7}[0-9A-Z]{12}$|^TN59\d{20}$|^TR\d{7}[0-9A-Z]{17}$|^AE\d{21}$|^GB\d{2}[A-Z]{4}\d{14}$/;

export const otherIndividualForm = i18n => {
    return [
        {
            type: "textInput",
            name: "name*",
            yup: yup
                .string(i18n("Enter name"))
                .max(128, i18n("Name should be of maximum 128 characters length"))
                .required(i18n("Name is required")),
        },
        {
            type: "textInput",
            name: "enName*",
            yup: yup
                .string(i18n("Enter english name"))
                .max(128, i18n("English name should be of maximum 128 characters length"))
                // .test('serverSideTest','UserExisted',async (value)=>{
                //     await new Promise((res, rej) => {
                //         setTimeout(() => {
                //             res();
                //         }, 1000);
                //     });
                //     return value==='123'?false:true
                // })
                .required(i18n("English name is required"))
        },
        // {
        //     type: "textInput",
        //     name: "idNo",
        //     yup: yup
        //         .string(i18n("Enter Id card number"))
        //         .length(18, i18n("Id card number must be 18 characters length"))
        //         .required(i18n("Id card number is required")),
        // },
        // {
        //     type: "date",
        //     name: "legalCertExpiryDate",
        //     yup: yup
        //         .date(i18n("Enter your Id card expire date"))
        //         .required(i18n("Id card exprie date is required")),
        // },
        // {
        //     type: "textInput",
        //     name: "postCode",
        //     yup: yup
        //         .string(i18n("Enter postcode"))
        //         .max(8, i18n("Postcode should be of maximum 8 characters length"))
        //         .required(i18n("Postcode is required")),
        // },
        // {
        //     type: "textInput",
        //     name: "address",
        //     yup: yup
        //         .string(i18n("Enter address"))
        //         .max(256, i18n("Address should be of maximum 256 characterslength"))
        //         .required(i18n("Address is required")),
        // },
    ];
};
