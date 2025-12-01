"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const questions = [
    { question: "What is the capital of France?", options: ["London", "Paris", "Berlin", "Rome"], answer: "Paris" },
    { question: "Which planet is closest to the sun?", options: ["Earth", "Mars", "Mercury", "Venus"], answer: "Mercury" },
    { question: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Charles Dickens", "Homer", "Tolstoy"], answer: "Shakespeare" },
    { question: "Largest ocean?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], answer: "Pacific" },
    { question: "Continents on Earth?", options: ["5", "6", "7", "8"], answer: "7" },
    { question: "What is H2O?", options: ["Hydrogen", "Oxygen", "Water", "Salt"], answer: "Water" },
    { question: "Fastest land animal?", options: ["Cheetah", "Lion", "Horse", "Tiger"], answer: "Cheetah" },
    { question: "Days in a leap year?", options: ["365", "366", "364", "367"], answer: "366" },
    { question: "Gas plants absorb?", options: ["Oxygen", "CO2", "Nitrogen", "Helium"], answer: "CO2" },
    { question: "Red Planet?", options: ["Mars", "Jupiter", "Saturn", "Venus"], answer: "Mars" },
    { question: "Legs on a spider?", options: ["6", "8", "10", "12"], answer: "8" },
    { question: "Tallest animal?", options: ["Elephant", "Giraffe", "Camel", "Kangaroo"], answer: "Giraffe" },
    { question: "Painter of Mona Lisa?", options: ["Van Gogh", "Da Vinci", "Picasso", "Michelangelo"], answer: "Da Vinci" },
    { question: "Largest planet?", options: ["Earth", "Mars", "Jupiter", "Uranus"], answer: "Jupiter" },
    { question: "Liquid metal?", options: ["Gold", "Mercury", "Iron", "Copper"], answer: "Mercury" },
  ];

  const [index, setIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [animClass, setAnimClass] = useState("");
  const [manAnim, setManAnim] = useState("");
  const [bridgeStatus, setBridgeStatus] = useState(Array(15).fill("intact")); // "intact" or "collapsed"

  const stopsRef = useRef([]);
  const [manPos, setManPos] = useState(0);

  // Update man's position along the bridges
  useEffect(() => {
    if (!won && stopsRef.current[0]) {
      const firstBridge = stopsRef.current[0].offsetLeft;
      const bridgeWidth = stopsRef.current[0].offsetWidth + 12; // spacing
      setManPos(firstBridge + index * bridgeWidth);
    }
  }, [index, won]);

  function handleAnswer(option) {
    if (option !== questions[index].answer) {
      // Collapse the current bridge
      setBridgeStatus((prev) => {
        const newStatus = [...prev];
        newStatus[index] = "collapsed";
        return newStatus;
      });
      setAnimClass("shake");
      setManAnim("fall-fire");
      setTimeout(() => setGameOver(true), 1000);
      return;
    }

    // Correct answer animation
    setAnimClass("bounce-scale");
    setManAnim("jump-up");

    setTimeout(() => {
      if (index + 1 === questions.length) {
        setWon(true);
      } else {
        setIndex(index + 1);
      }
      setAnimClass("");
      setManAnim("");
    }, 400);
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/junglevideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-5"></div>

      {/* Quiz Box */}
      <div
        className={`relative z-10 w-full max-w-xl p-6 rounded-lg shadow-md text-center transition-all ${animClass} bg-white/30 backdrop-blur-sm border border-white/20`}
      >
        {gameOver && <h1 className="text-3xl font-bold text-red-600 fade-pop">💀 Game Over!</h1>}
        {won && <h1 className="text-3xl font-bold text-green-600 fade-pop">🎉 You Won All 15!</h1>}

        {!gameOver && !won && (
          <>
            <h2 className="text-xl font-semibold mb-2">Question {index + 1} / {questions.length}</h2>
            <h3 className="text-lg mb-4">{questions[index].question}</h3>

            <div className="flex flex-col gap-3">
              {questions[index].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="p-2 bg-white/30 rounded hover:bg-white/50 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bridges + Man */}
      <div className="mt-10 w-full max-w-4xl relative flex justify-center z-10 h-40 items-end gap-3">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} ref={(el) => (stopsRef.current[i] = el)} className="relative">
            <img
              src="/bridge.svg"
              alt="Bridge"
              className={`w-[80px] h-[40px] object-contain transition-all duration-700 ${bridgeStatus[i] === "collapsed" ? "animate-collapse opacity-0" : ""}`}
            />
            {bridgeStatus[i] === "collapsed" && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-t from-red-700 via-orange-500 to-transparent rounded-full animate-fire"></div>
            )}
          </div>
        ))}

        {/* Man */}
        <div
          className={`absolute bottom-[50px] text-4xl transition-all duration-300 ${manAnim} ${won ? "victory" : ""}`}
          style={{
            left: won ? "50%" : manPos,
            transform: won ? "translateX(-50%) scale(2)" : undefined,
          }}
        >
          {won ? "😄" : "🧍‍♂️"}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        .shake { animation: shake 0.6s; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .bounce-scale { animation: bounce-scale 0.4s; }
        @keyframes bounce-scale {
          0%,100%{transform:scale(1);}
          50%{transform:scale(1.3) translateY(-10px);}
        }
        .jump-up { animation: jump-up 0.4s forwards; }
        @keyframes jump-up {
          0%{transform:translateY(0);}
          50%{transform:translateY(-30px);}
          100%{transform:translateY(0);}
        }
        .fall-fire { animation: fall-fire 1s forwards; }
        @keyframes fall-fire {
          0%{transform:translateY(0) rotate(0deg); opacity:1;}
          100%{transform:translateY(100px) rotate(45deg); opacity:0;}
        }
        .animate-collapse { animation: collapse 0.7s forwards; transform-origin:top center; }
        @keyframes collapse { 0%{transform:rotateX(0deg);} 100%{transform:rotateX(90deg) translateY(20px); opacity:0;} }
        .animate-fire { animation: flicker 1.5s infinite; }
        @keyframes flicker { 0%,100%{opacity:1;} 50%{opacity:0.7; transform:scale(1.05);} }

        /* Victory animation */
        .victory {
          animation: victory 1s forwards;
        }
        @keyframes victory {
          0% {
            transform: translateX(0) scale(1);
          }
          50% {
            transform: translateY(-50px) scale(2.2);
          }
          100% {
            transform: translateX(-50%) translateY(-20px) scale(2);
          }
        }
      `}</style>
    </div>
  );
}
