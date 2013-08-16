// Base URL for a spotify trackset
URL = "spotify:trackset:text2spotify:"

// Delay between consecutive calls to the Spotify Metadata API
DELAY = 110;

// See: http://www.intridea.com/blog/2011/2/8/fun-with-jquery-deferred
wait = function(time) {
  return $.Deferred(function(dfd) {
    setTimeout(dfd.resolve, time);
  });
}

function convert(query) {
    return $.ajax({
    type: "GET",
    url: "http://ws.spotify.com/search/1/track.json?q=" + query,
    dataType: "json",
    success: function(response) {
      tracks = response['tracks'];
      if (tracks.length > 0) {
        track = tracks[0]['href'].split(":");
        track = track[track.length-1]
        console.log(track);
        var href = $("#playlist").attr("href");
        $("#playlist").attr("href", href+track+",");
      }
    },
    error: function(e) {
         alert('Error121212: ' + e);
    }
  });
}

function convertAll() {
    // Read source and create empty output
    $("#playlist").attr("href", URL).addClass("disabled");
    $("#convert").text("Converting...").addClass("disabled");
    var tracksText = $('#tracks-text').val().trim().split("\n");
    var calls = [];
    var trackIds = [];

    // Convert each song
    var length = $(tracksText).length;
    var lastcall;
    $(tracksText).each(function (index, track) {
      wait(index * DELAY).then(function() {
        convert(track);
      });
    });

    wait(length * DELAY).then(function() {
      $('#playlist').removeClass("disabled");
      $('#convert').text("Convert").removeClass("disabled");
    });

    wait(length*DELAY).then(function() {
      console.log("Done");
      $('#playlist').removeClass("disabled");
    });
}

// Main
$(document).ready(function() {
    $('#convert').click(function() {
      convertAll();
    });
});
