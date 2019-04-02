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
var distance = require('euclidean-distance');

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class Graficos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPointsFrenteParetoOriginal: null,
      quantidadePontosOriginal: null
    };
  }

  verificaSeIncluiMaterialLogicaE = (listaSelecionados, listaDoMaterial) => {
    if (listaSelecionados.length > listaDoMaterial.length) return false;

    for (var i = 0; i < listaSelecionados.length; i++) {
      if (!listaDoMaterial.includes(listaSelecionados[i])) {
        return false;
      }
    }
    return true;
  };

  verificaSeIncluiMaterialLogicaOu = (listaSelecionados, listaDoMaterial) => {
    for (var i = 0; i < listaSelecionados.length; i++) {
      if (listaDoMaterial.includes(listaSelecionados[i])) {
        return true;
      }
    }
    return false;
  };

  obterListaSelecionados = objetoSelecionados => {
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
    _.forEach(MateriaisCeramicosDuplicados, function(material) {
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
                    <b>Elementos: </b>${material.Elementos}<br/>
                    <b>Compostos: </b>${material.Compostos}`
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
                  <b>Elementos: </b>${material.Elementos}<br/>
                  <b>Compostos: </b>${material.Compostos}`
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

  imprimeValores = MateriaisCeramicosDuplicados => {
    let arrayFinal = [];
    _.forEach(MateriaisCeramicosDuplicados, function(material) {
      let arrayMateriais = material.Compostos.split(',');
      let arrayIntermediario = arrayFinal.concat(arrayMateriais);
      arrayFinal = _.uniqWith(arrayIntermediario, _.isEqual);
    });
    //console.log(JSON.stringify(arrayFinal));
    // _.map(arrayFinal, item => {
    //   console.log(item);
    // });
  };

  obterOpcoesGrafico = (listaMateriais, titulo, tituloX, tituloY) => {
    return {
      theme: 'dark2',
      height: 520,
      animationEnabled: true,
      zoomEnabled: true,
      zoomType: 'xy',
      title: {
        text: titulo,
        fontSize: 35
      },
      axisX: {
        title: tituloX,
        titleFontSize: 25,
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      axisY: {
        title: tituloY,
        titleFontSize: 25,
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      data: [
        {
          type: 'scatter',
          markerSize: 15,
          dataPoints: listaMateriais
        }
      ]
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
    listaMateriaisParetoOriginal.sort(function(a, b) {
      return a.x - b.x;
    });

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
        fontSize: 35
      },
      axisX: {
        title: tituloX,
        titleFontSize: 25,
        minimum: -8,
        maximum: 2800,
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      axisY: {
        title: tituloY,
        titleFontSize: 25,
        minimum: -8,
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      data: [
        {
          type: 'spline',
          showInLegend: true,
          name: 'Frente Pareto Original',
          color: 'red',
          dataPoints: listaMateriaisParetoOriginal
        },
        {
          type: 'scatter',
          showInLegend: true,
          legendText: 'Frente Pareto do Filtro',
          color: 'yellow',
          name: 'Frente Pareto do Filtro',
          dataPoints: listaParetoAtual
        },
        {
          type: 'scatter',
          showInLegend: true,
          legendText: 'Outros materiais',
          color: 'blue',
          name: 'Outros materiais',
          dataPoints: listaOutrosPontos
        }
      ]
    };
  };

  obterMateriaisFormatoEntradaFrenteDePareto = materiais => {
    let lista = [];
    _.forEach(materiais, function(material) {
      let listaInterna = [material.x, material.y];
      lista.push(listaInterna);
    });
    return lista;
  };

  obterListaEmFormatoString = listaPontos => {
    let lista = [];
    _.forEach(listaPontos, function(ponto) {
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
    _.forEach(listaDePontosResultadoFrenteParetoString, function(ponto) {
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
      markerSize: null
    };
    var selfCalcula = this;
    _.forEach(listaDeMateriais, function(dataPoint) {
      if (
        listaIndexDoResultadoFrentePareto.includes(indexLoop) &&
        dataPointsFrenteParetoOriginal === null
      ) {
        novoDataPoint = {
          x: dataPoint.x,
          y: dataPoint.y,
          toolTipContent: dataPoint.toolTipContent,
          markerSize: 15,
          color: 'red'
        };
        listaFrenteParetoOriginal.push(novoDataPoint);
        materiasFrentePareto.push(dataPoint);
      } else if (
        listaIndexDoResultadoFrentePareto.includes(indexLoop) &&
        dataPointsFrenteParetoOriginal !== null
      ) {
        let pontoAtual = [dataPoint.x, dataPoint.y];
        let distanciaEuclidiana = selfCalcula.obterDistanciaEclidiana(
          pontoAtual
        );
        novoDataPoint = {
          x: dataPoint.x,
          y: dataPoint.y,
          toolTipContent:
            `<b>Informações material</b> <br/>` +
            dataPoint.toolTipContent +
            `<br/> <b>Distância do material da frente mais próximo: </b> ${distanciaEuclidiana.distanciaEclidiana.toFixed(
              2
            )} <br/>` +
            ` <br> <b>Informações material frente de pareto mais próximo</b> <br/>` +
            distanciaEuclidiana.pontoMaisProximo,
          markerSize: 12,
          color: 'yellow'
        };
        listaFrenteParetoNova.push(novoDataPoint);
      } else {
        novoDataPoint = {
          x: dataPoint.x,
          y: dataPoint.y,
          toolTipContent: dataPoint.toolTipContent,
          markerSize: 5,
          color: 'blue'
        };
        listaOutrosPontos.push(novoDataPoint);
      }
      indexLoop++;
    });
    if (!dataPointsFrenteParetoOriginal) {
      this.setState({
        dataPointsFrenteParetoOriginal: listaFrenteParetoOriginal,
        quantidadePontosOriginal:
          listaFrenteParetoOriginal.length + listaOutrosPontos.length
      });
    }

    return {
      pontosParetoOriginal: listaFrenteParetoOriginal,
      pontosPareto: listaFrenteParetoNova,
      pontosNormal: listaOutrosPontos
    };
  };

  obterDistanciaEclidiana = pontoAtual => {
    let dataPoints = this.state.dataPointsFrenteParetoOriginal;
    console.log(dataPoints);
    let listaPontos = _.map(dataPoints, function(dataPoint) {
      return [dataPoint.x, dataPoint.y];
    });
    let listaDistancias = _.map(listaPontos, function(ponto) {
      console.log('/n');
      console.log('ponto da lista: ', ponto);
      console.log('ponto atual: ', pontoAtual);
      let distanciaCalculada = distance(ponto, pontoAtual);
      console.log('distancia calculada: ', distanciaCalculada);
      return distanciaCalculada;
    });

    let distancia = _.min(listaDistancias);
    let indiceDistancia = listaDistancias.indexOf(distancia);
    let pontoMaisProximo = dataPoints[indiceDistancia];
    //console.log(distancia)
    return {
      distanciaEclidiana: distancia,
      pontoMaisProximo: pontoMaisProximo.toolTipContent.toString()
    };
  };

  shouldComponentUpdate = nextProps => {
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
      tipoFiltroLogico
    } = this.props;

    const {
      dataPointsFrenteParetoOriginal,
      quantidadePontosOriginal
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
          Total de materiais: {materiais.length}
        </Typography>
        <Typography
          variant='h6'
          gutterBottom
          style={{ display: 'inline-block' }}
        >
          Total na Frente de Pareto: {listaIndexDoResultadoFrentePareto.length}
        </Typography>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Gráfico Normal</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <CanvasJSChart
              options={this.obterOpcoesGrafico(
                materiais,
                'Fator de Qualidade - Qf (GHz) vs Constante Dielétrica - εr',
                'Constante Dielétrica',
                'Fator de Qualidade (Q*GHz)'
              )}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              Gráfico Frente de Pareto
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
                'Fator de Qualidade - Qf (GHz) vs Constante Dielétrica - εr',
                'Constante Dielétrica',
                'Fator de Qualidade (Q*GHz)'
              )}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              Gráfico Logaritmo
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <CanvasJSChart
              options={this.obterOpcoesGrafico(
                materiaisLog,
                'Fator de Qualidade - Qf (GHz) vs Constante Dielétrica - εr',
                'Log(εr)',
                'Log(Qf)'
              )}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        {this.imprimeValores(MateriaisCeramicosDuplicados)}
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
});

export default withStyles(styles)(Graficos);
