const readLine = require('readline-sync');
const fs = require('fs');
const sinon = require('sinon');

const myQuestion = sinon.stub(readLine, 'question');
const baseScenario = [
    'Clear', 'List All', 'Add', 'Author', '', 'test', '', 'en', 'drama', 'Back', 'List All', 
    'Add', 'Author', 'test2', 'ru', 'comedy', 'Back', 'List All', 
    'Add', 'Book', '', 'bookTitle1', 'test3', '', 'test', 'Back', 'List All',
    'Exit', 
];

for (let i = 0; i < baseScenario.length; ++i) {
    myQuestion.onCall(i).returns(baseScenario[i]);
}

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
    authors: readFile('authors.json'),
};

//Search function, uses for comparing data from JOSN and cmd
let foundAuthor = function (data, value) {
    for (let i = 0; i < data.length; ++i) {
        if (data[i].name === value) {
            return value;
        }
    }
}

function isValid(val, validators) {
    for (let i in validators) {
        let validator = validators[i];
        let name = validator.name;
        let props = validator.props;

        switch(name) {
            case 'required':
                if(props.value && !val) {                   
                    return false;
                }
                break;
            case 'unique':
                for (let i in props.among) {
                    let item = props.among[i];
                    if(item[props.field] === val) {                      
                        return false;
                    }
                }
                break;
            case 'exists':
                for (let i in props.among) {
                    let item = props.among[i];
                    if(item[props.field] === val) {
                        return true;
                    }                 
                }
            break;
        }
    }
    return true;
}

function getTempData(schema) {

    let temp = {};
    for (let field in schema) {
        console.log(field[0].toUpperCase() + field.slice(1) + ': ');        
        while (true) {
            let value = readLine.question();   
            
            if (isValid(value, schema[field].validators)) {
                temp[field] = value;
                break;
            }
            console.log(`${field} is incorrect!`);            
        }
    }
    return temp;
}

let addAuthor = function() {
    console.log("Adding new author: ");     
    let schema = schemas.author;
    let temp = getTempData(schema);
    db['authors'].push(temp);
}

let addBook =  function() {
    console.log("Adding new book: ");     
    let schema = schemas.book;
    let temp = getTempData(schema);
    temp.rate = 0; //Add default zero rate for each book
    db['books'].push(temp);
}


//Function that is displayed all added authors and books
let listAll = function() {    
    console.log('\nAuthors: \n');
    for (let i = 0; i < db['authors'].length; ++i) {
        console.log(`${i+1}: ${db['authors'][i].name}(${db['authors'][i].lang}). ${db['authors'][i].genre}`);        
    }
    console.log('\nBooks: \n');
    for (let i = 0; i < db['books'].length; ++i) {
        console.log(`${i+1}: ${db['books'][i].title}(${db['books'][i].author}). Rating: ${db['books'][i].rate}`);        
    }   
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
    db['books'] = [];
    db['authors'] = [];
    console.log('\nLibrary is empty now\n');
    saveData(db['books'], 'authors.json');
    saveData(db['books'], 'books.json');    
}

//Function that clear curent console window and call mainMenu
let reload = function() {
    process.stdout.write('\x1Bc');
}

let endInterract = function() {
    saveData(db['books'], 'books.json');
    saveData(db['authors'], 'authors.json');
    return 'break';
}

function interact(menu) {
    while (true) {
        printMenu(menu)
        let choice = askForChoice(menu.options)
        let result = performChoice(choice)
        if (result === 'break') {
            break;
        }
    }    
}

function printMenu(menu) {
    console.log(menu.label);
    console.log();    
    for(let i = 0; i < menu.options.length; ++i) {
        console.log(i+1+'.', menu.options[i].label);        
    }
    console.log('-'.repeat(20));    
}

function askForChoice(menu) {
    while(true) {
        let userChoice = readLine.question('Select menu option: ');
        let option = menu[userChoice - 1];

        if (option) {
            return option;
        }
        for (let i = 0; i < menu.length; ++i) {
            if (menu[i].label === userChoice) {
                return menu[i];
            }
        }
        console.log(`Incorrect choice: ${userChoice}`);        
    }
}

function performChoice(choice) {
    return choice.action();
}

const menus = {
    main: {
        label: 'Main menu',
        options: [
            {label: 'List All', action: listAll},
            {label: 'Search', action: search},
            {label: 'Add', action: (function add() {interact(menus.add)})},
            {label: 'Rate', action: rate},
            {label: 'Clear', action: clear},
            {label: 'Reload', action: reload},
            {label: 'Exit', action: endInterract},
        ]
    },

    add: {
        label: 'Create entity',
        options: [
            {label: 'Author', action: addAuthor},
            {label: 'Book', action: addBook},
            {label: 'Back', action: endInterract},
        ]
    }
}

const schemas = {
    author: {
        name: {validators: [
            {name: 'required', props: {value: true}}, 
            {name: 'unique', props: {field: 'name', among: db['authors']}}
        ]},
        lang: {validators: [
            {name: 'required', props: {value: true}}
        ]},
        genre: {validators: [
            {name: 'required', props: {value: true}}
        ]},
    },
    book: {
        title: {validators: [
            {name: 'required', props: {value: true}},
        ]},
        author: {validators: [
            {name: 'required', props: {value: true}},
            {name: 'exists', props: {among: db['authors'], field: "name"}}
        ]},
    },    
};

interact(menus.main);