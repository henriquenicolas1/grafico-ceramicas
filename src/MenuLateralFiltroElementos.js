import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { ListaElementos } from './lib/ListaElementos';
import { ListaCompostos } from './lib/ListaCompostos';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { EstadoElementosTrue } from './const/EstadoElementosTrue.js';
import { EstadoElementosFalse } from './const/EstadoElementosFalse.js';
import { EstadoCompostosTrue } from './const/EstadoCompostosTrue';
import { EstadoCompostosFalse } from './const/EstadoCompostosFalse';
import Divider from '@material-ui/core/Divider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import _ from 'lodash';

const styles = theme => ({
  list: {
    width: 600
  },
  button: {
    margin: theme.spacing.unit
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

export class MenuLateralFiltroElementos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alteracaoSalva: false,
      value: 0,
      elementos: EstadoElementosTrue,
      compostos: EstadoCompostosTrue
    };
  }

  handleChange = name => event => {
    const { value } = this.state;
    let valor = event.target.checked;

    if (value === 0) {
      this.setState(prevState => ({
        elementos: {
          ...prevState.elementos,
          [name]: valor
        }
      }));
    } else {
      this.setState(prevState => ({
        compostos: {
          ...prevState.compostos,
          [name]: valor
        }
      }));
    }
  };

  selecionarTodos = () => {
    const { value } = this.state;
    if (value === 0) {
      this.setState({ elementos: EstadoElementosTrue });
    } else {
      this.setState({ compostos: EstadoCompostosTrue });
    }
  };

  deselecionarTodos = () => {
    const { value } = this.state;
    if (value === 0) {
      this.setState({ elementos: EstadoElementosFalse });
    } else {
      this.setState({ compostos: EstadoCompostosFalse });
    }
  };

  aplicarFiltro = () => {
    this.setState({ alteracaoSalva: true });
    this.props.handleChangeState(this.state.elementos, this.state.compostos);
  };

  fecharFiltro = () => {
    this.setState({
      value: 0,
      elementos: this.props.listaElementosSemAlteracao,
      compostos: this.props.listaCompostosSemAlteracao
    });
    this.props.toggleDrawer('left', false);
  };

  renderLista = () => {
    const { value } = this.state;
    let listaDoFiltro = value === 0 ? ListaElementos : ListaCompostos;
    return (
      <div className={this.props.classes.list}>
        <GridList cellHeight={50} cols={8}>
          {_.map(listaDoFiltro, item => {
            return (
              <GridListTile key={item} style={{ marginLeft: '24px' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        value === 0
                          ? this.state.elementos[item]
                          : this.state.compostos[item]
                      }
                      onChange={this.handleChange(item)}
                      value={item}
                      color='primary'
                    />
                  }
                  label={item}
                />
              </GridListTile>
            );
          })}
        </GridList>
      </div>
    );
  };

  handleChangeAba = (event, value) => {
    this.setState({ value });
  };

  //   alteraParaEstadoOriginal = () => {
  //     const {
  //       listaElementosSemAlteracao,
  //       listaCompostosSemAlteracao
  //     } = this.props;
  //     this.setState({
  //       value: 0,
  //       elementos: listaElementosSemAlteracao,
  //       compostos: listaCompostosSemAlteracao
  //     });
  //   };

  //   componentWillUnmount = () => {
  //     console.log('chegou aqui mesmo');
  //     if (!this.state.alteracaoSalva) {
  //       this.alteraParaEstadoOriginal();
  //     }
  //   };

  render() {
    const { classes, open } = this.props;
    const { value } = this.state;

    return (
      <Drawer open={open} onClose={this.props.toggleDrawer('left', false)}>
        <div
          tabIndex={0}
          role='button'
          onKeyDown={this.props.toggleDrawer('left', false)}
        >
          <Button
            variant='outlined'
            className={classes.button}
            onClick={this.selecionarTodos}
          >
            Selecionar todos
          </Button>
          <Button
            variant='outlined'
            className={classes.button}
            onClick={this.deselecionarTodos}
          >
            Desmarcar todos
          </Button>
          <Button
            variant='outlined'
            color='primary'
            className={classes.button}
            onClick={this.aplicarFiltro}
          >
            Aplicar
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            className={classes.button}
            onClick={this.props.toggleDrawer('left', false)}
          >
            Cancelar
          </Button>
        </div>
        <Divider />
        <div className={classes.root}>
          <AppBar position='static'>
            <Tabs value={value} onChange={this.handleChangeAba}>
              <Tab label='Filtro por elemento' />
              <Tab label='Filtro por composto' />
            </Tabs>
          </AppBar>
          {value === 0 && this.renderLista()}
          {value === 1 && this.renderLista()}
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(MenuLateralFiltroElementos);
