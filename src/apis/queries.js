import createHistory from 'history/createBrowserHistory';
import {
  UPDATE_QUERY_STRING,
  UPDATE_QUERY_OBJECT
} from '../constants';
import {first, tap, filter} from 'rxjs/operators';
import _merge from 'lodash.merge';

export default class{
  constructor(rxdux, options, instance, history) {
    this.rxdux = rxdux;
    this.hooks = instance.hooks;

    /** 
     * Memory History is used by the test runner as there's no DOM. 
     * Passed in the constructor as history.
     * createHistory requires a DOM.
     * */
    try{ this.history = createHistory(); }
    catch(e) { this.history = history; }
  }

  /**
   * Makes the query object to be translated according to output type specification
   * @param filters
   * @returns {*}
   * @private
   */
  _makeQueryObject(filters) {
    return makeQueryObject(filters);
  }

  /**
   * Returns the query parameter based on state.filters
   * @param queryObject
   */
  _makeQueryString(queryObject) {
    return makeQueryString(queryObject);
  }

  /**
   *Updates the query String stored in the store$
   *
   * @param {*} queryString
   * @returns
   */
  _writeQueryStringToStore(queryString) {
    const queryString$ = this.rxdux.dispatch({
        type: UPDATE_QUERY_STRING,
        data: {queryString}
      }, 'queryString')
      .pipe(
        first(),
        tap(queryString => {
          this.hooks.onQueryStringUpdated$.next({queryString});
        })
      );

    queryString$.subscribe(() => {});
    return queryString$;
  }

  /**
   *Updates the query object stored in the store$
   *
   * @param {*} queryObject
   * @returns
   */
  _writeQueryObjectToStore(queryObject) {
    const queryObject$ = this.rxdux.dispatch({
        type: UPDATE_QUERY_OBJECT,
        data: {queryObject}
      }, 'queryObject')
      .pipe(
        first(),
        tap(queryObject => {
          this.hooks.onQueryObjectUpdated$.next({queryObject});
        })
      );

      queryObject$.subscribe(() => {});
      return queryObject$;
  }

  /**
 * Writes the query string to the url
 * @param queryString
 * @param options
 * @private
 */
  _writeQueryStringToUrl(queryString, options) {
    
    // Only allow if the config file specifies
    if (options.writeQueryStringToUrl && (queryString || queryString === null)) {
      // const path = this.history.location.href.split('?')[0].split(this.history.location.host)[1];
      const path = this.history.location.pathname;

      if (queryString === null) { queryString = ''; }

      let replaceUrl = (queryString + '&' + this._getPaginationQueryParams()).replace(/&+$/, "");

      // Legacy support for clearPaginationQueryString
      if (options.clearPaginationQueryString) {
        replaceUrl = queryString;
      }

      // Write via base64
      if (options.base64UrlQueryString) {
        replaceUrl = `fl=${this._base64(replaceUrl)}`;
      }

      /**
      * @todo Need to rewrite all url interactions to use the history api only. Replace not just the path, but the search params too
      * history.push('/home', { some: 'state' }) 
      * https://www.npmjs.com/package/history
      */
      this.history.replace({search: replaceUrl});

      return this.history;
    }
  }

  /**
   * Gets the pagination query params from the url to preserve them on write
   */
  _getPaginationQueryParams() {
    // const params = _.pick(this.parseParms(this.readQueryStringFromURL()), ['skip', 'take', 'page']);
    const params = this._pickFromUrl(['skip', 'take', 'page']);
    let str = '';

    // @todo convert this to a reducer
    for (let key in params) {
      str += `${key}=${params[key]}&`
    }

    return str.slice(0, -1);// removes the last ampersand
    //return params;
  }

  /**
   * Fetches the current view from the url
   * @returns {string}
   */
  _getViewParamFromURL() {
    // const params = _.pick(parseParms(readQueryStringFromURL()), ['view']);
    const params = this._pickFromUrl(['view']);
    let str = '';

    for (let key in params) {
      str += `${key}=${params[key]}&`
    }

    return this._parseParams(str.slice(0, -1)).view;
  }

  /**
   *Utility for picking properties form the query string
   * @returns
   */
  _pickFromUrl(props = []) {
    const _props = Array.isArray(props) ? props : [props];
    return Object.entries(this._parseParams(this._readQueryStringFromURL()))
      .reduce((acc, [k, v]) => {
        if (_props.includes(k)) {
          acc[k] = v;
        }
        return acc;
      }, {});
  }

  /**
   * From: http://stackoverflow.com/questions/23481979/function-to-convert-url-hash-parameters-into-object-key-value-pairs
   * @param str
   * @returns {{}}
   */
  _parseParams(str = '') {
    var pieces = str.replace('?', '').split("&"), data = {}, i, parts;
    // process each query pair
    for (i = 0; i < pieces.length; i++) {
      parts = pieces[i].split("=");
      if (parts.length < 2) {
        parts.push("");
      }
      data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    }
    return data;
  }

  /**
   * Reads the query string from a url
   */
  _readQueryStringFromURL() {
    // return this.history.location.href.split('?')[1] || '';
    return this.history.location.search;
  }

    /**
   * Converts a query string to a query object. Used on app load to rebuild a filter set
   * @param str
   */
  _makeFilterObjectFromQueryString(str) {
    return makeFilterObjectFromQueryString(str);
  }

  /**
  * Converts a query String to a base 64 query.
  * Supports browser and node environments
   *
   */
  _base64(inputString) {
    let _btoa;
    try{ _btoa = btoa; }
    catch(e) {
      _btoa = str => Buffer.from(str).toString('base64');
    }

    return _btoa(inputString);
  }

  /**
   * Converts a base 64 string to a human readable string.
   * Supports node env
   *
   * @returns
   */
  _unBase64(inputBase64Str) {
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    if(!inputBase64Str.match(base64Regex)) {
      throw new Error('queries.js[_unBase64QueryString] | Invalid base64 string provided.');
    }

    let _atob;
    try{ _atob = btoa; }
    catch(e) {
      _atob = str => Buffer.from(str, 'base64').toString();
    }

    return _atob(inputBase64Str);
  }

  /**
   * Plucks the queryObject from the current state
   *
   * @returns
   */
  getQueryObject(){
    return this.rxdux.selector$('queryObject');  
  }

    /**
   * Plucks the queryString from the current state
   *
   * @returns
   */
  getQueryString(){
    return this.rxdux.selector$('queryString');
  }

  /**
   * If we're running in a browser, return the full url, else return a dummy
   * @returns
   */
  getFullUrl() {
    let window = window;
    if(!window) { return 'https://iliketurtles.com/?state=sdfhw458hwreojbd&view=test'; }

    return window.location.href;
  }

  /**
   * Remove the query string fromt he url
   *
   */
  removeQueryStringFromUrl() {
    this.history.push(this.history.location.pathname);

    return `${this.history.location.pathname}${this.history.location.search}`;
  }
}

  /**
   * Makes the query object to be translated according to output type specification
   * @param filters
   * @returns {*}
   * @private
   */
  export function makeQueryObject({filters, sort, pagination}) {
    const _filters = filters
      .map(filter => ({ [filter.id]: filter.range || filter.value }))
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


    const _sort = sort
      .reduce((acc, curr) => {
        acc[`sort-${curr.property}`] = curr.sort;
        return acc;
      }, {});

      const _pagination = {
        skip: pagination.skip,
        take: pagination.take,
        page: pagination.page,
        cursor: pagination.cursor
      };

      return {..._filters, ..._sort, ..._pagination};
  };

  /**
   * Returns the query parameter based on state.filters
   * @param queryObject
   */
  export function makeQueryString(queryObject) {

    // MErge everything, then covnert merged array to an object
    // Remove anything with a null value
    // Handles single values and range values 
    Object.keys(queryObject)
      .forEach((key) => (queryObject[key] == null
        || ((queryObject[key].hasOwnProperty('start') && queryObject[key].hasOwnProperty('end'))
          && (queryObject[key].start == null && queryObject[key].end == null)))
        && delete queryObject[key]);

      let queryString = Object.keys(queryObject)
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
  };

  /**
   * Converter for strings to filter objects
   *
   * @export
   * @param {*} str
   * @returns
   */
  export function makeFilterObjectFromQueryString(str){
    return decodeURI(str.replace(/^\?/, ''))
      .split("&")
      .reduce((acc, segment) => {
        // segment: genre=1234nksfngkw45w45
        const _segment = segment.split('='); // ['genre','1234nksfngkw45w45']
        const key = _segment[0];
        const value = _segment[1].split(',');

        // Build pagination object
        if (key === 'view') {
          
          acc.view = value[0];
        } else if (['skip', 'take', 'page', 'cursor'].includes(key)) {
          
          acc.pagination[key] = value[0]; // un arrayify pagination values
        } else if (key.indexOf('sort-') > -1) {
          
          acc.sort.push({
            property: key.replace('sort-', ''), 
            sort: value[0]
          });
        } else {
          
          acc.filters.push({
            [key]: value
          });
        }

        return acc;
      }, {
        filters: [],
        sort: [],
        pagination: {},
        view: ''
      });
  }