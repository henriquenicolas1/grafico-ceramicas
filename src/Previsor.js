import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import { BodyEnvioAPI } from './lib/BodyEnvioAPI';
import { ListaOpcoesElementos } from './lib/ListaOpcoesElementos';
import LinearProgress from '@material-ui/core/LinearProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GraficoPrevisor from './GraficoPrevisor';

const styles = (theme) => ({
  root: {
    margin: 'auto',
    width: '25%',
    border: '1px solid',
    padding: '10px',
  },
  botaoAdicionar: {
    marginTop: '30px',
    marginBottom: '30px',
    marginLeft: '20px',
    marginRigth: '20px',
  },
  seletorElementoModal: {
    width: '90px',
  },
  seletorQuantidadeModal: {
    marginLeft: '20px',
  },
  loading: {
    marginBottom: '40px',
  },
  tituloLista: {
    marginBottom: '20px',
  },
  itemLista: {
    border: '1px solid',
  },
  tamanhoListaCriada: {
    width: '900px',
    margin: 'auto',
    border: '1px solid',
    padding: '10px',
  },
  alinharTextoCentro:{
    textAlign: 'center'
  }
});

function Previsor(props) {
  const [open, setOpen] = React.useState(false);
  const [openLoading, setOpenLoading] = React.useState(false);
  const [elemento, setElemento] = React.useState('');
  const [quantidade, setQuantidade] = React.useState('');
  const [listaEscolhida, setListaEscolhida] = React.useState([]);
  const [listaCompostosCriados, setListaCompostosCriados] = React.useState([]);
  const [listaDeOpcoes, setListaOpcoes] = React.useState(
    ListaOpcoesElementos.sort()
  );

  const handleChangeElemento = (event) => {
    setElemento(event.target.value || '');
  };

  const handleChangeQuantidade = (event) => {
    setQuantidade(event.target.value || 0);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveDaLista = (nome) => {
    const newList = listaEscolhida.filter((item) => item.nome !== nome);
    setListaEscolhida(newList.sort());
    adicionaOpcao(nome);
  };

  const handleAdicionaItem = () => {
    let listaNova = listaEscolhida;
    console.log(quantidade);
    if (elemento && quantidade && quantidade > 0) {
      const item = {
        nome: elemento,
        quantidade: parseFloat(quantidade),
      };

      listaNova.push(item);
      setListaEscolhida(listaNova.sort());
      removeOpcao(elemento);
      setElemento('');
      setQuantidade('');
      handleClose();
    }
  };

  const removeOpcao = (elemento) => {
    const newList = listaDeOpcoes.filter(
      (elementoOpcao) => elementoOpcao !== elemento
    );
    setListaOpcoes(newList.sort());
  };

  const adicionaOpcao = (elemento) => {
    let listaOpcoesNova = listaDeOpcoes;
    listaOpcoesNova.push(elemento);
    listaOpcoesNova.sort();
    setListaOpcoes(listaOpcoesNova);
  };

  const handleEnviarComposto = async () => {
    // POST request using fetch with error handling
    let bodyEnvio = Object.assign({}, BodyEnvioAPI);

    if (listaEscolhida && listaEscolhida.length) {
      listaEscolhida.forEach((elemento) => {
        bodyEnvio[elemento.nome][0] = Number(elemento.quantidade);
      });
    }

    let dadosEnvio = JSON.stringify(bodyEnvio);
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        Accept: '*/*',
        'Content-Length': dadosEnvio.length,
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
      },
      body: dadosEnvio,
    };

    //Realiza envio
    setOpenLoading(true);
    try {
      const response = await fetch(
        'http://192.168.99.107:5000/',
        requestOptions
      );
      const data = await response.json();

      let composto = {
        Material: montaForumula(),
        ConstanteDieletrica: parseFloat(data.constanteDieletrica),
        FatorQualidade: parseFloat(data.fatorQualidade),
        Elementos: montaElementos(),
        Compostos: montaCompostos(),
      };

      let novaLista = listaCompostosCriados;
      novaLista.push(composto);
      setListaCompostosCriados(novaLista);

      setOpenLoading(false);
      //Limpa os valores antigos
      for (const [key] of Object.entries(BodyEnvioAPI)) {
        BodyEnvioAPI[key][0] = 0;
      }
      setListaEscolhida([]);
      setListaOpcoes(ListaOpcoesElementos);
    } catch (erro) {
      //tratar erro
      console.log(erro);
      setOpenLoading(false);
    }
  };

  const montaForumula = () => {
    let formula = '';
    listaEscolhida.forEach((elemento) => {
      formula = formula + elemento.nome + elemento.quantidade;
    });
    return formula;
  };

  const montaElementos = () => {
    let elementos = '';
    listaEscolhida.forEach((elemento) => {
      elementos = elementos + elemento.nome + ',';
    });
    elementos = elementos.slice(0, -1);
    return elementos;
  };

  const montaCompostos = () => {
    let compostos = '';
    listaEscolhida.forEach((composto) => {
      compostos = compostos + composto.nome + composto.quantidade + ',';
    });
    compostos = compostos.slice(0, -1);
    return compostos;
  };

  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Add chemical element</DialogTitle>
        {/* <DialogContentText> A lista final deve conter no mínimo 2 elementos e incluir oxigênio</DialogContentText> */}
        <DialogContent>
          <form>
            <FormControl>
              <InputLabel htmlFor='demo-dialog-native'>Element</InputLabel>
              <Select
                className={props.classes.seletorElementoModal}
                native
                value={elemento}
                onChange={handleChangeElemento}
                input={<Input id='demo-dialog-native' />}
              >
                <option aria-label='None' value='' />
                {listaDeOpcoes.map((elementoQuimico) => (
                  <option value={elementoQuimico}>{elementoQuimico}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl className={props.classes.seletorQuantidadeModal}>
              <TextField
                value={quantidade}
                onChange={handleChangeQuantidade}
                id='standard-basic'
                label='Quantity'
                type='number'
                min='0'
              />
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleAdicionaItem} color='primary'>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog disableBackdropClick disableEscapeKeyDown open={openLoading}>
        <DialogTitle>
          Please wait for the calculation
          {/* Por favor aguarde enquanto realizamos o cálculo */}
        </DialogTitle>
        <LinearProgress className={props.classes.loading} />
      </Dialog>

      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            Compound Creation
            {/* Criação de Compostos */}
          </Typography>
        </ExpansionPanelSummary>
        <Button
          className={props.classes.botaoAdicionar}
          onClick={handleClickOpen}
          variant='contained'
        >
          Add chemical element
          {/* Adicionar elemento químico */}
        </Button>
        <Button
          className={props.classes.botaoAdicionar}
          onClick={() => handleEnviarComposto()}
          variant='contained'
          disabled={listaEscolhida.length < 2}
        >
          Get compound results
          {/* Enviar composto para análise */}
        </Button>
        <ExpansionPanelDetails>
          <Grid item xs={12} md={12}>
            <Typography className={props.classes.tituloLista} variant='h6'>
              Elements List
              {/* Lista de elementos{' '} */}
            </Typography>
            <div>
              <List className={props.classes.root}>
                <Grid container spacing={3}>
                  <ListItem>
                    <Grid item xs={4}>
                      <ListItemText primary={'Element'} />
                    </Grid>
                    <Grid item xs={4}>
                      <ListItemText primary={'Quantity'} />
                    </Grid>
                    <Grid item xs={4}>
                      <ListItemSecondaryAction>
                        <ListItemText primary={'Remove'} />
                      </ListItemSecondaryAction>
                    </Grid>
                  </ListItem>
                  {listaEscolhida.map((elemento) => (
                    <ListItem>
                      <Grid item xs={4}>
                        <ListItemAvatar>
                          <Avatar>{elemento.nome}</Avatar>
                        </ListItemAvatar>
                      </Grid>
                      <Grid item xs={4}>
                        <ListItemText primary={elemento.quantidade} />
                      </Grid>
                      <Grid item xs={4}>
                        <ListItemSecondaryAction>
                          <IconButton edge='end' aria-label='delete'>
                            <DeleteIcon
                              onClick={() => handleRemoveDaLista(elemento.nome)}
                            />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </Grid>
                    </ListItem>
                  ))}
                </Grid>
              </List>
            </div>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel defaultExpanded={false}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Created Compounds</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid item xs={12} md={12}>
            <Typography className={props.classes.tituloLista} variant='h6'>
              Created Compounds List
            </Typography>
            <div>
              <List className={props.classes.tamanhoListaCriada}>
                <Grid container spacing={3}>
                  <ListItem>
                    <Grid item xs={4}>
                      <ListItemText className={props.classes.alinharTextoCentro} primary={'Chemical Formula'} />
                    </Grid>
                    <Grid item xs={4}>
                      <ListItemText className={props.classes.alinharTextoCentro} primary={'Relative Permittivity'} />
                    </Grid>
                    <Grid item xs={4}>
                      <ListItemText className={props.classes.alinharTextoCentro} primary={'Quality Factor'} />
                    </Grid>
                  </ListItem>
                  {listaCompostosCriados.map((composto) => (
                    <ListItem>
                      <Grid item xs={4}>
                        <ListItemText className={props.classes.alinharTextoCentro} primary={composto.Material} />
                      </Grid>
                      <Grid item xs={4}>
                        <ListItemText className={props.classes.alinharTextoCentro}
                          primary={composto.ConstanteDieletrica.toFixed(2)}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ListItemText className={props.classes.alinharTextoCentro}
                          primary={composto.FatorQualidade.toFixed(2)}
                        />
                      </Grid>
                    </ListItem>
                  ))}
                </Grid>
              </List>
            </div>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <GraficoPrevisor listaCompostosCriados={listaCompostosCriados} />
    </div>
  );
}

export default withStyles(styles)(Previsor);
