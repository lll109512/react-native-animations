import { random } from "lodash";
import React, { useState } from "react";
import { Button } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import LongPressUnlockSlider from "src/components/LongPressUnlockSlider";

interface Props {}

const index = (props: Props) => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <View style={styles.root} >
            <LongPressUnlockSlider open={open} setOpen={setOpen}/>
        </View>
    );
};

export default index;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        padding: 8,
    },
});
