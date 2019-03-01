import { expect, assert } from 'chai';
import ViewsApi from 'Src/apis/views.js';
import optionsExample from 'Src/options.example.js';
import Rxdux from 'Src/rxdux';

describe('The Views API ', () => {
  let viewsApi;
  const rxdux = new Rxdux();
  const mockViews = [
    {id: 'eli', props:[{property: 'id'}]},
    {id: 'eliWithGlasses', props:[{property: 'id'}]},
    {id: 'eliWithAPegLeg', props:[{property: 'id'}]}
  ];

  beforeEach(function() {
    viewsApi = new ViewsApi(rxdux, optionsExample);
  });

  it('should instantiate', () => expect(viewsApi).to.be.instanceOf(ViewsApi));
  it('should have [getViews] method', () => assert.typeOf(viewsApi.getViews, 'function'));
  it('should have [setViews] method', () => assert.typeOf(viewsApi.setViews, 'function'));
  it('should have [selectView] method', () => assert.typeOf(viewsApi.selectView, 'function'));
  it('should have [getSelectedView] method', () => assert.typeOf(viewsApi.getSelectedView, 'function'));
  it('should have [getViewById] method', () => assert.typeOf(viewsApi.getViewById, 'function'));

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
});