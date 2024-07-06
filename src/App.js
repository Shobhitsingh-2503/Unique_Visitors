import "../src/App.css";
import { useState } from "react";
import { ethers } from "ethers";
import { abi, contractAddress } from "./constants";
import { AnimatedCounter } from "react-animated-counter";

function App() {
  const [cnt, setCnt] = useState(0);
  const [user, setUser] = useState("Connect");

  async function connect() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      await provider
        .send("eth_requestAccounts", [])
        .then(async (result) => {
          setUser(result.toString());
          await contract.addAccount(result.toString());
          await contract.getLength().then((res) => {
            setCnt(parseInt(res));
          });
        })
        .catch((error) => {
          alert(`${error.reason} transaction`);
        });
    } else {
      alert("No Wallet Found");
    }
  }

  useState(async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      provider.send("eth_requestAccounts", []).then((result) => {
        setUser(result.toString());
      });
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      contract.getLength().then((res) => {
        setCnt(parseInt(res));
      });
    } else {
      alert("Wallet NOT FOUND !");
    }
  });
  return (
    <div className="App" align="center">
      <button onClick={connect}>{user}</button>
      <div className="box" align="center">
        Total Unique User Count :-
        <AnimatedCounter
          value={cnt}
          color="black"
          fontSize="18px"
          decimalPrecision="0"
        />
      </div>
    </div>
  );
}

export default App;
