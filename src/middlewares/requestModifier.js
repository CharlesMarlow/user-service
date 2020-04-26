const setDefault = (req, res, next) => {
  let marketingValue = req.body.marketing_opt_in_accepted;
  if (marketingValue === undefined) {
    marketingValue = false;
  }
  return next();
};

module.exports = {
  setDefault,
};
