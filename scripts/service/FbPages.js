var fetch = require('node-fetch');

/**
 * Class for getting IDs of larp related pages from Facebook
 */

class FbPages {
  constructor(){
    this._accessToken = "EAAO1Gik9JWQBAEOTDe26hxuCGgvZAsVTcZBZBws5izC36yyEY9JLwdpXprKIcxq9nYRTrRBnrpwPWUKvKZAa0UmLG1jrjaZCKI48umheRxYIsiXjPLjhCWi2rjMDU34ScvRpWSagmmyMa5YLNHETe6rgKyqKhVQY5GBIZCwL8FuQZDZD";
    this._maxIterations = 10;
    this._firstUrl = 'https://graph.facebook.com/search?q=larp&type=page&access_token=' + this._accessToken;
  }

  /**
   * Get the IDs
   * @return {Promise} promise that resolves to an Array of strings - Facebook pages IDs
   */
  loadIds(){
    return new Promise((resolve, reject) => {
      var ids = [];
      var result = this.getUrl(this._firstUrl);

      for(let i=0; i<this._maxIterations-1; i++){
        result = result.then((data) => {
          data.data.forEach(page => ids.push(page.id));
          return this.getUrl(data.paging.next);
        });
      }

      result.then((data) => {
        data.data.forEach(page => ids.push(page.id));
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

module.exports = FbPages;
