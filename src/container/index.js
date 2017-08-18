import React from "react"
import { Router, Scene } from "react-native-router-flux"
import { Provider } from "react-redux"
import SplashScreen from 'react-native-splash-screen'

import createStore from ".././store/createStore"
import Home from ".././components/Home"
import Login from ".././components/Login"

export default class Container extends React.Component {
    constructor(props){
        super(props)
    }
    componentDidMount() {
        // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        SplashScreen.hide();
    }
    render() {
        let store = createStore({
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
        })
        return (
            <Provider store={store} >
                 <Router>  
                    <Scene key="root" hideNavBar> 
                         <Scene key="home" component={ Home } title="Home"/>                         
                         <Scene key="login" component={ Login } title="Login"/>  
                    </Scene> 
                </Router>    
             </Provider> 
        )
    }
}