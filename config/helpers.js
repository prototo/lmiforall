
app.use(function(req, res, next) {
  res.locals.user = req.user || false;
  next();
});

app.use(function(req, res, next) {
  res.locals.messages = req.flash();
  next();
});
