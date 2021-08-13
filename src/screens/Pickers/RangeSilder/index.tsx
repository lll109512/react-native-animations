import { random } from 'lodash'
import React,{useState} from 'react'
import { Button } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import RangeSilder from 'src/components/RangeSlider'

const mockData = [
    {
        label:'0',
        value:0
    },
    {
        label:'1',
        value:1
    },
    {
        label:'2',
        value:2
    },
    {
        label:'3',
        value:3
    },
    {
        label:'4',
        value:4
    },
    {
        label:'5',
        value:5
    }
]

interface Props {
    
}


const index = (props: Props) => {
    const [values, setValues] = useState<{min: number, max: number}>({min:0,max:5})
    const onChange = (values:any)=>{
        setValues(values)
    }
    return (
        <View style={styles.root}>
            <RangeSilder options={mockData} initValues={values} onChange={onChange}/>
            <View style={{marginTop:16,justifyContent:"center",alignItems:'center'}}>
                <Text>Values: min:{values.min} max:{values.max}</Text>
                <Button title='Random' onPress={()=>{
                    const rand1 = random(0,5)
                    const rand2 = random(0,5)
                    setValues({
                        min:Math.min(rand1,rand2),
                        max:Math.max(rand1,rand2)
                    })
                }}>
                </Button>
            </View>
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    root:{
        flex:1,
        backgroundColor:'white',
        justifyContent:"center",
        padding:8
    }
})
