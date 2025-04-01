import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Button, Modal, Typography } from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { useSpring, animated } from "@react-spring/web";
import background from "../../assets/images/mode1.gif";
import bgMusic from "../../assets/audio/memory-bg.mp3";
import axios from "axios";
import { API_URL } from "../../constants/api";

interface Card {
  id: number;
  image: string;
}

interface GameData {
  userID: string;
  gameDate: Date;
  failed: number;
  difficulty: string;
  completed: number;
  timeTaken: number;
}

interface StyledGameContainerProps {
  mouseDisabled: boolean;
  children?: React.ReactNode;
}

interface CardProps {
  card: Card;
  handleClick: () => void;
  flipped: boolean;
  matched: boolean;
}

const defaultDifficulty = "Hard";

// Card Images
const cardImages: Card[] = [
  { id: 1, image: "/images/earth.png" },
  { id: 2, image: "/images/earth.png" },
  { id: 3, image: "/images/jupiter.png" },
  { id: 4, image: "/images/jupiter.png" },
  { id: 5, image: "/images/mars.png" },
  { id: 6, image: "/images/mars.png" },
  { id: 7, image: "/images/mercury.png" },
  { id: 8, image: "/images/mercury.png" },
  { id: 9, image: "/images/neptune.png" },
  { id: 10, image: "/images/neptune.png" },
  { id: 11, image: "/images/saturn.png" },
  { id: 12, image: "/images/saturn.png" },
];

// Audio files for matching and final congratulation
const matchAudioFiles: string[] = [
  "/audio/wonderful.mp3",
  "/audio/NiceJob.mp3",
  "/audio/Greatwork.mp3",
  "/audio/KeepItGoing.mp3",
  "/audio/Amazing.mp3",
];

const congratsAudio = "/audio/congrats.mp3"; // Final congratulations audio

// Shuffle Logic
const shuffleArray = (array: Card[]): Card[] => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const saveGameData = async (gameData: GameData): Promise<void> => {
  try {
    const response = await axios.post(`${API_URL}/api/game`, gameData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Game data saved successfully", response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error saving game data:", error.message);
    } else if (axios.isAxiosError(error)) {
      console.error("Error saving game data:", error.response?.data);
    } else {
      console.error("Error saving game data:", String(error));
    }
  }
};

// Styled Components
const StyledGameContainer = styled(Box)<StyledGameContainerProps>(
  ({ mouseDisabled }) => ({
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    pointerEvents: mouseDisabled ? "none" : "auto",
  })
);

const PixelButton = styled(Box)(() => ({
  display: "inline-block",
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "14px",
  padding: "15px 30px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const PixelBox = styled(Box)(() => ({
  position: "absolute",
  bottom: "10%",
  left: "1%",
  backgroundColor: "#ff4d4f",
  color: "#fff",
  padding: "10px 20px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "12px",
  textAlign: "center",
  marginBottom: "10px",
}));

const PixelTimerBox = styled(Box)(() => ({
  position: "absolute",
  bottom: "5%",
  left: "1%",
  backgroundColor: "#2c2c54",
  color: "#fff",
  padding: "10px 20px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "12px",
  textAlign: "center",
}));

const CardContainer = styled(Box)({
  perspective: "1000px",
  cursor: "pointer",
  width: "120px",
  height: "120px",
});

const CardInner = styled(animated.div)({
  position: "relative",
  width: "100%",
  height: "100%",
  transformStyle: "preserve-3d",
  transition: "transform 0.6s",
}) as unknown as React.ComponentType<{
  style?: { transform: string };
  children?: React.ReactNode;
}>;

const CardFront = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
  transform: "rotateY(180deg)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});

const CardBack = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#2c2c54",
  border: "2px solid #00aaff",
  borderRadius: "8px",
  transform: "rotateY(0deg)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#2c2c54",
  border: "2px solid #00d9ff",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
  padding: "20px",
  textAlign: "center",
  borderRadius: "10px",
};

const PixelTypography = styled(Typography)(() => ({
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "24px",
  color: "#fff",
  letterSpacing: "1px",
  textShadow: `
    -1px -1px 0 #ff0000,  
    1px -1px 0 #ff7f00, 
    1px 1px 0 #ffd700, 
    -1px 1px 0 #ff4500`,
}));

const PixelButtonModal = styled(Button)(() => ({
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "14px",
  padding: "15px 30px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

// Card Component
const Card: React.FC<CardProps> = ({ card, handleClick, flipped, matched }) => {
  const { transform } = useSpring({
    transform: flipped || matched ? "rotateY(180deg)" : "rotateY(0deg)",
    config: { tension: 500, friction: 30 },
  });

  return (
    <CardContainer onClick={handleClick}>
      <CardInner style={{ transform: transform as unknown as string }}>
        <CardFront>
          <img
            src={card.image}
            alt="Card front"
            style={{ width: "140%", height: "140%" }}
          />
        </CardFront>
        <CardBack>
          <img
            src="/images/Back2.png"
            alt="Card back"
            style={{ width: "140%", height: "140%" }}
          />
        </CardBack>
      </CardInner>
    </CardContainer>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  handleClick: PropTypes.func.isRequired,
  flipped: PropTypes.bool.isRequired,
  matched: PropTypes.bool.isRequired,
};

const MemoryCardGame: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [initialReveal, setInitialReveal] = useState<boolean>(true);
  const [musicStarted, setMusicStarted] = useState<boolean>(false);
  const [mouseDisabled, setMouseDisabled] = useState<boolean>(false);
  const [bgVolume] = useState<number>(
    parseInt(localStorage.getItem("bgVolume") ?? "0", 10)
  );
  const [sfxVolume] = useState<number>(
    parseInt(localStorage.getItem("sfxVolume") ?? "0", 10)
  );
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioIndex, setAudioIndex] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleSaveNewGame = () => {
    const userID = localStorage.getItem("userID");
    if (userID) {
      saveGameData({
        userID,
        gameDate: new Date(),
        failed: failedAttempts,
        difficulty: defaultDifficulty,
        completed: 0,
        timeTaken: timer,
      });
    }
  };

  const handleNewGame = () => {
    setCards(shuffleArray(cardImages));
    setMatchedCards([]);
    setFlippedCards([]);
    setFailedAttempts(0);
    setTimer(0);
    setTimerActive(false);
    setInitialReveal(true);
    setAudioIndex(0);

    const mouseDisableDuration = 2000;
    setMouseDisabled(true);
    setTimeout(() => {
      setMouseDisabled(false);
    }, mouseDisableDuration);

    setTimeout(() => {
      setInitialReveal(false);
      setTimerActive(true);
    }, 1500);
  };

  const handleBackButton = () => {
    setOpenModal(true);
  };

  const handleModalYes = () => {
    setOpenModal(false);
    localStorage.removeItem("gameCompleted");
    navigate("/play");
  };

  const handleModalNo = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    handleNewGame();
    const handleFirstClick = () => {
      if (!musicStarted && audioRef.current) {
        audioRef.current.volume = bgVolume / 100;
        audioRef.current
          .play()
          .catch((error: Error) => console.error("Audio play error:", error));
        setMusicStarted(true);
      }
    };
    document.addEventListener("click", handleFirstClick);

    return () => document.removeEventListener("click", handleFirstClick);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;
      setTimeout(() => {
        if (card1.image === card2.image) {
          setMatchedCards((prev: number[]) => [...prev, card1.id, card2.id]);
          if (audioIndex < matchAudioFiles.length) {
            const nextAudio = new Audio(matchAudioFiles[audioIndex]);
            nextAudio.volume = sfxVolume / 100;
            nextAudio.play();
            setAudioIndex(audioIndex + 1);
          }
        } else {
          setFailedAttempts((prev) => prev + 1);
        }
        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards, audioIndex, sfxVolume]);

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      const congrats = new Audio(congratsAudio);
      congrats.volume = sfxVolume / 100;
      congrats.play();

      setTimerActive(false);

      const saveData = async () => {
        try {
          const userID = localStorage.getItem("userID");
          if (userID) {
            await saveGameData({
              userID,
              gameDate: new Date(),
              failed: failedAttempts,
              difficulty: defaultDifficulty,
              completed: 1,
              timeTaken: timer,
            });
            localStorage.setItem("gameCompleted", "true");
            setTimeout(() => navigate("/congratulations"), 1000);
          }
        } catch (error) {
          console.error("Error saving game data:", error);
        }
      };

      saveData();
    }
  }, [matchedCards, cards.length, navigate, sfxVolume, failedAttempts, timer]);

  const userID = localStorage.getItem("userID");
  if (!userID) {
    console.error("Error: userID is missing.");
    return null;
  }

  const handleCardClick = (card: Card) => {
    if (
      !matchedCards.includes(card.id) &&
      flippedCards.length < 2 &&
      !flippedCards.some((c) => c.id === card.id)
    ) {
      setFlippedCards((prev) => [...prev, card]);
    }
  };

  return (
    <StyledGameContainer mouseDisabled={mouseDisabled}>
      <audio ref={audioRef} src={bgMusic} loop />
      <PixelButton
        onClick={handleBackButton}
        sx={{ alignSelf: "flex-start", margin: 2 }}
      >
        Back
      </PixelButton>
      <PixelTimerBox>Timer: {timer}s</PixelTimerBox>
      <PixelBox>Learning Moments: {failedAttempts}</PixelBox>
      <Grid
        container
        spacing={8}
        justifyContent="center"
        sx={{ maxWidth: 700, marginTop: "-120px" }}
      >
        {cards.map((card) => (
          <Grid item xs={3} key={card.id}>
            <Card
              card={card}
              handleClick={() => handleCardClick(card)}
              flipped={
                initialReveal ||
                flippedCards.some((c) => c.id === card.id) ||
                matchedCards.includes(card.id)
              }
              matched={matchedCards.includes(card.id)}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <PixelButton
          onClick={() => {
            handleSaveNewGame();
            handleNewGame();
          }}
          sx={{ mt: 2 }}
        >
          New Game
        </PixelButton>
      </Box>

      <Modal open={openModal} onClose={handleModalNo}>
        <Box sx={modalStyle}>
          <PixelTypography variant="h6">
            Are you sure you want to go back to the play page?
          </PixelTypography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              marginTop: 2,
            }}
          >
            <PixelButtonModal
              onClick={() => {
                handleSaveNewGame();
                handleModalYes();
              }}
              variant="contained"
              color="primary"
            >
              Yes
            </PixelButtonModal>
            <PixelButtonModal
              onClick={handleModalNo}
              variant="contained"
              color="secondary"
            >
              No
            </PixelButtonModal>
          </Box>
        </Box>
      </Modal>
    </StyledGameContainer>
  );
};

export default MemoryCardGame;
