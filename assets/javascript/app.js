/*******************VARIABLES AND FUNCTION DEFINITIONS**************/

var mealID = "";
var recipe;
var protein = 0;
var carbs = 0;
var fat = 0;

var emptyInfo = function() {
  $("#title").empty();
  $("#ingredients-list").empty();
  $("#directions").empty();
  $("#cal").empty();
  $("#fat").empty();
  $("#satfat").empty();
  $("#chol").empty();
  $("#sodium").empty();
  $("#carb").empty();
  $("#fiber").empty();
  $("#sugar").empty();
  $("#protein").empty();
  $("#chart-container").empty();
};

var infoNotAvailable = function() {
  $("#cal").text("Not Available");
  $("#protein").text("Not Available");
  $("#carb").text("Not Available");
  $("#fat").text("Not Available");
  $("#satfat").text("Not Available");
  $("#chol").text("Not Available");
  $("#sodium").text("Not Available");
  $("#fiber").text("Not Available");
  $("#sugar").text("Not Available");
};

var printNutrients = function(nutrients, macro, id, unit) {
  var chartMacro = 0;
  if (nutrients[macro]) {
    if (macro === "PROCNT" || macro === "FAT" || macro === "CHOCDF") {
      chartMacro = Math.round(nutrients[macro].quantity / 4);
    }
    $(`#${id}`).text(Math.round(nutrients[macro].quantity / 4) + unit);
    return chartMacro;
  } else {
    $(`#${id}`).text("0" + unit);
  }
};

//Function to generate Pie chart
var makeChart = function() {
  //creates new canvas to render chart
  var newCanvas = $("<canvas>").attr({
    id: "macroChart",
    height: "400px",
    width: "400px"
  });

  //appends new canvas into the html document
  $("#chart-container").append(newCanvas);
  //renders chart on canvas
  var ctx = document.getElementById("macroChart").getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "pie",

    // The data for our dataset
    data: {
      labels: ["Protein", "Carbs", "Fat"],
      datasets: [
        {
          data: [protein, carbs, fat],
          backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C"]
        }
      ]
    },

    // Configuration options go here
    options: {}
  });
};

/*********************ON CLICK EVENTS*************************/

//on clicking search button for ingredient field, creates query url and calls API
$("#search-btn-ingredient").on("click", function() {
  var ingredientKeyword =
    "i=" +
    $("#ingredient-input")
      .val()
      .trim();
  var queryURL =
    "https://www.themealdb.com/api/json/v1/1/filter.php?" + ingredientKeyword;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    //pulls a random recipe from the response array and gets its id
    var randomRecipe = Math.floor(Math.random() * response.meals.length);
    mealID = response.meals[randomRecipe].idMeal;

    //calls API again to search by ID for individual recipe information
    var idURL =
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealID;
    $.ajax({
      url: idURL,
      method: "GET"
    }).then(function(response) {
      // Printing the entire object to console
      console.log(response);

      //pulls title, directions, and image url from response and sets to variables
      var title = response.meals[0].strMeal;
      var directions = response.meals[0].strInstructions;
      var imageURL = response.meals[0].strMealThumb;

      //pulls measure and ingredient information from response, puts them back together in the right order, then stores in an array
      var measuresArray = [
        response.meals[0].strMeasure1 + " " + response.meals[0].strIngredient1,
        response.meals[0].strMeasure2 + " " + response.meals[0].strIngredient2,
        response.meals[0].strMeasure3 + " " + response.meals[0].strIngredient3,
        response.meals[0].strMeasure4 + " " + response.meals[0].strIngredient4,
        response.meals[0].strMeasure5 + " " + response.meals[0].strIngredient5,
        response.meals[0].strMeasure6 + " " + response.meals[0].strIngredient6,
        response.meals[0].strMeasure7 + " " + response.meals[0].strIngredient7,
        response.meals[0].strMeasure8 + " " + response.meals[0].strIngredient8,
        response.meals[0].strMeasure9 + " " + response.meals[0].strIngredient9,
        response.meals[0].strMeasure10 +
          " " +
          response.meals[0].strIngredient10,
        response.meals[0].strMeasure11 +
          " " +
          response.meals[0].strIngredient11,
        response.meals[0].strMeasure12 +
          " " +
          response.meals[0].strIngredient12,
        response.meals[0].strMeasure13 +
          " " +
          response.meals[0].strIngredient13,
        response.meals[0].strMeasure14 +
          " " +
          response.meals[0].strIngredient14,
        response.meals[0].strMeasure15 +
          " " +
          response.meals[0].strIngredient15,
        response.meals[0].strMeasure16 +
          " " +
          response.meals[0].strIngredient16,
        response.meals[0].strMeasure17 +
          " " +
          response.meals[0].strIngredient17,
        response.meals[0].strMeasure18 +
          " " +
          response.meals[0].strIngredient18,
        response.meals[0].strMeasure19 +
          " " +
          response.meals[0].strIngredient19,
        response.meals[0].strMeasure20 + " " + response.meals[0].strIngredient20
      ];

      console.log(title);
      console.log(directions);
      console.log(measuresArray);
      emptyInfo();
      //loops through measuresArray, checks if the ingredient line exists, then appends it to ingredients list in the document
      for (i = 0; i < measuresArray.length; i++) {
        if (
          measuresArray[i] !== " " &&
          measuresArray[i] !== "null null" &&
          measuresArray[i] !== "  "
        ) {
          $("#ingredients-list").append($("<li>" + measuresArray[i] + "</li>"));
        }
      }

      //creates proper recipe format for the Edamam API from the mealDB response info
      recipe = {
        title: title,
        prep: "",
        yield: 4,
        ingr: measuresArray.filter(function(item) {
          return item !== " ";
        })
      };

      //Create the XHR object.
      function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
          // XHR for Chrome/Firefox/Opera/Safari.
          xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
          // XDomainRequest for IE.
          xhr = new XDomainRequest();
          xhr.open(method, url);
        } else {
          // CORS not supported.
          xhr = null;
        }
        return xhr;
      }
      var app_id = "5e802351";
      var app_key = "13bf29d458997ee7632f5d5a606996a3";
      // Makes the CORS request to the Edamam API
      function makeCorsRequest() {
        var url =
          "https://api.edamam.com/api/nutrition-details?app_id=" +
          app_id +
          "&app_key=" +
          app_key;
        var xhr = createCORSRequest("POST", url);
        if (!xhr) {
          alert("CORS not supported");
          return;
        }
        // Response handlers.
        xhr.onload = function() {
          console.log(JSON.parse(xhr.responseText));
          var response = JSON.parse(xhr.responseText);
          console.log(response.totalNutrients);
          //checks if nutrition data is returned
          if (response.totalNutrients !== undefined) {
            //writes nutrition data to page and updates variables for protein/fat/carbs macros
            protein = printNutrients(
              response.totalNutrients,
              "PROCNT",
              "protein",
              " g"
            );
            carbs = printNutrients(
              response.totalNutrients,
              "CHOCDF",
              "carb",
              " g"
            );
            fat = printNutrients(response.totalNutrients, "FAT", "fat", " g");
            printNutrients(response.totalNutrients, "FASAT", "satfat", " g");
            printNutrients(response.totalNutrients, "ENERC_KCAL", "cal", "");
            printNutrients(response.totalNutrients, "CHOLE", "chol", " mg");
            printNutrients(response.totalNutrients, "NA", "sodium", " mg");
            printNutrients(response.totalNutrients, "FIBTG", "fiber", " g");
            printNutrients(response.totalNutrients, "SUGAR", "sugar", " g");

            //renders pie chart
            makeChart();
          } else {
            //wites "not available" on page in place of nutrition details
            infoNotAvailable();
          }
        };

        xhr.onerror = function() {
          alert("Woops, there was an error making the request.");
        };

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(recipe));
      }

      makeCorsRequest();
      //Writes recipe title, directions, and image to the page
      $("#title").text(title);
      $("#directions").text(directions);
      $("#recipe-image").css({
        background: "url(" + imageURL + ")",
        "background-position": "center",
        "background-repeat": "no-repeat",
        "background-size": "cover"
      });
    });
  });
});

//on clicking search button for category field, creates query url and calls API
$("#search-btn-category").on("click", function() {
  var category = "c=" + $("#category-input").val();
  var queryURL =
    "https://www.themealdb.com/api/json/v1/1/filter.php?" + category;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    //pulls a random recipe from the response array and gets its id
    var randomRecipe = Math.floor(Math.random() * response.meals.length);
    mealID = response.meals[randomRecipe].idMeal;
    var idURL =
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealID;

    //calls API again to search by ID for individual recipe information
    $.ajax({
      url: idURL,
      method: "GET"
    }).then(function(response) {
      // Printing the entire object to console
      console.log(response);

      //pulls title, directions, and image url from response and sets to variables
      var title = response.meals[0].strMeal;
      var directions = response.meals[0].strInstructions;
      var imageURL = response.meals[0].strMealThumb;

      //pulls measure and ingredient information from response, puts them back together in the right order, then stores in an array
      var measuresArray = [
        response.meals[0].strMeasure1 + " " + response.meals[0].strIngredient1,
        response.meals[0].strMeasure2 + " " + response.meals[0].strIngredient2,
        response.meals[0].strMeasure3 + " " + response.meals[0].strIngredient3,
        response.meals[0].strMeasure4 + " " + response.meals[0].strIngredient4,
        response.meals[0].strMeasure5 + " " + response.meals[0].strIngredient5,
        response.meals[0].strMeasure6 + " " + response.meals[0].strIngredient6,
        response.meals[0].strMeasure7 + " " + response.meals[0].strIngredient7,
        response.meals[0].strMeasure8 + " " + response.meals[0].strIngredient8,
        response.meals[0].strMeasure9 + " " + response.meals[0].strIngredient9,
        response.meals[0].strMeasure10 +
          " " +
          response.meals[0].strIngredient10,
        response.meals[0].strMeasure11 +
          " " +
          response.meals[0].strIngredient11,
        response.meals[0].strMeasure12 +
          " " +
          response.meals[0].strIngredient12,
        response.meals[0].strMeasure13 +
          " " +
          response.meals[0].strIngredient13,
        response.meals[0].strMeasure14 +
          " " +
          response.meals[0].strIngredient14,
        response.meals[0].strMeasure15 +
          " " +
          response.meals[0].strIngredient15,
        response.meals[0].strMeasure16 +
          " " +
          response.meals[0].strIngredient16,
        response.meals[0].strMeasure17 +
          " " +
          response.meals[0].strIngredient17,
        response.meals[0].strMeasure18 +
          " " +
          response.meals[0].strIngredient18,
        response.meals[0].strMeasure19 +
          " " +
          response.meals[0].strIngredient19,
        response.meals[0].strMeasure20 + " " + response.meals[0].strIngredient20
      ];

      console.log(title);
      console.log(directions);
      console.log(measuresArray);
      emptyInfo();

      //loops through measuresArray, checks if the ingredient line exists, then appends it to ingredients list in the document
      for (i = 0; i < measuresArray.length; i++) {
        if (
          measuresArray[i] !== " " &&
          measuresArray[i] !== "null null" &&
          measuresArray[i] !== "  "
        ) {
          $("#ingredients-list").append($("<li>" + measuresArray[i] + "</li>"));
        }
      }

      //creates proper recipe format for the Edamam API from the mealDB response info
      recipe = {
        title: title,
        prep: "",
        yield: 4,
        ingr: measuresArray.filter(function(item) {
          return item !== " ";
        })
      };

      //Create the XHR object.
      function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
          // XHR for Chrome/Firefox/Opera/Safari.
          xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
          // XDomainRequest for IE.
          xhr = new XDomainRequest();
          xhr.open(method, url);
        } else {
          // CORS not supported.
          xhr = null;
        }
        return xhr;
      }
      var app_id = "5e802351";
      var app_key = "13bf29d458997ee7632f5d5a606996a3";
      // Make the CORS request to the Edamam API
      function makeCorsRequest() {
        var url =
          "https://api.edamam.com/api/nutrition-details?app_id=" +
          app_id +
          "&app_key=" +
          app_key;
        var xhr = createCORSRequest("POST", url);
        if (!xhr) {
          alert("CORS not supported");
          return;
        }
        // Response handlers.
        xhr.onload = function() {
          console.log(JSON.parse(xhr.responseText));
          var response = JSON.parse(xhr.responseText);

          //checks if nutrition data is returned
          if (response.totalNutrients !== undefined) {
            //writes nutrition data to page and updates variables for protein/fat/carbs macros
            protein = printNutrients(
              response.totalNutrients,
              "PROCNT",
              "protein",
              " g"
            );
            carbs = printNutrients(
              response.totalNutrients,
              "CHOCDF",
              "carb",
              " g"
            );
            fat = printNutrients(response.totalNutrients, "FAT", "fat", " g");
            printNutrients(response.totalNutrients, "FASAT", "satfat", " g");
            printNutrients(response.totalNutrients, "ENERC_KCAL", "cal", "");
            printNutrients(response.totalNutrients, "CHOLE", "chol", " mg");
            printNutrients(response.totalNutrients, "NA", "sodium", " mg");
            printNutrients(response.totalNutrients, "FIBTG", "fiber", " g");
            printNutrients(response.totalNutrients, "SUGAR", "sugar", " g");

            //renders pie chart
            makeChart();
          } else {
            //wites "not available" on page in place of nutrition details
            infoNotAvailable();
          }
        };

        xhr.onerror = function() {
          alert("Woops, there was an error making the request.");
        };

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(recipe));
      }

      makeCorsRequest();

      //Writes recipe title, directions, and image to the page

      $("#title").text(title);
      $("#directions").text(directions);
      $("#recipe-image").css({
        background: "url(" + imageURL + ")",
        "background-position": "center",
        "background-repeat": "no-repeat",
        "background-size": "cover"
      });
    });
  });
});

$("#random-btn").on("click", function() {
  var randomURL = "https://www.themealdb.com/api/json/v1/1/random.php";

  $.ajax({
    url: randomURL,
    method: "GET"
  }).then(function(response) {
    // Printing the entire object to console
    console.log(response);

    //pulls title, directions, and image url from response and sets to variables
    var title = response.meals[0].strMeal;
    var directions = response.meals[0].strInstructions;
    var imageURL = response.meals[0].strMealThumb;

    //pulls measure and ingredient information from response, puts them back together in the right order, then stores in an array
    var measuresArray = [
      response.meals[0].strMeasure1 + " " + response.meals[0].strIngredient1,
      response.meals[0].strMeasure2 + " " + response.meals[0].strIngredient2,
      response.meals[0].strMeasure3 + " " + response.meals[0].strIngredient3,
      response.meals[0].strMeasure4 + " " + response.meals[0].strIngredient4,
      response.meals[0].strMeasure5 + " " + response.meals[0].strIngredient5,
      response.meals[0].strMeasure6 + " " + response.meals[0].strIngredient6,
      response.meals[0].strMeasure7 + " " + response.meals[0].strIngredient7,
      response.meals[0].strMeasure8 + " " + response.meals[0].strIngredient8,
      response.meals[0].strMeasure9 + " " + response.meals[0].strIngredient9,
      response.meals[0].strMeasure10 + " " + response.meals[0].strIngredient10,
      response.meals[0].strMeasure11 + " " + response.meals[0].strIngredient11,
      response.meals[0].strMeasure12 + " " + response.meals[0].strIngredient12,
      response.meals[0].strMeasure13 + " " + response.meals[0].strIngredient13,
      response.meals[0].strMeasure14 + " " + response.meals[0].strIngredient14,
      response.meals[0].strMeasure15 + " " + response.meals[0].strIngredient15,
      response.meals[0].strMeasure16 + " " + response.meals[0].strIngredient16,
      response.meals[0].strMeasure17 + " " + response.meals[0].strIngredient17,
      response.meals[0].strMeasure18 + " " + response.meals[0].strIngredient18,
      response.meals[0].strMeasure19 + " " + response.meals[0].strIngredient19,
      response.meals[0].strMeasure20 + " " + response.meals[0].strIngredient20
    ];

    console.log(title);
    console.log(directions);
    console.log(measuresArray);
    emptyInfo();

    //loops through measuresArray, checks if the ingredient line exists, then appends it to ingredients list in the document
    for (i = 0; i < measuresArray.length; i++) {
      if (
        measuresArray[i] !== " " &&
        measuresArray[i] !== "null null" &&
        measuresArray[i] !== "  "
      ) {
        $("#ingredients-list").append($("<li>" + measuresArray[i] + "</li>"));
      }
    }

    //creates proper recipe format for the Edamam API from the mealDB response info
    recipe = {
      title: title,
      prep: "",
      yield: 4,
      ingr: measuresArray.filter(function(item) {
        return item !== " ";
      })
    };

    //Create the XHR object.
    function createCORSRequest(method, url) {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
      } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
      } else {
        // CORS not supported.
        xhr = null;
      }
      return xhr;
    }
    var app_id = "5e802351";
    var app_key = "13bf29d458997ee7632f5d5a606996a3";
    // Makes the CORS request to the Edamam API
    function makeCorsRequest() {
      var url =
        "https://api.edamam.com/api/nutrition-details?app_id=" +
        app_id +
        "&app_key=" +
        app_key;
      var xhr = createCORSRequest("POST", url);
      if (!xhr) {
        alert("CORS not supported");
        return;
      }
      // Response handlers.
      xhr.onload = function() {
        console.log(JSON.parse(xhr.responseText));
        var response = JSON.parse(xhr.responseText);

        //checks if nutrition data is returned
        if (response.totalNutrients !== undefined) {
          //writes nutrition data to page and updates variables for protein/fat/carbs macros
          protein = printNutrients(
            response.totalNutrients,
            "PROCNT",
            "protein",
            " g"
          );
          carbs = printNutrients(
            response.totalNutrients,
            "CHOCDF",
            "carb",
            " g"
          );
          fat = printNutrients(response.totalNutrients, "FAT", "fat", " g");
          printNutrients(response.totalNutrients, "FASAT", "satfat", " g");
          printNutrients(response.totalNutrients, "ENERC_KCAL", "cal", "");
          printNutrients(response.totalNutrients, "CHOLE", "chol", " mg");
          printNutrients(response.totalNutrients, "NA", "sodium", " mg");
          printNutrients(response.totalNutrients, "FIBTG", "fiber", " g");
          printNutrients(response.totalNutrients, "SUGAR", "sugar", " g");
          //renders pie chart
          makeChart();
        } else {
          //wites "not available" on page in place of nutrition details
          infoNotAvailable();
        }
      };

      xhr.onerror = function() {
        alert("Woops, there was an error making the request.");
      };

      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(recipe));
    }

    makeCorsRequest();

    //Writes recipe title, directions, and image to the page

    $("#title").text(title);
    $("#directions").text(directions);
    $("#recipe-image").css({
      background: "url(" + imageURL + ")",
      "background-position": "center",
      "background-repeat": "no-repeat",
      "background-size": "cover"
    });
  });
});
