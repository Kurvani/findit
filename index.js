import reddit from "./redditapi";

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

  // Clear input when typing in search
  searchInput.value = "";

  // Search Reddit (we imported our reddit search function that uses the Reddit API)
  reddit.search(searchTerm, searchLimit, sortBy).then(results => {
    let output = '<div class="card-columns">'; //We use let for our variable because we're goign to manipulate it
    // Loop through posts
    results.forEach(post => {
      // Check for image. We're essentailly saying if the post has a preview image use it, otherwise use the image at the URL. The ':' means else.
      const image = post.preview
        ? post.preview.images[0].source.url
        : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg";

      output += `
        <div class="card">
  <img class="card-img-top" src="${image}" alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">${post.title}</h5>
    <p class="card-text">${truncateText(post.selftext, 100)}</p>
    <a href="${post.url}" target="_blank" class="btn btn-primary">Read More</a>
    <hr>
    <span class="badge badge-secondary">Subreddit: ${post.subreddit}</span>
    <span class="badge badge-dark">Upvotes: ${post.score}</span>
    </div>
</div>
        `;
    });
    output += "</div>"; //Append the ending div to our output
    document.getElementById("results").innerHTML = output;
  });

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

// Truncate Text
function truncateText(text, limit) {
  const shortened = text.indexOf(" ", limit);
  if (shortened == -1) return text;
  return text.substring(0, shortened);
}
