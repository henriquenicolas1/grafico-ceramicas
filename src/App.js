import React, { Component } from 'react';
import './App.css';
import Graficos from './Graficos.js';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { ListaElementos } from './lib/ListaElementos';
import _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elementos: {
        Al: true,
        P: true,
        O: true,
        Mg: true,
        F: true,
        Li: true,
        C: true,
        B: true,
        Si: true,
        Ca: true,
        K: true,
        Ga: true,
        Ge: true,
        Sr: true,
        Cu: true,
        Na: true,
        Mo: true,
        Bi: true,
        Ba: true,
        Fe: true,
        Yb: true,
        L: true,
        M: true,
        Zn: true,
        H: true,
        Ti: true,
        Zr: true,
        W: true,
        Ta: true,
        Ni: true,
        Sb: true,
        La: true,
        V: true,
        Y: true,
        Te: true,
        Sn: true,
        Pb: true,
        Nd: true,
        S: true,
        Co: true,
        Mn: true,
        Sm: true,
        Hf: true,
        Us: true,
        Dy: true,
        Ho: true,
        N: true,
        Tb: true,
        Ag: true,
        Nb: true,
        T: true,
        Cd: true,
        In: true,
        Fl: true,
        Cr: true,
        Vo: true,
        Ce: true,
        Er: true,
        Tm: true,
        So: true,
        Pr: true,
        Eu: true,
        Gd: true,
        Wx: true,
        Lu: true,
        Pe: true,
        Rb: true,
        Z: true,
        Sc: true,
        E: true,
        Be: true,
        X: true,
        Ph: true
      }
    };
  }

  handleChange = name => event => {
    let valor = event.target.checked;
    this.setState(prevState => ({
      elementos: {
        ...prevState.elementos,
        [name]: valor
      }
    }));
  };

  render() {
    return (
      <div className='App'>
        <Graficos elementosSelecionados={this.state.elementos} />
        {_.map(ListaElementos, elemento => {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.elementos[elemento]}
                  onChange={this.handleChange(elemento)}
                  value={elemento}
                  color='primary'
                />
              }
              label={elemento}
            />
          );
        })}
      </div>
    );
  }
}

export default App;
