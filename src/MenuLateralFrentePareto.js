import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { MateriaisCeramicosDuplicados } from './lib/MateriaisCeramicosDuplicados';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import _ from 'lodash';

const styles = (theme) => ({
  list: {
    width: 550,
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
  card: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  posicaoTexto: {
    marginLeft: 8,
  },
  cardContent: {
    marginLeft: 10,
  },
});

export class MenuLateralFrentePareto extends Component {
  obterIdComDistancia = (lista) => {
    if (lista && lista.length > 0) {
      const regex = /\d+/;
      let objetoIdDistancia = _.map(lista, function (l) {
        return {
          Id: parseInt(l.toolTipContent.match(regex)[0]),
          Distancia: l.distancia,
        };
      });
      return objetoIdDistancia;
    }
    return null;
  };

  obterMateriais = (frentePareto, distanciasComId) => {
    let materiais;
    if (!frentePareto) {
      return null;
    }

    if (this.props.tipoFrentePareto === 'original') {
      materiais = _.map(frentePareto, function (index) {
        return {
          Id: MateriaisCeramicosDuplicados[index].Id,
          Material: MateriaisCeramicosDuplicados[index].Material,
          TemperaturaSintetizacao:
            MateriaisCeramicosDuplicados[index].TemperaturaSintetizacao,
          EstruturaCristalina:
            MateriaisCeramicosDuplicados[index].EstruturaCristalina,
          ConstanteDieletrica:
            MateriaisCeramicosDuplicados[index].ConstanteDieletrica,
          FatorQualidade: MateriaisCeramicosDuplicados[index].FatorQualidade,
          FrequenciaMedicao:
            MateriaisCeramicosDuplicados[index].FrequenciaMedicao,
          VariacaoTemperaturaFrequenciaRessonante:
            MateriaisCeramicosDuplicados[index]
              .VariacaoTemperaturaFrequenciaRessonante,
          Referencia: MateriaisCeramicosDuplicados[index].Referencia,
          Elementos: MateriaisCeramicosDuplicados[index].Elementos,
          Compostos: MateriaisCeramicosDuplicados[index].Compostos,
        };
      });
    } else {
      if (!distanciasComId) {
        return null;
      } else {
        materiais = _.map(distanciasComId, function (distId) {
          let index = distId.Id - 1;
          return {
            Id: MateriaisCeramicosDuplicados[index].Id,
            Material: MateriaisCeramicosDuplicados[index].Material,
            TemperaturaSintetizacao:
              MateriaisCeramicosDuplicados[index].TemperaturaSintetizacao,
            EstruturaCristalina:
              MateriaisCeramicosDuplicados[index].EstruturaCristalina,
            ConstanteDieletrica:
              MateriaisCeramicosDuplicados[index].ConstanteDieletrica,
            FatorQualidade:
              MateriaisCeramicosDuplicados[index].FatorQualidade,
            FrequenciaMedicao:
              MateriaisCeramicosDuplicados[index].FrequenciaMedicao,
            VariacaoTemperaturaFrequenciaRessonante:
              MateriaisCeramicosDuplicados[index]
                .VariacaoTemperaturaFrequenciaRessonante,
            Referencia: MateriaisCeramicosDuplicados[index].Referencia,
            Elementos: MateriaisCeramicosDuplicados[index].Elementos,
            Compostos: MateriaisCeramicosDuplicados[index].Compostos,
            Distancia: distId.Distancia
          };
        });
      }
    }
    return materiais;
  };

  renderLista = () => {
    const {
      classes,
      frentePareto,
      listaDataPointsFrenteParetoGerada,
      tipoFrentePareto,
    } = this.props;

    let distanciasComId = listaDataPointsFrenteParetoGerada
      ? this.obterIdComDistancia(listaDataPointsFrenteParetoGerada)
      : null;

    let materiais = frentePareto
      ? this.obterMateriais(frentePareto, distanciasComId)
      : null;

    if (materiais && tipoFrentePareto === 'original') {
      materiais.sort(function (a, b) {
        return a.Id - b.Id;
      });
    } else if (materiais && tipoFrentePareto === 'nova') {
      materiais.sort(function (a, b) {
        return a.Distancia - b.Distancia;
      });
    }

    return (
      <div className={classes.list}>
        {materiais
          ? _.map(materiais, (material) => {
              return (
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Typography
                      className={classes.title}
                      color='textSecondary'
                      gutterBottom
                    >
                      <span>Id: {material.Id}</span>
                    </Typography>
                    <Typography
                      className={classes.pos}
                      variant='h5'
                      component='h2'
                    >
                      <span>{material.Material}</span>
                      <br />
                    </Typography>

                    <Typography component='p'>
                      {tipoFrentePareto === 'nova' ? (
                        <div>
                          <strong>
                            Distance to Pareto Front:
                            {/* Distância até a frente de pareto: */}
                          </strong>
                          <span className={classes.posicaoTexto}>
                            {material.Distancia.toFixed(2)}
                          </span>
                        </div>
                      ) : null}
                      <strong>
                        Relative Permittivity:
                        {/* Constante Dielétrica: */}
                      </strong>
                      <span className={classes.posicaoTexto}>
                        {material.ConstanteDieletrica}
                      </span>
                      <br />
                      <strong>
                        Quality Factor:
                        {/* Fator de Qualidade: */}
                      </strong>
                      <span className={classes.posicaoTexto}>
                        {material.FatorQualidade}
                      </span>
                      <br />
                      <strong>
                        Elements:
                        {/* Elementos: */}
                      </strong>
                      <span className={classes.posicaoTexto}>
                        {material.Elementos}
                      </span>
                      <br />
                      <strong>
                        Compounds:
                        {/* Compostos: */}
                      </strong>
                      <span className={classes.posicaoTexto}>
                        {material.Compostos}
                      </span>
                      <br />
                      <strong>
                        Measurement Frequency:
                        {/* Frequência de Medição: */}
                      </strong>
                      <span className={classes.posicaoTexto}>
                        {material.FrequenciaMedicao}
                      </span>
                      <br />
                      <strong>
                        Sintering Temperature:
                        {/* Temperatura Sintetização: */}
                      </strong>
                      <span className={classes.posicaoTexto}>
                        {material.TemperaturaSintetizacao}
                      </span>
                      <br />
                      <strong>
                        Crystal Structure:
                        {/* Estrutura Cristalina: */}
                      </strong>
                      <span className={classes.posicaoTexto}>
                        {material.EstruturaCristalina}
                      </span>
                      <br />
                      <strong>
                        Coefficient of Temperature Variation of Resonant
                        Frequency:
                        {/* Coeficiente da variação de temperatura da frequência
                        ressonante: */}
                      </strong>
                      <span className={classes.posicaoTexto}>
                        {material.VariacaoTemperaturaFrequenciaRessonante}
                      </span>
                      <br />
                      <strong>
                        Reference:
                        {/* Referência: */}
                      </strong>
                      <span className={classes.posicaoTexto}>
                        {material.Referencia}
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
            textAlign: 'center',
          }}
          variant='h5'
          gutterBottom
        >
          Pareto Front
          {/* Frente de Pareto */}
        </Typography>

        <Divider />
        <div className={classes.root}>{this.renderLista()}</div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(MenuLateralFrentePareto);
