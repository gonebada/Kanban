
//ladowanie aplikacji po zaladowaniu drzewa DOM 
document.addEventListener('DOMContentLoaded', function () {
    function randomString() {
        var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
        var str = '';
        //losowanie ID 
        for (var i = 0; i < 10; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }
    //template generator //
    function generateTemplate(name, data, basicElement) {
        var template = document.getElementById(name).innerHTML;
        var element = document.createElement(basicElement || 'div');
        // if (name == 'columne-,template') {
        //     element.classList.add('column-parent');
        // }
        Mustache.parse(template);
        element.innerHTML = Mustache.render(template, data);
        return element;
    };

    //Klasa Column
    function Column(name) {
        let self = this;

        this.id = randomString();
        this.name = name;
        this.element = generateTemplate('column-template', { name: this.name, id: this.id });
        // initSortable(this.element.querySelector('ul'), 'card');
        //po tym query selectorattribute id 
        this.element.querySelector('.column').addEventListener('click', function (event) {
            if (event.target.classList.contains('btn-delete')) {
                self.removeColumn();
            }
            if (event.target.classList.contains('add-card')) {
                self.addCard(new Card(prompt("Enter the name of the card")));
            }
        })
    };
    Column.prototype = {
        addCard: function (card) {
            this.element.querySelector('ul').appendChild(card.element);
        },
        removeColumn: function() {
            this.element.parentNode.removeChild(this.element);
          }
    };

    function Card(description) {
        const self = this;

        this.id = randomString();
        this.description = description;
        this.element = generateTemplate('card-template', { description: this.description }, 'li');

        this.element.querySelector('.card').addEventListener('click', function (event) {
            event.stopPropagation();
            if (event.target.classList.contains('btn-delete')) {
                self.removeCard();
            }
        });
    }
    Card.prototype = {
        removeCard: function () {
            this.element.parentNode.removeChild(this.element);
        }
    };

    const board = {
        name: 'Kanban Board',
        addColumn: function (column) {
            this.element.appendChild(column.element);
            initSortable(column.id); //przenoszenie z jednego miejsca do drugiego
        },
        element: document.querySelector('#board .column-container')

    };
    document.querySelector('#board .create-column').addEventListener('click', function () {
        var name = prompt('Enter a column name');
        var column = new Column(name);
        board.addColumn(column);
    });

    //funkcja umozliwiajaca sortowanie i przenoszenie obiektow z jednego na drugi
    function initSortable(id) {
        var el = document.getElementById(id);
        var sortable = Sortable.create(el, {
            group: 'kanban',
            sort: true
        });
    }


    ///Create columns
    var todoColumn = new Column('To do');
    var doingColumn = new Column('Doing');
    var doneColumn = new Column('Done');
    ///add column to bard
    board.addColumn(todoColumn);
    board.addColumn(doingColumn);
    board.addColumn(doneColumn);

    ///Creating Cards
    var card1 = new Card('You have to finish your course ');
    var card2 = new Card('In progress two modules');
    var card3 = new Card(' You completed 30%');

    // add card to column
    todoColumn.addCard(card1);
    doingColumn.addCard(card2);
    doneColumn.addCard(card3);

});

