import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import StockLineChip from './StockLineChip';
import data from './data.json'
import { random } from 'lodash';

const index = (props) => {
  const d = data.slice(0,40).map(d=>d.close)
  const d2 = data.slice(40,80).map(d=>d.close)
  const d3 = data.slice(80,120).map(d=>d.close)
  // const d4 = data.slice(120,160).map(d=>d.close)
  const [d4,setD4] = useState(data.slice(120,160).map(d=>d.close))
  useEffect(()=>{
    const timer = setInterval(() => {
      setD4(c=>{
        // console.log(c)
        c.shift()
        c.push(Math.random()*300+ data[0].close);
        // c.shift().push(Math.random()*100)
        return [...c];
      })
    }, 1000);
    return ()=>{
      clearInterval(timer);
    }
  },[])
  return (
      <View style={styles.root}>
          <View style={{ height: 60 }} />
          <StockLineChip datas={d} />
          <StockLineChip datas={d2} color="#E33F64" />
          <StockLineChip datas={d3} />
          <StockLineChip datas={d4} color="#E33F64" />
      </View>
  );
};

export default index;

const styles = StyleSheet.create({
    root:{
        backgroundColor:"black",
        flex:1,
        padding:24
    }
});
