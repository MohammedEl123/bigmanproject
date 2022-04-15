const Bigman = require('../models/bigman');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const bigman = await Bigman.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    bigman.reviews.push(review);
    await review.save();
    await bigman.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/bigmans/${bigman._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Bigman.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/bigmans/${id}`);
}