const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

//Grab the searchForm variable and add on an EventListener
//When you have an EventListener you can pass in an event parameter as well (which we use 'e')

// Form Event Listener
searchForm.addEventListener("submit", e => {
  // Get search term (we grab this from our searchInput variable and grab the value stored in it)
  const searchTerm = searchInput.value;

  // Get sort
  // We can use any kind of selector so we do any input with the name of "sortby" but we want the one that's checked so we use ':checked'
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;

  //Get limit
  const searchLimit = document.getElementById("limit").value;

  // Check input to make sure we don't have an empty form
  if (searchTerm == "") {
    //Show message there is nothing typed in
    showMessage("Please add a search term", "alert-danger");
  }

  //preventDefault to prevent the form from actaully submitting to a file
  e.preventDefault();
});

// Show Message
function showMessage(message, className) {
  // Create the div
  const div = document.createElement("div");

  // Add our classes to that div we just created
  div.className = `alert ${className}`; //We're using backticks because we're going to use a variable; which is a template string which is part of ES6. Now with bootstrap your class should be alert and then whatever the color you want or the type

  // Add text
  // appendChild() means to put something inside of it. In this case put something inside our div
  div.appendChild(document.createTextNode(message));

  //Now to get it into the DOM so it displays
  //Get parent
  const searchContainer = document.getElementById("search-container");
  // Get search
  const search = document.getElementById("search");

  // Insert message
  //so we take the container and we want to insert the 'div' before the 'search' element
  searchContainer.insertBefore(div, search);

  // Timeout to get rid of alert message after a while
  //We can use an arrow instead of a function TODO: need more details on Arrow Functions
  //Since we are grabing a class we use querySelector().
  //setTimeout takes two parameters, what we're doing and then the time to remove, which is in milliseconds
  setTimeout(() => document.querySelector(".alert").remove(), 3000);
}
