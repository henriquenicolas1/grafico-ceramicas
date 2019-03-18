import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { MateriaisCeramicosDuplicados } from './lib/MateriaisCeramicosDuplicados.js';
import _ from 'lodash';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
    overflowX: 'auto'
  }
});

const formataString = string => {
  let texto = '';
  let lista = string.split(',');
  _.forEach(lista, function(value) {
    texto = texto + value.toString() + '; ';
  });
  return texto;
};

//Transformar em componente e colocar o loading
function TabelaCeramicas(props) {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Table>
        <colgroup>
          <col style={{ width: '9%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '9%' }} />
          <col style={{ width: '9%' }} />
          <col style={{ width: '9%' }} />
          <col style={{ width: '9%' }} />
          <col style={{ width: '9%' }} />
          <col style={{ width: '9%' }} />
          <col style={{ width: '9%' }} />
          <col style={{ width: '9%' }} />
          <col style={{ width: '9%' }} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>Id </TableCell>
            <TableCell>Material</TableCell>
            <TableCell>ST (◦C)</TableCell>
            <TableCell>Estrutura Cristalina</TableCell>
            <TableCell>𝜀r</TableCell>
            <TableCell>Qf (GHz)</TableCell>
            <TableCell>f0 </TableCell>
            <TableCell>𝜏f </TableCell>
            <TableCell> Referência </TableCell>
            <TableCell> Elementos </TableCell>
            <TableCell> Compostos </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {MateriaisCeramicosDuplicados.map(material => (
            <TableRow key={material.id}>
              <TableCell component='th' scope='row'>
                {material.Id}
              </TableCell>
              <TableCell>{material.Material}</TableCell>
              <TableCell>{material.TemperaturaSintetizacao}</TableCell>
              <TableCell>{material.EstruturaCristalina}</TableCell>
              <TableCell>{material.ConstanteDieletrica}</TableCell>
              <TableCell>{material.FatorQualidade}</TableCell>
              <TableCell>{material.FrequenciaMedicao}</TableCell>
              <TableCell>
                {material.VariacaoTemperaturaFrequenciaRessonante}
              </TableCell>
              <TableCell>{material.Referencia}</TableCell>
              <TableCell>{formataString(material.Elementos)}</TableCell>
              <TableCell>{formataString(material.Compostos)} </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

TabelaCeramicas.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TabelaCeramicas);
