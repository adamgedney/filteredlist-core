export default {
  queryObject: {},
  queryString: '',
  items: {},
  views: [], // Keep as array in order to maintain order
  workspace: {
    items: {} // id keyed items
  }, // {where: '[PROPNAME ie. id]', is: 'adjhfoadfh0q973580qy35'}
  pagination: {cursor: null, page: 1, skip: 0, take: 25, totalItems: 0},// if total isn't supplied then it will default to the items.length
  loading: false, // Toggled anytime there is a filterchange, and we are waiting for results
  selectedView: 0// defaults to the first view
};