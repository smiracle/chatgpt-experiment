import React, { useState, useEffect } from "react";

interface ResponseData {
  message: string;
}

const App = () => {
  const [persona1, setPersona1] = useState<string>("Dwayne Johnson");
  const [persona2, setPersona2] = useState<string>("Mr. T");
  const [conversation, setConversation] = useState<string[]>([]);

  const getApiResponse = async () => {
    console.log(`getApiResponse`);
    const continuationPrompt = `${conversation.slice(Math.max(conversation.length - 5, 0)).join(" ")}`;
    console.log(continuationPrompt);
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
      console.log(`updateConversation`);
    } else {
      setConversation([...conversation, response.message]);
      console.log(`updateConversation`);
    }
  };

  useEffect(() => {
    getApiResponse();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getApiResponse();
    }, 4000);
    console.log(`clearInterval`);
    return () => clearInterval(interval);
  }, [conversation]);

  return (
    <div>
      {conversation.map((node, index) => (
        <p key={index}>
          {index % 2 === 0 ? persona1 : persona2}: {node}
        </p>
      ))}
    </div>
  );
};

export default App;

//const [responseData, setResponseData] = useState<ResponseData | null>(null);
//const [inputValue, setInputValue] = useState("");

// const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//   event.preventDefault();
//   const response = await fetch("http://localhost:5000/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ message: inputValue }),
//   });
//   const data = await response.json();
//   setResponseData(data);
// };

{
  /* <form onSubmit={handleSubmit}>
        <textarea value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
        <button type="submit">Submit</button>
      </form> */
}
