import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Dimensions, StatusBar, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import Config from "react-native-config";
import { SPACING } from "src/screens/SharedElement/one/constants";

const {height,width} = Dimensions.get('screen')
const TINY_SIZE = 60

const API_URL = "https://api.pexels.com/v1/search?query=nature&orientation=portrait&size=small&per_page=20"

const fetchImage = async ()=>{
    const result = await fetch(API_URL, {
        headers: {
            Authorization: Config.PEXELS_KEY,
        },
    });
    const data = await result.json();
    return data.photos;
}

const index = props => {
    const [data, setData] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(0)
    React.useEffect(async () => {
        setData(await fetchImage())
    }, [])

    const topListRef = useRef(null)
    const bottomListRef = useRef(null)
    
    useEffect(() => {
        // much more easy than tutroial XD
        bottomListRef.current?.scrollToIndex({ index: selectedIndex, animated: true, viewOffset:width/2-TINY_SIZE+SPACING*2});
    }, [selectedIndex])

    if (!data){
        return <View><Text>Data loading...</Text></View>
    }
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar hidden />
            <FlatList
                ref={topListRef}
                data={data}
                horizontal
                pagingEnabled
                bounces={false}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={e => {
                    setSelectedIndex(Math.floor(e.nativeEvent.contentOffset.x / width));
                }}
                renderItem={({ item }) => {
                    return (
                        <View style={[{ height, width }]}>
                            <FastImage
                                key={item.id}
                                source={{ uri: item.src.portrait }}
                                resizeMode="cover"
                                style={[StyleSheet.absoluteFillObject]}
                            />
                        </View>
                    );
                }}
            />
            <FlatList
                ref={bottomListRef}
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: SPACING,
                }}
                style={{
                    position: "absolute",
                    bottom: TINY_SIZE,
                }}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity onPress={()=>{
                            setSelectedIndex(index);
                            topListRef.current.scrollToIndex({ index, animated:true});
                        }}>
                            <FastImage
                                key={item.id}
                                source={{ uri: item.src.tiny }}
                                resizeMode="cover"
                                style={{
                                    height: TINY_SIZE,
                                    width: TINY_SIZE,
                                    marginHorizontal: SPACING / 2,
                                    borderRadius: SPACING,
                                    borderColor: "white",
                                    borderWidth: selectedIndex === index ? 2 : 0,
                                }}
                            />
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
});

export default index;
