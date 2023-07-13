import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableNativeFeedback } from "react-native";
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'DatabaseProduotos.db' });

const initialState = {
  nome: '',
  desc: ''
}

export default class App extends Component {

  state = {
    ...initialState
  }

  criarTabela = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE Produtos (prod_id INT AUTO_INCREMENT, prod_nome varchar(30), prod_desc varchar(70), PRIMARY KEY (prod_id))',  //Query to execute as prepared statement
        [],  //Argument to pass for the prepared statement
        (tx, results) => {
          console.warn(JSON.stringify(results));
        }  //Callback function to handle the result
      );
    });
  }

  selecionarProdutos = async () => {
    await db.transaction(function (tx) {
      tx.executeSql(
        'SELECT * FROM Produtos',  //Query to execute as prepared statement
        [],  //Argument to pass for the prepared statement
        (tx, results) => {
          console.warn(results.rows.item(0).prod_nome);
        }  //Callback function to handle the result
      );
    });
  }

  inserirProduto = async (nome, desc) => {
    await db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO Produtos (prod_nome, prod_desc) VALUES (?, ?)',  //Query to execute as prepared statement
        [nome, desc],  //Argument to pass for the prepared statement
        (tx, results) => {
          console.warn(JSON.stringify(results));
        }  //Callback function to handle the result
      );
    });
    console.warn(this.state.nome);
  }

  deletarTabela = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        'DROP TABLE Produtos',  //Query to execute as prepared statement
        [],  //Argument to pass for the prepared statement
        (tx, results) => {
          console.warn(JSON.stringify(results));
        }  //Callback function to handle the result
      );
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.texto1}>Cadastrar Produto</Text>
        <View>
          <TextInput style={styles.input}
            placeholder="Nome do Produto..."
            value={this.state.nome}
            onChangeText={nome => this.setState({ nome })} />
          <TextInput style={styles.input}
            placeholder="Descrição do Produto..."
            value={this.state.desc}
            onChangeText={desc => this.setState({ desc })} />
        </View>
        <TouchableNativeFeedback onPress={this.deletarTabela}>
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
  texto2: {
    fontSize: 15,
    color: '#171717',
    fontWeight: 'bold'
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
    padding: 15,
    borderRadius: 10
  }
})
