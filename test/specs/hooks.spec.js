import { expect, assert } from 'chai';
import Hooks from 'Src/hooks.js';
import {Subject} from 'rxjs';

describe('The Hooks ', () => {
  let hooks;
  let _callbackData;
  let _onFilterChangePayload;
  
  beforeEach(function() {
    hooks = new Hooks();

    _callbackData = {items: []};
    _onFilterChangePayload = {
      filterId: 'role', 
      filterValue: ['sdgfkgj2345', 'sdgfkgj2345a', 'sdgfkgj2345f'], 
      queryObject: {'users': ['sdgfkgj2345', 'sdgfkgj2345a', 'sdgfkgj2345f']},
      callback: data => expect(data).to.eql(_callbackData)
    };
  });

	it('should instantiate', () => expect(hooks).to.be.instanceOf(Hooks));
  
  it('should have [onFilterChange$] Subject instance property', () => expect(hooks.onFilterChange$).to.be.instanceOf(Subject));
  it('should have [onFilterRemoved$] Subject instance property', () => expect(hooks.onFilterRemoved$).to.be.instanceOf(Subject));
  it('should have [onWorkspaceItemAdded$] Subject instance property', () => expect(hooks.onWorkspaceItemAdded$).to.be.instanceOf(Subject));
  it('should have [onWorkspaceItemRemoved$] Subject instance property', () => expect(hooks.onWorkspaceItemRemoved$).to.be.instanceOf(Subject));
  it('should have [onWorkSpaceCleared$] Subject instance property', () => expect(hooks.onWorkSpaceCleared$).to.be.instanceOf(Subject));
  it('should have [onFiltersReset$] Subject instance property', () => expect(hooks.onFiltersReset$).to.be.instanceOf(Subject));
  it('should have [onPaginationChange$] Subject instance property', () => expect(hooks.onPaginationChange$).to.be.instanceOf(Subject));
  it('should have [onSort$] Subject instance property', () => expect(hooks.onSort$).to.be.instanceOf(Subject));
  it('should have [loading$] Subject instance property', () => expect(hooks.loading$).to.be.instanceOf(Subject));
  it('should have [onColumnVisibilityChange$] Subject instance property', () => expect(hooks.onColumnVisibilityChange$).to.be.instanceOf(Subject));

  /** Hook Subscription testing */
  function testHook(name) {
    describe(`${name} `, () => {
      it('should forward calls to subscribers', () => {
        hooks[name].subscribe(d => expect(d).to.eql(_onFilterChangePayload));
        hooks[name].next(_onFilterChangePayload);
      });
    
      it('callback property should be callable from subscriber', () => {
        hooks[name].subscribe(d => d.callback(_callbackData));
        hooks[name].next(_onFilterChangePayload);
      });
    });
  }

  testHook('onFilterChange$');
  testHook('onFilterRemoved$');
  testHook('onWorkspaceItemAdded$');
  testHook('onWorkspaceItemRemoved$');
  testHook('onWorkSpaceCleared$');
  testHook('onPaginationChange$');
  testHook('onSort$');
  testHook('loading$');
  testHook('onColumnVisibilityChange$');
});

