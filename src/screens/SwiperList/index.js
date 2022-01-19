import React from 'react'
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { images } from 'src/data/data'

const screen = Dimensions.get('screen')

const TestList = (props)=>{
    const fakeListItems = [0,1,2,3,4,5,6,7]
    return (
        <View style={styles.container}>
            <FlatList
                data={fakeListItems}
                keyExtractor={(_,index)=>index.toString()}
                renderItem={({ item, index }) => (
                    <View style={{padding:8}}>
                        <Text>{item}</Text>
                    </View>
                )}
                refreshing={false}
                onRefresh={()=>{}}
            />
        </View>
    );
}
const TextCaoul = (props)=>{
    const imgs = images.map(item=>item.image)
    return (
        <View style={styles.container}>
            <View>
                <ScrollView
                    decelerationRate="fast"
                    bounces={false}
                    pagingEnabled
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    style={{ height: 200, backgroundColor: "red" }}
                >
                    {imgs.map((img, i) => (
                        <View key={i} style={[{ width: screen.width, height: 200 }]}>
                            <Image source={{ uri: img }} style={{ ...StyleSheet.absoluteFillObject }} />
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
const TextPlain = (props)=>{
    return (
        <View style={styles.container}>
            <Text>Plain</Text>
        </View>
    );
}

const SwiperList = (props)=>{
    const {views} = props
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled decelerationRate={'fast'}>
            {views.map(item=>item.component)}
        </ScrollView>
    );
}


const index = (props) => {
    const views = [
        {
            label:'Flat list',
            component:<TestList/>,
        },
        {
            label:'Causoule',
            component:<TextCaoul/>,
        },
        {
            label:'Plain text',
            component:<TextPlain/>,
        },
    ]
    return (
        <View style={styles.root}>
            <SwiperList views={views}/>
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    root:{
        flex:1,
        backgroundColor:"white"
    },
    container:{
        backgroundColor:'white',
        width:screen.width,
        // padding:12
    }
})
