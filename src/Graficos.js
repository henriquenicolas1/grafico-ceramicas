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

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
//TODO verificar comportamento do filtro. Como ele funciona como um `OU` os filtros talvez não deveriam ter relação entre si
class Graficos extends Component {
  constructor(props) {
    super(props);
    this.state = { Al: true };
  }

  calculaDataPoints = (
    MateriaisCeramicosDuplicados,
    elementosSelecionados,
    compostosSelecionados,
    tipoGrafico
  ) => {
    let listaFinal = [];
    _.forEach(MateriaisCeramicosDuplicados, function(material) {
      let listaElementosDoMaterial = material.Elementos.split(',');
      let listaCompostosDoMaterial = material.Compostos.split(',');
      let deveRetornar = false;
      let dataPoint;

      for (var i = 0; i < listaElementosDoMaterial.length; i++) {
        if (elementosSelecionados[listaElementosDoMaterial[i]]) {
          deveRetornar = true;
          break;
        }
      }

      for (var j = 0; j < listaCompostosDoMaterial.length; j++) {
        if (compostosSelecionados[listaCompostosDoMaterial[j]]) {
          deveRetornar = true;
          break;
        }
      }

      if (deveRetornar) {
        if (tipoGrafico === 'normal') {
          dataPoint = {
            x: material.ConstanteDieletrica,
            y: material.FatorQualidade ? material.FatorQualidade : 0,
            toolTipContent: `
                    <b>Id: </b> ${material.Id} <br/>
                    <b>Material: </b> ${material.Material} <br/>
                    <b>εr: </b>{x}<br/>
                    <b>Qf: </b>{y}`
          };
        } else {
          dataPoint = {
            x: Math.log(material.ConstanteDieletrica),
            y: material.FatorQualidade ? Math.log(material.FatorQualidade) : 0,
            toolTipContent: `
                  <b>Id: </b> ${material.Id} <br/>
                  <b>Material: </b> ${material.Material} <br/>
                  <b>εr: </b>{x}<br/>
                  <b>Qf: </b>{y}`
          };
        }

        listaFinal.push(dataPoint);
      }
    });
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
      height: 600,
      animationEnabled: true,
      zoomEnabled: true,
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

  shouldComponentUpdate = (nextProps, nextState) => {
    if (
      nextProps.elementosSelecionados !== this.props.elementosSelecionados ||
      nextProps.compostosSelecionados !== this.props.compostosSelecionados
    ) {
      return true;
    }
    return false;
  };

  render() {
    const {
      classes,
      elementosSelecionados,
      compostosSelecionados
    } = this.props;

    console.log(compostosSelecionados);
    const materiais = this.calculaDataPoints(
      MateriaisCeramicosDuplicados,
      elementosSelecionados,
      compostosSelecionados,
      'normal'
    );

    const materiaisLog = this.calculaDataPoints(
      MateriaisCeramicosDuplicados,
      elementosSelecionados,
      compostosSelecionados,
      'logaritmo'
    );

    return (
      <div className={classes.root}>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Gráfico 1</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <CanvasJSChart
              options={this.obterOpcoesGrafico(
                materiais,
                'Fator de Qualidade - Qf (GHz) vs Constante Dielétrica - εr',
                'Constante Dielétrica',
                'Fator de Qualidade (GHz)'
              )}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Gráfico 2</Typography>
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
