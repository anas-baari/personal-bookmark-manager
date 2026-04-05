const getBookmarks = () => {
    const savedData = localStorage.getItem("bookmarks");

    //  If there's no data in storage, return an empty list
    if (!savedData) {
        return [];
    }

    //  Convert the string from storage back into a JavaScript list
    const storedBookmarks = JSON.parse(savedData);

    //  Double-check: Is it actually a list (Array)?
    if (Array.isArray(storedBookmarks)) {
        return storedBookmarks;
    } else {
        //  If someone saved something weird (like a single word), return an empty list
        return [];
    }
};

let bookmarks = getBookmarks();

// DOM Elements
// The Sections (Containers)
const mainSection = document.getElementById("main-section");
const formSection = document.getElementById("form-section");
const bookmarkListSection = document.getElementById("bookmark-list-section");
const categoryList = document.getElementById("category-list");

// The Inputs & Dropdown
const nameInput = document.getElementById("name");
const urlInput = document.getElementById("url");
const categoryDropdown = document.getElementById("category-dropdown");

// The Navigation & Form Buttons
const addBookmarkBtn = document.getElementById("add-bookmark-button");
const closeFormBtn = document.getElementById("close-form-button");
const addBookmarkFormBtn = document.getElementById("add-bookmark-button-form");

// The Category & List Buttons
const viewCategoryBtn = document.getElementById("view-category-button");
const closeListBtn = document.getElementById("close-list-button");
const deleteBookmarkBtn = document.getElementById("delete-bookmark-button");

const categoryNameDisplay = document.querySelectorAll(".category-name");

// Switches the view between the main menu and the bookmark entry form
function displayOrCloseForm() {
    mainSection.classList.toggle("hidden");
    formSection.classList.toggle("hidden");
}

// Filters bookmarks by the selected category and renders them as radio
function displayBookmarks() {
    //  Refresh the bookmarks array from storage before filtering
    bookmarks = getBookmarks();

    const selectedCategory = categoryDropdown.value;
    const filteredBookmarks = bookmarks.filter((bookmark) => {
        return bookmark.category === selectedCategory;
    });

    categoryList.innerHTML = "";

    if (filteredBookmarks.length === 0) {
        categoryList.innerHTML = "<p>No Bookmarks Found</p>";
        return;
    }

    filteredBookmarks.forEach((item) => {
        categoryList.innerHTML +=
            `<div class="bookmark-item">
                <input type="radio" id="${item.name}" value="${item.name}" name="bookmark-radio">
                <label for="${item.name}"><a href="${item.url}">${item.name}</a></label>
            </div>`;
    });
}
// Deletes the selected bookmark from the current category and updates the UI
function deleteBookmark() {
    const selectedRadio = document.querySelector('input[name="bookmark-radio"]:checked');
    if (!selectedRadio) return;

    // Get the latest data before filtering
    bookmarks = getBookmarks();

    const nameToDelete = selectedRadio.value;
    const currentCategory = categoryDropdown.value;

    bookmarks = bookmarks.filter((bookmark) => {
        return !(bookmark.name === nameToDelete && bookmark.category === currentCategory);
    });

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    displayBookmarks();
}


// The "Add" Button
addBookmarkBtn.addEventListener("click", () => {
    categoryNameDisplay.forEach((heading) => {
        heading.textContent = categoryDropdown.value;
    })
    displayOrCloseForm();
})

// The "Go Back" Button
closeFormBtn.addEventListener("click", () => {
    displayOrCloseForm();
})

// the "addBookmarkFormBtn"
addBookmarkFormBtn.addEventListener("click", () => {
    if (nameInput.value.trim() === "" || urlInput.value.trim() === "") {
        alert("Please, provide valid name and URL");
        return;
    }

    // Refresh the local array from storage first to ensure it's current
    bookmarks = getBookmarks();

    const newBookmark = {
        name: nameInput.value,
        category: categoryDropdown.value,
        url: urlInput.value,
    };

    bookmarks.push(newBookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    nameInput.value = "";
    urlInput.value = "";
    displayOrCloseForm();
});

// Switches the view between the main menu and the category bookmark list
function displayOrHideCategory() {
    mainSection.classList.toggle("hidden");
    bookmarkListSection.classList.toggle("hidden");
}

// View category button
viewCategoryBtn.addEventListener("click", () => {
    categoryNameDisplay.forEach((heading) => {
        heading.textContent = categoryDropdown.value;
    })

    displayBookmarks();
    displayOrHideCategory();

});

// Go back to main menu from bookmark list
closeListBtn.addEventListener("click", () => {
    displayOrHideCategory();
})

// delete bookmark button event
deleteBookmarkBtn.addEventListener("click", () => {
    deleteBookmark();
})
