export const setDate = (date, type) => {
  return type == 'start'
    ? new Date(new Date(date).setHours(0, 0, 0, 0)).toLocaleString()
    : new Date(new Date(date).setHours(23, 59, 59, 59)).toLocaleString();
};

export const paginate = async (model, options, generatedQuery) => {
  let limit = options.limit ? options.limit : 25;
  let page, offset, skip, promises, include;

  if (options.offset) {
    offset = options.offset;
    skip = offset;
  } else if (options.page) {
    page = options.page;
    skip = (page - 1) * limit;
  } else {
    page = 1;
    offset = 0;
    skip = offset;
  }

  let docsQuery = {};
  if (limit) {
    generatedQuery['offset'] = skip;

    docsQuery = await model.findAndCountAll(generatedQuery);
    let result = {
      data: docsQuery['rows'],
      total: docsQuery['count'],
      limit: limit,
    };
    if (offset !== undefined) {
      result['offset'] = offset;
    }
    console.log('count', docsQuery['count']);
    if (page !== undefined) {
      result['page'] = page;
      result['pages'] = Math.ceil(Number(docsQuery['count']) / limit) || 1;
    }

    return result;
  } else {
    return await model.findAndCountAll(generatedQuery);
  }
};

export const moneyFormat = (price, sign = '$') => {
  const pieces = parseFloat(price)
    .toFixed(2)
    .split('');
  let ii = pieces.length - 3;
  while ((ii -= 3) > 0) {
    pieces.splice(ii, 0, ',');
  }
  return sign + pieces.join('');
};
