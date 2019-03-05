import { expect, assert } from 'chai';
import ViewsApi from 'Src/apis/views.js';
import optionsExample from 'Src/options.example.js';
import Rxdux from 'Src/rxdux';
import { stringify } from 'querystring';

describe('The Views API ', () => {
  let viewsApi;
  const rxdux = new Rxdux();
  const mockViews = [
    {id: 'eli', columns:[{property: 'id', visible: true}, {property: 'title', visible: true}]},
    {id: 'eliWithGlasses', columns:[{property: 'id'}, {property: 'title', visible: true}]},
    {id: 'eliWithAPegLeg', columns:[{property: 'id'}, {property: 'title', visible: false}, {property: 'genre', visible: true}]}
  ];
  const mockUpdatedViewItem = {id: 'eli', columns:[{property: 'id', visible: true}, {property: 'title', visible: false}]};

  beforeEach(function() {
    viewsApi = new ViewsApi(rxdux, optionsExample);
  });

  it('should instantiate', () => expect(viewsApi).to.be.instanceOf(ViewsApi));
  it('should have [getViews] method', () => assert.typeOf(viewsApi.getViews, 'function'));
  it('should have [setViews] method', () => assert.typeOf(viewsApi.setViews, 'function'));
  it('should have [selectView] method', () => assert.typeOf(viewsApi.selectView, 'function'));
  it('should have [getSelectedView] method', () => assert.typeOf(viewsApi.getSelectedView, 'function'));
  it('should have [getViewById] method', () => assert.typeOf(viewsApi.getViewById, 'function'));
  it('should have [updateView] method', () => assert.typeOf(viewsApi.updateView, 'function'));

  it('getViews method should return an Observable that plucks the views from the current rxdux state', (done) => {   
    let called = false;
    
    viewsApi.getViews()
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockViews);
          done();called = true; 
        }
      }); 
  });

  it('setViews method should set the views array in the store', (done) => {   
    let called = false;
    
    viewsApi.setViews(mockViews)
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockViews);
          done();called = true;
        }
      }); 
  });

  it('selectView method should update the selectedView prop in the store', (done) => {   
    let called = false;
    
    viewsApi.selectView('eliWithAPegLeg')
      .subscribe(d => {
        if(!called) {
          expect(d).to.equal('eliWithAPegLeg');
          done();called = true;
        }
      }); 
  });

  it('getSelectedView method should return the full selectedView object', (done) => {   
    let called = false;
    
    viewsApi.getSelectedView()
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockViews[2]); // expected result relies on selectView test to have run just previous
          done();called = true;
        }
      }); 
  });

  it('getViewById method should return the full view object for the specified id', (done) => {   
    let called = false;
    
    viewsApi.getViewById('eli')
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockViews[0]);
          done();called = true;
        }
      }); 
  });

  it('updateView method should deep update the view in the store then return the full view object for the specified id', (done) => {   
    let called = false;
    
    viewsApi.updateView('eli', {columns:[{property: 'id', visible: true}, {property: 'title', visible: false}]})
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockUpdatedViewItem);
          done();called = true;
        }
      }); 
  });
});
