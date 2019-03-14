import {
  SET_VIEWS,
  SELECT_VIEW,
  UPDATE_VIEW
} from '../constants';
import {mergeMap, filter, first, tap} from 'rxjs/operators';
import { of } from 'rxjs';

export default class{
  constructor(rxdux, options, instance) {
    this.options = options;
    this.rxdux = rxdux;
    this.namespace = 'views';
    this.hooks = instance.hooks;
    this.data = instance.data;
    this.queries = instance.queries;

    this.activateProxyHookSubscriptions();
  }

  activateProxyHookSubscriptions() {
    const {onSelectedViewChange$, _onSelectedViewChange$} = this.hooks;

    _onSelectedViewChange$
      .subscribe(({selectedView, state}) => {
        if (selectedView) { //  BehaviorSubjects initialize
          onSelectedViewChange$.next({selectedView, state, 
            replaceItems: ({items, idProp = 'id', totalItems}) => 
              this.data.replaceItems({items, idProp, totalItems})
          })
        }
      });
  }

  /**
   * Get all views
   *
   * @returns
   */
  getViews() {
    return this.rxdux.selector$(this.namespace);
  }

  /**
   * Populates the views array in the store
   *
   * @param {*} views
   * @returns
   */
  setViews(views) {
    const views$ = this.rxdux.dispatch({
      type: SET_VIEWS,
      data: {
        views: Array.isArray(views) ? views : [views]
      }
    }, 'views')
    .pipe(
      first(),
      tap(_views => {
        this.hooks.onViewsSet$.next({views: _views});
      })
    );

    views$.subscribe(() => {});
    return views$;
  }

  /**
   * Sets the selectedView reference
   *
   * @param {*} id
   * @returns
   */
  selectView(id) {
    const selectedView$ = this.rxdux.dispatch({
      type: SELECT_VIEW,
      data: {id}
    }, 'selectedView');
    const state = this.rxdux.state;

    // Write our query to the url
    if (state.queryString) {
      this.queries._writeQueryStringToUrl(state.queryString, this.options);
    }

    this.hooks._onSelectedViewChange$.next({selectedView: id, state});

    return selectedView$;
  }

  /**
   * Returns the view object that the selectedView prop in the store references
   *
   * @returns
   */
  getSelectedView() {
    let _selectedView;

    return this.rxdux.selector$('selectedView')
      .pipe(
        mergeMap(selectedView => {
          _selectedView = selectedView;

          return this.rxdux.selector$(this.namespace);
        }),
        mergeMap(views => of(views
          .filter(view => view.id === _selectedView)[0]
        ))
      )
  }

  /**
   * Returns a view object by id
   *
   * @param {*} id
   * @returns
   */
  getViewById(id) {
    return this.rxdux.selector$(this.namespace)
      .pipe(
        mergeMap(views => of(views
          .filter(view => view.id === id)[0]
        ))
      )
  }

  /**
   * Updates a view object in the store
   *
   * @param {*} id
   * @param {*} view
   * @returns
   */
  updateView(id, view) {
    const state$ = this.rxdux.dispatch({
      type: UPDATE_VIEW,
      data: {id, view}
    }, 'state')
    .pipe(
      first(),
      tap(state => {
        this.hooks.onViewUpdated$.next({
          view: state.views.filter(view => view.id === id)[0], 
          state
        });
      }),
      mergeMap(() => this.getViewById(id))
    );

    state$.subscribe(() => {});
    return state$;
  }
}