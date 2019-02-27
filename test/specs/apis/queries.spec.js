import { expect, assert } from 'chai';
import QueriesApi from 'Src/apis/queries.js';
import optionsExample from 'Src/options.example.js';

describe('The Queries API ', () => {
  let queriesApi;
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

  beforeEach(function() {
    queriesApi = new QueriesApi(optionsExample);
  });

  it('should instantiate', () => expect(queriesApi).to.be.instanceOf(QueriesApi));
  it('should have a history instance', () => assert.ok(queriesApi.history));

  it('should have [_makeQueryObject] method', () => assert.typeOf(queriesApi._makeQueryObject, 'function'));
  it('should have [_makeQueryString] method', () => assert.typeOf(queriesApi._makeQueryString, 'function'));
  it('should have [_writeQueryStringToURL] method', () => assert.typeOf(queriesApi._writeQueryStringToURL, 'function'));
  it('should have [_getPaginationQueryParams] method', () => assert.typeOf(queriesApi._getPaginationQueryParams, 'function'));
  it('should have [_readQueryStringFromURL] method', () => assert.typeOf(queriesApi._readQueryStringFromURL, 'function'));
  it('should have [_parseParams] method', () => assert.typeOf(queriesApi._parseParams, 'function'));
  it('should have [_makeQueryObjectFromQueryString] method', () => assert.typeOf(queriesApi._makeQueryObjectFromQueryString, 'function'));
  // it('should have [getQueryObject] method', () => assert.typeOf(queriesApi.getQueryObject, 'function'));
  // it('should have [getQueryString] method', () => assert.typeOf(queriesApi.getQueryString, 'function'));
  // it('should have [getFullUrl] method', () => assert.typeOf(queriesApi.getFullUrl, 'function'));
  // it('should have [removeQueryStringFromUrl] method', () => assert.typeOf(queriesApi.removeQueryStringFromUrl, 'function'));

  it('_makeQueryObject should convert a filters collection to a query object', () =>
    expect(queriesApi._makeQueryObject(filters)).to.eql(queryObjectLessSort));

  it('_makeQueryString should convert a query to a query string', () => 
    expect(queriesApi._makeQueryString(queryObject)).to.eql(queryString));

  it('_writeQueryStringToURL should modify the history api by writing to the location property', () =>
    expect(queriesApi._writeQueryStringToURL(queryString, {writeQueryStringToURL: true}).location.search).to.eql(queryString)); 
  
    it('_makeQueryObjectFromQueryString should convert a query object to a query string', () =>
      expect(queriesApi._makeQueryObjectFromQueryString(queryString)).to.eql(Object.assign(queryObjectLessSort, {sort: { primaryGenre: 'ASC' }})));
});