class SearchHelper {
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }

  searchByField(field) {
    if (this.queryParams.search) {
      this.query = this.query.find({
        [field]: { $regex: this.queryParams.search, $options: "i" },
      });
    }
    return this;
  }

  filterByDate(field) {
    let filter = {};
    if (this.queryParams.startDate || this.queryParams.endDate) {
      filter[field] = {};
      if (this.queryParams.startDate) {
        filter[field].$gte = new Date(this.queryParams.startDate);
      }
      if (this.queryParams.endDate) {
        filter[field].$lte = new Date(this.queryParams.endDate);
      }
      this.query = this.query.find(filter);
    }
    return this;
  }

  execute() {
    return this.query;
  }
}

module.exports = SearchHelper;
