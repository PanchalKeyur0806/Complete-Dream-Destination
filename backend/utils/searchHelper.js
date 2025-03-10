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
    console.log("date is .........", this.queryParams.date)
    if (this.queryParams.date) {
      
      // Parse the date string directly
      const dateStr = this.queryParams.date; // e.g., "2025-03-08"
      
      // Create UTC date range (start of day = 00:00:00 UTC, end of day = 23:59:59 UTC)
      const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
      const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);
      
      console.log("Date filter:", {
        dateStr,
        startOfDay,
        endOfDay,
        field
      });
      
      this.query = this.query.find({
        [field]: { $gte: startOfDay, $lte: endOfDay }
      });
    }
    return this;
  }
  

  execute() {
    return this.query;
  }
}

module.exports = SearchHelper;
