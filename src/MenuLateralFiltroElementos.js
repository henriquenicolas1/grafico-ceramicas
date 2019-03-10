import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { ListaElementos } from './lib/ListaElementos';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { EstadoElementosTrue } from './const/EstadoElementosTrue.js';
import { EstadoElementosFalse } from './const/EstadoElementosFalse.js';
import _ from 'lodash';

const styles = theme => ({
  list: {
    width: 600
  },
  button: {
    margin: theme.spacing.unit
  }
});

export class MenuLateralFiltroElementos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elementos: EstadoElementosTrue
    };
  }

  handleChange = name => event => {
    let valor = event.target.checked;
    this.setState(prevState => ({
      elementos: {
        ...prevState.elementos,
        [name]: valor
      }
    }));
  };

  selecionarTodos = () => {
    this.setState({ elementos: EstadoElementosTrue });
  };

  deselecionarTodos = () => {
    this.setState({ elementos: EstadoElementosFalse });
  };

  aplicarFiltro = () => {
    this.props.handleChangeState(this.state.elementos);
  };

  render() {
    const { classes, open } = this.props;

    const sideList = (
      <div className={classes.list}>
        {_.map(ListaElementos, elemento => {
          return (
            <FormControlLabel
              key={elemento}
              control={
                <Checkbox
                  checked={this.state.elementos[elemento]}
                  onChange={this.handleChange(elemento)}
                  value={elemento}
                  color='primary'
                />
              }
              label={elemento}
            />
          );
        })}
      </div>
    );

    return (
      <Drawer open={open} onClose={this.props.toggleDrawer('left', false)}>
        <div
          tabIndex={0}
          role='button'
          onKeyDown={this.props.toggleDrawer('left', false)}
        >
          <div>
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
          {sideList}
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(MenuLateralFiltroElementos);
