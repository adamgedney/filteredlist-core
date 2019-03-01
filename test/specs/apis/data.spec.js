import { expect, assert } from 'chai';
import DataApi from 'Src/apis/data.js';
import optionsExample from 'Src/options.example.js';
import Rxdux from 'Src/rxdux';

describe('The Data API ', () => {
  let dataApi;
  const rxdux = new Rxdux();
  const mockEmptyItems = [];
  const mockItemsArray = [
    {id: 1, name: 'Bluefish'},
    {id: 2, name: 'Whale'},
    {id: 0, name: 'Eli'}
  ];
  const mockReplaceItemsArray = [
    {id: 34, name: 'RedFish'},
    {id: 314, name: 'Eli'},
    {id: 246, name: 'Tigers'}
  ];

  beforeEach(function() {
    dataApi = new DataApi(rxdux, optionsExample);
  });

  it('should instantiate', () => expect(dataApi).to.be.instanceOf(DataApi));
  it('should have [getItems] method', () => assert.typeOf(dataApi.getItems, 'function'));
  it('should have [pushItems] method', () => assert.typeOf(dataApi.pushItems, 'function'));
  it('should have [replaceItems] method', () => assert.typeOf(dataApi.replaceItems, 'function'));
  it('should have [clearItems] method', () => assert.typeOf(dataApi.clearItems, 'function'));
  it('should have [updateData] method', () => assert.typeOf(dataApi.updateData, 'function'));


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
    
    dataApi.pushItems(mockItemsArray)
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockItemsArray);
          done();called = true;
        }
      }); 
  });

  it('replaceItems method should replace all items in the stores item registry', (done) => {   
    let called = false;
    
    dataApi.replaceItems(mockReplaceItemsArray)
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockReplaceItemsArray);
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