module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        review: String,
        author: String,
        review_source: String,
        rating: Number,
        title: String,
        product_name: String,
        reviewed_date: String
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Reviews = mongoose.model("reviews", schema);
    return Reviews;
  };
  