import React, { Component } from 'react';
import './App.css';
import Graficos from './Graficos.js';
import Button from '@material-ui/core/Button';
import MenuLateralFiltroElementos from './MenuLateralFiltroElementos';
import MenuLateralFiltroCompostos from './MenuLateralFiltroCompostos';
import { EstadoElementosTrue } from './const/EstadoElementosTrue.js';
import { EstadoCompostosTrue } from './const/EstadoCompostosTrue.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tipoFiltroCategoria: 'elementos',
      tipoFiltroLogico: 'filtroOU',
      filtroElemento: false,
      filtroComposto: false,
      elementos: EstadoElementosTrue,
      compostos: EstadoCompostosTrue
    };
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  handleChangeStateElementos = (listaElementos, tipoFiltroLogico) => {
    this.setState({
      elementos: listaElementos,
      filtroElemento: false,
      tipoFiltroCategoria: 'elementos',
      tipoFiltroLogico: tipoFiltroLogico
    });
  };

  handleChangeStateCompostos = (listaCompostos, tipoFiltroLogico) => {
    this.setState({
      compostos: listaCompostos,
      filtroComposto: false,
      tipoFiltroCategoria: 'compostos',
      tipoFiltroLogico: tipoFiltroLogico
    });
  };

  render() {
    return (
      <div className='App'>
        <Button onClick={this.toggleDrawer('filtroElemento', true)}>
          Filtrar Gráficos por Elemento
        </Button>
        <Button onClick={this.toggleDrawer('filtroComposto', true)}>
          Filtrar Gráficos por Compostos
        </Button>
        <MenuLateralFiltroElementos
          toggleDrawer={this.toggleDrawer}
          open={this.state.filtroElemento}
          handleChangeState={this.handleChangeStateElementos}
          listaElementosSemAlteracao={this.state.elementos}
        />
        <MenuLateralFiltroCompostos
          toggleDrawer={this.toggleDrawer}
          open={this.state.filtroComposto}
          handleChangeState={this.handleChangeStateCompostos}
          listaElementosSemAlteracao={this.state.compostos}
        />

        <Graficos
          elementosSelecionados={this.state.elementos}
          compostosSelecionados={this.state.compostos}
          tipoFiltroCategoria={this.state.tipoFiltroCategoria}
          tipoFiltroLogico={this.state.tipoFiltroLogico}
        />
      </div>
    );
  }
}

export default App;
