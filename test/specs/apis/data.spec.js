import { expect, assert } from 'chai';
import DataApi from 'Src/apis/data.js';
import optionsExample from 'Src/options.example.js';
import Rxdux from 'Src/rxdux';

describe('The Data API ', () => {
  let dataApi;
  const rxdux = new Rxdux();
  const mockEmptyItems = [];
  const mockItemsArray = [
    {id: 0, name: 'Eli'},
    {id: 1, name: 'Bluefish'},
    {id: 2, name: 'Whale'}
  ];
  const mockItemsArrayKeyed = { 
    '0': { id: 0, name: 'Eli' },
    '1': { id: 1, name: 'Bluefish' },
    '2': { id: 2, name: 'Whale' } 
  };
  const mockReplaceItemsArray = [
    {id: 34, name: 'RedFish'},
    {id: 246, name: 'Tigers'},
    {id: 314, name: 'Eli'}
  ];

  beforeEach(function() {
    dataApi = new DataApi(rxdux, optionsExample);
  });

  it('should instantiate', () => expect(dataApi).to.be.instanceOf(DataApi));
  it('should have [_transformCollectionToKeyValue] method', () => assert.typeOf(dataApi._transformCollectionToKeyValue, 'function'));
  it('should have [getItems] method', () => assert.typeOf(dataApi.getItems, 'function'));
  it('should have [pushItems] method', () => assert.typeOf(dataApi.pushItems, 'function'));
  it('should have [replaceItems] method', () => assert.typeOf(dataApi.replaceItems, 'function'));
  it('should have [updateItem] method', () => assert.typeOf(dataApi.updateItem, 'function'));
  it('should have [clearItems] method', () => assert.typeOf(dataApi.clearItems, 'function'));

  it('_transformCollectionToKeyValue method should convert array items to key value entries', (done) => {   
    assert.deepEqual(dataApi._transformCollectionToKeyValue(mockItemsArray, 'id'), mockItemsArrayKeyed);
    done();
  });

  it('getItems method should return an Observable that plucks the items from the current rxdux state', (done) => {   
    let called = false;
    
    dataApi.getItems()
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockEmptyItems);
          done();called = true;
        }
      }); 
  });

  it('pushItems method should Add items to the items registry in the store', (done) => {   
    let called = false;
    
    dataApi.pushItems(mockItemsArray, 'id')
      .subscribe(d => {
        if(!called) {
          console.log(d, mockItemsArray);
          expect(d).to.eql(mockItemsArray);
          done();called = true;
        }
      }); 
  });

  it('replaceItems method should replace all items in the stores item registry', (done) => {   
    let called = false;
    
    dataApi.replaceItems(mockReplaceItemsArray, 'id')
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockReplaceItemsArray);
          done();called = true;
        }
      }); 
  });

  it('updateItem method should update the one item in the store', (done) => {   
    let called = false;
    let _mockItems = [
      {id: 34, name: 'EliFishies'},
      {id: 246, name: 'Tigers'},
      {id: 314, name: 'Eli'}
    ];

    dataApi.updateItem({id: 34, name: 'EliFishies'}, 'id')
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(_mockItems);
          done();called = true;
        }
      }); 
  });

  it('clearItems method should clear all items in the stores item registry', (done) => {   
    let called = false;
    
    dataApi.clearItems()
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql([]);
          done();called = true;
        }
      }); 
  });
});