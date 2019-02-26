export default {
  _queryObject: {},
  _queryString: '',
  _items: [],
  _views: [],
  _workspaceItems: [], // {where: '[PROPNAME ie. id]', is: 'adjhfoadfh0q973580qy35'}
  _pagination: {cursor: null, page: 1, skip: 0, take: 25, totalItems: 0},// if total isn't supplied then it will default to the _items.length
  _loading: false, // Toggled anytime there is a filterchange, and we are waiting for results
  _selectedView: 0// defaults to the first view
};