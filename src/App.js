import React, { Component } from 'react';
import './App.css';
import { MateriaisCeramicosDuplicados } from './lib/MateriaisCeramicosDuplicados.js';
import CanvasJSReact from './canvasjs.react';
import _ from 'lodash';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class App extends Component {
  calculaDataPointsComLabel = MateriaisCeramicosDuplicados => {
    return _.map(MateriaisCeramicosDuplicados, material => {
      return {
        x: material.ConstanteDieletrica,
        y: material.FatorQualidade ? material.FatorQualidade : 0,
        toolTipContent: `<b>Material: </b> ${
          material.Material
        } <br/><b>εr: </b>{x}<br/><b>Qf: </b>{y}`
      };
    });
  };

  calculaDataPointsLogaritmoComLabel = MateriaisCeramicosDuplicados => {
    return _.map(MateriaisCeramicosDuplicados, material => {
      if (material.FatorQualidade) {
        return {
          x: Math.log(material.ConstanteDieletrica),
          y: Math.log(material.FatorQualidade),
          toolTipContent: `<b>Material: </b> ${
            material.Material
          } <br/><b>εr: </b>{x}<br/><b>Qf: </b>{y}`
        };
      } else {
        return {
          x: 0,
          y: 0,
          toolTipContent: `<b>Material: </b> ${
            material.Material
          } <br/><b>εr: </b>${material.ConstanteDieletrica}<br/><b>Qf: </b>{y}`
        };
      }
    });
  };

  obterOpcoesGrafico = (listaMateriais, titulo, tituloX, tituloY) => {
    return {
      theme: 'dark2',
      animationEnabled: true,
      zoomEnabled: true,
      title: {
        text: titulo
      },
      axisX: {
        title: tituloX,
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      axisY: {
        title: tituloY,
        includeZero: false,
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      data: [
        {
          type: 'scatter',
          markerSize: 10,
          dataPoints: listaMateriais
        }
      ]
    };
  };

  render() {
    const materiais = this.calculaDataPointsComLabel(
      MateriaisCeramicosDuplicados
    );

    const materiaisLog = this.calculaDataPointsLogaritmoComLabel(
      MateriaisCeramicosDuplicados
    );

    return (
      <div className='App'>
        <CanvasJSChart
          options={this.obterOpcoesGrafico(
            materiais,
            'Fator de Qualidade - Qf (GHz) vs Constante Dielétrica - εr',
            'Constante Dielétrica',
            'Fator de Qualidade (GHz)'
          )}
        />
        <br />
        <CanvasJSChart
          options={this.obterOpcoesGrafico(
            materiaisLog,
            'Fator de Qualidade - Qf (GHz) vs Constante Dielétrica - εr',
            'Log(εr)',
            'Log(Qf)'
          )}
        />
      </div>
    );
  }
}

export default App;
