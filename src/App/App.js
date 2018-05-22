import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import axios from 'axios';
import XMLParser from 'react-xml-parser';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/Feather';

export default class App extends Component {
  state = {
    rainChance: ''
  };

  async componentDidMount() {
    const location = await this._getLocation();
    console.log(location);
    this.setState({ location });
    this._getRainChance(location);
  }

  _getRainChance = (location) => {
    axios.get('http://api.worldweatheronline.com/premium/v1/weather.ashx', {
      params: {
        key: '2c8015e9e05642c898a180033182205',
        q: location.latitude + ',' + location.longitude,
        includelocation: 'yes',
        date: 'today',
        tp: 24,
        num_of_days: 1,
      }
    }).then((response) => {
      const xml = new XMLParser().parseFromString(response.data.toString());
      this.setState({
        rainChance: xml.getElementsByTagName('chanceofrain')[0].value
      })
    }).catch(function (error) {
      console.log(error);
    });
  };

  _getLocation = () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((data) => {
        resolve({
          latitude: data.coords.latitude,
          longitude: data.coords.longitude
        });
      }, (error) => {
        console.log(error);
        resolve({});
      }, { timeOut: 10000, enableHighAccuracy: true });
    });
  };

  render() {
    return (
      <View style={styles.container}>

        <View style={{
          flex: 2,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 50,
        }}>
          <Text style={styles.text}>Chance of rain today: </Text>

          <Progress.Circle
            style={{ marginTop: 15 }}
            progress={Number(this.state.rainChance) / 100}
            size={110}
            animated={true}
            showsText={true}
          />


          <View style={{ flex: 1, marginTop: 30 }}>
            {this.state.rainChance < 50 ?
              <Icon name="sun" size={90} color="#007AFF" />
              :
              <Icon name="cloud-rain" size={90} color="#007AFF" />
            }
          </View>
        </View>

        <View style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          alignSelf: 'stretch',
          flexDirection: 'row'
        }}>
          <Image
            style={{ height: 100, width: 100, marginHorizontal: 50 }}
            resizeMode={'contain'}
            source={require('./imgs/putin.png')} />

          <Image
            style={{ height: 100, width: 100, marginHorizontal: 50 }}
            resizeMode={'contain'}
            source={require('./imgs/chicks.png')} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 30,
    textAlign: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    color: '#007AFF'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
