import createHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
// import _ from 'underscore';

export default class{
  constructor(rxdux, options, instance) {
    /** 
     * Memory History is used by the test runner as there's no DOM. 
     * createHistory requires a DOM 
     * */
    try{ this.history = createHistory(); }
    catch(e){ this.history = createMemoryHistory(); }
  }

  /**
   * Makes the query object to be translated according to output type specification
   * @param filters
   * @returns {*}
   * @private
   */
  _makeQueryObject(filters) {
    return filters
      .map(filter => (
        { [filter.id]: filter.range 
          ? filter.range 
          : filter.value 
        })
      )
      .reduce((sum, query) => {
        const key = Object.keys(query)[0];

        // Check if the property to filter on exists already;
        // Then check if it's an array.
        // make it an array and push the value
        if (sum.hasOwnProperty(key) && !(key.indexOf('sort-') > -1)) {
          if (Array.isArray(sum[key])) {
            sum[key].push(query[key]);// Add the new value
          } else {
            sum[key] = [sum[key]];// Extract the string value and transform to an array
            sum[key].push(query[key]);//Add the new value
          }
        } else {
          sum[key] = query[key];// First run, add the string
        }
        // return the mutated object
        return sum;
      }, {});
  }

  /**
   * Returns the query parameter based on state.filters
   * @param queryObject
   */
  _makeQueryString(queryObject) {

    // Remove anything with a null value
    // Handles single values and range values
    Object.keys(queryObject)
      .forEach((key) => (queryObject[key] == null
        || ((queryObject[key].hasOwnProperty('start') && queryObject[key].hasOwnProperty('end'))
          && (queryObject[key].start == null && queryObject[key].end == null)))
        && delete queryObject[key]);

      let queryString = 
      Object.keys(queryObject)
        .map(k => {
          let attribute = k,
            value = queryObject[k],
            tmp_query = '';

          if (value.hasOwnProperty('start') && value.hasOwnProperty('end')) {
            tmp_query = `${attribute}--start=${value.start}&${attribute}--end=${value.end}`;
          } else {
            tmp_query = `${attribute}=${value}`;
          }

          return tmp_query;
        })
        .reduce((sum, query) => {

          //Handle missing &
          if (query.charAt(0) !== '&') {
            query = '&' + query;
          }

          // Combine query strings
          return sum + query;
        }, '');

    // Handle the ? character at the beginning of the string
    if (queryString.charAt(0) === '&') {
      queryString = queryString.replace(/^&/, '?');
    } else if (queryString.charAt(0) !== '&' || queryString.charAt(0) !== '?') {
      queryString = '?' + queryString;
    }

    return queryString;
  }
}