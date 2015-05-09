var WebTorrent = require('webtorrent')

var client = new WebTorrent()
var magnetUri = '5cacfa2c16fff8ef7ceddee7e93c06182e437316'

console.log('will add magnetUri', magnetUri);

client.add(magnetUri, function (torrent) {
  // Got torrent metadata!
  console.log('Torrent info hash:', torrent.infoHash)

  torrent.files.forEach(function (file) {
    // Get a url for each file
    file.getBlobURL(function (err, url) {
      if (err) throw err

      // Add a link to the page
      var a = document.createElement('a')
      a.download = file.name
      a.href = url
      a.textContent = 'Download ' + file.name
      document.body.appendChild(a)
    })
  })
})