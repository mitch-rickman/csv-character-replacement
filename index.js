const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');

// file locations
const inputFilePath = path.resolve(__dirname, 'input.csv');
const outputFilePath = path.resolve(__dirname, 'output.csv');



// globals
let currentReadRow = 1;
const readDataStore = [];

function runProgram() {
    importCsv();
}

// read input file data
function importCsv() {
    console.log('importing csv from:', inputFilePath);
    fs.createReadStream(inputFilePath)
        .pipe(csvParser())
        .on('data', onDataRead)
        .on('end', onFileReadEnd);
}

function onDataRead(row) {
    readDataStore.push(row);
    console.log('reading row: ', currentReadRow);
    currentReadRow++;
}

function onFileReadEnd() {
    outputCsv();
    console.log('file read complete');
}


// ouput files
function outputCsv() {
    console.log(Object.keys(readDataStore[0]));
    console.log(Object.keys(readDataStore[1]));
    var headerValues = Object.keys(readDataStore[0])
    var headerRows = headerValues.map((key) => {
        return {
            id: key,
            title: key
        }
    });
    console.log(headerRows);
    const csvWriter = require('csv-writer').createObjectCsvWriter({
        path: outputFilePath,
        header: headerRows
    });
    
    csvWriter
        .writeRecords(readDataStore)
        .then(onWriteComplete);
}

function onWriteComplete() {
    console.log('output file created:', outputFilePath);
}



runProgram();
