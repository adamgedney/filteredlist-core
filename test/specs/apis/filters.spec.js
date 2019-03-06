import { expect, assert } from 'chai';
import FiltersApi from 'Src/apis/filters.js';
import ViewsApi from 'Src/apis/views.js';
import optionsExample from 'Src/options.example.js';
import Rxdux from 'Src/rxdux';
import Hooks from 'Src/hooks';

describe('The Filters API ', () => {
  let filtersApi, viewsApi;
  const rxdux = new Rxdux({}, new Hooks());
  const mockViews = [
    {
      id: 'eli', 
      columns:[{property: 'id', sort: 'ASC' /** ASC, DESC, null */}, {property: 'title', visible: true}],
      filterGroups: [
        {
          id: 'figNewtons',
          filters: [
            {id: 'newtons', type: 'select', value: null}
          ]
        }
      ],
      // _pagination: {cursor: null, page: 1, skip: 0, take: 25, totalItems: 0}
    },
    {id: 'eliWithGlasses', columns:[{property: 'id'}, {property: 'title', visible: true}]},
    {id: 'eliWithAPegLeg', columns:[{property: 'id'}, {property: 'title', visible: false}, {property: 'genre', visible: true}]}
  ];
  const exampleFilterRun = {
    view : 'eli',
    filters: [{
      id: 'newtons',
      value: ['f144y'],
      operator: null
    }],
    sort: [{column: 'id', operator: 'DESC'}],
    pagination: {skip: 0, take: 25}
  };

  beforeEach(function() {
    viewsApi = new ViewsApi(rxdux, optionsExample);
    filtersApi = new FiltersApi(rxdux, optionsExample);
 
    viewsApi.setViews(mockViews)
  });

  it('should instantiate', () => expect(filtersApi).to.be.instanceOf(FiltersApi));

  it('should have [getFilters] method', () => assert.typeOf(filtersApi.getFilters, 'function'));
  it('should have [getSortFilters] method', () => assert.typeOf(filtersApi.getSortFilters, 'function'));
  it('should have [getPaginationFilters] method', () => assert.typeOf(filtersApi.getPaginationFilters, 'function'));
  it('should have [run] method', () => assert.typeOf(filtersApi.run, 'function'));
  it('should have [resetFilters] method', () => assert.typeOf(filtersApi.resetFilters, 'function'));

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

  it('getSortFilters method should return an Observable that plucks the sort filters from the current rxdux state', (done) => {   
    let called = false;
    
    filtersApi.getSortFilters('eli')
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql([ 
            { property: 'id', sort: 'ASC' },
            { property: 'title', sort: null } 
          ]);
          done();called = true;
        }
      }); 
  });

  it('getPaginationFilters method should return an Observable that plucks the filters from the current rxdux state', (done) => {   
    let called = false;
    
    filtersApi.getPaginationFilters('eli')
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql({cursor: null, page: 1, skip: 0, take: 25, totalItems: 0});
          done();called = true;
        }
      }); 
  });

  it('run method should add a filter command to the store, then return an Observable that plucks the filters from the current rxdux state', done => {   
    let called = false;
    assert.ok(filtersApi.run(exampleFilterRun));
    
    filtersApi.getFilters({view: 'eli', filterGroup: 'figNewtons'})
      .subscribe(d => {
        if(!called) {
          expect(d[0].value).to.have.members(['f144y']);
          done();called = true;
        }
      });
  });

  it('resetFilters method should clear all filter values in the store, then return an Observable that plucks the filters from the current rxdux state', done => {   
    let called = false;
    assert.ok(filtersApi.run(exampleFilterRun));
    assert.ok(filtersApi.resetFilters());
    
    filtersApi.getFilters({view: 'eli', filterGroup: 'figNewtons'})
      .subscribe(d => {
        if(!called) {
          assert.isNull(d[0].value);
          assert.isNull(d[0].operator);

          done();called = true;
        }
      });
  });
});