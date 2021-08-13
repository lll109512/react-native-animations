
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native'
import Routes from './routes'
import 'react-native-gesture-handler';


const index= () => {
    return (
        <NavigationContainer>
            <Routes/>
        </NavigationContainer>
    )
}

export default index

const styles = StyleSheet.create({})