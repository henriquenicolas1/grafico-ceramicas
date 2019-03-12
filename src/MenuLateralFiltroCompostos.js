import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { ListaCompostos } from './lib/ListaCompostos';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { EstadoCompostosTrue } from './const/EstadoCompostosTrue';
import { EstadoCompostosFalse } from './const/EstadoCompostosFalse';
import Divider from '@material-ui/core/Divider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
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
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  }
});

export class MenuLateralFiltroCompostos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compostos: EstadoCompostosTrue,
      tipoFiltroLogico: 'filtroOU'
    };
  }

  handleChangeCheckbox = name => event => {
    let valor = event.target.checked;
    this.setState(prevState => ({
      compostos: {
        ...prevState.compostos,
        [name]: valor
      }
    }));
  };

  handleChangeTipoFiltro = event => {
    this.setState({ tipoFiltroLogico: event.target.value });
  };

  selecionarTodos = () => {
    this.setState({ compostos: EstadoCompostosTrue });
  };

  deselecionarTodos = () => {
    this.setState({ compostos: EstadoCompostosFalse });
  };

  aplicarFiltro = () => {
    this.props.handleChangeState(
      this.state.compostos,
      this.state.tipoFiltroLogico
    );
  };

  renderLista = () => {
    return (
      <div className={this.props.classes.list}>
        <GridList cellHeight={50} cols={8}>
          {_.map(ListaCompostos, item => {
            return (
              <GridListTile key={item} style={{ marginLeft: '24px' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.compostos[item]}
                      onChange={this.handleChangeCheckbox(item)}
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

  render() {
    const { classes, open } = this.props;

    return (
      <Drawer
        open={open}
        onClose={this.props.toggleDrawer('filtroComposto', false)}
      >
        <div
          tabIndex={0}
          role='button'
          onKeyDown={this.props.toggleDrawer('filtroComposto', false)}
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
            onClick={this.props.toggleDrawer('filtroComposto', false)}
          >
            Cancelar
          </Button>
        </div>
        <Divider />
        <div style={{ heigth: '150px' }}>
          <RadioGroup
            aria-label='Tipo de Filtro'
            name='filtro1'
            className={classes.group}
            value={this.state.tipoFiltroLogico}
            onChange={this.handleChangeTipoFiltro}
          >
            <FormControlLabel
              value='filtroOU'
              control={<Radio color='primary' />}
              label='Filtro Lógica OU'
            />
            <FormControlLabel
              value='filtroE'
              control={<Radio color='primary' />}
              label='Filtro Lógica E'
            />
          </RadioGroup>
        </div>
        <Divider />
        <div className={classes.root}>{this.renderLista()}</div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(MenuLateralFiltroCompostos);
