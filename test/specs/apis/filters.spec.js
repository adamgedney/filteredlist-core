import { expect, assert } from 'chai';
import FiltersApi from 'Src/apis/filters.js';
import ViewsApi from 'Src/apis/views.js';
import optionsExample from 'Src/options.example.js';
import Rxdux from 'Src/rxdux';

describe('The Filters API ', () => {
  let filtersApi, viewsApi;
  const rxdux = new Rxdux();
  const mockViews = [
    {
      id: 'eli', 
      columns:[{property: 'id'}, {property: 'title', visible: true}],
      filterGroups: [
        {
          id: 'figNewtons',
          filters: [
            {id: 'newtons', type: 'select', value: null}
          ]
        }
      ]
    },
    {id: 'eliWithGlasses', columns:[{property: 'id'}, {property: 'title', visible: true}]},
    {id: 'eliWithAPegLeg', columns:[{property: 'id'}, {property: 'title', visible: false}, {property: 'genre', visible: true}]}
  ];

  beforeEach(function() {
    viewsApi = new ViewsApi(rxdux, optionsExample);
    filtersApi = new FiltersApi(rxdux, optionsExample);

    viewsApi.setViews(mockViews)
  });

  it('should instantiate', () => expect(filtersApi).to.be.instanceOf(FiltersApi));

  it('should have [getFilters] method', () => assert.typeOf(filtersApi.getFilters, 'function'));
  it('should have [setFilters] method', () => assert.typeOf(filtersApi.setFilters, 'function'));
  it('should have [getSortFilters] method', () => assert.typeOf(filtersApi.getSortFilters, 'function'));
  it('should have [getPaginationFilters] method', () => assert.typeOf(filtersApi.getPaginationFilters, 'function'));
  it('should have [run] method', () => assert.typeOf(filtersApi.run, 'function'));
  it('should have [resetFilters] method', () => assert.typeOf(filtersApi.resetFilters, 'function'));
  it('should have [resetPagination] method', () => assert.typeOf(filtersApi.resetPagination, 'function'));
  it('should have [resetSort] method', () => assert.typeOf(filtersApi.resetSort, 'function'));
  it('should have [resetAll] method', () => assert.typeOf(filtersApi.resetAll, 'function'));

  it('getFilters method should return an Observable that plucks the filters from the current rxdux state', (done) => {   
    let called = false;
    
    filtersApi.getFilters({view: 'eli', filterGroup: 'figNewtons'})
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockViews[0].filterGroups[0].filters);
          done();called = true;
        }
      }); 
  });

  it('setFilters method should allow setting the filters for a particular view and filtergroup', (done) => {   
    let called = false;
    
    filtersApi.setFilters('eli')
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql([]);
          done();called = true;
        }
      }); 
  });

  it('getSortFilters method should return an Observable that plucks the filters from the current rxdux state', (done) => {   
    let called = false;
    
    filtersApi.getSortFilters()
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql([]);
          done();called = true;
        }
      }); 
  });

  it('getPaginationFilters method should return an Observable that plucks the filters from the current rxdux state', (done) => {   
    let called = false;
    
    filtersApi.getPaginationFilters()
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql([]);
          done();called = true;
        }
      }); 
  });


});