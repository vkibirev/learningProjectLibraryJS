let read = require('readline-sync');
let mainMenu = function() {
    
    console.log('\nLibrary\n');    
    console.log(`1: List all\n2: Search\n3: Add\n4: Rate\n5: Clear\n6: Reload`);    

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

    console.log('\nSearch\n');
    console.log(`1: By title\n2: By author\n3: By genre\n4: By rating\n5: Back`);

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
        default:
            console.log('Incorrect item had been chosen');
            break;        
    }
}

let add = function() {
    console.log('\nAdd entity\n');
    console.log(`1: Author\n2: Book\n3: Back`);

    let selectedItem = read.question();
    switch (selectedItem) {
        case '1':
        case 'Author':
            console.log('add author');
            break;
        case '2':
        case 'Book':
            console.log('add book');
            break;
        case '3':        
        case 'Back':
            mainMenu();
            break;
        default:
            console.log('Incorrect item had been chosen');
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