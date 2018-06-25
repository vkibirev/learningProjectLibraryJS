let read = require('readline-sync');
let mainMenu = function() {
    
    console.log('\nLibrary');    
    console.log(`
    1: List all
    2: Search
    3: Add
    4: Rate
    5: Clear
    6: Reload`);

    let selectedItem = read.question();
    switch(selectedItem) {
        case '1':
        case 'List All': 
            listAll();
            break;
        default: 
            console.log('incorrect');
            break;
            
    }
};

let listAll = function() {
    console.log('List All');
};

mainMenu();