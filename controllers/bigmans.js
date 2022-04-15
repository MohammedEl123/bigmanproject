const Bigman = require('../models/bigman');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const bigmans = await Bigman.find({}).populate({
        path: 'popupText',
        strictPopulate: false,
        });

    res.render('bigmans/index', { bigmans })
}

module.exports.renderNewForm = (req, res) => {
    res.render('bigmans/new');
}

module.exports.createBigman = async (req, res, next) => {
   
const bigman = new Bigman(req.body.bigman);
bigman.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    bigman.author = req.user._id;
    await bigman.save();
    console.log(bigman);
    req.flash('success', 'Successfully made a new bigman!');
    res.redirect(`/bigmans/${bigman._id}`)
}


module.exports.showBigman = async (req, res,) => {
    const bigman = await Bigman.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!bigman) {
        req.flash('error', 'Cannot find that item!');
        return res.redirect('/bigmans');
    }
    res.render('bigmans/show', { bigman });
}
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const bigman = await bigman.findById(id)
    if (!bigman) {
        req.flash('error', 'Cannot find that item!');
        return res.redirect('/bigmans');
    }
    res.render('bigmans/edit', { bigman });
}

module.exports.updateBigman = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const bigman = await Bigman.findByIdAndUpdate(id, { ...req.body.bigman });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    bigman.images.push(...imgs);
    await bigman.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await bigman.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated the item!');
    res.redirect(`/bigmans/${bigman._id}`)
}

module.exports.deleteBigman = async (req, res) => {
    const { id } = req.params;
    await Bigman.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the item')
    res.redirect('/bigmans');
}