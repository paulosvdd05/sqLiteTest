import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";
import { openDatabase } from 'react-native-sqlite-storage';
import Produto from "./components/Produto";
var db = openDatabase({ name: 'DatabaseProduotos.db' });

const initialState = {
  nome: '',
  desc: '',
  produto: [1]
}

export default class App extends Component {

  state = {
    ...initialState
  }

  componentDidMount = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE Produtos (prod_id INT AUTO_INCREMENT, prod_nome varchar(30), prod_desc varchar(70), PRIMARY KEY (prod_id))',  //Query to execute as prepared statement
        [],  //Argument to pass for the prepared statement
        (tx, results) => {

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
          console.warn(results.rows.item(5).prod_desc);
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
      <View style={{ flex: 1, justifyContent: 'space-evenly', backgroundColor: '#3b434f' }}>
        <View style={{backgroundColor:'#024EB4', padding:5}}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Cadastro de Produtos</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.texto1}>Nome:</Text>
            <TextInput style={styles.input}
              placeholder='Insira o nome do produto.'
              value={this.state.parcelas}
              onChangeText={parcelas => this.setState({ parcelas })}
              keyboardType='numeric'
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.texto1}>Descrição:</Text>
            <TextInput style={styles.input}
              placeholder='Insira a descrição do produto.'
              value={this.state.intervalo}
              onChangeText={intervalo => this.setState({ intervalo })}
              keyboardType='numeric'
            />
          </View>
        </View>
        <View style={styles.botaoContainer}>
          <TouchableOpacity style={styles.botao} onPress={this.calcular}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cadastar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.FlatListContainer}>
          <FlatList style={styles.prodList}
            data={this.state.lista}
            keyExtractor={item => `${item.id}`}
            renderItem={({ item, index }) => <Tabela {...item} data={moment(new Date(item.data)).format('DD[/]MM[/]YYYY')} index={index} />}
          />
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    backgroundColor: '#fff',
    color: '#313131',
    borderRadius: 10,
    shadowColor: '#171717',
    elevation: 10,
    justifyContent: 'center',
    width: '100%'
  },
  texto1: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  botao: {
    backgroundColor: '#024EB4',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#171717',
    elevation: 10,
  },
  botaoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  inputContainer: {
    marginHorizontal: 10, marginTop: 10,
  },
  FlatListContainer: {
    flex: 3,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 15,
    shadowColor: '#171717',
    elevation: 10,
    marginBottom: 10
  },
  formContainer: {
    flex: 1,
  },
  prodList: {
    marginVertical: 10,
  },
})