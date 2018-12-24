import mysql from 'mysql';

// Setup database server reconnection when server timeouts connection:
let connection;
function connect() {
  connection = mysql.createConnection({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'eirmh',
    password: 'PiFHWdUd',
    database: 'eirmh'
  });

  // Connect to MySQL-server
  connection.connect((error) => {
    if (error) throw error; // If error, show error in console and return from this function
  });

  // Add connection error handler
  connection.on('error', (error) => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') { // Reconnect if connection to server is lost
      connect();
    }
    else {
      throw error;
    }
  });
}
connect();

class Service {
  getTur() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT t.tur_id, t.dato, t.lengde, s.sted_navn, t.sted_id, p.skipar_navn, t.skipar_id, m.skismurning_navn, t.skismurning_id, t.kommentar, v.temperatur, v.nedbor_mm, v.vindstyrke_mps, n.nedbortype_navn, v.nedbortype_id, y.skylag_navn, v.skylag_id FROM ((((((TUR t INNER JOIN VAER v ON v.tur_id = t.tur_id) INNER JOIN STED s ON s.sted_id = t.sted_id) INNER JOIN SKIPAR p ON p.skipar_id = t.skipar_id) INNER JOIN SKISMURNING m ON m.skismurning_id = t.skismurning_id) INNER JOIN NEDBORTYPE n ON n.nedbortype_id = v.nedbortype_id) INNER JOIN SKYLAG y ON y.skylag_id = v.skylag_id)', (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
        console.log(result);
      });
    });
  }
  getIdTur(turId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT t.dato, t.lengde, s.sted_navn, p.skipar_navn, m.skismurning_navn, t.kommentar, v.temperatur, v.nedbor_mm, v.vindstyrke_mps, n.nedbortype_navn, y.skylag_navn FROM ((((((TUR t INNER JOIN VAER v ON v.tur_id = t.tur_id) INNER JOIN STED s ON s.sted_id = t.sted_id) INNER JOIN SKIPAR p ON p.skipar_id = t.skipar_id) INNER JOIN SKISMURNING m ON m.skismurning_id = t.skismurning_id) INNER JOIN NEDBORTYPE n ON n.nedbortype_id = v.nedbortype_id) INNER JOIN SKYLAG y ON y.skylag_id = v.skylag_id) WHERE t.tur_id = ?', [turId], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
        console.log(result);
      });
    });
  }
  getSted() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM STED', (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  getTopSkipar() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT s.skipar_navn, COUNT(t.skipar_id) AS antall FROM TUR t INNER JOIN SKIPAR s ON s.skipar_id = t.skipar_id GROUP BY s.skipar_navn ORDER BY COUNT(t.skipar_id) DESC', (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
        console.log(result);
      });
    });
  }
  getSkipar() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT s.skipar_id, s.skipar_navn, s.skimerke_id, m.skimerke_navn, s.skitype_id, t.skitype_navn, s.langrennstype_id, l.langrennstype_navn FROM SKIPAR s, SKIMERKE m, SKITYPE t, LANGRENNSTYPE l WHERE s.skimerke_id = m.skimerke_id AND s.skitype_id = t.skitype_id AND s.langrennstype_id = l.langrennstype_id', (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
        console.log(result);
      });
    });
  }
  getLangrennstype() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM LANGRENNSTYPE', (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  getSkitype() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM SKITYPE', (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  getSkimerke() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM SKIMERKE', (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  getSkismurning() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM SKISMURNING', (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  getNedbortype() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM NEDBORTYPE', (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  getSkylag() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM SKYLAG', (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  getTotal() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT SUM(lengde) FROM TUR', (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  getSesongTotal() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT SUM(case when dato BETWEEN "2018-11-01" AND "2018-11-30" then lengde else 0 end) as "November", SUM(case when dato BETWEEN "2018-12-01" AND "2018-12-31" then lengde else 0 end) as "Desember", SUM(case when dato BETWEEN "2019-01-01" AND "2019-01-31" then lengde else 0 end) as "Januar", SUM(case when dato BETWEEN "2019-02-01" AND "2019-02-29" then lengde else 0 end) as "Februar" FROM TUR', (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  getAvgVaer() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT s.sted_navn AS sted, AVG(v.nedbor_mm) AS nedbor, AVG(v.temperatur) AS temperatur, AVG(v.vindstyrke_mps) AS vindstyrke FROM ((TUR t INNER JOIN VAER v ON v.tur_id = t.tur_id) INNER JOIN STED s ON s.sted_id = t.sted_id) GROUP BY s.sted_navn', (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  insertLangrennstype(langrennstype_navn) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO LANGRENNSTYPE VALUES (NULL, ?)', [langrennstype_navn], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  insertSkitype(skitype_navn) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO SKITYPE VALUES (NULL, ?)', [skitype_navn], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  insertSkimerke(skimerke_navn) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO SKIMERKE VALUES (NULL, ?)', [skimerke_navn], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  insertSkismurning(skismurning_navn) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO SKISMURNING VALUES (NULL, ?)', [skismurning_navn], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  insertNedbortype(nedbortype_navn) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO NEDBORTYPE VALUES (NULL, ?)', [nedbortype_navn], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  insertSkylag(skylag_navn) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO SKYLAG VALUES (NULL, ?)', [skylag_navn], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  insertSkipar(skipar_navn, langrennstype_navn, skimerke_navn, skitype_navn) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO SKIPAR (skipar_id, skipar_navn, langrennstype_id, skimerke_id, skitype_id) SELECT NULL, ?, l.langrennstype_id, sm.skimerke_id, st.skitype_id FROM LANGRENNSTYPE l, SKIMERKE sm, SKITYPE st WHERE l.langrennstype_navn = ? AND sm.skimerke_navn = ? AND st.skitype_navn = ?', [skipar_navn, langrennstype_navn, skimerke_navn, skitype_navn], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  deleteSkipar(skipar_navn, langrennstype_navn, skimerke_navn, skitype_navn) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE * FROM FROM SKIPAR s, LANGRENNSTYPE l, SKIMERKE sm, SKITYPE st WHERE AND skipar_navn = ? l.langrennstype_navn = ? AND sm.skimerke_navn = ? AND st.skitype_navn = ?', [skipar_navn, langrennstype_navn, skimerke_navn, skitype_navn], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  deleteLangrennstype(langrennstype_navn) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE * FROM LANGRENNSTYPE WHERE langrennstype_navn = ?',[langrennstype_navn], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  deleteSkitype(skitype_navn) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE * FROM SKITYPE WHERE skitype_navn = ?',[skitype_navn], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  deleteSkimerke(skimerke_navn) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE * FROM SKIMERKE WHERE skimerke_navn = ?',[skimerke_navn], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  deleteSkismurning(skismurning_navn) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE * FROM SKISMURNING WHERE sksmurning_navn = ?',[skismurning_navn], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  deleteSkylag(skylag_navn) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE * FROM SKYLAG WHERE skylag_navn = ?',[skylag_navn], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
  deleteNedbortype(nedbortype_navn) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE * FROM NEDBORTYPE WHERE nedbortype_navn = ?',[nedbortype_navn], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
}

let service = new Service();

export { service };
