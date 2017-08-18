import React from "react"
import { ListItem, Left } from "native-base"
import { StyleSheet, View, Text } from "react-native"
import EvilIcons from "react-native-vector-icons/dist/EvilIcons"


export default (props) => {
    const { item, onItemClicked} = props
    return (
        <ListItem style={ styles.placesListItem }
                key={ item.placeID }
                onPress={ () => { onItemClicked(item.placeID) } } >
            <Left>
                <EvilIcons name="location" style={{ fontSize: 30, color: "crimson"}}/>
                <Text>{ item.fullText }</Text>
            </Left>
        </ListItem>
    )
}


const styles = StyleSheet.create({
    placesListItem: {
        marginBottom: 5,
        backgroundColor: "#fff",
        borderRadius: 5,
        marginLeft: 0,
        paddingLeft: 10,
        paddingRight: 35,
    }
})