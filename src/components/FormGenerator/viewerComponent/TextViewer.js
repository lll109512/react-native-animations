import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const TextViewer = (props) => {
    const { data, i18n, index, formatedTitle, title, label,name } = props;
    return (
        <View>
            {formatedTitle && (
                <Text numberOfLines={1} adjustsFontSizeToFit style={{ marginBottom: 4,fontSize:14 }}>
                    {formatedTitle}
                </Text>
            )}
            <Text style={{fontSize:18}}>{data[name]}</Text>
        </View>
    );
}


export default TextViewer

const styles = StyleSheet.create({})
