import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import HubConnection, { HubConnectionBuilder } from "@microsoft/signalr";

function App() {
  const [message, setMessage] = useState<string>("");
  const [chatText, setChatText] = useState<string[]>([]);
  const [hubConnection, setHubConnection] = useState<
    HubConnection.HubConnection
  >();

  useEffect(() => {
    // Set the initial SignalR Hub Connection.
    const createHubConnection = async () => {
      // Build new Hub Connection, url is currently hard coded.
      const hubConnect = new HubConnectionBuilder()
        .withUrl("http://localhost:5000/chat")
        .build();
      try {
        await hubConnect.start();
        console.log("Connection successful!");

        hubConnect.on("SendMessage", (message: string) => {
          messageReceived(message);
        });
      } catch (err) {
        alert(err);
      }
      setHubConnection(hubConnect);
    };

    createHubConnection();
  }, [chatText]);

  async function onMessageSubmit() {
    let messages: string[] = [];
    messages = chatText;

    if (message.length) {
      messages.push(message);

      if (hubConnection) {
        debugger;
        hubConnection.invoke("sendMessage", message);
      }
    }

    setMessage("");
    setChatText(messages);
  }

  function messageReceived(receivedMessage: string) {
    // let messages: string[] = [];
    // messages = chatText;
    // debugger;
    // if (receivedMessage) {
    //   messages.push(receivedMessage);
    // }

    setChatText(chatText.concat(receivedMessage));
    //setChatText(messages);
  }

  function onMessageChange(e: React.FormEvent<HTMLInputElement>) {
    setMessage(e.currentTarget.value);
  }

  function onClearHistory() {
    setChatText([]);
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    debugger;
    if (e.charCode === 13) {
      onMessageSubmit();
    }
    if (e.keyCode === 13) {
      onMessageSubmit();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <label htmlFor="chat-text">Cal's chat app...</label>
        <input
          name="chat-text"
          onChange={onMessageChange}
          value={message}
          onKeyPress={handleEnter}
        />
        <button id="send" onClick={onMessageSubmit}>
          Send!
        </button>
        <button id="clear-history" onClick={onClearHistory}>
          Clear history
        </button>
        <ul>
          {Array.from(new Set(chatText)).map((chat, index) => (
            <li key={index}>{chat}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
