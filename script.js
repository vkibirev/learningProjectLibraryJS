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
            break;            
    }
};

let listAll = function() {
    console.log('List All');
};

let search = function() {

    console.log('\nSearch');
    console.log(`
    1: By title
    2: By author
    3: By genre
    4: By rating
    5: Back`);

    let selectedItem = read.question();
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
            
            
    }
}

mainMenu();