const readLine = require('readline-sync');
const fs = require('fs');

const sinon = require('sinon');
const myQuestion = sinon.stub(readLine, 'question');
const baseScenario = [
    'Clear', 'Add', 'Author', '', 'test', '', 'en', 'Back', 'List All', 
    'Add', 'Book', 'Book1', 'test', 'comedy', 'Back', 'List All', 'Exit'    
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

//Object that contains data from files
const db = 
{
    books: readFile('books.json'), 
    authors: readFile('authors.json'),
};

//Function that run all function that are needed for menu displaying
// and running features that correspond to them
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

//Function that print menu in the screen
function printMenu(menu) {
    console.log(menu.label);
    console.log();    
    for(let i = 0; i < menu.options.length; ++i) {
        console.log(i+1+'.', menu.options[i].label);        
    }
    console.log('\n'+'-'.repeat(20));    
}

//Function that ask user which menu item he wants run 
//and return object that correspond to the item selected by user
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

//Function that run selected by user menu item
function performChoice(choice) {
    return choice.action();
}

//Function that is displayed all added authors and books
let listAll = function() {  
    let showAllAuthors = showFactory('authors');
    let showAllBooks = showFactory('books');

    showAllAuthors('\nAll Authors: \n');
    showAllBooks('\nAll Books: \n');
};

function showFactory(type) {
    function show(ListName) {
        let storage = db[type];
        console.log(ListName);        
        for (let i = 0; i < storage.length; ++i) {
            let item = storage[i];
            for (let key in item) {
                console.log(`${key[0].toUpperCase() + key.slice(1)} : ${item[key]}`);
            }
            console.log('-'.repeat(20));
        }
    }
    return show;
}

//Validator for add feature
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

//Feature that asks user what data should be written into certain field 
//and create array with this fields in the object if the fields are valid
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

//Validator for results of Search
function searchResultiSValid(val, validators) {
    for (let i in validators) {
        validator = validators[i];
        let name = validator.name;
        let props = validator.props;

        let temp = [];
        switch(name) {
            case 'required':
                if(props.value && !val) {                   
                    return false;
                }                
                break;
            case 'display':
                for (let i in props.among) {
                    let item = props.among[i];
                    if (item[props.field] === val) {
                        temp.push(item);                                               
                    }
                }
                return temp; 
            case 'less':
                for (let i in props.among) {
                    let item = props.among[i];
                    if (item[props.field] < val) {
                        temp.push(item);                                                 
                    }
                }
                return temp;
            case 'greater':
                for (let i in props.among) {
                    let item = props.among[i];
                    if (item[props.field] > val) {
                        temp.push(item);                                                
                    }
                }
                return temp; 
        }
    }
    // return false;
}

//Function for displaying collected search results
function displaySearch(searchItem) {
    for (let i = 0; i < searchItem.length; ++i) {
        console.log(`${i+1} Title: ${searchItem[i].title}. Author: ${searchItem[i].author}. Genre: ${searchItem[i].author}. Rating: ${searchItem[i].author}.`);        
    }   
}

//Function that takes search query from user and run functions for validation entered query and function for displaying result  
function searchResults(schema) {
    for (let field in schema) {
        console.log(field[0].toUpperCase() + field.slice(1) + ': ');
        let temp = [];
        while(true) {
            let value = readLine.question();
            let searchItem = searchResultiSValid(value, schema[field].validators);
            if (searchItem === false) {
                console.log('Please enter search query: ');
                continue;
            }           
            displaySearch(searchItem);
            break;            
        }
    }
}

//Function that initiate add author process
let addAuthor = function() {
    console.log("Adding new author: ");     
    let schema = schemas.author;
    let temp = getTempData(schema);
    db['authors'].push(temp);
}

//Function that initiate add book process
let addBook =  function() {
    console.log("Adding new book: ");     
    let schema = schemas.book;
    let temp = getTempData(schema);
    temp.rate = 0; //Add default zero rate for each book
    db['books'].push(temp);
}

function search() {
    interact(menus.search);
}

function searchByTitle() {    
    searchResults(searchSchemas.byTitle);
}       

function searchByAuthor() {
    searchResults(searchSchemas.byAuthor);
}

function searchByGenre() {
    searchResults(searchSchemas.byGenre);
}

function searchByRating() {
    interact(menus.rating)
}

function searchByRatingLess() {
    searchResults(searchSchemas.less);
}

function searchByRatingGreater() {
    searchResults(searchSchemas.greater);
}

//Menu "Rate" function
let rate = function() {  
    let bookId = readLine.question('\nBook ID: \n');
    if (db['books'].length === 0) {        
        console.log('Please add at least one book');
    } else if (bookId === null || bookId === '') {
        console.log('Incorrect book ID');
        rate();
    } else {
        ++db['books'][bookId-1].rate;
        console.log(`\nRating: ${db['books'][bookId-1].rate}`);
        saveData(db['books'], 'books.json');
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

//Function that clear curent console window
let reload = function() {
    process.stdout.write('\x1Bc');
}

//Function that return user to the previous menu 
//if "Back" item had been selected 
//and finish the program if "Exit" item had been selected. 
//Also all data saves each time.
let endInterract = function() {
    saveData(db['books'], 'books.json');
    saveData(db['authors'], 'authors.json');
    return 'break';
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
    },

    search: {
        label: 'Search menu',
        options: [
            {label: 'By Title', action: searchByTitle},
            {label: 'By Author', action: searchByAuthor},
            {label: 'By Genre', action: searchByGenre},
            {label: 'By Rating', action: searchByRating},
            {label: 'Back', action: endInterract},
        ]
    },

    rating: {
        label: 'Search by rating',
        options: [
            {label: 'Less', action: searchByRatingLess},
            {label: 'Greater', action: searchByRatingGreater},
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
    },
    book: {
        title: {validators: [
            {name: 'required', props: {value: true}},
        ]},
        author: {validators: [
            {name: 'required', props: {value: true}},
            {name: 'exists', props: {among: db['authors'], field: "name"}}
        ]},
        genre: {validators: [
            {name: 'required', props: {value: true}}
        ]},
    },
};

const searchSchemas = {
    byTitle: {
        title: {validators : [
            {name: 'required', props: {value: true}},
            {name: 'display', props: {field: 'title', among: db['books']}}
        ]},
    },
    byAuthor: {
        author: {validators : [
            {name: 'required', props: {value: true}},
            {name: 'display', props: {field: 'author', among: db['books']}}
        ]},
    },
    byGenre: {
        genre: {validators : [
            {name: 'required', props: {value: true}},
            {name: 'display', props: {field: 'genre', among: db['books']}}
        ]},
    },
    less: {
        less: {validators : [
            {name: 'required', props: {value: true}},
            {name: 'less', props: {field: 'rate', among: db['books']}}
        ]},
    },
    greater: {
        greater: {validators : [
            {name: 'required', props: {value: true}},
            {name: 'greater', props: {field: 'rate', among: db['books']}}
        ]},
    },
};

interact(menus.main);