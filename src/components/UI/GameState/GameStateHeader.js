import { ethers } from "ethers";
import "./GameStateHeader.scss";
import { useEffect, useRef, useState } from "react";

export const GameStateHeader = ({ opponentName, myTurn, remainingTime }) => {


  const [cryptoAccount, setCryptoAccount] = useState('');

  const formatTime = (time) => {
    if (!time) {
      return "-- : --";
    }

    const minutes =
      Math.floor(time / 60) < 10
        ? "0" + Math.floor(time / 60)
        : Math.floor(time / 60);
    const seconds = time % 60 < 10 ? "0" + (time % 60) : time % 60;

    return minutes + " : " + seconds;
  };
  const truncate = (str) => {
    return str?.length > 10 ? `${str.substring(0, 6)}...${str.slice(-4)}` : str;
  }

  const initConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      const accs = await provider.send('eth_accounts', []);
      if (accs) {
        setCryptoAccount(accs[0]);
      }

      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length < 1) {
            window.location.reload();
        }

        setCryptoAccount(accounts[0]);
      })

      window.ethereum.on("networkChanged", async (networkId) => {
        console.log("Network:", networkId);
        await initConnection();
      })

    }  
  }

  const onConnectWalletClick = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const accs = await provider.send('eth_requestAccounts', []);
    if (accs) {
      setCryptoAccount(accs[0]);
    }

    } else {
      alert('METAMASK NOT INSTALLED');
    }
  }

  useEffect(() => {

    initConnection();

  }, []) ;
  
  return (
    <div className="GameStateHeader">
      <div className="u-you-container">
        <div className="u-black"></div>
        <div className="u-info">
          <div className="u-info-img-back">
            <div className="u-info-img"></div>
          </div>
          <div className="u-info-name">You</div>
        </div>
        <div className={`u-left-banner ${myTurn ? "show" : "hide"}`}></div>
      </div>

      <div className="u-time-container">
        <div className={`u-time`}>
          {myTurn ? formatTime(remainingTime) : "-- : --"}
        </div>
        <div className="u-clock"></div>
        <div className={`u-time`}>
          {!myTurn ? formatTime(remainingTime) : "-- : --"}
        </div>
      </div>

      <div className="u-opponent-container">
        <div className="u-black"></div>
        <div className="u-info">
          <div className="u-info-img-back">
            <div className="u-info-img"></div>
          </div>
          <div className="u-info-name">{opponentName}</div>

          <div className="CryptoWalletButton" onClick={cryptoAccount ? null : onConnectWalletClick}>
            {
              truncate(cryptoAccount) || 'Connect Wallet'
            }
          </div>
          
        </div>
        <div className={`u-right-banner ${!myTurn ? "show" : "hide"}`}></div>
      </div>
    </div>
  );
};

export default GameStateHeader;
