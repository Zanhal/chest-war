import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const ChestPieceWar = () => {
  const [gameState, setGameState] = useState('start'); // 'start', 'selectPeople', 'enterNames', 'loading', 'results'
  const [playerCount, setPlayerCount] = useState('');
  const [playerNames, setPlayerNames] = useState([]);
  const [chestWinners, setChestWinners] = useState([]);
  const [legReceivers, setLegReceivers] = useState([]);
  const [usedChestQuotes, setUsedChestQuotes] = useState([]);
  const [usedLegQuotes, setUsedLegQuotes] = useState([]);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [shakeTitle, setShakeTitle] = useState(false);
  
  const videoRefs = useRef({});

  const chestQuotes = [
    { text: "പ പ പാാാാ 🎶🤣", video: "jay.mp4" },
    { text: "ഉന്നാല്‍ മുഡിയാത് തമ്പി 🔥😹", video: "sra.mp4" },
    { text: "ഹെ ഹെ ഹെ… 😏🗿", video: "in.mp4" },
    { text: "🕺🕺🕺🕺🕺", video: "su.mp4" }
  ];

  const legQuotes = [
    { text: "അഹാാാാാ... ഇപ്പോ എങ്ങനുണ്ട് 🚶", video: "pettu_o.mp4" },
    { text: "എന്താ അവസ്ഥ 😩😭😭", video: "avastha.mp4" },
    { text: "ചാച്ചിക്കോ 😢😹", video: "thala.mp4" },
    { text: "ബ്രോ ഒന്ന് കരഞ്ഞുടേ 🤣😭 ", video: "hari_o.mp4" }
  ];

  const getUniqueQuote = (quotes, usedList) => {
    if (usedList.length >= quotes.length) usedList = [];
    const remaining = quotes.filter(q => !usedList.includes(q));
    const quote = remaining[Math.floor(Math.random() * remaining.length)];
    return { quote, newUsedList: [...usedList, quote] };
  };

  const stopAllVideos = () => {
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  const handleStartGame = () => {
    setGameState('selectPeople');
    setShakeTitle(true);
    setTimeout(() => setShakeTitle(false), 400);
  };

  const handlePeopleSelect = () => {
    const count = parseInt(playerCount);
    if (!count || count < 2 || count > 8) {
      alert("Please select between 2 to 8 players.");
      return;
    }
    setPlayerNames(new Array(count).fill(''));
    setGameState('enterNames');
  };

  const handleNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleFight = () => {
    const validNames = playerNames.filter(name => name.trim() !== '');
    if (validNames.length < 2) {
      alert("Enter at least 2 valid names!");
      return;
    }

    setGameState('loading');
    
    setTimeout(() => {
      const shuffled = [...validNames].sort(() => Math.random() - 0.5);
      const chestCount = Math.floor(validNames.length / 2);
      const newChestWinners = shuffled.slice(0, chestCount);
      const newLegReceivers = shuffled.slice(chestCount);

      // Assign quotes
      const chestResults = [];
      const legResults = [];
      let newUsedChest = [];
      let newUsedLeg = [];

      newChestWinners.forEach(name => {
        const { quote, newUsedList } = getUniqueQuote(chestQuotes, newUsedChest);
        newUsedChest = newUsedList;
        chestResults.push({ name, quote });
      });

      newLegReceivers.forEach(name => {
        const { quote, newUsedList } = getUniqueQuote(legQuotes, newUsedLeg);
        newUsedLeg = newUsedList;
        legResults.push({ name, quote });
      });

      setChestWinners(chestResults);
      setLegReceivers(legResults);
      setUsedChestQuotes(newUsedChest);
      setUsedLegQuotes(newUsedLeg);
      setFlippedCards(new Set());
      setGameState('results');
    }, 1000);
  };

  const handleReroll = () => {
    const allNames = [...chestWinners.map(w => w.name), ...legReceivers.map(r => r.name)];
    const shuffled = [...allNames].sort(() => Math.random() - 0.5);
    const chestCount = Math.floor(allNames.length / 2);
    const newChestWinners = shuffled.slice(0, chestCount);
    const newLegReceivers = shuffled.slice(chestCount);

    // Assign quotes
    const chestResults = [];
    const legResults = [];
    let newUsedChest = [];
    let newUsedLeg = [];

    newChestWinners.forEach(name => {
      const { quote, newUsedList } = getUniqueQuote(chestQuotes, newUsedChest);
      newUsedChest = newUsedList;
      chestResults.push({ name, quote });
    });

    newLegReceivers.forEach(name => {
      const { quote, newUsedList } = getUniqueQuote(legQuotes, newUsedLeg);
      newUsedLeg = newUsedList;
      legResults.push({ name, quote });
    });

    setChestWinners(chestResults);
    setLegReceivers(legResults);
    setUsedChestQuotes(newUsedChest);
    setUsedLegQuotes(newUsedLeg);
    setFlippedCards(new Set());
  };

  const handleCardClick = (cardId) => {
    stopAllVideos();
    setFlippedCards(prev => new Set([...prev, cardId]));
  };

  useEffect(() => {
    // Play the video for the most recently flipped card
    if (flippedCards.size === 0) return;
    const lastCardId = Array.from(flippedCards).slice(-1)[0];
    const video = videoRefs.current[lastCardId];
    if (video) {
      video.muted = false;
      video.currentTime = 0;
      video.play().catch((e) => {
        console.warn("Video play failed:", e);
      });
    }
  }, [flippedCards]);

  const FlipCard = ({ name, quote, cardId }) => {
    const isFlipped = flippedCards.has(cardId);
    
    return (
      <li 
        className={`flip-card ${isFlipped ? 'flipped' : ''}`}
        onClick={() => handleCardClick(cardId)}
      >
        <div className="flip-inner">
          <div className="flip-front">
            Click to Reveal 🔒
          </div>
          <div className="flip-back">
            <div className="name">{name}</div>
            <div className="quote">{quote.text}</div>
            <video 
              ref={el => videoRefs.current[cardId] = el}
              className="quote-video" 
              preload="metadata" 
              src={quote.video} 
            />
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="app-bg">
      <div className="app-container">
        <h1 className={`app-title${shakeTitle ? ' shake' : ''}`}>
          Chest Piece War
        </h1>
        <p className="app-subtitle">
          Not everyone will win
        </p>

        {/* Start Screen */}
        {gameState === 'start' && (
          <div className="start-screen">
            <button 
              onClick={handleStartGame}
              className="primary-btn"
            >
              Start the War
            </button>
            
            <div className="info-box">
              <h3 className="info-title">What's This?</h3>
              <p>
                When your squad orders Shawai or Al Faham and the chest pieces are limited... chaos begins.  
                This site settles the debate <strong>fair and square</strong>.
                <br/><br/>
                Let fate decide who eats chest, who gets legs, and who cries.
              </p>
            </div>
          </div>
        )}

        {/* Select People Count */}
        {gameState === 'selectPeople' && (
          <div className="select-people">
            <label className="label">How many people are in the war?</label>
            <select 
              value={playerCount}
              onChange={(e) => setPlayerCount(e.target.value)}
              className="select"
            >
              <option value="">-- Choose --</option>
              {[2,3,4,5,6,7,8].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <br/>
            <button 
              onClick={handlePeopleSelect}
              className="primary-btn mt-2"
            >
              Next
            </button>
          </div>
        )}

        {/* Enter Names */}
        {gameState === 'enterNames' && (
          <div className="enter-names">
            <p className="mb">Enter player names:</p>
            {playerNames.map((name, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder="Enter the name"
                  className="input"
                />
              </div>
            ))}
            <div className="btn-row">
              <button 
                onClick={() => setGameState('selectPeople')}
                className="primary-btn"
              >
                Go Back
              </button>
              <button 
                onClick={handleFight}
                className="primary-btn"
              >
                💥 Fight
              </button>
            </div>
          </div>
        )}

        {/* Loading Screen */}
        {gameState === 'loading' && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}

        {/* Results */}
        {gameState === 'results' && (
          <div>
            <div className="mb-8">
              <h2 className="results-title">🥩 Chest Piece Winners:</h2>
              <ul className="results-list">
                {chestWinners.map((winner, index) => (
                  <FlipCard 
                    key={`chest-${index}`} 
                    name={winner.name} 
                    quote={winner.quote} 
                    cardId={`chest-${index}`} 
                  />
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="results-title">🍗 Leg Piece Receivers:</h2>
              <ul className="results-list">
                {legReceivers.map((receiver, index) => (
                  <FlipCard 
                    key={`leg-${index}`} 
                    name={receiver.name} 
                    quote={receiver.quote} 
                    cardId={`leg-${index}`} 
                  />
                ))}
              </ul>
            </div>

            <button 
              onClick={handleReroll}
              className="primary-btn reroll-btn"
            >
              Re roll
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChestPieceWar;