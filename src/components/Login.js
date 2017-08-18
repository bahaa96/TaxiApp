import React from "react"
import { connect } from "react-redux"
import {
    View,
    Text
} from "react-native"


class Login extends React.Component {
    constructor(props) {
        super(props)
    }
    render(){
        return (
            <View>
                <Text>Login</Text>
            </View>
        )
    }
}


export default Login