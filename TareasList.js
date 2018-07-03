import React, {Component} from 'react';
import {Text, View, ListView} from 'react-native';
import PropTypes from 'prop-types';

export default class TareasList extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      dataSource: ds.cloneWithRows(props.todos)
    };
  }

  renderRow(todo) {
    return(
      <Text>{todo.tareas}</Text>
    )
  }

  render(){
    return(
      <View>
        <ListView
          key={this.props.todos}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}/>
      </View>
    );
  }
}
//agregar validacion de los props

//aaray of espera la informacion sobre la matriz
TareasList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.object).isRequired,
};
