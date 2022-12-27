class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  serach() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
          
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  serachBy() {
    const keyword = this.queryStr.category
      ? {
          name: {
            $regex: this.queryStr.category,
            $options: "i",
          },
          
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

 

  filter() {

    const queryCopy = { ...this.queryStr };

    //removing some fields for category
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);
    //filter for price and rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  pagination() {
    const currentPage = Number(this.queryStr.page) || 1; //
    const resultPerPAge= Number(this.queryStr.limit) || 15


    const skip = resultPerPAge * (currentPage - 1);

    this.query = this.query.limit(resultPerPAge).skip(skip);

    return this;
    
  }
  
}
module.exports = ApiFeatures;
