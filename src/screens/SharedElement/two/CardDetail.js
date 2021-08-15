import React, { useRef } from "react";
import { StyleSheet, Text, View,Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import faker from 'faker'
import { Image } from "react-native-animatable";
import { StatusBar } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign'
import { SharedElement } from "react-navigation-shared-element";
import * as Animatable from 'react-native-animatable'
const screen = Dimensions.get("screen");

const avartNumber = 6

const Height = ()=>{
    return <View>
        <Text style={styles.heading}>Height</Text>
        <View style={{flexDirection:'row', alignItems:'flex-end'}}>
            <Text style={styles.number}>
                {Math.floor(Math.random()*2200)+1000}
            </Text>   
            <Text style={styles.numberType}>m</Text>         
        </View>
    </View>
}

const Distance = ()=>{
    return <View>
        <Text style={styles.heading}>Distance</Text>
        <View style={{flexDirection:'row', alignItems:'flex-end'}}>
            <Text style={styles.number}>
                {Math.floor(Math.random()*40)+10}
            </Text>   
            <Text style={styles.numberType}>km</Text>         
        </View>
    </View>
}

const Avatars = ()=>{
    return (
        <View>
            <Text style={styles.heading}>Your team</Text>
            <View style={{ flexDirection: "row" }}>{[...Array(avartNumber).keys()].map((_,index)=>{
                const uri = faker.internet.avatar()
                return <Image 
                            key={index}
                            source={{uri}}
                            style={[styles.avatar,{zIndex:-index,marginLeft:index===0?0:-20}]}
                        />

            })}</View>
        </View>
    );
}

const CardDetail = ({ navigation, route }) => {
    const { item } = route.params;

    const bottomRef = useRef(null);
    const iconRef = useRef(null);
    return (
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}>
            <StatusBar hidden />
            <SharedElement id={`item.${item.key}.photo`} style={styles.image}>
                <Image source={{ uri: item.image }} style={styles.image} />
            </SharedElement>
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,0.3)" }]}>
                <Animatable.View
                    ref={iconRef}
                    style={[StyleSheet.absoluteFillObject, { zIndex: 2 }]}
                    animation="fadeIn"
                    duration={800}
                    delay={700}
                >
                    <AntDesign
                        name="arrowleft"
                        size={24}
                        color={"#fff"}
                        style={{
                            paddingHorizontal: 12,
                            position: "absolute",
                            top: 40,
                            left: 20,
                            zIndex: 2,
                        }}
                        onPress={() => {
                            Promise.all([
                                bottomRef.current.fadeOut(500),
                                iconRef.current.fadeOut(500),
                            ]).then(() => {
                                navigation.goBack();
                            });
                        }}
                    />
                    <View style={styles.shadow} />
                </Animatable.View>
                <View
                    style={{
                        flex: 1,
                        position: "absolute",
                        bottom: 70,
                        justifyContent: "flex-end",
                    }}
                >
                    <View style={{paddingHorizontal:20,alignItems:'flex-start'}}>
                        <SharedElement id={`item.${item.key}.name`}>
                            <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit={true}>
                                {item.name}
                            </Text>
                        </SharedElement>
                    </View>
                    <Animatable.View
                        animation="fadeInUp"
                        duration={800}
                        delay={700}
                        ref={bottomRef}
                        style={{
                            width: screen.width,
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            marginTop:20
                        }}
                    >
                        <Avatars />
                        <Distance />
                        <Height />
                    </Animatable.View>
                </View>
            </View>
        </View>
    );
};

export default CardDetail;

const styles = StyleSheet.create({
    heading: {
        color: "white",
        marginBottom: 8,
        fontSize: 13,
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderWidth: 2,
    },
    number: {
        fontSize: 30,
        color: "white",
        fontWeight: "700",
    },
    numberType: {
        fontSize: 17,
        color: "white",
        marginLeft: 4,
    },
    image: {
        resizeMode: "cover",
        height: screen.height,
        width: screen.width,
        position: "absolute",
    },
    shadow: {
        backgroundColor: "rgba(0,0,0,0.2)",
        position: "absolute",
        height: screen.height,
        width: screen.width,
    },
    name: {
        textTransform: "uppercase",
        color: "white",
        fontWeight: "900",
        fontSize: 40,
    },
    nameElement: {
        position: "absolute",
        bottom: 120,
        left: 12,
    },
});
