const { create } = require("ipfs-http-client");

const ipfs = create("https://ipfs.infura.io:5001");

async function run() {
  const files = [{
    path: '/',
    content: JSON.stringify({
      name: "Warranty Information",
      attributes: [
        {
          "serial_number": "a11f251da6fbe5878b7d75f053f45049",
          "owner": "Sasha Aldrick"
        }
      ],
      image: "https://gateway.ipfs.io/ipfs/QmP6knuG7P1SbPMuN2Jucax1mJ6suVAYfzrLAQmoqRVUMH",
      description: "Warranty Serial No: 1c4984ffa09f9aa5a6dde352ae093412"
    })
  }];

  const result = await ipfs.add(files);
  console.log(result);
}

run();
