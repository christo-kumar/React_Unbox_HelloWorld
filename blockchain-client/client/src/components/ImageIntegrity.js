import React from 'react';
import ImageInteritry from "../contracts/ImageInteritry.json";
import getWeb3 from "../getWeb3";
import Pic1 from "../resources/Prof_Pic1.jpg";
import Pic2 from "../resources/Prof_Pic2.jpg";
import Pic3 from "../resources/Prof_Pic3.jpg";

class ImageIntegrity extends React.Component {

    state = { storageValue: 0, web3: null, accounts: null, contract: null };

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = ImageInteritry.networks[networkId];
            const instance = new web3.eth.Contract(
                ImageInteritry.abi,
                deployedNetwork && deployedNetwork.address,
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, accounts, contract: instance });
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    runExample = async () => {
        const { accounts, contract } = this.state;

        // Stores a given value, 5 by default.
        await contract.methods.set(5).send({ from: accounts[0] });

        // Get the value from the contract to prove it worked.
        const response = await contract.methods.get().call();

        // Update state with the result.
        this.setState({ storageValue: response });
    };

    validateImage = async (imageUrl, timeStamp) => {
        console.log(imageUrl);
        console.log(timeStamp);
        const { accounts, contract } = this.state;
        console.log(accounts);
        this.getBase64(imageUrl).then(
            async (res) => {
                const bcResponse = await contract.methods.getImageFromMap(timeStamp).call();
                console.log(res.a);
                console.log(bcResponse);
                if (bcResponse === res.a) {
                    alert("Real PIC - File Matched. Timestamp = " + timeStamp);
                } else {
                    alert("Morphed Image. Timestamp = " + timeStamp);
                }
            },
            (rej) => {
                console.log(rej.a);
            }
        );

    };

    uploadImage = async (imageUrl, timeStamp) => {
        console.log(imageUrl);
        console.log(timeStamp);
        const { accounts, contract } = this.state;
        console.log(accounts);
        this.getBase64(imageUrl).then(
            async (res) => {
                console.log(res.a);
                //hash ~ Key
                await contract.methods.addImageToMapV1(res.a, timeStamp).send({ from: accounts[0] });
                const response = await contract.methods.getImageFromMap(timeStamp).call();
                alert("Image Uploaded To BlockChain. Timestamp = " + timeStamp);
            },
            (rej) => {
                console.log(rej.a);
            }
        );
    };

    async getBase64(imageUrl) {
        const response = await fetch(imageUrl);
        const imageBlob = await response.blob();
        let promise = new Promise((res, rej) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onload = () => {
                res({ a: reader.result });
            };
            reader.onerror = (error) => {
                rej({ a: error });
            };
        });

        return promise;

    };

    render() {
        const imageUrl1 = "Users/christokumar/Documents/Profile/React/client/src/resources/Prof_Pic1.jpg";
        const imageUrl2 = "Users/christokumar/Documents/Profile/React/client/src/resources/Prof_Pic2.jpg";
        const imageUrl3 = "Users/christokumar/Documents/Profile/React/client/src/resources/Prof_Pic3.jpg";
        const timeStamp1 = "1653376882";
        const timeStamp2 = "1721840882";
        return (
            <div>
                <h1> Welcome to Real Pic </h1>
                <table>
                    <tr>
                        <td><img src={Pic1} height={120} width={100} /></td>
                        <td> <h5>{timeStamp1}</h5></td>
                        <td><button onClick={() => { this.uploadImage(imageUrl1, timeStamp1) }}> Upload </button></td>
                        <td><button onClick={() => { this.validateImage(imageUrl1, timeStamp1) }}> Validate </button></td>
                    </tr>
                    <tr>
                        <td><img src={Pic2} height={120} width={100} /></td>
                        <td> <h5>{timeStamp2}</h5></td>
                        <td><button onClick={() => { this.uploadImage(imageUrl2, timeStamp2) }}> Upload </button></td>
                        <td><button onClick={() => { this.validateImage(imageUrl2, timeStamp2) }}> Validate </button></td>
                    </tr>
                    <tr>
                        <td><img src={Pic3} height={120} width={100} /></td>
                        <td> <h5> Morphed Of - {timeStamp1}</h5></td>
                        <td><button onClick={() => { this.validateImage(imageUrl3, timeStamp1) }}> Validate </button></td>
                    </tr>
                </table>

            </div>
        );
    }
}

export default ImageIntegrity;