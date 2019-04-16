import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { MateriaisCeramicosDuplicados } from './lib/MateriaisCeramicosDuplicados';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import _ from 'lodash';

const styles = theme => ({
  list: {
    width: 550
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
  },
  card: {
    minWidth: 275
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  posicaoTexto: {
    marginLeft: 8
  },
  cardContent: {
    marginLeft: 10
  }
});

export class MenuLateralFrentePareto extends Component {
  renderLista = () => {
    const { classes, frentePareto } = this.props;
    let listaOrdenada = frentePareto
      ? frentePareto.sort(function(a, b) {
          return a - b;
        })
      : null;

    return (
      <div className={classes.list}>
        {listaOrdenada
          ? _.map(listaOrdenada, index => {
              return (
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Typography
                      className={classes.title}
                      color='textSecondary'
                      gutterBottom
                    >
                      <span>Id: {MateriaisCeramicosDuplicados[index].Id}</span>
                    </Typography>
                    <Typography
                      className={classes.pos}
                      variant='h5'
                      component='h2'
                    >
                      <span>
                        {MateriaisCeramicosDuplicados[index].Material}
                      </span>
                      <br />
                    </Typography>

                    <Typography component='p'>
                      <strong>Constante Dielétrica:</strong>
                      <span className={classes.posicaoTexto}>
                        {
                          MateriaisCeramicosDuplicados[index]
                            .ConstanteDieletrica
                        }
                      </span>
                      <br />
                      <strong>Fator de Qualidade:</strong>
                      <span className={classes.posicaoTexto}>
                        {MateriaisCeramicosDuplicados[index].FatorQualidade}
                      </span>
                      <br />
                      <strong>Elementos:</strong>
                      <span className={classes.posicaoTexto}>
                        {MateriaisCeramicosDuplicados[index].Elementos}
                      </span>
                      <br />
                      <strong>Compostos:</strong>
                      <span className={classes.posicaoTexto}>
                        {MateriaisCeramicosDuplicados[index].Compostos}
                      </span>
                      <br />
                      <strong>Frequência de Medição:</strong>
                      <span className={classes.posicaoTexto}>
                        {MateriaisCeramicosDuplicados[index].FrequenciaMedicao}
                      </span>
                      <br />
                      <strong>Temperatura Sintetização:</strong>
                      <span className={classes.posicaoTexto}>
                        {
                          MateriaisCeramicosDuplicados[index]
                            .TemperaturaSintetizacao
                        }
                      </span>
                      <br />
                      <strong>Estrutura Cristalina:</strong>
                      <span className={classes.posicaoTexto}>
                        {
                          MateriaisCeramicosDuplicados[index]
                            .EstruturaCristalina
                        }
                      </span>
                      <br />
                      <strong>
                        Coeficiente da variação de temperatura da frequência
                        ressonante:
                      </strong>
                      <span className={classes.posicaoTexto}>
                        {
                          MateriaisCeramicosDuplicados[index]
                            .VariacaoTemperaturaFrequenciaRessonante
                        }
                      </span>
                      <br />
                      <strong>Referência:</strong>
                      <span className={classes.posicaoTexto}>
                        {MateriaisCeramicosDuplicados[index].Referencia}
                      </span>
                    </Typography>
                  </CardContent>
                </Card>
              );
            })
          : null}
      </div>
    );
  };

  //TODO: Colocar informação de distância na frente de pareto nova
  render() {
    const { classes, open, tipoFrentePareto } = this.props;
    let toggle =
      tipoFrentePareto === 'original'
        ? 'menuFrentePareto'
        : 'menuFrenteParetoNova';

    return (
      <Drawer
        open={open}
        onClose={this.props.toggleDrawer(toggle, false)}
        anchor='right'
      >
        <Divider />
        <Typography
          style={{
            marginTop: '10px',
            marginBottom: '10px',
            textAlign: 'center'
          }}
          variant='h5'
          gutterBottom
        >
          Frente de Pareto
        </Typography>

        <Divider />
        <div className={classes.root}>{this.renderLista()}</div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(MenuLateralFrentePareto);
