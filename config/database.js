if(process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://matsumouri:m9911428@ds119113.mlab.com:19113/vidjotprod'
  }
} else {
  module.exports = {
    mongoURI:  'mongodb://127.0.0.1:27017/ideas'
  }
}
