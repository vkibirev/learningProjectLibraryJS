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
let find = function (data, value) {
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
                if (find(dataAuthors, authorName)) {
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
            let tempBooks = {};
            let dataBooks = [];
            let authorsList = readFile('authors.json'); 
            existingBooks = readFile('books.json');
            if (existingBooks) {
                dataBooks = existingBooks;
            }

            let bookTitle = readLine.question('Title: ');
            tempBooks.bookTitle = bookTitle;
            while(true) {
                let bookAuthor = readLine.question('Author: ');
                if (find(authorsList, bookAuthor)) {                    
                    tempBooks.author = bookAuthor;
                    break;
                }
                console.log('Incorrect author\n');
            }
            dataBooks.push(tempBooks);
            saveData(dataBooks, 'books.json');
            add();
            break;
    }
}

let mainMenu = function() {
    
    console.log('\nLibrary\n');    
    console.log(`1: List all\n2: Search\n3: Add\n4: Rate\n5: Clear\n6: Reload`);    

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

let listAll = function() {
    console.log('List All');
};

let search = function() {

    console.log('\nSearch\n');
    console.log(`1: By title\n2: By author\n3: By genre\n4: By rating\n5: Back`);

    let selectedItem = readLine.question();
    switch (selectedItem) {
        case '1':
        case 'By title':
            console.log('by title');
            break;
        case '2':
        case 'By author':
            console.log('by author');
            break;
        case '3':
        case 'By genre':
            console.log('by genre');
            break;
        case '4':
        case 'By rating':
            console.log('by rating');
            break;
        case '5':
        case 'Back':
            mainMenu();
            break;
        default:
            console.log('Incorrect item had been chosen');
            break;        
    }
}

let add = function() {
    console.log('\nAdd entity\n');
    console.log(`1: Author\n2: Book\n3: Back`);

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

let rate = function() {
    console.log('\nBook ID\n');
}

let clear = function() {
    console.log('\nLibrary is empty now\n');
    mainMenu();    
}

let reload = function() {
    process.stdout.write("\u001b[2J\u001b[0;0H");
    mainMenu();
}

mainMenu();