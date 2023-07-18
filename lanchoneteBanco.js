import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";
import { openDatabase } from 'react-native-sqlite-storage';
import Produto from "./components/Produto";
var db = openDatabase({
    name: 'lanchoneteBD.db', createFromLocation: '~lanchoneteBD.db',
}, null, null)

const initialState = {
    nome: '',
    desc: '',
    etiqueta: '',
    valor: '',
    estoque: '',
    produto: [],
}

export default class App extends Component {

    state = {
        ...initialState
    }




    inserirProduto = async (nome, desc, etiqueta, valor, estoque) => {
        console.warn(nome + desc + etiqueta + valor + estoque);
        await db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO produto (id_produto, descricao, etiqueta, valor, qtd_estoque) VALUES (?, ?, ?, ?, ?)',  //Query to execute as prepared statement
                [nome, desc, etiqueta, valor, estoque],  //Argument to pass for the prepared statement
                (tx, results) => {
                    console.warn(results, tx);
                }  //Callback function to handle the result
            );
        });

    }

    selecionar = () => {
        this.setState({ produto: [] }, () => {
            db.transaction(async (tx) => {
                await tx.executeSql(
                    'SELECT * FROM produto',  //Query to execute as prepared statement
                    [],  //Argument to pass for the prepared statement
                    (tx, results) => {
                        for (let i = 0; i < results.rows.length; ++i) {
                            this.setState({
                                produto: [...this.state.produto, {
                                    id: results.rows.item(i).id_produto,
                                    nome: results.rows.item(i).descricao,
                                    desc: results.rows.item(i).etiqueta,
                                }]
                            })
                        }
                    }  //Callback function to handle the result
                );
            });
        })

    }


    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-evenly', backgroundColor: '#3b434f' }}>
                <View style={{ backgroundColor: '#024EB4', padding: 5 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Banco Lanchonete</Text>
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.texto1}>Id:</Text>
                        <TextInput style={styles.input}
                            placeholder='Insira o id do produto.'
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
                    <View style={styles.inputContainer}>
                        <Text style={styles.texto1}>Etiqueta:</Text>
                        <TextInput style={styles.input}
                            placeholder='Insira a Etiqueta do produto.'
                            value={this.state.etiqueta}
                            onChangeText={etiqueta => this.setState({ etiqueta })}
                            keyboardType='numeric'
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.texto1}>Valor:</Text>
                        <TextInput style={styles.input}
                            placeholder='Insira a Valor do produto.'
                            value={this.state.valor}
                            onChangeText={valor => this.setState({ valor })}
                            keyboardType='numeric'
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.texto1}>Estoque:</Text>
                        <TextInput style={styles.input}
                            placeholder='Insira a Estoque do produto.'
                            value={this.state.estoque}
                            onChangeText={estoque => this.setState({ estoque })}
                            keyboardType='numeric'
                        />
                    </View>
                </View>
                <View style={styles.botaoContainer}>
                    <TouchableOpacity style={[styles.botao, { backgroundColor: '#024EB4' }]} onPress={() => this.inserirProduto(this.state.nome, this.state.desc, this.state.etiqueta, this.state.valor, this.state.estoque)}>
                        <Text style={styles.textoBotao}>CADASTRAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.botao, { backgroundColor: '#00c600' }]} onPress={this.selecionar}>
                        <Text style={styles.textoBotao}>SELECIONAR</Text>
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
        flex: 5,
    },
    prodList: {
        marginVertical: 10,
    },
})