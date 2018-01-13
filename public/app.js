
/*
// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});
*/

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
//$("#scrapeArticles").on("click", function() {
  console.log("scrapeArticles");
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


$('#mondal-btn').on('click', function () {
  console.log("test");
});

$('#saveArticles').on('click', function () {
  console.log("saveArticles");


  console.log(articles);

});

$('#scrapeArticles').on('click', function () {
  console.log("scrapeArticles");

  /*
  $.get('/scrape', function(data) {

  }).done(function(data) {

      $('.modal-body').text("Added 30 new articles!");
      event.preventDefault();
      jQuery.noConflict();
      $('#myModal').modal('show');

  });
  */

  $.get('/newArticles').done(function(data) {

    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<div class='panel panel-heading'>"
        + "<div class='panel-heading'>" 
        + "<button class='edit btn btn-default saveArticle' data-title='"
        + data[i].title + "' data-link='"
        + data[i].link +"'>Save Article</button><h3>"
        + data[i].title + "</h3></div><div class='panel-body'><p>"
        + data[i].link + "</p></div></div>");
    }

    $('.modal-body').text("Added 30 new articles!");
    event.preventDefault();
    jQuery.noConflict();
    $('#myModal').modal('show');

  });
});


// Save an article
$("#articles").on("click", ".saveArticle", function() {
  event.preventDefault();
  console.log("saveArticle");

  var title = $(this).attr("data-title");
  console.log(title);
  var link = $(this).attr("data-link");
  console.log(link);

  var newArticle = {
    title: title,
    link: link
  }

  $.post('/scrapeArticle', newArticle)
    // on success, run this callback
    .done(function(data) {
      // log the data we found
      //console.log(data);
      // tell the user we're adding a recipe with an alert window
    $('.modal-body').text("Saved the article");
    event.preventDefault();
    jQuery.noConflict();
    $('#myModal').modal('show');

  });
});