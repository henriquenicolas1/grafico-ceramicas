import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { ListaElementos } from './lib/ListaElementos';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { EstadoElementosTrue } from './const/EstadoElementosTrue.js';
import { EstadoElementosFalse } from './const/EstadoElementosFalse.js';
import Divider from '@material-ui/core/Divider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';

const styles = (theme) => ({
  list: {
    width: 620,
  },
  button: {
    margin: theme.spacing.unit,
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

export class MenuLateralFiltroElementos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elementos: EstadoElementosTrue,
      tipoFiltroLogico: 'filtroOU',
    };
  }

  handleChangeCheckbox = (name) => (event) => {
    let valor = event.target.checked;

    this.setState((prevState) => ({
      elementos: {
        ...prevState.elementos,
        [name]: valor,
      },
    }));
  };

  handleChangeTipoFiltro = (event) => {
    this.setState({ tipoFiltroLogico: event.target.value });
  };

  selecionarTodos = () => {
    this.setState({ elementos: EstadoElementosTrue });
  };

  deselecionarTodos = () => {
    this.setState({ elementos: EstadoElementosFalse });
  };

  aplicarFiltro = () => {
    this.props.handleChangeState(
      this.state.elementos,
      this.state.tipoFiltroLogico
    );
  };

  renderLista = () => {
    return (
      <div className={this.props.classes.list}>
        <GridList cellHeight={50} cols={8}>
          {_.map(ListaElementos, (item) => {
            return (
              <GridListTile key={item} style={{ marginLeft: '24px' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.elementos[item]}
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
        onClose={this.props.toggleDrawer('filtroElemento', false)}
      >
        <div
          tabIndex={0}
          role='button'
          onKeyDown={this.props.toggleDrawer('filtroElemento', false)}
        >
          <Divider />
          <Typography
            style={{
              marginTop: '10px',
              marginBottom: '10px',
              textAlign: 'center',
            }}
            variant='h5'
            gutterBottom
          >
            Elements Filter
          </Typography>
          <Divider />
          <Button
            variant='outlined'
            className={classes.button}
            onClick={this.selecionarTodos}
          >
            Select All
          </Button>
          <Button
            variant='outlined'
            className={classes.button}
            onClick={this.deselecionarTodos}
          >
            Deselect All
          </Button>
          <Button
            variant='outlined'
            color='primary'
            className={classes.button}
            onClick={this.aplicarFiltro}
          >
            Apply
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            className={classes.button}
            onClick={this.props.toggleDrawer('filtroElemento', false)}
          >
            Cancel
          </Button>
        </div>
        <Divider />
        <div style={{ heigth: '150px', marginLeft: '80px' }}>
          <FormControlLabel
            style={{ marginLeft: '32px' }}
            value='filtroOU'
            checked={this.state.tipoFiltroLogico === 'filtroOU'}
            onChange={this.handleChangeTipoFiltro}
            control={<Radio color='primary' />}
            label='Logic Filter OR'
          />
          <FormControlLabel
            style={{ marginLeft: '32px' }}
            value='filtroE'
            checked={this.state.tipoFiltroLogico === 'filtroE'}
            onChange={this.handleChangeTipoFiltro}
            control={<Radio color='primary' />}
            label='Logic Filter AND'
          />
        </div>
        <Divider />
        <div className={classes.root}>{this.renderLista()}</div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(MenuLateralFiltroElementos);
