const Item = require("../models/Item");

exports.create = async (req, res) => {
  const item = await Item.create({
    ...req.body,
    userId: req.user.id
  });
  res.json(item);
};

exports.getAll = async (req, res) => {
  const items = await Item.find({ userId: req.user.id });
  res.json(items);
};

exports.update = async (req, res) => {
  const item = await Item.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  res.json(item);
};

exports.delete = async (req, res) => {
  await Item.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });
  res.json({ msg: "Deleted" });
};