var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ImageInteritry = artifacts.require("./ImageInteritry.sol");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(ImageInteritry);
};
