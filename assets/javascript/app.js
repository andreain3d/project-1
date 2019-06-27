// queryURL is the url we'll use to query the API
var queryURLRand = "https://www.themealdb.com/api/json/v1/1/random.php";
var queryURLCat = "https://www.themealdb.com/api/json/v1/1/categories.php";
var queryURLFilt = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";
var queryURLName = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
// Begin building an object to contain our API call's query parameters
// Set the API key
var queryParams = { "api-key": "1" };

// Grab text the user typed into the search input, add to the queryParams object
queryParams.q = $("#name-input")
  .val()
  .trim();
var queryURLName =
  "https://www.themealdb.com/api/json/v1/1/search.php?s=" + $("#name-input");
$("#search-btn").on("click", function(event) {
  $.ajax({
    url: queryURLName,
    method: "GET"
  });
});

// If the user selects the random button, include it in the queryParams object
var queryURLRand = "https://www.themealdb.com/api/json/v1/1/random.php";
var randomRecipe = $("#random-btn").on("click", function(event) {
  $.ajax({
    url: queryURLRand,
    method: "GET"
  });
});

// If the user wants to search by ingredient, include it in the queryParams object
var ingredient = $("#ingredient-input")
  .val()
  .trim();
var queryURLFilt =
  "https://www.themealdb.com/api/json/v1/1/filter.php?i=" + ingredient;
$("#search-btn").on("click", function(event) {
  $.ajax({
    url: queryURLFilt,
    method: "GET"
  });
});

// If the user provides a filter, include it in the queryParams object
var category = $("#category-input");
if (parseInt(category)) {
  queryParams.category_filter = category;
  var queryURLCat = "https://www.themealdb.com/api/json/v1/1/categories.php";
  $("#search-btn").on("click", function(event) {
    $.ajax({
      url: queryURLCat,
      method: "GET"
    });
  });

  // Logging the URL so we have access to it for troubleshooting
  console.log(
    "---------------\nURL: " +
      queryURLCat +
      queryURLFilt +
      queryURLName +
      queryURLRand +
      "\n---------------"
  );
  console.log(queryURLRand + $.param(queryParams));
  console.log(queryURLName + $.param(queryParams));
  console.log(queryURLCat + $.param(queryParams));
  console.log(queryURLFilt + $.param(queryParams));
}

// Get from the form the number of results to display
// API doesn't have a "limit" parameter, so we have to do this ourselves
var categoryCount = $("#category-input").val();

// Log the NYTData to console, where it will show up as an object
console.log(MealDB);
console.log("------------------------------------");

// Loop through and build elements for the number of category choices
for (var i = 0; i < categoryCount; i++) {
  // Get specific article info for current index
  var categorySelection = MealDB.response.docs[i];

  var categoryNum = i + 1;
}

function clear() {
  $("#name-input").empty();
  $("#category-input").empty();
  $("#ingredient-input").empty();
}

// CLICK HANDLERS
// ==========================================================

// .on("click") function associated with the Search Button
$("#search-btn").on("click", function(event) {
  // This line allows us to take advantage of the HTML "submit" property
  // This way we can hit enter on the keyboard and it registers the search
  // (in addition to clicks). Prevents the page from reloading on form submit.
  event.preventDefault();

  // Empty the region associated with the recipes
  clear();

  var queryURL = buildQueryURL();

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(updatePage);
});
