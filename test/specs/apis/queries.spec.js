import { expect, assert } from 'chai';
import QueriesApi from 'Src/apis/queries.js';
import {mergeMap} from 'rxjs/operators';
import Rxdux from 'Src/rxdux';
import optionsExample from 'Src/options.example.js';
import createMemoryHistory from 'history/createMemoryHistory';
import Hooks from 'Src/hooks';

describe('The Queries API ', () => {
  let history, queriesApi;
  const rxdux = new Rxdux({}, new Hooks());
  let mockUrl = '/';
  let mockFullUrl = 'https://iliketurtles.com/?state=sdfhw458hwreojbd&view=test';
  let queryObject = {
    state: ["cbd0a696-2b4f-4469-85d1-f7027345e3e0"],
    genres: ["87fc3814-4cb9-43a5-b723-63ecebd65c5a", "cdc3d520-8b74-46ac-9f4c-8f27d04ab49f"],
    languages: ["9d5741e1-b482-4027-8c57-45193073ef12"],
    entityType: ["olyplat-entity-movie"],
    "sort-primaryGenre": "ASC",
    // sort: { primaryGenre: 'ASC' }
  };
  let queryObjectLessSort = {
    state: ["cbd0a696-2b4f-4469-85d1-f7027345e3e0"],
    genres: ["87fc3814-4cb9-43a5-b723-63ecebd65c5a", "cdc3d520-8b74-46ac-9f4c-8f27d04ab49f"],
    languages: ["9d5741e1-b482-4027-8c57-45193073ef12"],
    entityType: ["olyplat-entity-movie"]
  };
  let queryString = '?state=cbd0a696-2b4f-4469-85d1-f7027345e3e0&genres=87fc3814-4cb9-43a5-b723-63ecebd65c5a,cdc3d520-8b74-46ac-9f4c-8f27d04ab49f&languages=9d5741e1-b482-4027-8c57-45193073ef12&entityType=olyplat-entity-movie&sort-primaryGenre=ASC';
  let filters = [
    {"id":"state","type":"select","prop":"state","label":"State","value":["cbd0a696-2b4f-4469-85d1-f7027345e3e0"],"multiple":true,"options":{"key":"entityUUID","value":"entityValue"}},
    {"id":"genres","type":"select","prop":"genres","label":"Genres","value":["87fc3814-4cb9-43a5-b723-63ecebd65c5a","cdc3d520-8b74-46ac-9f4c-8f27d04ab49f"],"multiple":true,"multi":true,"options":{"key":"entityUUID","value":"entityValue"}},
    {"id":"languages","type":"select","prop":"languages","label":"Languages","value":["9d5741e1-b482-4027-8c57-45193073ef12"],"multiple":true,"options":{"key":"entityUUID","value":"entityValue"}},
    {"id":"entityType","type":"select","prop":"entityType","label":"Show Type","value":["olyplat-entity-movie"],"multiple":true,"options":{"key":"entityUUID","value":"entityValue"}}
  ];
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

  beforeEach(function() {
    history = createMemoryHistory();
    queriesApi = new QueriesApi(rxdux, optionsExample, null, history);
  });

  it('should instantiate', () => expect(queriesApi).to.be.instanceOf(QueriesApi));
  it('should have a history instance', () => assert.ok(queriesApi.history));

  it('should have [_makeQueryObject] method', () => assert.typeOf(queriesApi._makeQueryObject, 'function'));
  it('should have [_makeQueryString] method', () => assert.typeOf(queriesApi._makeQueryString, 'function'));
  it('should have [_writeQueryStringToURL] method', () => assert.typeOf(queriesApi._writeQueryStringToURL, 'function'));
  it('should have [_getPaginationQueryParams] method', () => assert.typeOf(queriesApi._getPaginationQueryParams, 'function'));
  it('should have [_getViewParamFromURL] method', () => assert.typeOf(queriesApi._getViewParamFromURL, 'function'));
  it('should have [_pickFromUrl] method', () => assert.typeOf(queriesApi._pickFromUrl, 'function'));
  it('should have [_readQueryStringFromURL] method', () => assert.typeOf(queriesApi._readQueryStringFromURL, 'function'));
  it('should have [_parseParams] method', () => assert.typeOf(queriesApi._parseParams, 'function'));
  it('should have [_makeQueryObjectFromQueryString] method', () => assert.typeOf(queriesApi._makeQueryObjectFromQueryString, 'function'));
  it('should have [_writeQueryStringToStore] method', () => assert.typeOf(queriesApi._writeQueryStringToStore, 'function'));
  it('should have [_writeQueryObjectToStore] method', () => assert.typeOf(queriesApi._writeQueryObjectToStore, 'function'));
  it('should have [getQueryObject] method', () => assert.typeOf(queriesApi.getQueryObject, 'function'));
  it('should have [getQueryString] method', () => assert.typeOf(queriesApi.getQueryString, 'function'));
  it('should have [getFullUrl] method', () => assert.typeOf(queriesApi.getFullUrl, 'function'));
  it('should have [removeQueryStringFromUrl] method', () => assert.typeOf(queriesApi.removeQueryStringFromUrl, 'function'));
  it('should have [_base64] method', () => assert.typeOf(queriesApi._base64, 'function'));
  it('should have [_unBase64] method', () => assert.typeOf(queriesApi._unBase64, 'function'));

  it('_makeQueryObject method should convert a filters collection to a query object', () =>
    expect(queriesApi._makeQueryObject(filters)).to.eql(queryObjectLessSort));

  it('_makeQueryString method should convert a query object to a query string', () => 
    expect(queriesApi._makeQueryString(queryObject)).to.eql(queryString));

  it('_writeQueryStringToURL method should modify the history api by writing to the location property', () =>
    expect(queriesApi._writeQueryStringToURL(queryString, {writeQueryStringToURL: true}).location.search).to.eql(queryString)); 
  
  it('_writeQueryStringToURL method should return undefined if options.writeQueryStringToURL is falsey', () =>
    expect(queriesApi._writeQueryStringToURL(queryString, {writeQueryStringToURL: undefined})).to.be.undefined); 
  
  it('_writeQueryStringToURL method should return undefined if queryString is falsey', () =>
    expect(queriesApi._writeQueryStringToURL(undefined, {writeQueryStringToURL: undefined})).to.be.undefined); 
  
  it('_makeQueryObjectFromQueryString method should convert a query object to a query string', () =>
    expect(queriesApi._makeQueryObjectFromQueryString(queryString)).to.eql(Object.assign(queryObjectLessSort, {sort: { primaryGenre: 'ASC' }})));
  
  it('_writeQueryStringToStore method should update the store with a new query string', done => {
    let called = false;

    queriesApi._writeQueryStringToStore(queryString)
      .subscribe(d => {
        if(!called) {
          assert.equal(d, queryString);

          queriesApi._writeQueryStringToStore('');
          done();called = true;
          called = true;
        }
      }); 
  });

  it('_writeQueryObjectToStore method should update the store with a new query object', done => {
    let called = false;

    queriesApi._writeQueryObjectToStore(queryObject)
      .subscribe(d => {
        if(!called) {
          assert.deepEqual(d, queryObject);

          queriesApi._writeQueryObjectToStore({})
          done();called = true;
          called = true;
        }
      }); 
  });

  it('getQueryObject method should return an Observable that plucks the query object from the current rxdux state', done => {
    let called = false;
    
    queriesApi.getQueryObject()
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql({})
          done();called = true;
        }
      });
  });

  it('getQueryString method should return an Observable that plucks the query string from the current rxdux state', done => {
    let called = false;
    
    queriesApi.getQueryString()
      .subscribe(d => {
        if(!called) {
          assert.equal(d, '')
          done();called = true;
        }
      });
  });

  it('getFullUrl method should return a full url', () =>
    assert.equal(queriesApi.getFullUrl(), mockFullUrl));
  
  it('removeQueryStringFromUrl method should remove the query string from the url', () => {
    history.replace(`/${queryString}`);

    assert.equal(queriesApi.removeQueryStringFromUrl(), mockUrl);
  });

  it('_pickFromUrl method should return an object of data picked from the url query string', () => {
    history.replace(mockFullUrl);

    expect(queriesApi._pickFromUrl('state')).to.eql({state: 'sdfhw458hwreojbd'});
  });

  it('_getViewParamFromURL method should return an object of view data picked from the url query string', () => {
    history.replace(mockFullUrl);

    assert.equal(queriesApi._getViewParamFromURL(), 'test');
  });

  it('_base64 method should return a base64 encoded queryString', () => {
    assert.match(queriesApi._base64(queryString), base64Regex); 
  });

  it('_unBase64 method should return the input string', () => {
    const base64QueryStr = queriesApi._base64(queryString);

    assert.equal(queriesApi._unBase64(base64QueryStr), queryString); 
  });

  it('_writeQueryStringToURL method should write a base64 query to the url if options.base64UrlQueryString is true', () => {
    const historySearchValue = queriesApi._writeQueryStringToURL(queryString, {writeQueryStringToURL: true, base64UrlQueryString: true}).location.search;

    assert.equal(historySearchValue, `?fl=${queriesApi._base64(queryString)}`); 
  });
});