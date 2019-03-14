import { expect, assert } from 'chai';
import ViewsApi from 'Src/apis/views.js';
import QueriesApi from 'Src/apis/queries.js';
import optionsExample from 'Src/options.example.js';
import Rxdux from 'Src/rxdux';
import Hooks from 'Src/hooks';
import createMemoryHistory from 'history/createMemoryHistory';

describe('The Views API ', () => {
  let viewsApi, queries, history;
  const hooks = new Hooks();
  const rxdux = new Rxdux({}, hooks);
  const mockViews = [
    {id: 'eli', columns:[{property: 'id', visible: true}, {property: 'title', visible: false}]},
    {id: 'eliWithGlasses', columns:[{property: 'id'}, {property: 'title', visible: true}]},
    {id: 'eliWithAPegLeg', columns:[{property: 'id'}, {property: 'title', visible: false}, {property: 'genre', visible: true}]}
  ];
  const mockUpdatedViewItem = {
    id: 'eli', 
    columns:[{property: 'id', visible: true, sort: null}, {property: 'title', visible: false, sort: null}],
    _pagination: {
      "cursor": null,
      "skip": 0,
      "page": 1,
      "take": 25,
      "totalItems": 300, // 300 is input to the store by the filters.spec
      "totalPages": 12
    },
    filterGroups: []
  };

  beforeEach(function() {
    rxdux.reset();
    history = createMemoryHistory();
    queries = new QueriesApi(rxdux, optionsExample, {hooks, history});
    viewsApi = new ViewsApi(rxdux, optionsExample, {hooks, queries});
  });

  it('should instantiate', () => expect(viewsApi).to.be.instanceOf(ViewsApi));
  it('should have [getViews] method', () => assert.typeOf(viewsApi.getViews, 'function'));
  it('should have [setViews] method', () => assert.typeOf(viewsApi.setViews, 'function'));
  it('should have [selectView] method', () => assert.typeOf(viewsApi.selectView, 'function'));
  it('should have [getSelectedView] method', () => assert.typeOf(viewsApi.getSelectedView, 'function'));
  it('should have [getViewById] method', () => assert.typeOf(viewsApi.getViewById, 'function'));
  it('should have [updateView] method', () => assert.typeOf(viewsApi.updateView, 'function'));
  it('should have [activateProxyHookSubscriptions] method', () => assert.typeOf(viewsApi.activateProxyHookSubscriptions, 'function'));

  it('getViews method should return an Observable that plucks the views from the current rxdux state', (done) => {   
    let called = false;
    
    viewsApi.getViews()
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql([]);
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

  it('selectView method should trigger the onSelectedViewChange$ hook to fire', done => {   
    let called = false;
    
    hooks.onSelectedViewChange$
      .subscribe(d => {
        if(!called) {
          expect(d).to.have.keys(['selectedView', 'state', 'replaceItems']);
          done();called = true;
        }
      });

      assert.ok(viewsApi.selectView('eliWithAPegLeg'));
  });

  it('getSelectedView method should return the full selectedView object', (done) => {   
    let called = false;
    viewsApi.setViews(mockViews);
    viewsApi.selectView('eliWithAPegLeg');
    viewsApi.getSelectedView()
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockViews[2]);
          done();called = true;
        }
      }); 
  });

  it('getViewById method should return the full view object for the specified id', (done) => {   
    let called = false;
    viewsApi.setViews(mockViews);
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

    viewsApi.setViews(mockViews);
    viewsApi.updateView('eli', {columns:[{property: 'id', visible: true}, {property: 'title', visible: false}]})
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockUpdatedViewItem);
          done();called = true;
        }
      }); 
  });
});
