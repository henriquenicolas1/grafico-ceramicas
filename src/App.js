import React, { Component } from 'react';
import './App.css';
import Graficos from './Graficos.js';
import Button from '@material-ui/core/Button';
import MenuLateralFiltroElementos from './MenuLateralFiltroElementos';
import { EstadoElementosTrue } from './const/EstadoElementosTrue.js';
import { EstadoCompostosTrue } from './const/EstadoCompostosTrue.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: false,
      elementos: EstadoElementosTrue,
      compostos: EstadoCompostosTrue
    };
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  handleChangeState = (listaElementos, listaCompostos) => {
    this.setState({
      elementos: listaElementos,
      compostos: listaCompostos,
      left: false
    });
  };

  render() {
    return (
      <div className='App'>
        <Button onClick={this.toggleDrawer('left', true)}>
          Filtrar Gráficos
        </Button>
        <MenuLateralFiltroElementos
          toggleDrawer={this.toggleDrawer}
          open={this.state.left}
          handleChangeState={this.handleChangeState}
          listaElementosSemAlteracao={this.state.elementos}
          listaCompostosSemAlteracao={this.state.compostos}
        />

        <Graficos
          elementosSelecionados={this.state.elementos}
          compostosSelecionados={this.state.compostos}
        />
      </div>
    );
  }
}

export default App;
