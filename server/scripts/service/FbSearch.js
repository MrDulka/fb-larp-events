const fetch = require('node-fetch');
const _ = require('underscore');

/**
 * Class for searching on Facebook
 */

class FbSearch {
    constructor(logger) {
        this._maxIterations = 5;
        this._logger = logger;
        this._accessToken = "&access_token=EAAO1Gik9JWQBAEOTDe26hxuCGgvZAsVTcZBZBws5izC36yyEY9JLwdpXprKIcxq9nYRTrRBnrpwPWUKvKZAa0UmLG1jrjaZCKI48umheRxYIsiXjPLjhCWi2rjMDU34ScvRpWSagmmyMa5YLNHETe6rgKyqKhVQY5GBIZCwL8FuQZDZD";
    }

    /**
     * Search for events for all the passed in queries
     * @param {Object[]} searchArray - array of search queries + types that should be searched
     * @return {Promise|Object[]} promise that resolves with array of events returned from Facebook
     */
    searchAll(searchArray){
        let promiseArray = [];
        searchArray.forEach(search => {
            promiseArray.push(this.searchForEvents(search));
        });

        return Promise.all(promiseArray).then( data => {
            return _.flatten(data);
        }).catch(err => {
            this._logger.error('FbSearch#seachAll Error: ', err);
        });
    }

    /**
     * Searches for events on Facebook
     * @param {Object} search - what to search for, specified by query and type
     * @return {Promise|Object[]} promise that resolves with array of events returned from Facebook
     */
    searchForEvents(search) {
        let url = `https://graph.facebook.com/search?q=${search.query}&type=${search.type}` + this._accessToken;

        return new Promise((resolve, reject) => {
          if(search.type === 'group' || search.type === 'page'){
              this.getAll(url).then(data => {
                  let ids = data.map(el => el.id);
                  return this.getEventsFromIds(ids);
              }).then(data => {
                  let events = this.organize(data);
                  resolve(events);
              }).catch(err => {
                  this._logger.error('FbSearch#seachForEvents Error: ', err);
              });
          }
          else if(search.type === 'event'){
              this.getAll(url).then(events => {
                  resolve(events);
              }).catch(err => {
                  this._logger.error('FbSearch#seachForEvents Error: ', err);
              });
          }
          else {
              resolve([]);
          }
        });

    }

    /**
     * Puts all events in one flat array, discards empty objects,
     * makes things organized
     * @param {Object[]} data - array of objects received and put together from FB
     * @return {Object[]} events - array of objects
     */
    organize(data) {
        var events = [];
        for (var elem of data) {
            for (var id in elem) {
                if (elem.hasOwnProperty(id) && elem[id].data) {
                    events = events.concat(elem[id].data);
                }
            }
        }
        return events;
    }

    /**
     * Splits ids into chunks that facebook api can hadle (size 25)
     * and requests data for events of pages/groups with specified ids
     * @param {string[]} ids - array of strings, ids of facebook pages/groups
     * @return {Promise} promise that resolve with an array of data responses
     * from Facebook
     */
    getEventsFromIds(ids) {
        let idArray = ids;
        let iterations = Math.ceil(idArray.length / 25);
        let promises = [];

        for (let i = 0; i < iterations; i++) {
            let idString = idArray.splice(-25).join(",");
            let searchUrl = "https://graph.facebook.com/events?ids=" +
                idString + this._accessToken;
            let prom = this.getUrl(searchUrl);
            promises.push(prom);
        }
        return Promise.all(promises);
    }

    /**
     * Make a request to the url provided and then iterate over the paginated
     * results, making more requests to the provided "next" urls
     * @param {string} firstUrl - url with which we start the search
     * @return {Promise|Array} results put together in one array
     */
    getAll(firstUrl) {
        return new Promise((resolve, reject) => {
            let resultData = [];
            let result = this.getUrl(firstUrl);

            for (let i = 0; i < this._maxIterations - 1; i++) {
                result = result.then((data) => {
                    if (!data) return;
                    data.data.forEach(elem => resultData.push(elem));
                    if (!data.paging || !data.paging.next) {
                        return;
                    } else {
                        return this.getUrl(data.paging.next);
                    }
                });
            }

            result.then((data) => {
                if (data) {
                    data.data.forEach(elem => resultData.push(elem));
                }
                resolve(resultData);
            })
            .catch(err => {
                this._logger.error(`FbSearch#getAll Error:`, err);
            });
        });
    }

    /**
     * Make a call to specified url to get data
     * @param {string} url
     * @return {Promise} promise that resolves to an object with returned data
     */
    getUrl(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(err => {
                    this._logger.error(`FbSearch#getUrl Error:`, err);
                });
        });
    }
}

module.exports = FbSearch;
