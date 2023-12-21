const Product = require('../models/product.js');

const getAllProducts = async (req, res) => {
  const { featured, name, company, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }

  if (company) {
    queryObject.company = company;
  }

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '<': '$lt',
      '>=': '$gte',
      '<=': '$lte',
      '=': '$eq',
    };
    const regEx = /\b(>|<|>=|<=|=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result.sort(sortList);
  } else {
    result.sort('createAt');
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result.select(fieldsList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 0;
  const skip = (page - 1) * limit;
  result.limit(limit).skip(skip);

  const products = await result;
  res.status(200).json({ Hits: products.length, products });
};

module.exports = { getAllProducts };
