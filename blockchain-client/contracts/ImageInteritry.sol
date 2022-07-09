// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract ImageInteritry {

     address private contractOwner;
     //img_timeStamp : [image_hashes]
     //string[] entities;
     mapping (string => string) imageMap;
     

     constructor() {
         contractOwner = msg.sender;
     }

     modifier onlyOwner() {
         require(msg.sender == contractOwner, 'Only owner can update the image table');
         _;
     }

     function addImageToMapV1(string memory hash, string memory timeStamp) public {
         imageMap[timeStamp] = hash;
     }

     function getImageFromMap(string memory timeStamp) public view returns (string memory) {
         return imageMap[timeStamp];
     }
}