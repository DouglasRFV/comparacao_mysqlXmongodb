const mongoose = require('mongoose');
const cliente_model = require("./model/clientes.model");
let PromiseAll = require('promises-all');
const ObjectsToCsv = require('objects-to-csv');

mongoose.connect('mongodb://localhost:27017/db_comparacao',{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useFindAndModify:false
}, function(err){
    if(err){ console.log(err) }
});

async  function mongodb_consult(){
    cliente_model.find({});
}

let arrayToConvert = [];
let arrayTempos = [];
let counter = 0;
let timer = setInterval( function() {
    if (counter >= 5000000) {
        clearInterval( timer );
    }
    for (let i = 0; i < 100000; i++) {
        mongodb_consult().then(function (){
            let tempoFim = new Date();
            arrayTempos[i] = tempoFim.getTime();
            let valorFinal = ((tempoFim.getTime() - arrayTempos[i-1]) * 0.001);
            if(valorFinal > 0) {
                let result = {
                    Comando:'FIND',
                    Banco:'MongoDB',
                    Resultado: valorFinal
                };
                arrayToConvert.push(result);
                const csv = new ObjectsToCsv(arrayToConvert);
                csv.toDisk(`csv_results/find_mongodb.csv`, {append: true});
            }
            
        });
        counter++;
    };
    console.log('COUNTER =>', counter);
}, 1000 );

