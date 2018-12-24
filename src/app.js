import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { service } from './services';

class ErrorMessage extends React.Component {
  constructor() {
    super();
    errorMessage = this;
    this.message='';
  }

  render() {
    return (
      <div>
        <b><font color='red'>{this.message}</font></b>
      </div>
    );
  }

  set(message) {
    this.message = message;
    this.forceUpdate();
  }
}
let errorMessage;

class Menu extends React.Component {
  render() {
    return (
      <div>
        <Link to='/'>Hjem</Link> <Link to='/tur'>Tur</Link> <Link to='/utstyr'>Utstyr</Link> <Link to='/sted'>Skiløyper</Link> <Link to='/info'>Info</Link>
      </div>
    );
  }
}

class Hjem extends React.Component {
  render() {
    return (
      <div>
        Hjemmeside
      </div>
    );
  }
}


class Tur extends React.Component {
  constructor() {
    super(); // Call React.Component constructor

    this.trips = [];
    this.places = [];
    this.skis = [];
    this.smurninger = [];
    this.clouds = [];
    this.nedbor = [];
  }

  render() {
    let listItems = [];
    for(let trip of this.trips) {
      listItems.push(
        <li key={trip.tur_id}>
          <Link to={'/tur/' + trip.tur_id}>{trip.dato.toLocaleDateString()}, {trip.sted_navn}</Link>
        </li>
      );
    }

    let sted = [];
    for (let place of this.places) {
      sted.push(
        <option key={place.sted_id} value={place.sted_id}>{place.sted_navn}</option>
      );
    }

    let skipar = [];
    for (let ski of this.skis) {
      skipar.push(
        <option key={ski.skipar_id} value={ski.skipar_id}>{ski.skipar_navn}</option>
      );
    }
    let skismurning = [];
    for (let smurning of this.smurninger) {
      skismurning.push(
        <option key={smurning.skismurning_id} value={smurning.skismurning_id}>{smurning.skismurning_navn}</option>
      );
    }
    let skylag = [];
    for (let cloud of this.clouds) {
      skylag.push(
        <option key={cloud.skylag_id} value={cloud.skylag_id}>{cloud.skylag_navn}</option>
      );
    }
    let nedborstype = [];
    for (let ned of this.nedbor) {
      nedborstype.push(
        <option key={ned.nedbortype_id} value={ned.nedbortype_id}>{ned.nedbortype_navn}</option>
      );
    }
    return (
      <div>
        <b>Mine skiturer:</b>
        <ul>{listItems}</ul>
        <b>Ny skitur:</b>
        <div>
          Skipar: <select ref='par'><option value='0'>Velg skipar</option>{skipar}</select> <br/>
        <table>
        <tbody>
          <tr>
            <td>Sted:</td>
            <td> <select ref='loype'><option value='0'>Velg sted</option>{sted}</select> </td>
          </tr>
          <tr>
          <td>Lengde: </td><td><input type='number' ref='lengde' /> i km. </td>
          </tr>
          <tr>
          <td>Dato: </td><td> <input type='date' ref='dato' /> </td>
          </tr>
          <tr>
          <td>Skipar: </td><td><select ref='par'><option value='0'>Velg skipar</option>{skipar}</select> </td>
          </tr>
          <tr>
          <td>Skismurning: </td><td> <select ref='smor'><option value='0'>Velg skismurning</option>{skismurning}</select> </td>
          </tr>
          <tr>
          <td>Temperatur: </td><td> <input type='number' ref='temp' /> i °C. </td>
          </tr>
          <tr>
          <td>Nedbør: </td><td> <input type='number' ref='nedbormm' /> i mm.</td>
          </tr>
          <tr>
          <td>Vindstyrke: </td><td> <input type='number' ref='vind' /> i mps. </td>
          </tr>
          <tr>
          <td>Skylag: </td><td> <select ref='sky'><option value='0'>Velg skylag</option>{skylag}</select> </td>
          </tr>
          <tr>
          <td>Nedbørstype: </td><td> <select ref='ned'><option value='0'>Velg nedbørstype</option>{nedborstype}</select> </td>
          </tr>
        </tbody>
        </table>

          <button onClick={ () => {
            console.log(this.refs.loype.value, this.refs.lengde.value, this.refs.dato.value, this.refs.par.value, this.refs.smor.value, this.refs.temp.value, this.refs.nedbormm.value, this.refs.vind.value, this.refs.sky.value, this.refs.ned.value);
          }}>Legg til</button>
        </div>
      </div>
    );
  }

  // Called after render() is called for the first time
  componentDidMount() {
    service.getTur().then((result) => {
      this.trips = result;
      this.forceUpdate(); // Rerender component with updated data
    }).catch((error) => {
      errorMessage.set('Failed to get tur: ' + error);
    });
    service.getSted().then((result) => {
      this.places = result;
      this.forceUpdate(); // Rerender component with updated data
    }).catch((error) => {
      errorMessage.set('Failed to get sted: ' + error);
    });
    service.getSkipar().then((result) => {
      this.skis = result;
      this.forceUpdate(); // Rerender component with updated data
    }).catch((error) => {
      errorMessage.set('Failed to get skipar: ' + error);
    });
    service.getSkismurning().then((result) => {
      this.smurninger = result;
      this.forceUpdate(); // Rerender component with updated data
    }).catch((error) => {
      errorMessage.set('Failed to get skismurning: ' + error);
    });
    service.getSkylag().then((result) => {
      this.clouds = result;
      this.forceUpdate(); // Rerender component with updated data
    }).catch((error) => {
      errorMessage.set('Failed to get skylag: ' + error);
    });
    service.getNedbortype().then((result) => {
      this.nedbor = result;
      this.forceUpdate(); // Rerender component with updated data
    }).catch((error) => {
      errorMessage.set('Failed to get nedbørtype: ' + error);
    });
  }

  // this.refs.newTripButton.onclick = () => {
  // console.log(this.refs.loype.value);
  // }
}

// Detailed view of one customer
class TurDetails extends React.Component {
  constructor(props) {
    super(props); // Call React.Component constructor

    this.tur = [];

    // The customer id from path is stored in props.match.params.customerId
    this.id = props.match.params.turId;
  }

  render() {
    return (
      <div>
        <h3>Tur</h3>
        <ul>
          <li>Dato: {this.tur.dato}</li>
          <li>Sted: {this.tur.sted_navn}</li>
          <li>Lengde: {this.tur.lengde} km </li>
          <li>Kommentar: {this.tur.kommentar}</li>
          <br/>
        <b>Utstyr:</b>

          <li>Skipar: {this.tur.skipar_navn}</li>
          <li>Skismurning: {this.tur.skismurning_navn}</li>
          <br/>
        <b>Vær:</b>
          <li>Temperatur: {this.tur.temperatur} °C</li>
          <li>Nedbør: {this.tur.nedbor_mm} mm</li>
          <li>Vindstyrke: {this.tur.vindstyrke_mps} mps</li>
          <li>Nedbørstype: {this.tur.nedbortype_navn}</li>
          <li>Skylag: {this.tur.skylag_navn}</li>
        </ul>
      </div>
    );
  }

  // Called after render() is called for the first time
  componentDidMount() {

    service.getIdTur(this.id).then((result) => {
      this.tur = result[0];
      this.tur.dato = result[0].dato.toLocaleDateString();
      this.forceUpdate();
    }).catch((error) => {
      errorMessage.set('Failed to get tur details: ' + error);
    });
  }
}

class Sted extends React.Component {
  constructor() {
    super();
    this.places = [];
  }
  render() {
    let sted = [];

    for (let place of this.places) {
      sted.push(
        <tr key={place.sted_id}>
        <td>{place.sted_navn}</td>
        <td>{place.sted_beskrivelse}</td>
        </tr>
      );
    }

    return(
      <div>
      <h3>Skiløyper</h3>
      <table>
      <thead>
        <tr>
          <th>Stedsnavn</th>
          <th>Beskrivelse</th>
        </tr>
      </thead>
      <tbody>
          {sted}
      </tbody>
      </table>
      <br/>
      <b>Legg til nytt skisted:</b> <br/>
      Stedsnavn: <input type='text' ref='snavn' /> <br/>
      Beskrivelse: <br/> <textarea ref='beskrivelse'></textarea>
      <br/> <button ref='addPlaceButton'>Legg til</button>
      </div>
    );
  }
  componentDidMount() {
    service.getSted().then((result) => {
      this.places = result;
      this.forceUpdate();
    }).catch((error) => {
      errorMessage.set('Failed to get places: ' + error);
    });
  }
}
class Utstyr extends React.Component {
  constructor() {
    super();
    this.skis = [];
    this.brands = [];
    this.types = [];
    this.styles = [];
  }
  render() {
    let listItems = [];
    for (let ski of this.skis) {
      listItems.push(
        <li key={ski.skipar_id}>{ski.skipar_navn} </li>
      );
    }
    let merke = [];
    let skitype = [];
    let stil = [];
    for (let brand of this.brands) {
      merke.push(
        <option key={brand.skimerke_id} value={brand.skimerke_id}>{brand.skimerke_navn}</option>
      );
    }
    for (let type of this.types) {
      skitype.push(
        <option key={type.skitype_id} value={type.skitype_id}>{type.skitype_navn}</option>
      );
    }
    for (let style of this.styles) {
      stil.push(
        <option key={style.langrennstype_id} value={style.langrennstype_id}>{style.langrennstype_navn}</option>
      );
    }

    return(
      <div>
      <h3>Utstyr</h3>
      <b>Mine skipar:</b>
      <ul>
      {listItems}
      </ul>
      <br/> <b>Legg til nytt skipar: </b> <br/>
      Skiparnavn: <input type='text' ref='newSkiName'/>
      <br/> <select ref='newBrand'><option value='0'>Skimerke</option>{merke}</select>
      <select ref='newType'><option value='0'>Skitype</option>{skitype}</select>
      <select ref='newStyle'><option value='0'>Langrennstype</option>{stil}</select>
      <br/><button ref='newSkiButton' onClick={ () => {
        console.log(this.refs.newSkiName.value, this.refs.newBrand.value, this.refs.newType.value, this.refs.newStyle.value);
      }}>Lagre</button>
      </div>
    );
  }
  componentDidMount(){
    service.getSkipar().then((result) => {
      this.skis = result;
      this.forceUpdate();
    }).catch((error) => {
      errorMessage.set('Failed to get skis: ' + error);
    });
    service.getSkimerke().then((result) => {
      this.brands = result;
      this.forceUpdate();
    }).catch((error) => {
      errorMessage.set('Failed to get brands: ' + error);
    });
    service.getSkitype().then((result) => {
      this.types = result;
      this.forceUpdate();
    }).catch((error) => {
      errorMessage.set('Failed to get types: ' + error);
    });
    service.getLangrennstype().then((result) => {
      this.styles = result;
      this.forceUpdate();
    }).catch((error) => {
      errorMessage.set('Failed to get styles: ' + error);
    });
  }
}
class Info extends React.Component {
  constructor() {
    super();
    this.sesong = [];
    this.vaer = [];
    this.skipar = [];
  }
  render() {
    return(
      <div>info</div>
    );
  }
  componentDidMount(){
    service.getSesongTotal().then((result) => {
      this.sesong = result;
      console.log(this.sesong);
      this.forceUpdate();
    }).catch((error) => {
      errorMessage.set('Failed to get season total: ' + error);
    });
    service.getAvgVaer().then((result) => {
      this.vaer = result;
      console.log(this.vaer);
      this.forceUpdate();
    }).catch((error) => {
      errorMessage.set('Failed to get weather average: ' + error);
    });
    service.getTopSkipar().then((result) => {
      this.skipar = result;
      console.log(this.skipar);
      this.forceUpdate();
    }).catch((error) => {
      errorMessage.set('Failed to get top skis: ' + error);
    });
  }
}


ReactDOM.render((
  <HashRouter>
    <div>
      <ErrorMessage />
      <Menu />
      <Switch>
        <Route exact path='/' component={Hjem} />
        <Route exact path='/tur' component={Tur} />
        <Route exact path='/sted' component={Sted} />
        <Route exact path='/utstyr' component={Utstyr} />
        <Route exact path='/info' component={Info} />
        <Route exact path='/tur/:turId' component={TurDetails} />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'));
