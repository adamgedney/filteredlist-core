export function calculatePagination(_data, view) {
  const totalItems = _data.totalItems || 0;
  const page = (view._pagination.skip / view._pagination.take) + 1;
  const totalPages = totalItems / view._pagination.take;
  
  return {totalItems, page, totalPages};
}