export const parseFilterParams = (query, userId) => {
  const filter = { user: userId };

  if (query.search && typeof query.search === 'string') {
    const searchTerm = query.search.trim();
    if (searchTerm.length > 0) {
      const regex = new RegExp(
        searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i',
      );

      filter.$or = [{ title: regex }, { content: regex }];

      filter.$or.push({ tag: regex });
    }
  }

  if (query.tag && query.tag !== 'All') {
    filter.tag = query.tag;
  }

  return filter;
};
