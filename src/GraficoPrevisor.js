import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { MateriaisCeramicosDuplicados } from './lib/MateriaisCeramicosDuplicados.js';
import CanvasJSReact from './canvasjs.react';
import _ from 'lodash';
const pf = require('pareto-frontier');

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function GraficoPrevisor(props) {
  const [
    quantidadePontosOriginal,
    setQuantidadePontosOriginal,
  ] = React.useState(null);

  const calculaDataPoints = (listaMateriais) => {
    let listaFinal = [];
    _.forEach(listaMateriais, function (material) {
      let stringToolTip = '';
      if (material.Id) {
        stringToolTip = stringToolTip + `<b>Id: </b> ${material.Id} <br/>`;
      }
      let dataPoint = {
        x: material.ConstanteDieletrica,
        y: material.FatorQualidade ? material.FatorQualidade : 0,
        toolTipContent:
          stringToolTip +
          `<b>Material: </b> ${material.Material} <br/>
                    <b>εr: </b>${material.ConstanteDieletrica}<br/>
                    <b>Qf: </b>${material.FatorQualidade}<br/>
                    <b>Elements: </b>${material.Elementos}<br/>
                    <b>Compounds: </b>${material.Compostos}`,
      };

      listaFinal.push(dataPoint);
    });
    if (!quantidadePontosOriginal) {
      setQuantidadePontosOriginal(listaFinal.length);
    }
    return listaFinal;
  };

  const obterMateriaisFormatoEntradaFrenteDePareto = (materiais) => {
    let lista = [];
    _.forEach(materiais, function (material) {
      let listaInterna = [material.x, material.y];
      lista.push(listaInterna);
    });
    return lista;
  };

  const obterListaEmFormatoString = (listaPontos) => {
    let lista = [];
    _.forEach(listaPontos, function (ponto) {
      let valor = ponto[0].toString() + ';' + ponto[1].toString();
      lista.push(valor);
    });
    return lista;
  };

  const obterIndexFrentePareto = (
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

  const calculaDataPointsFrentePareto = (
    listaDeMateriais,
    listaIndexDoResultadoFrentePareto
  ) => {
    let listaFrenteParetoOriginal = [];
    let listaOutrosPontos = [];
    let indexLoop = 0;
    let novoDataPoint = {
      x: null,
      y: null,
      toolTipContent: null,
      color: null,
      markerSize: null,
    };
    _.forEach(listaDeMateriais, function (dataPoint) {
      if (listaIndexDoResultadoFrentePareto.includes(indexLoop)) {
        novoDataPoint = {
          x: dataPoint.x,
          y: dataPoint.y,
          toolTipContent: dataPoint.toolTipContent,
          markerSize: 15,
          color: 'red',
        };
        listaFrenteParetoOriginal.push(novoDataPoint);
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
    listaFrenteParetoOriginal.sort(function (a, b) {
      return a.x - b.x;
    });
    return {
      pontosParetoOriginal: listaFrenteParetoOriginal,
      pontosNormal: listaOutrosPontos,
    };
  };

  //Concatenar com a lista dos novos materiais que vão chegar via props
  const materiais = calculaDataPoints(MateriaisCeramicosDuplicados);

  const materiaisEmFormatoDeEntradaFrenteDePareto = obterMateriaisFormatoEntradaFrenteDePareto(
    materiais
  );

  const resultadoMateriaisFrenteDePareto = pf.getParetoFrontier(
    materiaisEmFormatoDeEntradaFrenteDePareto
  );

  const listaDePontosDosMateriaisString = obterListaEmFormatoString(
    materiaisEmFormatoDeEntradaFrenteDePareto
  );
  const listaDePontosResultadoFrenteParetoString = obterListaEmFormatoString(
    resultadoMateriaisFrenteDePareto
  );

  const listaIndexDoResultadoFrentePareto = obterIndexFrentePareto(
    listaDePontosDosMateriaisString,
    listaDePontosResultadoFrenteParetoString
  );

  const materiaisResultadoFrentePareto = calculaDataPointsFrentePareto(
    materiais,
    listaIndexDoResultadoFrentePareto
  );

  const materiaisNovos = props.listaCompostosCriados.length
    ? calculaDataPoints(props.listaCompostosCriados)
    : [];

  const calculaDataPointsNovosCompostos = (materiaisNovos) => {
    let listaNovosCompostos = [];
    _.forEach(materiaisNovos, function (dataPoint) {
      let novoDataPoint = {
        x: null,
        y: null,
        toolTipContent: null,
        color: null,
        markerSize: null,
      };

      let distanciaEuclidiana = obterDistanciaEclidiana(dataPoint);

      novoDataPoint = {
        x: dataPoint.x,
        y: dataPoint.y,
        toolTipContent:
          dataPoint.toolTipContent +
          `<br/> <b>Distance to Pareto Front: </b> ${distanciaEuclidiana.toFixed(
            2
          )} <br/>`,
        markerSize: 17,
        color: '#7FFFD4',
      };
      listaNovosCompostos.push(novoDataPoint);
    });

    return listaNovosCompostos;
  };

  const obterDistanciaEclidiana = (pontoAtual) => {
    let listaDistancias = [];
    let listaFrenteParetoOriginal =
      materiaisResultadoFrentePareto.pontosParetoOriginal;

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

      let distanciaCalculada = distToSegment(p, v, w);
      listaDistancias.push(distanciaCalculada);
    }
    return _.min(listaDistancias);
  };

  const sqr = (x) => {
    return x * x;
  };

  const dist2 = (v, w) => {
    return sqr(v.x - w.x) + sqr(v.y - w.y);
  };

  const distToSegmentSquared = (p, v, w) => {
    var l2 = dist2(v, w);
    if (l2 === 0) {
      return dist2(p, v);
    }
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, {
      x: v.x + t * (w.x - v.x),
      y: v.y + t * (w.y - v.y),
    });
  };

  const distToSegment = (p, v, w) => {
    return Math.sqrt(distToSegmentSquared(p, v, w));
  };

  const listaMateriaisNovos = calculaDataPointsNovosCompostos(materiaisNovos);

  const obterOpcoesGraficoFrenteParetoNovosMateriais = (
    listaMateriaisParetoOriginal,
    listaOutrosPontos,
    listaMateriaisNovos,
    titulo,
    tituloX,
    tituloY
  ) => {
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
          legendText: 'Other Materials',
          color: 'blue',
          name: 'Other Materials',
          dataPoints: listaOutrosPontos,
        },
        {
          type: 'scatter',
          showInLegend: true,
          legendText: 'New Materials',
          color: '#7FFFD4',
          name: 'New Materials',
          dataPoints: listaMateriaisNovos,
        },
      ],
    };
  };

  return (
    <div>
      <ExpansionPanel defaultExpanded={false}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Results Chart</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <CanvasJSChart
            options={obterOpcoesGraficoFrenteParetoNovosMateriais(
              materiaisResultadoFrentePareto.pontosParetoOriginal,
              materiaisResultadoFrentePareto.pontosNormal,
              listaMateriaisNovos,
              'Quality Factor Qf (GHz) vs Relative Permittivity εr',
              'Relative Permittivity',
              'Quality Factor (Q*GHz)'
            )}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

export default GraficoPrevisor;
