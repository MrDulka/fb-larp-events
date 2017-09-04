var fetch = require('node-fetch');
var Event = require('../database/Event.js')

/**
 * Class for getting events from Facebook
 */
class FbEvents {
    /**
     * loads events
     * @return {Promise} promise that resolves with an array of events that we
     * received from Facebook
     */

    load() {
      return new Promise(function(resolve, reject) {
        const accessToken = process.env.ACCESS_TOKEN;
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
            reject(err);
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
              reject(err);
            });
          }
        }

        //make a request to graph api for events of specified pages, identified by their event ids
        function getEvents(pageIds){
          var idString = pageIds.join(",");
          var searchUrl = graphUrl + "events?ids=" + idString + "&access_token=" + accessToken;
          fetch(searchUrl)
          .then(response => response.json())
          .then(data => filterEvents(data))
          .catch(err => {
            console.log(err);
            reject(err);
          });
        }

        //fiter and store events in global "events" array
        function filterEvents(data){
          for(var id in data){
            if (data.hasOwnProperty(id) && data[id].data){
              events = events.concat(data[id].data);
            }
          }

          //filter only upcoming events with specified location coordinates
          events = events.filter( event => {
            if (!event.place || !event.place.location || !event.place.location.latitude || !event.place.location.longitude){
              return false;
            }
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
            //in the end, make the events instances of the Event class
            events = events.map( event => {
              var name = event.name;
              var date = {
                start_date: event.start_time,
                end_date: event.end_time
              }
              var location = {
                latitude: event.place.location.latitude,
                longitude: event.place.location.longitude
              }
              var fbId = event.id;

              return new Event(name, date, location, fbId);
            });

            resolve(events);
          }
        }
      });
    }
}

module.exports = FbEvents;
