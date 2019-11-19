const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');
const characterDictionary = require('./dictionary'); 

// file locations
const inputFilePath = path.resolve(__dirname, 'input.csv');
const outputFilePath = path.resolve(__dirname, 'output.csv');

// columns to clean
const columnsToClean = ['Guest name', 'Booker name'];



// globals
let currentReadRow = 1;
let readDataStore = [];

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
    readDataStore = readDataStore.map(updateBadCharacters)
    outputCsv();
    console.log('file read complete');
}

function updateBadCharacters(row, index) {
    console.log('updating row', index);

    for (let i = 0, n = columnsToClean.length; i < n; i++) {
        let column = columnsToClean[i];
        
        Object.keys(characterDictionary).forEach((badCharacter) => {
            if (row[column].indexOf(badCharacter) !== -1) {
                console.log(`replacing bad character "${badCharacter}" in ${column}: ${row[column]}`); 
                row[column] = row[column].replace(badCharacter, characterDictionary[badCharacter]);
            }
        });
    }

    return row;
}


// ouput files
function outputCsv() {
    // console.log(Object.keys(readDataStore[0]));
    // console.log(Object.keys(readDataStore[1]));
    var headerValues = Object.keys(readDataStore[0])
    var headerRows = headerValues.map((key) => {
        return {
            id: key,
            title: key
        }
    });
    
    // console.log(headerRows);
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
