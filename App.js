import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableNativeFeedback } from "react-native";
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'UserDatabase.db' });



export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.texto1}>Cadastrar Produto</Text>
        <View>
          <TextInput style={styles.input}
            placeholder="Nome do Produto..." />
          <TextInput style={styles.input}
            placeholder="Descrição do Produto..." />
        </View>
        <TouchableNativeFeedback>
          <View style={styles.botao}>
            <Text style={styles.texto2}>Cadastrar</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2329',
    justifyContent: 'center',
    alignItems: 'center'
  },
  texto1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  texto2:{
    fontSize:15,
    color:'#171717',
    fontWeight:'bold'
  },
  input: {
    height: 40,
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#171717',
    elevation: 10,
    width: 280
  },
  botao: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
    padding:15,
    borderRadius:10
  }
})
