import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import backgroundGif from "../../assets/images/play.gif";
import calmBackground from "../../assets/images/calm-wallpaper.jpg";
import backgroundMusic from "../../assets/audio/background-music.mp3";
import buttonHoverSound from "../../assets/audio/button-hover.mp3";
import buttonClickSound from "../../assets/audio/button-click.mp3";
import { X } from "lucide-react";
import "./Play.css";
import { ethers } from "ethers";
import { History } from "@/types/history";
import axios from "axios";
import { API_URL } from "../../constants/api";

interface CustomModalStyles {
  overlay: React.CSSProperties;
  content: React.CSSProperties;
}

const modalStyles: CustomModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    backgroundColor: "#1e1e2e",
    border: "2px solid #4a4e69",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "600px",
    height: "300px",
    width: "90%",
    color: "#fff",
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "hidden",
  },
};

const modalPlayStyles: CustomModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    backgroundColor: "#1e1e2e",
    border: "2px solid #4a4e69",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "600px",
    height: "200px",
    width: "90%",
    color: "#fff",
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "hidden",
  },
};

const Play: React.FC = () => {
  const navigate = useNavigate();
  const userID = localStorage.getItem("userID");
  const [SettingsmodalIsOpen, setModalSettingIsOpen] = useState<boolean>(false);
  const [PlaymodalIsOpen, setModalPlayIsOpen] = useState<boolean>(false);
  const [HistorymodalIsOpen, setHistorymodalIsOpen] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [tabHistory, setTabHistory] = useState<string>("my");
  const [history, setHistory] = useState<History>([]);
  const [isCalmMode] = useState<boolean>(false);

  const [bgVolume, setBgVolume] = useState<number>(
    localStorage.getItem("bgVolume") !== null
      ? parseInt(localStorage.getItem("bgVolume") || "50", 10)
      : 50
  );
  const [sfxVolume, setSfxVolume] = useState<number>(
    localStorage.getItem("sfxVolume") !== null
      ? parseInt(localStorage.getItem("sfxVolume") || "50", 10)
      : 50
  );

  const [mutedBg, setMutedBg] = useState<boolean>(false);
  const [mutedSfx, setMutedSfx] = useState<boolean>(false);

  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  const [walletInfo, setWalletInfo] = useState({
    address: "",
    balance: "0",
    network: "",
    chainId: "",
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    bgAudioRef.current = new Audio(backgroundMusic);
    hoverAudioRef.current = new Audio(buttonHoverSound);
    clickAudioRef.current = new Audio(buttonClickSound);

    const bgAudio = bgAudioRef.current;
    bgAudio.loop = true;
    bgAudio.volume = bgVolume / 100;

    const startMusic = () => {
      bgAudio.play().catch((error) => console.error("Autoplay failed:", error));
    };

    document.addEventListener("click", startMusic, { once: true });

    return () => {
      document.removeEventListener("click", startMusic);
      bgAudio.pause();
      bgAudio.currentTime = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = bgVolume / 100;
    }
    localStorage.setItem("bgVolume", bgVolume.toString());
  }, [bgVolume]);

  useEffect(() => {
    if (hoverAudioRef.current) {
      hoverAudioRef.current.volume = sfxVolume / 100;
    }
    if (clickAudioRef.current) {
      clickAudioRef.current.volume = sfxVolume / 100;
    }
    localStorage.setItem("sfxVolume", sfxVolume.toString());
  }, [sfxVolume]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get<History>(
          `${API_URL}/api/history?userID=${userID}`
        );
        setHistory(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        setHistory([]);
      }
    };

    fetchHistory();
  }, []);

  const handleBgVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value, 10);
    setBgVolume(newVolume);
    setMutedBg(newVolume === 0);
  };

  const handleSfxVolumeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVolume = parseInt(event.target.value, 10);
    setSfxVolume(newVolume);
    setMutedSfx(newVolume === 0);
  };

  // const toggleCalmMode = () => {
  //   setIsCalmMode((prev) => !prev);
  //   playClickSound();
  // };

  const playHoverSound = () => {
    if (hoverAudioRef.current) {
      hoverAudioRef.current.currentTime = 0;
      hoverAudioRef.current
        .play()
        .catch((error) => console.error("Hover sound playback failed:", error));
    }
  };

  const playClickSound = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current
        .play()
        .catch((error) => console.error("Click sound playback failed:", error));
    }
  };

  const SettingopenModal = () => {
    setModalSettingIsOpen(true);
    playClickSound();
  };

  const SettingcloseModal = () => {
    setModalSettingIsOpen(false);
    playClickSound();
  };

  const PlayopenModal = () => {
    playClickSound();
    setModalPlayIsOpen(true);
  };

  const PlaycloseModal = () => {
    playClickSound();
    setModalPlayIsOpen(false);
  };

  const HistoryopenModal = () => {
    playClickSound();
    setHistorymodalIsOpen(true);
  };

  const HistorycloseModal = () => {
    playClickSound();
    setHistorymodalIsOpen(false);
  };

  const handleDifficultySelect = (level: string): void => {
    setDifficulty(level);
  };

  const handlePlay = () => {
    playClickSound();
    const userID = localStorage.getItem("userID");
    if (!userID) {
      alert("UserID is missing. Please log in again.");
      return;
    }
    localStorage.setItem("gameStarted", "true");

    if (isCalmMode) {
      if (difficulty === "red") {
        navigate("/calm-hard");
      } else if (difficulty === "yellow") {
        navigate("/calm-medium");
      } else if (difficulty === "green") {
        navigate("/calm-easy");
      } else {
        alert(`Selected difficulty: ${difficulty}`);
      }
    } else {
      if (difficulty === "red") {
        navigate("/memory-card-game");
      } else if (difficulty === "yellow") {
        navigate("/medium");
      } else if (difficulty === "green") {
        navigate("/easy");
      } else {
        alert(`Selected difficulty: ${difficulty}`);
      }
    }
  };

  // const handleHistory = () => {
  //   playClickSound();
  //   console.log("History");
  // };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Por favor instale a MetaMask!");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      const walletData = {
        address: address,
        balance: ethers.utils.formatEther(balance),
        network: network.name,
        chainId: network.chainId.toString(),
      };

      setWalletInfo(walletData);
      setIsConnected(true);

      localStorage.setItem("walletAddress", address);
      localStorage.setItem("walletBalance", balance.toString());
      localStorage.setItem("walletNetwork", network.name);
      localStorage.setItem("walletChainId", network.chainId.toString());
      localStorage.setItem("walletProvider", provider.toString());
      localStorage.setItem("walletSigner", signer.toString());
    } catch (error) {
      console.error("Erro ao conectar wallet:", error);
      alert("Erro ao conectar com a MetaMask");
    }
  };

  useEffect(() => {
    const loadWalletInfo = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            const network = await provider.getNetwork();

            const walletData = {
              address,
              balance: ethers.utils.formatEther(balance),
              network: network.name,
              chainId: network.chainId.toString(),
            };

            setWalletInfo(walletData);
            setIsConnected(true);
          }
        } catch (error) {
          console.error("Erro ao carregar informações da wallet:", error);
        }
      }
    };

    loadWalletInfo();
  }, []);

  return (
    <div
      className="background-container"
      style={{
        backgroundImage: `url(${isCalmMode ? calmBackground : backgroundGif})`,
      }}
    >
      <h1 className={`game-title ${isCalmMode ? "calm-title" : ""}`}>
        WonderCards
      </h1>

      <button
        className="wallet-button"
        onClick={connectWallet}
        onMouseEnter={playHoverSound}
      >
        {isConnected
          ? `Wallet Connected: ${walletInfo.address.slice(
              0,
              6
            )}...${walletInfo.address.slice(-4)}`
          : "Connect Wallet"}
      </button>

      {isConnected && (
        <div className="wallet-info">
          <p>
            Endereço: {walletInfo.address.slice(0, 6)}...
            {walletInfo.address.slice(-4)}
          </p>
          <p>Saldo: {Number(walletInfo.balance).toFixed(4)} ETH</p>
          <p>Rede: {walletInfo.network}</p>
          <p>Chain ID: {walletInfo.chainId}</p>
        </div>
      )}

      <div className="button-container">
        <button
          className={`game-button ${isCalmMode ? "calm-button" : ""}`}
          onClick={PlayopenModal}
          onMouseEnter={playHoverSound}
        >
          Play
        </button>
        <button
          className={`game-button ${isCalmMode ? "calm-button" : ""}`}
          onClick={HistoryopenModal}
          onMouseEnter={playHoverSound}
        >
          History
        </button>
        <button
          className={`game-button ${isCalmMode ? "calm-button" : ""}`}
          onClick={() => {
            playClickSound();
            alert("Instructions coming soon!");
          }}
          onMouseEnter={playHoverSound}
        >
          Instructions
        </button>
        <button
          className={`game-button ${isCalmMode ? "calm-button" : ""}`}
          onClick={SettingopenModal}
          onMouseEnter={playHoverSound}
        >
          Settings
        </button>
        <button
          className={`game-button ${isCalmMode ? "calm-button" : ""}`}
          onClick={() => {
            playClickSound();
            localStorage.removeItem("token");
            localStorage.removeItem("userID");
            window.location.href = "/login";
          }}
          onMouseEnter={playHoverSound}
        >
          Logout
        </button>
      </div>
      <Modal
        isOpen={SettingsmodalIsOpen}
        onRequestClose={SettingcloseModal}
        style={{
          ...modalStyles,
          content: {
            ...modalStyles.content,
            backgroundColor: isCalmMode ? "#86a17d" : "#1e1e2e",
            color: isCalmMode ? "#ffffff" : "#fff",
          },
        }}
      >
        <button
          onClick={SettingcloseModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <X size={24} />
        </button>

        <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>
          Background Music
        </h2>
        <div className="volume-control">
          <span className="volume-icon">{mutedBg ? "🔇" : "🔊"}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={bgVolume}
            onChange={handleBgVolumeChange}
            className="volume-slider"
          />
        </div>

        <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>
          Sound Effects
        </h2>
        <div className="volume-control">
          <span className="volume-icon">{mutedSfx ? "🔇" : "🔊"}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={sfxVolume}
            onChange={handleSfxVolumeChange}
            className="volume-slider"
          />
        </div>

        {/* <div className="calm-mode">
          <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>
            Calm Mode
          </h2>
          <label className="switch">
            <input
              type="checkbox"
              checked={isCalmMode}
              onChange={toggleCalmMode}
            />
            <span className="slider round"></span>
          </label>
        </div> */}
      </Modal>

      <Modal
        isOpen={PlaymodalIsOpen}
        onRequestClose={PlaycloseModal}
        style={{
          ...modalPlayStyles,
          content: {
            ...modalPlayStyles.content,
            backgroundColor: isCalmMode ? "#86a17d" : "#1e1e2e",
            color: isCalmMode ? "#ffffff" : "#fff",
          },
        }}
      >
        <button
          onClick={PlaycloseModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <X size={24} />
        </button>

        <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>
          Select Difficulty
        </h2>
        <div className="difficulty-selection">
          <button
            onClick={() => {
              handleDifficultySelect("green");
              playClickSound();
            }}
            className={`difficulty-button green ${
              difficulty === "green" && !isCalmMode ? "selected" : ""
            } ${isCalmMode && difficulty === "green" ? "calm-selected" : ""}`}
            onMouseEnter={playHoverSound}
          >
            Easy
          </button>
          <button
            onClick={() => {
              handleDifficultySelect("yellow");
              playClickSound();
            }}
            className={`difficulty-button yellow ${
              difficulty === "yellow" && !isCalmMode ? "selected" : ""
            } ${isCalmMode && difficulty === "yellow" ? "calm-selected" : ""}`}
            onMouseEnter={playHoverSound}
          >
            Normal
          </button>
          <button
            onClick={() => {
              handleDifficultySelect("red");
              playClickSound();
            }}
            className={`difficulty-button red ${
              difficulty === "red" && !isCalmMode ? "selected" : ""
            } ${isCalmMode && difficulty === "red" ? "calm-selected" : ""}`}
            onMouseEnter={playHoverSound}
          >
            Hard
          </button>
        </div>

        <div>
          <button
            onClick={handlePlay}
            className="play-button"
            onMouseEnter={playHoverSound}
          >
            Accept
          </button>
        </div>
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={HistorymodalIsOpen}
        onRequestClose={HistorycloseModal}
        style={{
          ...modalPlayStyles,

          content: {
            ...modalPlayStyles.content,
            backgroundColor: isCalmMode ? "#86a17d" : "#1e1e2e",
            color: isCalmMode ? "#ffffff" : "#fff",
            height: "500px",
          },
        }}
      >
        <button
          onClick={HistorycloseModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <X size={24} />
        </button>
        <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>
          History
        </h2>
        <div className="tabs-history">
          <button
            className="tab-history"
            onClick={() => setTabHistory("my")}
            data-active={tabHistory === "my"}
          >
            MY GAMES
          </button>
          <button
            className="tab-history"
            onClick={() => setTabHistory("all")}
            data-active={tabHistory === "all"}
          >
            ALL GAMES
          </button>
        </div>
        <div className="history-list">
          {tabHistory === "my" && (
            <div className="history-list">
              {history &&
                Array.isArray(history) &&
                history
                  .filter((item) => item.userID === userID)
                  .map((item) => (
                    <div key={item._id} className="history-item">
                      <p>
                        Data: {new Date(item.gameDate).toLocaleDateString()}
                      </p>
                      <p>Dificuldade: {item.difficulty}</p>
                      <p>Falhas: {item.failed}</p>
                    </div>
                  ))}
            </div>
          )}

          {tabHistory === "all" && (
            <div className="history-list" data-active={tabHistory === "all"}>
              {history &&
                Array.isArray(history) &&
                history.map((item) => (
                  <div key={item._id} className="history-item">
                    <p>Data: {new Date(item.gameDate).toLocaleDateString()}</p>
                    <p>Dificuldade: {item.difficulty}</p>
                    <p>Falhas: {item.failed}</p>
                  </div>
                ))}
            </div>
          )}

          {history.length === 0 && (
            <p>
              No history found. Play a game to start tracking your progress.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Play;
