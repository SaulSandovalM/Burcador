import React, {Component} from 'react'
import {Text, StyleSheet, View, ListView, TouchableHighlight, Dimensions, Animated, TextInput} from 'react-native'

const {width, height} = Dimensions.get('window')

export default class App extends Component {
    constructor(props){
        super(props)
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.state = {
            isLoaded: false,
            dataSource: ds.cloneWithRows([]),
            rawData: '',
            empty: true,
            isLoading: false,
            rotateY: new Animated.Value(0),
            translateX: new Animated.Value(width),
            text: ''
        }
    }

    componentWillMount() {
        this.fetchData()
    }

    fetchData(){
        fetch('https://api.tvmaze.com/schedule')
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(data),
                    isLoading: false,
                    empty: false,
                    rawData: data
                })
            })
            .catch((error) => {
                this.setState({
                    empty: true,

                })
            })
    }

    renderRow(rowData){
        return (
            <TouchableHighlight style={styles.containerCell}>
                <View>
                    <View style={styles.footerContainer}>
                        <View style={styles.footerTextContainer}>
                            <Text style={styles.text}>{rowData.name}</Text>
                            <Text style={[styles.text, styles.textTitle]}>{rowData.number}</Text>
                            <Text style={[styles.text, styles.textBy]}>By {rowData.airdate}</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    filterSearch(text){
        this.setState({text})
        let newData = this.dataFilter(text, this.state.rawData);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newData),
            isLoaded: true,
            empty: false
        })
    }

    dataFilter(text, data){
        return data.filter(function(item){
            const itemData = item.name.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
    }

    render(){
        return (
            <View style={styles.container}>

                <Animated.View
                    style={[styles.content, {
                        width: width,
                        backgroundColor: 'gray',
                        flex: 1,
                        transform: [
                            {
                                perspective: 450
                            },
                            {
                                translateX: this.state.translateX.interpolate({
                                    inputRange: [0, width],
                                    outputRange: [width, 0]
                                })
                            },
                            {
                                rotateY: this.state.rotateY.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '-10deg']
                                })
                            }
                        ]
                    }]}
                >

                    <TextInput
                        style={styles.textInput}
                        onChangeText={(text) => this.filterSearch(text)}
                        value={this.state.text}
                    />
                    <ListView
                        enableEmptySections={true}
                        style={styles.listContainer}
                        renderRow={this.renderRow.bind(this)}
                        dataSource={this.state.dataSource}
                    />
                </Animated.View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    textInput: {
        height: 50,
        borderWidth: 1,
        borderColor: 'yellow',
        marginBottom: 10,
        marginHorizontal: 10
    },
    content: {
        zIndex: 1
    },
    footerContainer: {
       flexDirection: 'row',
       paddingHorizontal: 10,
       paddingVertical: 10,
       backgroundColor: 'black'
    },
    listContainer: {
        marginHorizontal: 10
    },
    text: {
        color: 'white'
    },
    containerCell: {
        marginBottom: 10
    },
    textTitle: {
        fontSize: 13
    },
    textBy: {
        fontSize: 12
    },
})
