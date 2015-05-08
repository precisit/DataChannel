var WebTorrent = require('webtorrent')

var client = new WebTorrent()
console.log('Created new webTorrent');

var magnetUri = '5a1052a8a744b6066a95ff0bbc878598f068b64f'

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