const readLine = require('readline-sync');
const fs = require('fs');
const sinon = require('sinon');

// const myQuestion = sinon.stub(readLine, 'question');

//Function that save data into JSON 
let saveData = function (data, filePath) {
    let str = JSON.stringify(data);
    fs.writeFileSync(filePath, str);
};
//function that read data from JSON
let readFile = function (filePath) {
    let str = fs.readFileSync(filePath).toString();
    return JSON.parse(str);
}

const db = 
{
    books: readFile('books.json'),
    authors: readFile('authors.json')
};

//Search function, uses for comparing data from JOSN and cmd
let foundAuthor = function (data, value) {
    for (let i = 0; i < data.length; ++i) {
        if (data[i].name === value) {
            return value;
        }
    }
}

//Function for adding authors and books into JSON
let adder = function(type, filePath) {   
    
    switch(type) {        
        case 'author':        
            let tempAuthors = {}; //temprorary object that is needed for adding author information
            console.log('Adding new author');
            //Check if autor name field isn't empty and author doesn't exist
            while(true){
                let authorName = readLine.question('Name: ');

                if (authorName === null || authorName === '') {    
                    console.log(`Field can't be empty`);
                    continue;
                } 
                if (foundAuthor(db['authors'], authorName)) {
                    console.log('Author already exists. Please add newone\n');
                    continue;                        
                }
                tempAuthors.name = authorName; 
                break;
            }            
            // Check if Language field is filled
            while (true) {
                let authorLanguage = readLine.question('Language: ');
                if (authorLanguage === null || authorLanguage === '') {
                    console.log(`Field can't be empty`);
                    continue;
                }
                tempAuthors.lang = authorLanguage;
                break;
            }
            //Check if Genre field is filled
            while(true) {
                let authorGenre = readLine.question('Genre: ');
                if (authorGenre === null || authorGenre === '') {
                    console.log(`Field can't be empty`);
                    continue;
                }
                tempAuthors.genre = authorGenre;
                break;
            }
            db['authors'].push(tempAuthors); //add object with new author into array of objects with all previously added authors
            saveData(db['authors'], 'authors.json'); //save array of objects with authors into JSON
            add();         
            break;
        case 'book':
        default:
            let tempBooks = {}; //temprorary object that nis needed for adding books information

            let bookTitle = readLine.question('Title: ');
            tempBooks.bookTitle = bookTitle;
            //Check if aouthor that should be used for adding book is presented in the authors.json
            while(true) {
                let bookAuthor = readLine.question('Author: ');
                if (foundAuthor(db['authors'], bookAuthor)) {                    
                    tempBooks.author = bookAuthor;
                    break;
                }
                console.log('Incorrect author\n');
            }
            tempBooks.rate = 0; //Add default zero rate for each book
            db['books'].push(tempBooks);
            saveData(db['books'], 'books.json');
            add();
            break;
    }
}

//Function that displayed main menu and call functions for each menu item
let mainMenu = function() {
    
    console.log('\nLibrary\n');    
    console.log(`1: List all\n2: Search\n3: Add\n4: Rate\n5: Clear\n6: Reload\n`);    

    let selectedItem = readLine.question();
    switch(selectedItem) {
        case '1':
        case 'List All': 
            listAll();
            break;
        case '2':
        case 'Search':
            search();
            break;
        case '3':
        case 'Add':
            add();
            break;
        case '4':
        case 'Rate':
            rate();
            break;
        case '5':
        case 'Clear':
            clear();
            break;
        case '6':
        case 'Reload':
            reload();
            break;
        default: 
            console.log('Incorrect item had been chosen');
            mainMenu();
            break;            
    }
};

//Function that is displayed all added authors and books
let listAll = function() {    
    console.log('\nAuthors: \n');
    for (let i = 0; i < db['authors'].length; ++i) {
        console.log(`${i+1}: ${db['authors'][i].name}(${db['authors'][i].lang}). ${db['authors'][i].genre}`);        
    }
    console.log('\nBooks: \n');
    for (let i = 0; i < db['books'].length; ++i) {
        console.log(`${i+1}: ${db['books'][i].bookTitle}(${db['books'][i].author}). Rating: ${db['books'][i].rate}`);        
    }
    mainMenu();    
};

let search = function() {

    console.log('\nSearch\n');
    console.log(`1: By title\n2: By author\n3: By genre\n4: By rating\n5: Back\n`);

    let selectedItem = readLine.question();
    switch (selectedItem) {
        case '1':
        case 'By title':

            let bookTitle = readLine.question('Title: \n');

                for (let i = 0; i < db['books'].length; ++i) {
                    let matchAuthor = 0;
                    if (bookTitle === db['books'][i].bookTitle) {
                        
                        for (j = 0; j < db['authors'].length; ++j) {
                            if (db['books'][j].name === db['authors'][i].author) {
                                matchAuthor = j;
                            }                            
                        }                       
                        
                        console.log(`\n${db['books'][i].bookTitle}(${db['books'][i].author}). Genre: ${db['authors'][matchAuthor].genre}. Rating: ${db['books'][i].rate}.`);                                                
                    } 
                }                
                search();
            break;
        case '2':
        case 'By author':
            let authorName = readLine.question('Author: \n');
            for (let i = 0; i < db['authors'].length; ++i) { 
                if (authorName === db['authors'][i].name) {
                    for (let j = 0; j < db['books'].length; ++j) {
                        if (db['authors'][i].name === db['books'][j].author){
                            console.log(`\n${db['books'][j].bookTitle}(${db['books'][j].author}). Genre: ${db['authors'][i].genre}. Rating: ${db['books'][j].rate}.`); //One problem here - if we manually add into JSON file object with same authors both of them will be displayed
                        }                        
                    }
                }
            }
            search();
            break;
        case '3':
        case 'By genre':
            let authorGenre = readLine.question('Genre: \n');
            for (let i = 0; i < db['authors'].length; ++i) { 
                if (authorGenre === db['authors'][i].genre) {
                    for (let j = 0; j < db['books'].length; ++j) { 
                        if (db['authors'][i].name === db['books'][j].author){
                            console.log(`\n${db['books'][j].bookTitle}(${db['books'][j].author}). Genre: ${db['authors'][i].genre}. Rating: ${db['books'][j].rate}.`); 
                        }                        
                    }
                }
            }
            search();
            break;
        case '4':
        case 'By rating':
            !function ratingSearch() {
                console.log('\nRating Search\n');
                console.log(`1: Less\n2: Greater\n3: Back\n`);
                
                let typeOfRatingSearh = readLine.question();

                switch(typeOfRatingSearh) {
                    case '1':
                    case 'Less':
                        let lessThan = readLine.question('Less than: ');
                        for (let i = 0; i < db['books'].length; ++i) { // two FORs are used to collect data from two dofferent JSON (especialli it is needed to display genre data that palced in 'authors JSON', not in the 'books.json')
                            for (let j = 0; j < db['books'].length; ++j) {
                                if (db['authors'][i].name === db['books'][j].author && db['books'][j].rate < lessThan){
                                    console.log(`\n${db['books'][j].bookTitle}(${db['books'][j].author}). Genre: ${db['authors'][i].genre}. Rating: ${db['books'][j].rate}.`); 
                                }
                            }
                        }
                        search();
                        break;
                    case '2':
                    case 'Greater':
                        let greaterThan = readLine.question('Greater than: ');
                        for (let i = 0; i < db['books'].length; ++i) { // two FORs are used to collect data from two dofferent JSON (especialli it is needed to display genre data that palced in 'authors JSON', not in the 'books.json')
                            for (let j = 0; j < db['books'].length; ++j) {
                                if (db['authors'][i].name === db['books'][j].author && db['books'][j].rate > greaterThan){
                                    console.log(`\n${db['books'][j].bookTitle}(${db['books'][j].author}). Genre: ${db['authors'][i].genre}. Rating: ${db['books'][j].rate}.`); 
                                }                        
                            }
                            
                        }
                        search();
                        break;
                    case '3':
                    case 'Back':
                        search();
                        break;
                    default:
                    console.log('Incorrect item had been chosen');
                    search();
                    break;                        
                }
                
            }()
            break;
        case '5':
        case 'Back':
            mainMenu();
            break;
        default:
            console.log('Incorrect item had been chosen');
            search();
            break;        
    }
}

//Menu "Add" function
let add = function() {
    console.log('\nAdd entity\n');
    console.log(`1: Author\n2: Book\n3: Back\n`);

    let author = {};
    let selectedItem = readLine.question();
    switch (selectedItem) {
        case '1':
        case 'Author':
            adder('author');
            break;
        case '2':
        case 'Book':
            adder('book');;
            break;
        case '3':        
        case 'Back':
            mainMenu();
            break;
        default:
            console.log('Incorrect item had been chosen');
            add();
            break;        
    }
    
}
//Menu "Rate" function
let rate = function() {  
    let bookId = readLine.question('\nBook ID: \n');
    if (db['books'].length === 0) {        
        console.log('Please add at least one book');
        mainMenu();                        
    } else if (bookId === null || bookId === '') {
        console.log('Incorrect book ID');
        rate();
    } else {
        ++db['books'][bookId-1].rate;
        console.log(`\nRating: ${db['books'][bookId-1].rate}`);
        saveData(db['books'], 'books.json');
        mainMenu();
    }
}

//Menu "Clear" function
let clear = function() {
    let clearData = [];
    console.log('\nLibrary is empty now\n');
    saveData(clearData, 'authors.json');
    saveData(clearData, 'books.json');
    mainMenu();    
}

//Function that clear curent console window and call mainMenu
let reload = function() {
    process.stdout.write('\x1Bc');
    mainMenu();
}
mainMenu();