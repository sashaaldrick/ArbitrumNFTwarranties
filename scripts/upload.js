const { create } = require("ipfs-http-client");

const ipfs = create("https://ipfs.infura.io:5001");

async function run() {
  const files = [{
    path: '/',
    content: JSON.stringify({
      name: "Warranty Information",
      attributes: [
        {
          "serial_number": "1ce18ce708ea4d222c687058e1ec6b11",
          "owner": "Sasha Aldrick"
        }
      ],
      image: "https://gateway.pinata.cloud/ipfs/QmZoBsCNmeSt1mfNc2ne88MBD1ua22c4rkik6QQ6oMZ213",
      description: "Warranty Serial No: 1ce18ce708ea4d222c687058e1ec6b11"
    })
  }];

  const result = await ipfs.add(files);
  console.log(result);
}

run();
