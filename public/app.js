$(document).ready(function(){

  $("#articles").append("<div class='panel panel-danger'>"
    + "<div class='panel-heading'>" 
    + "<h3>We don't have any new articles</h3></div></div>");

})

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

// Test use
$('#mondal-btn').on('click', function () {
  console.log("test");
});

// Scrape Articles
$('#scrapeArticles').on('click', function () {
  console.log("scrapeArticles");
  $("#articles").empty();

  $.get('/newArticles').done(function(data) {

    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<div class='panel panel-primary'>"
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
    //Delete this
    $(this).parent().parent("div").remove();
});