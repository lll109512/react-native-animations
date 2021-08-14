import React from 'react'
import { StyleSheet, Text, View, Image} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Animated from 'react-native-reanimated';
import {SPACING, spec,} from './constants.js'
import { SharedElement } from 'react-navigation-shared-element';
const {ITEM_HEIGHT,ITEM_WIDTH,FULL_SIZE,RADIUS} = spec

type StackParamList = {
  Detail: {
        item:{
            key: number,
            location: string,
            numberOfDays: number,
            image:string,
            color: string,
        }
    }
};

type Props = StackScreenProps<StackParamList,'Detail'>

const TravelDetail = (props: Props) => {
    const {navigation,route:{params:{item}}} = props
    return (
        <SafeAreaView style={{flex:1}}>
            <AntDesign
                name='arrowleft'
                size={24}
                color={'#333'}
                style={{
                    paddingHorizontal:SPACING,
                    position:'absolute',
                    top:50,
                    left:10,
                    zIndex:1
                }}
                onPress={()=>navigation.goBack()}
            />
            <View style={[StyleSheet.absoluteFillObject]}>
                <SharedElement id={`item.${item.key}.photo`} style={[StyleSheet.absoluteFillObject]}>
                    <Image
                        source={{uri: item.image}}
                        style={[StyleSheet.absoluteFillObject, {resizeMode: 'cover'}]}
                    />
                </SharedElement>
            </View>
            <SharedElement id={`item.${item.key}.location`}>
                <Text style={[styles.location]}>
                    {item.location}
                </Text>
            </SharedElement>
        </SafeAreaView>
    )
}


export default TravelDetail

const styles = StyleSheet.create({
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    margin: SPACING,
  },
  location: {
    fontSize: 30,
    color: 'white',
    fontWeight: '800',
    width: ITEM_WIDTH * 0.8,
    textTransform: 'uppercase',
    position: 'absolute',
    top: 100,
    left: SPACING * 2,
  },
  days: {
    position: 'absolute',
    bottom: SPACING,
    left: SPACING,
    width: 52,
    height: 52,
    borderRadius: 26,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'tomato',
  },
  daysValue: {
    fontWeight: '800',
    color: 'white',
    fontSize: 16,
  },
  daysLable: {
    color: 'white',
    fontSize: 16,
  },
  card: {
    borderRadius: RADIUS,
    overflow:"hidden"
  },
});
