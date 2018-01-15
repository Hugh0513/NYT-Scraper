// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  if (data.length === 0) {
      $("#articles").append("<div class='panel panel-danger'>"
        + "<div class='panel-heading'>" 
        + "<h3>We don't have any saved article</h3></div></div>");
  }
  else {
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<div class='panel panel-primary'>"
        + "<div class='panel-heading'>" 
        + "<button class='edit btn btn-default deleteArticle' data-id='"
        + data[i]._id + "'>Delete From Saved</button>"
        + "<button class='delete btn btn-default noteArticle' data-id='"
        + data[i]._id + "'>Article Notes</button><h3>"
        + data[i].title + "</h3></div><div class='panel-body'><p>"
        + data[i].link + "</p></div></div>");
    }
  }
});

// Test use
$('#mondal-btn').on('click', function () {
  console.log("test");
});

// Display Article Notes and Input Note Area in Modal
$("#articles").on("click", ".noteArticle", function() {
  console.log("noteArticle");
  console.log($(this).attr("data-id"));
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Empty the notes from the note section
  $(".modal-title").empty();
  $("#noteHistory").empty();
  $("#noteInput").text("");
  $(".modal-footer").empty();

  // Now make an ajax call for the Notes
  $.ajax({
    method: "GET",
    url: "/notes/" + thisId
  })
    .done(function(data) {
      console.log(data);
      console.log(data.length);

      // If there's a note in the article
      if (data.length === 0) {
        console.log("no notes");
          $("#noteHistory").append("<p>No note for this article yet</p>");
      }
      else {
        for (var i = 0; i < data.length; i++) {
          $("#noteHistory").append("<div class='panel panel-default noteHistory'>" + data[i].body + "<button data-id='" + data[i]._id + "' type='button' class='btn btn-warning delete'>x</button></div>");
        }
      }
      // The title of the article
      $(".modal-title").append("Notes For Aricle: " + thisId);
      $(".modal-footer").append("<button class='btn btn-defaul' data-dismiss='modal' data-id='" + thisId + "' id='savenote'>Save Note</button>");

      event.preventDefault();
      jQuery.noConflict();
      $('#myModal').modal('show');

    });

});

// Delete an article
$("#articles").on("click", ".deleteArticle", function() {
  event.preventDefault();
  console.log("deleteArticle");
  console.log($(this).attr("data-id"));

  var deleteArticle = {
    _id: $(this).attr("data-id")
  };

  $.post('/deleteArticle', deleteArticle)
    // on success, run this callback
    .done(function(data) {
      
    $('.modal-body').text("Saved the article");
    event.preventDefault();
    jQuery.noConflict();
    $('#myModal').modal('show');

  });
    //Delete this
    $(this).parent().parent("div").remove();
});


// When you click the savenote button
$("#myModal").on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  console.log($("#noteInput").val());

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/notes/" + thisId,
    data: {
      // Value taken from note input
      body: $("#noteInput").val(),
      article_id: thisId
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input note entry
  $("#noteInput").val("");
});

// Delete an note
$("#noteHistory").on("click", ".delete", function() {
  event.preventDefault();
  console.log("deleteNote");
  console.log($(this).attr("data-id"));

  var deleteNote= {
    _id: $(this).attr("data-id")
  };

  $.post('/deleteNote', deleteNote)
    // on success, run this callback
    .done(function(data) {

    });
    //Delete this
    $(this).parent("div").remove();
});