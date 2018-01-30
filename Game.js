import React, { Component } from 'react';
import PropTypes from 'prop-types';


import {StyleSheet,Text,View} from 'react-native';
import RandomNumber from './RandomNumber'

export default class Game extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds:PropTypes.number.isRequired,
  };
  state = {
    selectedNumbers: [],
    remainingSeconds: this.props.initialSeconds ,
  };
  randomNumbers = Array.from({ length: this.props.randomNumberCount})
                .map(() => 1 + Math.floor(10 * Math.random()));
  target = this.randomNumbers.slice(0, this.props.randomNumberCount - 2)
                              .reduce((acc, curr) => acc + curr, 0);

ComponentDidMount(){
this.intervalId = setInterval(() => {
    this.setState((prevState) => {
      return { remainingSeconds: prevState.remainingSeconds - 1};

  }, () => {
  if(this.state.remainingSeconds === 0){
    clearInterval(this.intervalId);
  }
  });
  },1000);
}

ComponentWillUnmount(){
  clearInterval(this.intervalId);
}

  isNumberSelected = (numberIndex) => {
    return this.state.selectedNumbers.indexOf(numberIndex) >= 0;
  };

  selectNumber = (numberIndex) => {
    this.setState((prevState) => ({
       selectedNumbers: [...prevState.selectedNumbers, numberIndex],
    }));
  };

gameStatus = () => {
  const sumSelected = this.state.selectedNumbers.reduce((acc, curr) => {
    return acc + this.randomNumbers[curr];
  }, 0);
  // if (this.state.remainingSeconds === 0) {
  //   return 'LOST';
  // }
  if (sumSelected<this.target){
    return 'PLAYING';
  }
  if (sumSelected===this.target){
    return 'WON';
  }
  if (sumSelected > this.target){
    return 'LOST';
  }
}


  render() {
    const gameStatus = this.gameStatus();
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>{this.target}</Text>
        <View style={styles.randomContainer}>
        {this.randomNumbers.map((randomNumber, index) =>
          <RandomNumber
          key={index}
          id={index}
          number={randomNumber}
          isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'}
          onPress={this.selectNumber}
           />
      )}
      </View>
      <Text>{gameStatus}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
  },

  target: {
     fontSize: 50,
     margin: 50,
    // backgroundColor: '#bbb',
     textAlign: 'center'
   },

   randomContainer:{
     flex: 1,
     flexDirection: 'row',
     flexWrap: 'wrap',
     justifyContent: 'space-around',

   },

STATUS_PLAYING:{
  backgroundColor: '#999',
},

STATUS_WON:{
  backgroundColor: 'green',
},

STATUS_LOST:{
  backgroundColor: 'red',
},

});
