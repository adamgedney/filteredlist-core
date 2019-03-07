/** 
 * Given state and a view or optionally a filtergroup and view, it returns just the filters array
 * */
export const getFilters = function({view, filterGroup, state}){
  const viewObject = state.views.filter(_view => _view.id === view)[0];

  if (filterGroup) {
    return viewObject.filterGroups.filter(group => group.id === filterGroup)[0].filters
  } else {
    return viewObject.filterGroups.reduce((acc, group) => {
      return acc.concat(group.filters);
    }, [])
  }
}