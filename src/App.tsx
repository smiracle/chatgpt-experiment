import React, { useState, useEffect } from "react";
import "./App.css";

interface ResponseData {
  message: string;
}

const App = () => {
  const [persona1, setPersona1] = useState<string>("");
  const [persona2, setPersona2] = useState<string>("");
  const [conversation, setConversation] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const getApiResponse = async () => {
    setIsFetching(true);
    const continuationPrompt = `${conversation.slice(Math.max(conversation.length - 5, 0)).join(" ")}`;
    const request = await fetch("http://localhost:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message:
          conversation.length == 0
            ? `Pretend you are ${persona1}, introduce yourself and say something unique and memorable to start a 1:1 conversation`
            : conversation.length == 1
            ? `Pretend you are ${persona2}, introduce yourself and say something unique and memorable to start a 1:1 conversation`
            : conversation.length % 2 === 0
            ? `Assume the role of ${persona1} and continue the conversation by talking to ${persona2} in a way that would seem natural to a human: ${continuationPrompt}`
            : `Assume the role of ${persona2} and continue the conversation by talking to ${persona1} in a way that would seem natural to a human: ${continuationPrompt}`,
      }),
    });
    const response: ResponseData = await request.json();
    if (conversation.length >= 10) {
      const sliced = conversation.slice(1);
      setConversation([...sliced, response.message]);
    } else {
      setConversation([...conversation, response.message]);
    }
    setIsFetching(false);
  };  

  const handleStartConversation = () => {
    if (persona1 !== "" && persona2 !== "") {
      setConversation([]);
      setIsStarted(true);
      getApiResponse(); // Call the API immediately when starting the conversation
    }
  };

  const handleStop = () => {
    setIsStarted(false);
  }

  const handleClearConversation = () => {
    setConversation([]);
  }

  useEffect(() => {
    if (!isStarted || isFetching) {
      return;
    }
    const interval = setInterval(() => {
      if (isStarted && !isFetching) {
        console.log("Calling API");
        getApiResponse();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isStarted, isFetching]);

  return (
    <div className="container">
      <h3>GPT-3.5 Auto-Conversation Experiment</h3>
     <label >Persona 1:</label>
      <input
        type="text"
        id="persona1"
        name="persona1"
        value={persona1}
        onChange={e => setPersona1(e.target.value)}
      />
      <label >Persona 2:</label>
      <input
        type="text"
        id="persona2"
        name="persona2"
        value={persona2}
        onChange={e => setPersona2(e.target.value)}
      />
      <div className="buttons">
        <button onClick={handleStartConversation} disabled={isStarted}>Start</button>
        <button onClick={handleStop} disabled={!isStarted}>Stop</button>
        <button onClick={handleClearConversation} disabled={conversation.length === 0}>Clear</button>
      </div>
      <ul className="conversation">
        {conversation.map((node, index) => (
          <li className="conversation-item" key={index}>
            <strong>{index % 2 === 0 ? persona1 : persona2}:</strong> {node}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;