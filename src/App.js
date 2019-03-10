import React, { Component } from 'react';
import './App.css';
import Graficos from './Graficos.js';
import Button from '@material-ui/core/Button';
import MenuLateralFiltroElementos from './MenuLateralFiltroElementos';
import { EstadoElementosTrue } from './const/EstadoElementosTrue.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: false,
      elementos: EstadoElementosTrue
    };
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  handleChangeState = listaElementos => {
    this.setState({ elementos: listaElementos });
    this.setState({ left: false });
  };

  render() {
    return (
      <div className='App'>
        <Button onClick={this.toggleDrawer('left', true)}>
          Abrir filtro de elementos
        </Button>
        <MenuLateralFiltroElementos
          toggleDrawer={this.toggleDrawer}
          open={this.state.left}
          handleChangeState={this.handleChangeState}
        />

        <Graficos elementosSelecionados={this.state.elementos} />
      </div>
    );
  }
}

export default App;
