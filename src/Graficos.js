import React, { Component } from 'react';
import CanvasJSReact from './canvasjs.react';
import { MateriaisCeramicosDuplicados } from './lib/MateriaisCeramicosDuplicados.js';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import _ from 'lodash';
const pf = require('pareto-frontier');

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class Graficos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPointsFrenteParetoOriginal: null,
      quantidadePontosOriginal: null,
    };
  }

  verificaSeIncluiMaterialLogicaE = (listaSelecionados, listaDoMaterial) => {
    if (listaSelecionados.length > listaDoMaterial.length) return false;

    for (let i = 0; i < listaSelecionados.length; i++) {
      if (!listaDoMaterial.includes(listaSelecionados[i])) {
        return false;
      }
    }
    return true;
  };

  verificaSeIncluiMaterialLogicaOu = (listaSelecionados, listaDoMaterial) => {
    for (let i = 0; i < listaSelecionados.length; i++) {
      if (listaDoMaterial.includes(listaSelecionados[i])) {
        return true;
      }
    }
    return false;
  };

  obterListaSelecionados = (objetoSelecionados) => {
    let listaSelecionados = [];

    for (var chave in objetoSelecionados) {
      if (objetoSelecionados[chave]) {
        listaSelecionados.push(chave);
      }
    }
    return listaSelecionados;
  };

  calculaDataPoints = (
    MateriaisCeramicosDuplicados,
    elementosSelecionados,
    compostosSelecionados,
    tipoFiltroCategoria,
    tipoFiltroLogico,
    tipoGrafico
  ) => {
    let listaFinal = [];
    var self = this;
    _.forEach(MateriaisCeramicosDuplicados, function (material) {
      let listaDoMaterial =
        tipoFiltroCategoria === 'elementos'
          ? material.Elementos.split(',')
          : material.Compostos.split(',');

      let listaSelecionados =
        tipoFiltroCategoria === 'elementos'
          ? self.obterListaSelecionados(elementosSelecionados)
          : self.obterListaSelecionados(compostosSelecionados);

      let deveRetornarMaterial =
        tipoFiltroLogico === 'filtroOU'
          ? self.verificaSeIncluiMaterialLogicaOu(
              listaSelecionados,
              listaDoMaterial
            )
          : self.verificaSeIncluiMaterialLogicaE(
              listaSelecionados,
              listaDoMaterial
            );

      let dataPoint;

      if (deveRetornarMaterial) {
        if (tipoGrafico === 'normal') {
          dataPoint = {
            x: material.ConstanteDieletrica,
            y: material.FatorQualidade ? material.FatorQualidade : 0,
            toolTipContent: `
                    <b>Id: </b> ${material.Id} <br/>
                    <b>Material: </b> ${material.Material} <br/>
                    <b>εr: </b>${material.ConstanteDieletrica}<br/>
                    <b>Qf: </b>${material.FatorQualidade}<br/>
                    <b>Elements: </b>${material.Elementos}<br/>
                    <b>Compounds: </b>${material.Compostos}`,
          };
        } else {
          dataPoint = {
            x: Math.log(material.ConstanteDieletrica),
            y: material.FatorQualidade ? Math.log(material.FatorQualidade) : 0,
            toolTipContent: `
                  <b>Id: </b> ${material.Id} <br/>
                  <b>Material: </b> ${material.Material} <br/>
                  <b>εr: </b>${material.ConstanteDieletrica}<br/>
                  <b>Qf: </b>${material.FatorQualidade}<br/>
                  <b>Log(εr): </b>{x}<br/>
                  <b>Log(Qf): </b>{y}<br/>
                  <b>Elements: </b>${material.Elementos}<br/>
                  <b>Compounds: </b>${material.Compostos}`,
          };
        }

        listaFinal.push(dataPoint);
      }
    });
    if (!this.state.quantidadePontosOriginal) {
      this.setState({ quantidadePontosOriginal: listaFinal.length });
    }
    return listaFinal;
  };

  // imprimeValores = MateriaisCeramicosDuplicados => {
  //   let arrayFinal = [];
  //   _.forEach(MateriaisCeramicosDuplicados, function(material) {
  //     let arrayMateriais = material.Compostos.split(',');
  //     let arrayIntermediario = arrayFinal.concat(arrayMateriais);
  //     arrayFinal = _.uniqWith(arrayIntermediario, _.isEqual);
  //   });
  //   console.log(JSON.stringify(arrayFinal));
  //    _.map(arrayFinal, item => {
  //      console.log(item);
  //    });
  // };

  obterOpcoesGrafico = (listaMateriais, titulo, tituloX, tituloY) => {
    return {
      theme: 'dark2',
      height: 520,
      animationEnabled: true,
      zoomEnabled: true,
      zoomType: 'xy',
      title: {
        text: titulo,
        fontSize: 35,
      },
      axisX: {
        title: tituloX,
        titleFontSize: 25,
        crosshair: {
          enabled: true,
          snapToDataPoint: true,
        },
      },
      axisY: {
        title: tituloY,
        titleFontSize: 25,
        crosshair: {
          enabled: true,
          snapToDataPoint: true,
        },
      },
      data: [
        {
          type: 'scatter',
          markerSize: 15,
          dataPoints: listaMateriais,
        },
      ],
    };
  };

  obterOpcoesGraficoFrentePareto = (
    listaMateriaisParetoOriginal,
    listaNovosMateriaisPareto,
    listaOutrosPontos,
    quantidadePontosOriginal,
    titulo,
    tituloX,
    tituloY
  ) => {
    let quantidadeDePontos =
      listaNovosMateriaisPareto.length + listaOutrosPontos.length;
    let listaParetoAtual =
      !quantidadePontosOriginal ||
      quantidadePontosOriginal === quantidadeDePontos
        ? []
        : listaNovosMateriaisPareto;

    return {
      theme: 'dark2',
      height: 520,
      animationEnabled: true,
      zoomEnabled: true,
      zoomType: 'xy',
      title: {
        text: titulo,
        fontSize: 35,
      },
      axisX: {
        title: tituloX,
        titleFontSize: 25,
        minimum: -8,
        maximum: 2800,
        crosshair: {
          enabled: true,
          snapToDataPoint: true,
        },
      },
      axisY: {
        title: tituloY,
        titleFontSize: 25,
        minimum: -8,
        crosshair: {
          enabled: true,
          snapToDataPoint: true,
        },
      },
      data: [
        {
          type: 'spline',
          showInLegend: true,
          name: 'Original Pareto Front',
          color: 'red',
          dataPoints: listaMateriaisParetoOriginal,
        },
        {
          type: 'scatter',
          showInLegend: true,
          legendText: 'Filtered Pareto Front',
          color: 'yellow',
          name: 'Filtered Pareto Front',
          dataPoints: listaParetoAtual,
        },
        {
          type: 'scatter',
          showInLegend: true,
          legendText: 'Other materials',
          color: 'blue',
          name: 'Other materials',
          dataPoints: listaOutrosPontos,
        },
      ],
    };
  };

  obterMateriaisFormatoEntradaFrenteDePareto = (materiais) => {
    let lista = [];
    _.forEach(materiais, function (material) {
      let listaInterna = [material.x, material.y];
      lista.push(listaInterna);
    });
    return lista;
  };

  obterListaEmFormatoString = (listaPontos) => {
    let lista = [];
    _.forEach(listaPontos, function (ponto) {
      let valor = ponto[0].toString() + ';' + ponto[1].toString();
      lista.push(valor);
    });
    return lista;
  };

  obterIndexFrentePareto = (
    listaDePontosDosMateriaisString,
    listaDePontosResultadoFrenteParetoString
  ) => {
    let lista = [];
    _.forEach(listaDePontosResultadoFrenteParetoString, function (ponto) {
      let index = listaDePontosDosMateriaisString.indexOf(ponto);
      lista.push(index);
    });
    return lista;
  };

  calculaDataPointsFrentePareto = (
    listaDeMateriais,
    listaIndexDoResultadoFrentePareto,
    dataPointsFrenteParetoOriginal
  ) => {
    let listaFrenteParetoOriginal = [];
    let materiasFrentePareto = [];
    let listaFrenteParetoNova = [];
    let listaOutrosPontos = [];
    let indexLoop = 0;
    let novoDataPoint = {
      x: null,
      y: null,
      toolTipContent: null,
      color: null,
      markerSize: null,
    };
    let self = this;
    _.forEach(listaDeMateriais, function (dataPoint) {
      if (
        listaIndexDoResultadoFrentePareto.includes(indexLoop) &&
        dataPointsFrenteParetoOriginal === null
      ) {
        novoDataPoint = {
          x: dataPoint.x,
          y: dataPoint.y,
          toolTipContent: dataPoint.toolTipContent,
          markerSize: 15,
          color: 'red',
        };
        listaFrenteParetoOriginal.push(novoDataPoint);
        materiasFrentePareto.push(dataPoint);
      } else if (
        listaIndexDoResultadoFrentePareto.includes(indexLoop) &&
        dataPointsFrenteParetoOriginal !== null
      ) {
        let distanciaEuclidiana = self.obterDistanciaEclidiana(dataPoint);

        novoDataPoint = {
          x: dataPoint.x,
          y: dataPoint.y,
          toolTipContent:
            dataPoint.toolTipContent +
            `<br/> <b>Distance to Pareto Front: </b> ${distanciaEuclidiana.toFixed(
              2
            )} <br/>`,
          markerSize: 12,
          color: 'yellow',
          distancia: distanciaEuclidiana,
        };
        listaFrenteParetoNova.push(novoDataPoint);
      } else {
        novoDataPoint = {
          x: dataPoint.x,
          y: dataPoint.y,
          toolTipContent: dataPoint.toolTipContent,
          markerSize: 5,
          color: 'blue',
        };
        listaOutrosPontos.push(novoDataPoint);
      }
      indexLoop++;
    });
    if (!dataPointsFrenteParetoOriginal) {
      listaFrenteParetoOriginal.sort(function (a, b) {
        return a.x - b.x;
      });

      this.setState({
        dataPointsFrenteParetoOriginal: listaFrenteParetoOriginal,
        quantidadePontosOriginal:
          listaFrenteParetoOriginal.length + listaOutrosPontos.length,
      });

      this.props.alteraEstadoAppFrenteParetoOriginal(
        listaIndexDoResultadoFrentePareto
      );
    } else {
      this.props.alteraEstadoAppFrenteParetoNova(
        listaIndexDoResultadoFrentePareto
      );
    }
    this.props.alteraEstadoAppListaDataPoninsFrenteParetoGerada(
      listaFrenteParetoNova
    );
    return {
      pontosParetoOriginal: listaFrenteParetoOriginal,
      pontosPareto: listaFrenteParetoNova,
      pontosNormal: listaOutrosPontos,
    };
  };

  obterDistanciaEclidiana = (pontoAtual) => {
    let listaDistancias = [];
    let listaFrenteParetoOriginal = this.state.dataPointsFrenteParetoOriginal;

    for (let i = 0; i < listaFrenteParetoOriginal.length - 1; i++) {
      let p = { x: pontoAtual.x, y: pontoAtual.y };
      let v = {
        x: listaFrenteParetoOriginal[i].x,
        y: listaFrenteParetoOriginal[i].y,
      };
      let w = {
        x: listaFrenteParetoOriginal[i + 1].x,
        y: listaFrenteParetoOriginal[i + 1].y,
      };

      let distanciaCalculada = this.distToSegment(p, v, w);
      listaDistancias.push(distanciaCalculada);
    }
    return _.min(listaDistancias);
  };

  sqr = (x) => {
    return x * x;
  };

  dist2 = (v, w) => {
    return this.sqr(v.x - w.x) + this.sqr(v.y - w.y);
  };

  distToSegmentSquared = (p, v, w) => {
    var l2 = this.dist2(v, w);
    if (l2 === 0) {
      return this.dist2(p, v);
    }
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return this.dist2(p, {
      x: v.x + t * (w.x - v.x),
      y: v.y + t * (w.y - v.y),
    });
  };

  distToSegment = (p, v, w) => {
    return Math.sqrt(this.distToSegmentSquared(p, v, w));
  };

  shouldComponentUpdate = (nextProps) => {
    if (
      nextProps.elementosSelecionados !== this.props.elementosSelecionados ||
      nextProps.compostosSelecionados !== this.props.compostosSelecionados ||
      nextProps.tipoFiltroCategoria !== this.props.tipoFiltroCategoria ||
      nextProps.tipoFiltroLogico !== this.props.tipoFiltroLogico
    ) {
      return true;
    }
    return false;
  };

  render() {
    const {
      classes,
      elementosSelecionados,
      compostosSelecionados,
      tipoFiltroCategoria,
      tipoFiltroLogico,
    } = this.props;

    const {
      dataPointsFrenteParetoOriginal,
      quantidadePontosOriginal,
    } = this.state;

    const materiais = this.calculaDataPoints(
      MateriaisCeramicosDuplicados,
      elementosSelecionados,
      compostosSelecionados,
      tipoFiltroCategoria,
      tipoFiltroLogico,
      'normal'
    );

    const materiaisLog = this.calculaDataPoints(
      MateriaisCeramicosDuplicados,
      elementosSelecionados,
      compostosSelecionados,
      tipoFiltroCategoria,
      tipoFiltroLogico,
      'logaritmo'
    );

    const materiaisEmFormatoDeEntradaFrenteDePareto = this.obterMateriaisFormatoEntradaFrenteDePareto(
      materiais
    );

    const resultadoMateriaisFrenteDePareto = pf.getParetoFrontier(
      materiaisEmFormatoDeEntradaFrenteDePareto
    );

    const listaDePontosDosMateriaisString = this.obterListaEmFormatoString(
      materiaisEmFormatoDeEntradaFrenteDePareto
    );
    const listaDePontosResultadoFrenteParetoString = this.obterListaEmFormatoString(
      resultadoMateriaisFrenteDePareto
    );

    const listaIndexDoResultadoFrentePareto = this.obterIndexFrentePareto(
      listaDePontosDosMateriaisString,
      listaDePontosResultadoFrenteParetoString
    );

    const materiaisResultadoFrentePareto = this.calculaDataPointsFrentePareto(
      materiais,
      listaIndexDoResultadoFrentePareto,
      dataPointsFrenteParetoOriginal
    );

    return (
      <div className={classes.root}>
        <Typography
          variant='h6'
          gutterBottom
          style={{ display: 'inline-block', marginRight: '80px' }}
        >
          Total materials: {materiais.length}
          {/* Total de materiais: {materiais.length} */}
        </Typography>
        <Typography
          variant='h6'
          gutterBottom
          style={{ display: 'inline-block' }}
        >
          Total Pareto Front: {listaIndexDoResultadoFrentePareto.length}
          {/* Total na Frente de Pareto: {listaIndexDoResultadoFrentePareto.length} */}
        </Typography>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              Normal Chart
              {/* Gráfico Normal */}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <CanvasJSChart
              options={this.obterOpcoesGrafico(
                materiais,
                'Quality Factor Qf (GHz) vs Relative Permittivity εr',
                'Relative Permittivity',
                'Quality Factor (Q*GHz)'
              )}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              Pareto Front Chart
              {/* Gráfico Frente de Pareto */}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <CanvasJSChart
              options={this.obterOpcoesGraficoFrentePareto(
                dataPointsFrenteParetoOriginal
                  ? dataPointsFrenteParetoOriginal
                  : materiaisResultadoFrentePareto.pontosParetoOriginal,
                materiaisResultadoFrentePareto.pontosPareto,
                materiaisResultadoFrentePareto.pontosNormal,
                quantidadePontosOriginal,
                'Quality Factor Qf (GHz) vs Relative Permittivity εr',
                'Relative Permittivity',
                'Quality Factor (Q*GHz)'
              )}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              Log Chart
              {/* Gráfico Logaritmo */}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <CanvasJSChart
              options={this.obterOpcoesGrafico(
                materiaisLog,
                'Quality Factor Qf (GHz) vs Relative Permittivity εr',
                'Log(εr)',
                'Log(Qf)'
              )}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        {/* {this.imprimeValores(MateriaisCeramicosDuplicados)} */}
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

export default withStyles(styles)(Graficos);
