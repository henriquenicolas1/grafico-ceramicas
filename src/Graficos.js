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
                    <b>εr: </b>{x}<br/>
                    <b>Qf: </b>{y}<br/>
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
                  <b>εr: </b>{x}<br/>
                  <b>Qf: </b>{y}
                  <b>Elementos: </b>${material.Elementos}<br/>
                  <b>Compostos: </b>${material.Compostos}`
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
