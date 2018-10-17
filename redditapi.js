export default {
  search: function(searchTerm, searchLimit, sortBy) {
    //This is where we're goign to make our request. ?q= is to query
    return fetch(
      //fetch returns a promise
      `http://www.reddit.com/search.json?q=${searchTerm}&sort]${sortBy}&limit=${searchLimit}`
    )
      .then(res => res.json()) // with the fetch api we'll do a .then to get the dresponse and then say we want that response in .json //Then we do another .then to give us the data
      .then(data => data.data.children.map(data => data.data))
      .catch(err => console.log(err)); //Put a catch error function at the end just in case. TODO: are lines 6-10 essentially just one giant line of code separated for the sake of readability? FIND OUT!
  }
};
