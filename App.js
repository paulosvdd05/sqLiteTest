import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";
import { openDatabase } from 'react-native-sqlite-storage';
import Produto from "./components/Produto";
var db = openDatabase({ name: 'DatabaseProduotos.db' });

const initialState = {
  nome: '',
  desc: '',
  produto: [],
}

export default class App extends Component {

  state = {
    ...initialState
  }

  componentDidMount = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Produtos (prod_id INTEGER PRIMARY KEY, prod_nome varchar(30), prod_desc varchar(70))',  //Query to execute as prepared statement
        [],  //Argument to pass for the prepared statement
        async (tx, results) => {
          await db.transaction((tx) => {
            tx.executeSql(
              'SELECT * FROM Produtos',  //Query to execute as prepared statement
              [],  //Argument to pass for the prepared statement
              (tx, results) => {
                for (let i = 0; i < results.rows.length; i++) {
                  this.setState({
                    produto: [...this.state.produto, {
                      id: results.rows.item(i).prod_id,
                      nome: results.rows.item(i).prod_nome,
                      desc: results.rows.item(i).prod_desc,
                    }]
                  })
                }

              }  //Callback function to handle the result
            );
          })
        }  //Callback function to handle the result
      );
    });
  }

  selecionarProdutos = async (id) => {
    await db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Produtos',  //Query to execute as prepared statement
        [],  //Argument to pass for the prepared statement
        (tx, results) => {
          this.setState({
            produto: [...this.state.produto, {
              id: results.rows.item(id - 1).prod_id,
              nome: results.rows.item(id - 1).prod_nome,
              desc: results.rows.item(id - 1).prod_desc,
            }]
          })

        }  //Callback function to handle the result
      );
    });
  }

  inserirProduto = async (nome, desc) => {

    await db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO Produtos (prod_nome, prod_desc) VALUES (?, ?)',  //Query to execute as prepared statement
        [nome, desc],  //Argument to pass for the prepared statement
        (tx, results) => {
          this.selecionarProdutos(results.insertId);
        }  //Callback function to handle the result
      );
    });

  }



  deletarTabela = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        'DROP TABLE Produtos',  //Query to execute as prepared statement
        [],  //Argument to pass for the prepared statement
        (tx, results) => {
          this.setState({produto:[]})
        }  //Callback function to handle the result
      );
    });
  }


  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-evenly', backgroundColor: '#3b434f' }}>
        <View style={{ backgroundColor: '#024EB4', padding: 5 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Cadastro de Produtos</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.texto1}>Nome:</Text>
            <TextInput style={styles.input}
              placeholder='Insira o nome do produto.'
              value={this.state.nome}
              onChangeText={nome => this.setState({ nome })}
              keyboardType='numeric'
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.texto1}>Descrição:</Text>
            <TextInput style={styles.input}
              placeholder='Insira a descrição do produto.'
              value={this.state.desc}
              onChangeText={desc => this.setState({ desc })}
              keyboardType='numeric'
            />
          </View>
        </View>
        <View style={styles.botaoContainer}>
          <TouchableOpacity style={[styles.botao, { backgroundColor: '#024EB4' }]} onPress={() => this.inserirProduto(this.state.nome, this.state.desc)}>
            <Text style={styles.textoBotao}>CADASTRAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.botao, { backgroundColor: '#c60000' }]} onPress={this.deletarTabela}>
            <Text style={styles.textoBotao}>DELETAR</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.FlatListContainer}>
          <FlatList style={styles.prodList}
            data={this.state.produto}
            keyExtractor={item => `${item.id}`}
            renderItem={({ item, index }) => <Produto {...item} index={index} />}
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
    width: 150,
    padding: 15,
    borderRadius: 5,
    shadowColor: '#171717',
    elevation: 10,
  },
  botaoContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row'
  },
  textoBotao: {
    color: '#fff', fontWeight: 'bold', fontSize: 15, textAlign: 'center'
  },
  inputContainer: {
    marginHorizontal: 10, marginTop: 10,
  },
  FlatListContainer: {
    flex: 2,
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