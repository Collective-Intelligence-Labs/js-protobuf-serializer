const protobuf = require("protobufjs");
const keccak256 = require("keccak256")


const fromHexString = (hexString) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

const toHexString = (bytes) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

const fromUtf8String = (str) => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  const byteArray = new Uint8Array(encoded);
  return byteArray;
}


const aggregateAddress = "0F9AB7131548af0D9798375B1cc9B5d06322bD60";
const routerAddress = "0E8AB7131548af0D9798375B1cc9B5d06322bD60";
const nftHash = keccak256("Some NFT").toString("hex");
const owner1Address = "5Fd258E46CF5c5b2Ad252C37b48aeF887E65fd6A"
const owner2Address = "4E49eC51fA1CA06aF05a2039f603855cCbE1Ab2b"
// const owner3Address = "42e4CEc68f821441118BCeb6545d6A912114BD86"
// const owner4Address = "64e4CEc68f821441118BCeb6545d6A912114BD86"

const mockSignature = keccak256('some sig').toString('hex');


protobuf.load("operation.proto", function(err, root) {
    if (err) throw err;

    const OperationMessage = root.lookupType("Operation");
    const CommandMessage = root.lookupType("Command");
    const MintNFTPayloadMessage = root.lookupType("MintNFTPayload");
    const TransferNFTPayloadMessage = root.lookupType("TransferNFTPayload");


    const MintNFTPayload = {
      hash: fromHexString(nftHash),
      owner: fromHexString(owner1Address),
    };
    const errMsg1 = MintNFTPayloadMessage.verify(MintNFTPayload);
    if (errMsg1) throw Error(`MintNFTPayloadMessage: ${errMsg1}`);
    const mintPayload = MintNFTPayloadMessage.create(MintNFTPayload);
    const encodedMintPayload = MintNFTPayloadMessage.encode(mintPayload).finish();
    console.log('encodedMintPayload', "0x" + toHexString(encodedMintPayload));
    console.log("\n");


    const MintCommand = { 
      aggregateId: fromHexString(aggregateAddress),
      cmdSignature: fromHexString(mockSignature),
      cmdType: 1,
      cmdPayload: encodedMintPayload
    };
    const errMsg2 = CommandMessage.verify(MintCommand);
    if (errMsg2) throw Error(`CommandMessage: ${errMsg2}`);
    const mintCommand = CommandMessage.create(MintCommand);
    const encodedMintCommand = CommandMessage.encode(mintCommand).finish();
    console.log('encodedMintCommand', "0x" + toHexString(encodedMintCommand));
    console.log("\n");


    const TransferNFTPayload = {
      hash: fromHexString(nftHash),
      to: fromHexString(owner2Address),
    };
    const errMsg3 = TransferNFTPayloadMessage.verify(TransferNFTPayload);
    if (errMsg3) throw Error(`MintNFTPayloadMessage: ${errMsg3}`);
    const transferPayload = TransferNFTPayloadMessage.create(TransferNFTPayload);
    const encodedTransferPayload = TransferNFTPayloadMessage.encode(transferPayload).finish();
    console.log('encodedTransferPayload', "0x" + toHexString(encodedTransferPayload));
    console.log("\n");


    const TransferCommand = { 
      aggregateId: fromHexString(aggregateAddress),
      cmdSignature: fromHexString(mockSignature),
      cmdType: 2,
      cmdPayload: encodedTransferPayload
    };
    const errMsg4 = CommandMessage.verify(TransferCommand);
    if (errMsg4) throw Error(`CommandMessage: ${errMsg4}`);
    const transferCommand = CommandMessage.create(TransferCommand);
    const encodedTransferCommand = CommandMessage.encode(transferCommand).finish();
    console.log('encodedTransferCommand', "0x" + toHexString(encodedTransferCommand));
    console.log("\n");


    const Operation = { 
      routerId: fromHexString(routerAddress),
      commands: [
        mintCommand,
        transferCommand
      ]
    };

    const errMsg5 = OperationMessage.verify(Operation);
    if (errMsg5) throw Error(`Operation: ${errMsg5}`);
    const operation = OperationMessage.create(Operation);

    
    // Encode a message to an Uint8Array (browser) or Buffer (node)
    const encodedOperation = OperationMessage.encode(operation).finish();
    console.log("0x" + toHexString(encodedOperation));

    // console.log("\r\n");

    // Decode an Uint8Array (browser) or Buffer (node) to a message
    // const decodedOperation = OperationMessage.decode(encodedOperation);
    // console.log(decodedOperation);

});