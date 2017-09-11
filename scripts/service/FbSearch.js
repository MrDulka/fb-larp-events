var fetch = require('node-fetch');

/**
 * Class for searching on Facebook
 */

class FbSearch {
  constructor(){
    this._maxIterations = 10;
  }
  /**
   * Get the IDs, iterate over the paginated results returned from FB,
   * using their provided "next" link
   * @param {string} firstUrl - url with which we start the search
   * @return {Promise} promise that resolves to an Array of IDs as strings
   */
  loadIds(firstUrl){
    return new Promise((resolve, reject) => {
      var ids = [];
      var result = this.getUrl(firstUrl);

      for(let i=0; i<this._maxIterations-1; i++){
        result = result.then((data) => {
          data.data.forEach(elem => ids.push(elem.id));
          if (!data.paging.next) return;
          else return this.getUrl(data.paging.next);
        });
      }

      result.then((data) => {
        if(data) {
          data.data.forEach(elem => ids.push(elem.id));
        }
        resolve(ids);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }

  /**
   * Make a call to specified url to get data
   * @param {string} url
   * @return {Promise} promise that resolves to an object with returned data
   */
  getUrl(url){
    return new Promise((resolve, reject) => {
      fetch(url)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }
}

module.exports = FbSearch;
