import { expect, assert } from 'chai';
import FiltersApi from 'Src/apis/filters.js';
import ViewsApi from 'Src/apis/views.js';
import optionsExample from 'Src/options.example.js';
import Rxdux from 'Src/rxdux';
import Hooks from 'Src/hooks';
import Queries from 'Src/apis/queries';
import createMemoryHistory from 'history/createMemoryHistory';

describe('The Filters API ', () => {
  let filtersApi, viewsApi, queries, history;
  const hooks = new Hooks();
  const rxdux = new Rxdux(optionsExample, hooks);

  const mockViews = [
    {
      id: 'eli', 
      columns:[{property: 'id', sort: 'ASC' /** ASC, DESC, null */}, {property: 'title', visible: true}],
      filterGroups: [
        {
          id: 'figNewtons',
          filters: [
            {id: 'newtons', type: 'select', value: null},
            {id: 'figgy', type: 'select', value: null},
            {id: 'state', type: 'select', value: null},
            {id: 'languages', type: 'select', value: null}
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
    filters: [
      {
        id: 'newtons',
        value: ['f144y'],
        operator: null
      },
      {
        id: 'state',
        value: ["87fc3814-4cb9-43a5-b723-63ecebd65c5a", "cdc3d520-8b74-46ac-9f4c-8f27d04ab49f"],
        operator: 'AND'
      },
      {
        id: 'languages',
        value: ["9d5741e1-b482-4027-8c57-45193073ef12"],
        operator: 'OR'
      },
    ],
    sort: [{column: 'id', operator: 'DESC'}],
    pagination: {skip: 0, take: 25}
  };

  beforeEach(function() {
    history = createMemoryHistory();
    queries = new Queries(rxdux, optionsExample, {hooks}, history);
    viewsApi = new ViewsApi(rxdux, optionsExample, {hooks});
    filtersApi = new FiltersApi(rxdux, optionsExample, {hooks, queries});
 
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

  it('getFilters method should return an Observable of filters from the entire view if no filterGroup was set', (done) => {   
    let called = false;
    
    filtersApi.getFilters({view: 'eli'})
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

  it('run method should trigger the _onFilterChange$ hook to fire', done => {   
    let called = false;
    
    hooks._onFilterChange$
      .subscribe(d => {
        if(!called) {
          expect(d).to.have.keys(['change', 'state', 'lastState']);
          done();called = true;
        }
      });

      assert.ok(filtersApi.run(exampleFilterRun));
  });

  // it('run method should trigger the onFilterChange$ hook to fire, and the queryObject and queryString should be present in the state', done => {   
  //   let called = false;
    
  //   filtersApi.hooks.onFilterChange$
  //     .subscribe(d => {
  //       if(!called && Object.keys(d.state).length > 0) {
  //         console.log('TEST onFilterChange hook ', d, d.state.queryString, JSON.stringify(d.state.queryObject, null, 2));
  //         expect(d.state.queryObject).not.to.be.empty
  //         // expect(d).to.have.keys(['change', 'state', 'lastState'])
  //         // .and.expect(d.state).to.have.keys(['change', 'state', 'lastState', 'cb']);
  //         done();called = true;
  //       }
  //     });

  //     assert.ok(filtersApi.run(exampleFilterRun));
  // });

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