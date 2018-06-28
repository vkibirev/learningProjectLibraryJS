const readLine = require('readline-sync');
const fs = require('fs');

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
            let tempAuthors = {}; //temprorary object that nis needed for adding author information
            let dataAuthors = []; //array  of objects that collect all information about added autors and uses for adding it to JSON
            let existingAuthors = readFile('authors.json');
            if (existingAuthors) {
                dataAuthors = existingAuthors;
            }            
            console.log('Adding new author');
            //Check if autor name field isn't empty and author doesn't exist
            while(true){
                let authorName = readLine.question('Name: ');

                if (authorName === null || authorName === '') {    
                    console.log(`Field can't be empty`);
                    continue;
                } 
                if (foundAuthor(dataAuthors, authorName)) {
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
            dataAuthors.push(tempAuthors); //add object with new author into array of objects with all previously added authors
            saveData(dataAuthors, 'authors.json'); //save array of objects with authors into JSON
            add();         
            break;
        case 'book':
        default:
            let tempBooks = {}; //temprorary object that nis needed for adding books information
            let dataBooks = []; //array of objects that collect all information about added books and uses for adding it to JSON
            let authorsList = readFile('authors.json'); 
            existingBooks = readFile('books.json');
            if (existingBooks) {
                dataBooks = existingBooks;
            }

            let bookTitle = readLine.question('Title: ');
            tempBooks.bookTitle = bookTitle;
            //Check if aouthor that should be used for adding book is presented in the authors.json
            while(true) {
                let bookAuthor = readLine.question('Author: ');
                if (foundAuthor(authorsList, bookAuthor)) {                    
                    tempBooks.author = bookAuthor;
                    break;
                }
                console.log('Incorrect author\n');
            }
            tempBooks.rate = 0; //Add default zero rate for each book
            dataBooks.push(tempBooks);
            saveData(dataBooks, 'books.json');
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
    let authorsList = readFile('authors.json');
    let booksList = readFile('books.json');
    console.log('\nAuthors: \n');
    for (let i = 0; i < authorsList.length; ++i) {
        console.log(`${i+1}: ${authorsList[i].name}(${authorsList[i].lang}). ${authorsList[i].genre}`);        
    }
    console.log('\nBooks: \n');
    for (let i = 0; i < booksList.length; ++i) {
        console.log(`${i+1}: ${booksList[i].bookTitle}(${booksList[i].author}). Rating: ${booksList[i].rate}`);        
    }
    mainMenu();    
};

let search = function() {

    console.log('\nSearch\n');
    console.log(`1: By title\n2: By author\n3: By genre\n4: By rating\n5: Back\n`);
    let booksList = readFile('books.json');
    let authorsList = readFile('authors.json');

    let selectedItem = readLine.question();
    switch (selectedItem) {
        case '1':
        case 'By title':

            let bookTitle = readLine.question('Title: \n');

                for (let i = 0; i < booksList.length; ++i) {
                    let matchAuthor = 0;
                    if (bookTitle === booksList[i].bookTitle) {
                        
                        for (j = 0; i < authorsList; ++j) {
                            if (authorsList[j].name === booksList[i].author) {
                                matchAuthor = j;
                            }
                        }
                        console.log(`\n${booksList[i].bookTitle}(${booksList[i].author}). Genre: ${authorsList[matchAuthor].genre}. Rating: ${booksList[i].rate}.`);                                                
                    } 
                }                
                search();
            break;
        case '2':
        case 'By author':
            let authorName = readLine.question('Author: \n');
            for (let i = 0; i < authorsList.length; ++i) { 
                if (authorName === authorsList[i].name) {
                    for (let j = 0; j < booksList.length; ++j) {
                        if (authorsList[i].name === booksList[j].author){
                            console.log(`\n${booksList[j].bookTitle}(${booksList[j].author}). Genre: ${authorsList[i].genre}. Rating: ${booksList[j].rate}.`); //One problem here - if we manually add into JSON file object with same authors both of them will be displayed
                        }                        
                    }
                }
            }
            search();
            break;
        case '3':
        case 'By genre':
            let authorGenre = readLine.question('Genre: \n');
            for (let i = 0; i < authorsList.length; ++i) { 
                if (authorGenre === authorsList[i].genre) {
                    for (let j = 0; j < booksList.length; ++j) { 
                        if (authorsList[i].name === booksList[j].author){
                            console.log(`\n${booksList[j].bookTitle}(${booksList[j].author}). Genre: ${authorsList[i].genre}. Rating: ${booksList[j].rate}.`); 
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
                        for (let i = 0; i < booksList.length; ++i) { // two FORs are used to collect data from two dofferent JSON (especialli it is needed to display genre data that palced in 'authors JSON', not in the 'books.json')
                            for (let j = 0; j < booksList.length; ++j) {
                                if (authorsList[i].name === booksList[j].author && booksList[j].rate < lessThan){
                                    console.log(`\n${booksList[j].bookTitle}(${booksList[j].author}). Genre: ${authorsList[i].genre}. Rating: ${booksList[j].rate}.`); 
                                }
                            }
                        }
                        search();
                        break;
                    case '2':
                    case 'Greater':
                        let greaterThan = readLine.question('Greater than: ');
                        for (let i = 0; i < booksList.length; ++i) { // two FORs are used to collect data from two dofferent JSON (especialli it is needed to display genre data that palced in 'authors JSON', not in the 'books.json')
                            for (let j = 0; j < booksList.length; ++j) {
                                if (authorsList[i].name === booksList[j].author && booksList[j].rate > greaterThan){
                                    console.log(`\n${booksList[j].bookTitle}(${booksList[j].author}). Genre: ${authorsList[i].genre}. Rating: ${booksList[j].rate}.`); 
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
    let dataRate = [];    
    let bookId = readLine.question('\nBook ID: \n');
    let bookList = readFile('books.json');
    if (bookList) {
        dataRate = bookList; 
    }          
    if (dataRate.length === 0) {        
        console.log('Please add at least one book');
        mainMenu();                        
    } else if (bookId === null || bookId === '') {
        console.log('Incorrect book ID');
        rate();
    } else {
        ++dataRate[bookId-1].rate;
        console.log(`\nRating: ${dataRate[bookId-1].rate}`);
        saveData(dataRate, 'books.json');
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