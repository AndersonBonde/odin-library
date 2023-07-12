let myLibrary = new Map();

function Book(name, author, pages, read) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function() {
    return `${this.name} by ${this.author}, ${this.pages} pages, ${this.read}`;
}

Book.prototype.toggleRead = function() {
    this.read = this.read == "Yes" ? "No" : "Yes";
}

function addBookToLibrary(bookArr) {
    if(Array.isArray(bookArr)) {
        bookArr.forEach(curr => {
            if(!myLibrary.has(curr.name)) {
                myLibrary.set(curr.name, curr);
            }
        })
    } else {
        if(!myLibrary.has(bookArr.name)) {
            myLibrary.set(bookArr.name, bookArr);
        }
    }
}

// Creating 3 books to populate the list initially;
const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 255, "No");
const harryPotter1 = new Book("Harry Potter and the Philosopher`s Stone", "J.K. Rowling", 223, "Yes");
const harryPotter2 = new Book("Harry Potter and the Chamber of Secrets", "J.K. Rowling", 341, "Yes");

addBookToLibrary([theHobbit, harryPotter1, harryPotter2]);

const bookTable = document.querySelector(".book-table");

function displayBooks(bookArray) {
    clearBookTable();

    bookArray.forEach(curr => {
        let tableRow = document.createElement("tr");
        let values = Object.values(curr);
        let bookName = values[0];

        values.forEach((curr, index) => {
            let td = document.createElement("td");
            td.textContent = curr;
            
            if(index == 3) { // Read column;
                addReadButtonToggle(curr, td, bookName);
            }

            tableRow.appendChild(td);
        })

        addRemoveButtonToRow(bookName, tableRow);
        
        bookTable.appendChild(tableRow);
    });
}
displayBooks(myLibrary);

function clearBookTable() {
    let tr = document.querySelectorAll("tr");
    tr = Array.from(tr).slice(1); // Remove first row from selection(Header);

    tr.forEach(curr => {
        bookTable.removeChild(curr);
    })
}

function addReadButtonToggle(curr, td, bookName) {
    let button = document.createElement("button");
    button.classList.add("read-button");
    button.dataset.book = bookName;

    if(curr == "Yes") {
        button.innerHTML = "&check;";
        button.style.cssText = "background-color: greenyellow;"
    } else {
        button.innerHTML = "&#10005;";
        button.style.cssText = "background-color: tomato; color: white;"
    }

    button.addEventListener("click", (e) => {
        let toSwitch = e.target.dataset.book;
        let book = myLibrary.get(toSwitch);
        book.toggleRead();
        displayBooks(myLibrary);
    })

    td.style.cssText = "display: flex; justify-content: space-between; align-items: center;";
    td.appendChild(button);
}

function addRemoveButtonToRow(bookName, tableRow) {
    let td = document.createElement("td");
    let removeButton = document.createElement("button");

    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-button");
    removeButton.dataset.book = bookName;

    removeButton.addEventListener("click", (e) => {
        let toDelete = e.target.dataset.book;

        if(myLibrary.get(toDelete) !== undefined) {
            myLibrary.delete(toDelete);
        }

        displayBooks(myLibrary);
    })

    td.appendChild(removeButton);
    tableRow.appendChild(td);
}

const addNewButton = document.querySelector(".addBook");
const closeModalButton = document.querySelector(".close-modal");
const bookFormContainer = document.querySelector(".form-container");
const overlay = document.querySelector(".overlay");
const modalSubmitButton = document.querySelector('button[type="submit"]');

const bookTitle = document.querySelector("#book-title");
const bookAuthor = document.querySelector("#book-author");
const bookPages = document.querySelector("#book-pages");
const readRadio = document.getElementsByName("book-read");

addNewButton.addEventListener("click", openBookModal);
closeModalButton.addEventListener("click", closeBookModal);
overlay.addEventListener("click", closeBookModal);
modalSubmitButton.addEventListener("click", createBook);

function openBookModal() {
    overlay.classList.add("active");
    bookFormContainer.classList.add("active");
}

function closeBookModal() {
    clearFormFields();

    overlay.classList.remove("active");
    bookFormContainer.classList.remove("active");
}

function clearFormFields() {
    bookTitle.value = "";
    bookAuthor.value = "";
    bookPages.value = "";
    readRadio[0].checked = true;
}

function createBook(e) {
    e.preventDefault();

    let currTitle = bookTitle.value;
    let currAuthor = bookAuthor.value;
    let currPages = bookPages.value;
    let currRead = Array.from(readRadio).find(radio => radio.checked).value;

    let book = new Book(currTitle, currAuthor, currPages, currRead);
    addBookToLibrary(book);
    displayBooks(myLibrary);

    closeBookModal();
}