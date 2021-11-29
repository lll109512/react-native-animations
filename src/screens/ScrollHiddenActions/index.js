import React from 'react'
import faker from "faker";
import { BlurView } from "@react-native-community/blur";
import Animated from 'react-native-reanimated'
import { StyleSheet, Text, View,Dimensions } from 'react-native';
const screen = Dimensions.get('screen')
const BlurHeader = (props)=>{
    const {title} = props
    return (
        <View style={styles.header}>
            <BlurView blurType="xlight" blurAmount={10} reducedTransparencyFallbackColor="white">
                <Text style={styles.headerText}>{title}</Text>
            </BlurView>
        </View>
    );
}

const BlurActions = (props)=>{
    const {title} = props
    return (
        <View style={styles.actions}>
            <View style={styles.container}>
                <BlurView
                    blurType="xlight"
                    blurAmount={10}
                    reducedTransparencyFallbackColor="white"
                >
                    <View style={styles.actionsBar}>
                        <Text>Actions</Text>
                    </View>
                </BlurView>
            </View>
        </View>
    );
}
const index = (props) => {
    const data = Array(20).fill(0).map(_ => faker.lorem.paragraph());
    return <View style={styles.root}>
        <Animated.ScrollView style={{paddingTop:90}}>
            {data.map(item=>(<Text style={styles.paragraph}>{item}</Text>))}
        </Animated.ScrollView>
        <BlurHeader title='Article'/>
        <BlurActions/>
    </View>;
}

export default index

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "white" },
    paragraph: { paddingHorizontal: 12, paddingVertical: 12 },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
    },
    headerText: {
        textAlign: "center",
        marginTop: 50,
        marginBottom: 10,
        color: "black",
        fontSize: 20,
        fontWeight: "600",
    },
    actions: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        marginBottom: 0,
        flexDirection: "row",
    },
    actionsBar: {
        height: 100,
        width: screen.width,
        borderRadius: 10,
        // borderWidth: 0.2,
        borderColor: "rgba(0,0,0,0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
});
