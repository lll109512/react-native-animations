
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native'
import Routes from './routes'
import 'react-native-gesture-handler';
import { FormProvider } from 'src/components/FormGenerator/ContextProvider';
import {formComponents,viewComponents} from 'src/components/FormGenerator/FormGeno';


const index= () => {
    return (
        <FormProvider formComponents={formComponents} viewComponents={viewComponents}>
            <NavigationContainer>
                <Routes/>
            </NavigationContainer>
        </FormProvider>
    )
}

export default index

const styles = StyleSheet.create({})