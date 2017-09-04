var fetch = require('node-fetch');

class FbEvents {
    load() {
      return new Promise(function(resolve, reject) {
        const accessToken = "EAAO1Gik9JWQBAEOTDe26hxuCGgvZAsVTcZBZBws5izC36yyEY9JLwdpXprKIcxq9nYRTrRBnrpwPWUKvKZAa0UmLG1jrjaZCKI48umheRxYIsiXjPLjhCWi2rjMDU34ScvRpWSagmmyMa5YLNHETe6rgKyqKhVQY5GBIZCwL8FuQZDZD";
        const graphUrl = "https://graph.facebook.com/";
        const maxIterations = 5; //limit how many times we call getPageIds
        var iterationsLeft = maxIterations;
        var eventIterationsDone = 0;
        var events = [];

        getFirstPageIds();

        function getFirstPageIds(){
          iterationsLeft--;
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
          if (iterationsLeft>0 && data.paging && data.paging.next) {
            iterationsLeft--;
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

          considerReturn(events);
        }

        /*consider if all requests for events are done and resolve the top level
        Promise if all is finished*/
        function considerReturn(events){
          eventIterationsDone++;
          if (eventIterationsDone >= maxIterations){
            resolve(events);
          }
        }
      });
    }
}

module.exports = FbEvents;
