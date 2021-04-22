let PromiseAll = require('promises-all');
let mysql = require('mysql');
let moment = require('moment');
const ObjectsToCsv = require('objects-to-csv');

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root@mysql",
    database:'bd_comparacao'
  });
  
  con.connect(function(err) {if (err) throw err;});
// console.log('-------- Iniciando Script ------------');

async  function mysql_consult(i){
  
        await con.query(`UPDATE clientes SET nome_cliente = 'TESTE CLIENTE ${i + 500}', updatedAt = '${moment()}' `, (err, result, fields) => {
          if (err) throw err;
        });
      //await con.query("SELECT * FROM clientes INNER JOIN empresas e ON empresas_cod_empresa = e._id", function (err, result, fields) {if (err) throw err;});
}

let arrayToConvert = [];
let arrayTempos = [];
let counter = 0;
let timer = setInterval( function() {
  if (counter >= 5000000) {
      clearInterval( timer );
  }
  for (let i = 0; i < 100000; i++) {
    let inicio = moment().milliseconds();
    mysql_consult(i).then(function (){
      let fim = moment().milliseconds();
      arrayTempos[i] = fim;
      let valorFinal = (fim - arrayTempos[i-1]) * 0.001;
    
      if(valorFinal > 0) {
        let result = {
          Comando:'UPDATE',
          Banco:'MySQL',
          Resultado: valorFinal,
        }
        arrayToConvert.push(result);
        const csv = new ObjectsToCsv(arrayToConvert);
        csv.toDisk(`csv_results/update_mysql.csv`, {append: true});
      }
      inicio = 0
      fim = 0;
      valorFinal = 0;
    });
    counter++;
  };
  console.log('COUNTER =>', counter);
}, 1000 );
