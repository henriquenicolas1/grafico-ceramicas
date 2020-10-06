import React, { Component } from 'react';
import './App.css';
import Graficos from './Graficos.js';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuLateralFiltroElementos from './MenuLateralFiltroElementos';
import MenuLateralFiltroCompostos from './MenuLateralFiltroCompostos';
import MenuLateralFrentePareto from './MenuLateralFrentePareto';
import { EstadoElementosTrue } from './const/EstadoElementosTrue.js';
import { EstadoCompostosTrue } from './const/EstadoCompostosTrue.js';
import TabelaCeramicas from './TabelaCeramicas';
import Previsor from './Previsor';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      tipoFiltroCategoria: 'elementos',
      tipoFiltroLogico: 'filtroOU',
      filtroElemento: false,
      filtroComposto: false,
      menuFrentePareto: false,
      menuFrenteParetoNova: false,
      frenteParetoOriginal: null,
      frenteParetoNova: null,
      listaDataPointsFrenteParetoGerada: null,
      elementos: EstadoElementosTrue,
      compostos: EstadoCompostosTrue,
    };
  }

  alteraEstadoAppFrenteParetoOriginal = (frentePareto) => {
    this.setState({ frenteParetoOriginal: frentePareto });
  };

  alteraEstadoAppFrenteParetoNova = (frentePareto) => {
    this.setState({ frenteParetoNova: frentePareto });
  };

  alteraEstadoAppListaDataPoninsFrenteParetoGerada = (dataPoints) => {
    this.setState({ listaDataPointsFrenteParetoGerada: dataPoints });
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  handleChangeStateElementos = (listaElementos, tipoFiltroLogico) => {
    this.setState({
      elementos: listaElementos,
      filtroElemento: false,
      tipoFiltroCategoria: 'elementos',
      tipoFiltroLogico: tipoFiltroLogico,
    });
  };

  handleChangeStateCompostos = (listaCompostos, tipoFiltroLogico) => {
    this.setState({
      compostos: listaCompostos,
      filtroComposto: false,
      tipoFiltroCategoria: 'compostos',
      tipoFiltroLogico: tipoFiltroLogico,
    });
  };

  handleChangeAba = (event, value) => {
    this.setState({ value });
  };

  //TODO: a troca de aba faz com que o estado da aplicação fique errado
  render() {
    const { classes } = this.props;
    const { value, listaDataPointsFrenteParetoGerada } = this.state;
    return (
      <div className='App'>
        <div className={classes.root}>
          <AppBar position='static' color='default'>
            <Tabs
              value={value}
              onChange={this.handleChangeAba}
              indicatorColor='primary'
              textColor='primary'
              scrollButtons='auto'
              centered
            >
              <Tab label='Charts' />
              <Tab label='Table' />
              <Tab label='Predictor' />
            </Tabs>
          </AppBar>
          {value === 0 && (
            <div>
              <Button
                style={{
                  marginTop: '24px',
                  marginBottom: '24px',
                  marginRight: '8px',
                  marginLeft: '8px',
                }}
                variant='outlined'
                onClick={this.toggleDrawer('filtroElemento', true)}
              >
                Filter Charts by Elements
                {/* Filtrar Gráficos por Elemento */}
              </Button>
              <Button
                style={{
                  marginTop: '24px',
                  marginBottom: '24px',
                  marginRight: '8px',
                  marginLeft: '8px',
                }}
                variant='outlined'
                onClick={this.toggleDrawer('filtroComposto', true)}
              >
                Filter Charts by Compounds
                {/* Filtrar Gráficos por Compostos */}
              </Button>
              <Button
                style={{
                  marginTop: '24px',
                  marginBottom: '24px',
                  marginRight: '8px',
                  marginLeft: '8px',
                }}
                variant='outlined'
                onClick={this.toggleDrawer('menuFrentePareto', true)}
              >
                Display Chemical Compounds Pareto Front
                {/* Exibir Elementos Frente de Pareto */}
              </Button>
              <Button
                style={{
                  marginTop: '24px',
                  marginBottom: '24px',
                  marginRight: '8px',
                  marginLeft: '8px',
                }}
                variant='outlined'
                onClick={this.toggleDrawer('menuFrenteParetoNova', true)}
                disabled={this.state.frenteParetoNova === null}
              >
                Display Chemical Compounds Pareto Front from Filter
                {/* Exibir Elementos Frente de Pareto do Filtro */}
              </Button>
              {/* <a href='./lista-materiais-ceramicos.pdf' download>
          Click to download
        </a> */}
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
              <MenuLateralFrentePareto
                toggleDrawer={this.toggleDrawer}
                open={this.state.menuFrentePareto}
                frentePareto={this.state.frenteParetoOriginal}
                tipoFrentePareto={'original'}
                listaDataPointsFrenteParetoGerada={null}
              />
              <MenuLateralFrentePareto
                toggleDrawer={this.toggleDrawer}
                open={this.state.menuFrenteParetoNova}
                frentePareto={this.state.frenteParetoNova}
                tipoFrentePareto={'nova'}
                listaDataPointsFrenteParetoGerada={
                  listaDataPointsFrenteParetoGerada
                }
              />
              <Graficos
                elementosSelecionados={this.state.elementos}
                compostosSelecionados={this.state.compostos}
                tipoFiltroCategoria={this.state.tipoFiltroCategoria}
                tipoFiltroLogico={this.state.tipoFiltroLogico}
                alteraEstadoAppFrenteParetoOriginal={
                  this.alteraEstadoAppFrenteParetoOriginal
                }
                alteraEstadoAppFrenteParetoNova={
                  this.alteraEstadoAppFrenteParetoNova
                }
                alteraEstadoAppListaDataPoninsFrenteParetoGerada={
                  this.alteraEstadoAppListaDataPoninsFrenteParetoGerada
                }
              />
            </div>
          )}
          {value === 1 && <TabelaCeramicas />}
          {value === 2 && <Previsor />}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
