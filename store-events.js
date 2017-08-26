module.exports = function(){
  var mongodb = require('mongodb');
  var fetch = require('node-fetch');

  var accessToken = "EAAO1Gik9JWQBAEOTDe26hxuCGgvZAsVTcZBZBws5izC36yyEY9JLwdpXprKIcxq9nYRTrRBnrpwPWUKvKZAa0UmLG1jrjaZCKI48umheRxYIsiXjPLjhCWi2rjMDU34ScvRpWSagmmyMa5YLNHETe6rgKyqKhVQY5GBIZCwL8FuQZDZD";
  var graphUrl = "https://graph.facebook.com/";
  var maxIterations = 0; //limit how many times we call getPageIds (this number + 1)
  var events = [];

  getFirstPageIds();

  function getFirstPageIds(){
    fetch(graphUrl + "search?q=larp&type=page&access_token=" + accessToken)
    .then(response=>response.json())
    .then(data => getPageIds(data))
    .catch(err => {
      console.log(err);
      //TODO: add error handling
    });
  }

  function getPageIds(data){
    var pageIds = data.data.map(el => el.id);
    getEvents(pageIds);

    //recursively call getPageIds for a limited number of times
    if (maxIterations>0 && data.paging && data.paging.next) {
      maxIterations--;
      var nextUrl = data.paging.next;
      fetch(nextUrl)
      .then(response=>response.json())
      .then(d => getPageIds(d))
      .catch(err => {
        console.log(err);
        //TODO: add error handling
      });
    }
  }

  //make a request to graph api for events of specified pages, identified by ids
  function getEvents(pageIds){
    var idString = pageIds.join(",");
    var searchUrl = graphUrl + "events?ids=" + idString + "&access_token=" + accessToken;
    fetch(searchUrl)
    .then(response => response.json())
    .then(data => filterEvents(data))
    .catch(err => {
      console.log(err);
      //TODO: add error handling
    });
  }

  //fiter and store events in global "events" array
  function filterEvents(data){
    for(var id in data){
      if (data.hasOwnProperty(id) && data[id].data){
        events = events.concat(data[id].data);
      }
    }

    //filter only upcoming events
    events = events.filter( event => {
      var now = new Date();
      var startTime = new Date(event.start_time);
      return now < startTime;
    });

    store(events);
  }

  //store events in mongodb, TODO should be made to insert only events that are not in the database yet
  function store(events){
    var uri = 'mongodb://localhost:27017/test';
    console.log("not connected yet");
    mongodb.MongoClient.connect(uri, function(error, db){
      if(error){
        console.log(error);
        process.exit(1);
      }
      console.log("connected!");

      db.collection('events').insert(events, function(error, result){
          if (error){
            console.log(error);
            process.exit(1);
          }
      });


    });

  }
}
