const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h14v14H5z" fill="currentColor" />
  </svg>
);import { useRef, useState } from "react";
import { useChat } from "../hooks/useChat";

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
 
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();
  const [messages, setMessages] = useState([]); // Chat history state
  const [stopped, setStopped] = useState(false); // State to track if processing is stopped

  const sendMessage = async () => {
    const text = input.current.value;
    if (!loading && text.trim() !== "") {
      // Add user message first
      setMessages(prev => [...prev, { sender: "User", text }]);
      input.current.value = "";

      // Get bot reply
      const botReply = await chat(text);
      setMessages(prev => [...prev, { sender: "Chatbot", text: botReply }]);
    }
  };

  const handleAudioUpload = async (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    setAudioFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5005/upload-audio/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);
      alert("Audio uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload audio.");
    }
  }
};

  

  if (hidden) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
          <h1 className="font-black text-xl">Human Virtual Assistant</h1>
        </div>

        {/* CHAT MESSAGES DISPLAY */}
        <div className="fixed bottom-[5px] right-[970px] w-[275px] h-[350px] z-20 flex flex-col justify-between p-4 overflow-y-auto bg-white bg-opacity-30 rounded-lg backdrop-blur-md mb-4 pointer-events-auto">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col items-end justify-center gap-4">
          {/* Zoom Button */}
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-md"
          >
            {cameraZoomed ? (
              <ZoomOutIcon />
            ) : (
              <ZoomInIcon />
            )}
          </button>

          {/* Green Screen Toggle Button */}
          <button
            onClick={() => {
              const body = document.querySelector("body");
              if (body.classList.contains("greenScreen")) {
                body.classList.remove("greenScreen");
              } else {
                body.classList.add("greenScreen");
              }
            }}
            className="pointer-events-auto bg-blue-500 hover:bg-pink-600 text-white p-4 rounded-md"
          >
            <ScreenIcon />
          </button>
        </div>
        
        {/* INPUT AREA */}
        <div className="w-full max-w-screen-sm mx-auto pointer-events-auto">
          {/* Hidden file input for audio upload */}
          {/* Input with "+" for audio upload and STOP inside */}
          <div className="relative mb-2">
            <div className="flex w-full">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black p-4 rounded-l-md flex items-center justify-center"
                disabled
                  >
                <SearchIcon />
                </button>

              <input
                className="flex-grow placeholder:text-gray-800 placeholder:italic p-4 rounded-r-md bg-opacity-50 bg-white backdrop-blur-md pr-14"
                placeholder="Type a message..."
                ref={input}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <div className="absolute top-2 right-2">
               
              </div>
            </div>
          </div>
            
          {/* Talk to me button outside the search bar */}
          <button
            disabled={loading}
            onClick={sendMessage}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white p-2 px-6 font-semibold uppercase rounded-md ${
              loading ? "cursor-not-allowed opacity-30" : ""
            }`}
          >
            TALK TO ME
          </button>
        </div>
      </div>
    </>
  );
};

const ZoomOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197M15.803 15.803A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
  </svg>
);

const ZoomInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197M15.803 15.803A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
  </svg>
);

const ScreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
  </svg>
);


const AudioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
  </svg>
);