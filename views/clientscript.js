var accessToken = "EAAO1Gik9JWQBAEOTDe26hxuCGgvZAsVTcZBZBws5izC36yyEY9JLwdpXprKIcxq9nYRTrRBnrpwPWUKvKZAa0UmLG1jrjaZCKI48umheRxYIsiXjPLjhCWi2rjMDU34ScvRpWSagmmyMa5YLNHETe6rgKyqKhVQY5GBIZCwL8FuQZDZD";
var graphUrl = "https://graph.facebook.com/";
var maxIterations = 1; //limit how many times we call getPageIds (this number + 1)
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

  console.log(events);
  visualize(events);
}

//add data to the table
function visualize(events){
  var rows = d3.select("#d3-root").selectAll("div")
    .data(events)
    .enter()
    .append("div")
    .attr("class", "row");

  rows.append("div")
    .attr("class", "cold-md-5 col-sm-5 col-xs-12")
      .append("div")
        .append("strong")
        .text(d => d.name);

  rows.append("div")
    .attr("class", "cold-md-2 col-sm-2 col-xs-4")
      .append("div")
        .append("span")
        .text(d => `${formatTime(d.start_time)} - ${formatTime(d.end_time)}`);

  rows.append("div")
    .attr("class", "cold-md-2 col-sm-2 col-xs-4")
      .append("div")
        .append("span")
        .text(d => {
          if(d.place && d.place.location && d.place.location.city){
            return d.place.location.city
          } else if (d.place && d.place.name){
            return d.place.name
          } else return "No location specified"
        });

  rows.append("div")
    .attr("class", "cold-md-3 col-sm-3 col-xs-4")
      .append("div")
        .append("a")
        .attr("href", d => `https://www.facebook.com/events/${d.id}`)
        .attr("target", "_blank")
        .text("Facebook event page");

}

function formatTime(time){
  if (!time) {
    return "";
  }
  var date = new Date(time);

  var day = pad(date.getDate());
  var month = pad(date.getMonth());
  var year = pad(date.getFullYear());
  var hours = pad(date.getHours());
  var minutes = pad(date.getMinutes());

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function pad(num){
  return num < 10 ? "0" + num : num.toString();
}
