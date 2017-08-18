import { connect } from "react-redux"
import React from "react"
import { Image, View, StyleSheet, FlatList, StatusBar } from 'react-native';
import { 
    Container, Header, Title, Content, Footer, FooterTab, Button,
    Left, Right, Body, Icon, Text, Item, Input, List, ListItem
} from "native-base"
import { Actions } from "react-native-router-flux"
import FontAwesome from "react-native-vector-icons/dist/FontAwesome"
import MaterialCommunityIcons from "react-native-vector-icons/dist/MaterialCommunityIcons"
import RNGooglePlaces from 'react-native-google-places';
import MapView from 'react-native-maps';


import { setRegion } from "../actions/index"
import PlacesListItem from "./PlacesListItem"
import calculateFare from "../utils/fareCalculation"
import Login from "./Login";

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pickUpLocation: {},
            dropOffLocation: {},
            pickUpText: "",
            dropOffText: "",
            pickUpPredictions: [],
            dropOffPredictions: []
        }
        this.dummyNumbers = {
            baseFare: 0.4,
            timeRate: 0.14,
            distanceRate: 0.97,
            surge: 1
        }
        this.onRegionChange = this.onRegionChange.bind(this)
        this.pickUpChosen = this.pickUpChosen.bind(this)
        this.dropOffChosen = this.dropOffChosen.bind(this)
        this.startBooking = this.startBooking.bind(this)
    }
    onRegionChange(region) {
      this.props.dispatch(setRegion(region))
    }
    pickUpChosen(placeID) {
        RNGooglePlaces.lookUpPlaceByID(placeID)
            .then((results) => {
                this.setState({ pickUpLocation: {
                    address: results.address,
                    latitude: results.latitude,
                    longitude: results.longitude
                }, pickUpText: "" })
                this._pickUpInput.setNativeProps({ text: results.address})
            })
            .catch((error) => console.log(error.message));

    }
    dropOffChosen(placeID) {
        RNGooglePlaces.lookUpPlaceByID(placeID)
            .then((results) => {
                this.setState({ dropOffLocation: {
                    address: results.address,
                    latitude: results.latitude,
                    longitude: results.longitude
                }, dropOffText: "" })
                this._dropOffInput.setNativeProps({ text: results.address})

            })
            .catch((error) => console.log(error.message));
    }
    startBooking() {
        const { pickUpLocation, dropOffLocation } = this.state
        if( Object.keys(pickUpLocation).length && Object.keys(dropOffLocation).length ) {
            const params = {
                units: "metric",
                origins: pickUpLocation.latitude + "," + pickUpLocation.longitude,
                destinations: dropOffLocation.latitude + "," + dropOffLocation.longitude,
                key: "AIzaSyBgkWJO17isxhNBmet050vv8rGxgGPCxfw"
            }
            const that = this

            fetch(`http://10.0.2.2:3000/bookings`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: "geekbahaa",
                    pickUpLocation,
                    dropOffLocation
                })
            })
                .then(() => {
                    fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=${ params.units }
                    &origins=${ params.origins }&destinations=${ params.destinations }&key=${ params.key }`)
                        .then(function (response) {
                            return response.json()
                        }).then( json => {
                            const {baseFare, timeRate, distanceRate, surge} = that.dummyNumbers
                            if (json.rows[0].elements[0].status === "ZERO_RESULTS"){
                                alert("Sorry, This destination is so far to reach it with Taxi.")
                                return 1
                            }
                            alert(calculateFare(baseFare, timeRate, json.rows[0].elements[0].duration.value, distanceRate, json.rows[0].elements[0].distance.value, surge))
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
            }).catch((err) => console.log(err))
        }
    }
    componentDidUpdate(prevProps, prevState) {
        const state = this.state

        if ( prevState.pickUpText !== state.pickUpText ) {
            RNGooglePlaces.getAutocompletePredictions(state.pickUpText)
            .then((results) => {
                this.setState({pickUpPredictions: results})                           

            })
            .catch((error) => console.log(error.message));
        }

        if ( prevState.dropOffText !== state.dropOffText ) {
            RNGooglePlaces.getAutocompletePredictions(state.dropOffText)
            .then((results) => {
                this.setState({dropOffPredictions: results})                                       
            })
            .catch((error) => console.log(error.message));
        }
        
    }
    render(){
        return (
            <View style={{ flex: 1}}>
                <StatusBar
                  backgroundColor="#3F51B5"
                  barStyle="light-content" 
                />
                <View style={ styles.fabContainer }>
                    <Button rounded style={ styles.fab } onPress = { this.startBooking }><Text> &nbsp;Book</Text></Button>
                </View>
                <Container style={ styles.mainContainer }>
                    <Header>
                        <Left style={{ flex: 1 }}>
                            <Button transparent>
                            <Icon name='menu' />
                            </Button>
                        </Left>
                        <Body style={{ flex: 1, marginLeft: 30 }}>
                            <Image source={{uri: 'http://10.0.2.2:3000/assets/taxi_logo_white.png'}} style={{resizeMode: "contain", height: 75, width: 75, margin: "auto"}} />
                        </Body>
                        <Right style={{ flex: 1 }}>
                            <Button transparent>
                                <FontAwesome name="gift"  style={{ fontSize: 30, color: "#fff"}}/>
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        <Container>
                            <View style={ styles.mapContainer }>
                                <MapView 
                                    style={ styles.map }
                                    region={ this.props.region }
                                    onRegionChange={ this.onRegionChange }
                                >
                                    <MapView.Marker
                                        coordinate={this.props.region}
                                        pinColor="crimson"
                                    />
                                    <MapView.Marker
                                        coordinate={{
                                            latitude: 37.7929,
                                            longitude: -122.4464,
                                        }}
                                        pinColor="purple"
                                    />
                                    <MapView.Marker
                                        coordinate={{
                                            latitude: 37.7884,
                                            longitude: -122.4076,
                                        }}
                                        image={require("../.././server/assets/carMarker2.png")}
                                    />
                                    <MapView.Marker
                                        coordinate={{
                                            latitude: 37.770015,
                                            longitude: -122.446937,
                                        }}
                                        image={require("../.././server/assets/carMarker2.png")}
                                    />

                                </MapView>


                            </View>
                            <View style={ styles.formContainer }>
                                <View style={ styles.inputHolder }> 
                                    <Text>PICK-UP</Text>
                                    <Item>
                                        <Icon active name='search' style={{ color: "crimson"}}/>
                                        <Input placeholder='Choose pick-up location' ref={component => this._pickUpInput = component} onChangeText={ text => { this.setState({ pickUpText: text }) } } />
                                    </Item>
                                </View> 
                                <FlatList
                                    data={ this.state.pickUpPredictions }
                                    renderItem={({item}) => <PlacesListItem item={ item } onItemClicked={ this.pickUpChosen } /> }
                                />
                                
                                <View style={styles.inputHolder}> 
                                    <Text>DROP-OFF</Text>
                                    <Item>
                                        <Icon active name='search' style={{ color: "crimson"}}/>
                                        <Input placeholder='Choose drop-off location' ref={component => this._dropOffInput = component} onChangeText={ text => { this.setState({ dropOffText: text }) } }/>
                                    </Item>
                                </View>
                                <FlatList
                                data={ this.state.dropOffPredictions }
                                renderItem={({item}) => <PlacesListItem item={ item } onItemClicked={ this.dropOffChosen }/>}
                                />
                            </View>
                        </Container>
                    </Content>
                    <Footer >
                        <FooterTab >
                            <Button vertical>
                                <MaterialCommunityIcons name="car" style={{ fontSize: 30, color: "white"}}/>
                                <Text>TaxiCar</Text>
                            </Button>
                            <Button vertical>
                                <MaterialCommunityIcons name="car-connected" style={{ fontSize: 30, color: "white"}}/>
                                <Text>TaxiPoll</Text>
                            </Button>
                            <Button vertical active>
                                <MaterialCommunityIcons name="credit-card-plus" style={{ fontSize: 30, color: "white"}}/>
                                <Text>Premium</Text>
                            </Button>
                            <Button vertical>
                                <MaterialCommunityIcons name="car-sports" style={{ fontSize: 30, color: "white"}}/>
                                <Text>TaxiBike</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "#ccc",
    },
    inputHolder: {
        padding: 10,
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 5,
        elevation: 5
    },
    pickUpList: {
        opacity: 0.95,
    },
    dropOffList: {
        opacity: 0.95,

    },
    mapContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    formContainer: {
        padding: 10,
    },
    fabContainer: {
        flex: 1,
        position: "absolute",
        right: 25,
        bottom: 100,
        zIndex: 10,

    },
    fab: {
        backgroundColor: "#3F51B5",
        width: 100,
        height: 100,
    }
})


export default connect(
    (state) => {
        return {
            region: state.region
        }
    }
)(Home);

