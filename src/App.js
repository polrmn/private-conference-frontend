import { useEffect, useRef, useState } from "react";
import { Button, Input, message } from "antd";
import axios from "axios";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const iframeRef = useRef();

  useEffect(() => {
    const credentials = JSON.parse(localStorage.getItem("credential"));
    if (credentials) {
      setEmail(credentials.email);
      setPassword(credentials.password);
    }
  }, []);

  const createScript = () => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      const player = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            event.target.setVolume(100);
          },
        },
      });
      console.log(player);
    };
  };

  const handleSubmit = async () => {
    const credentials = { email, password };
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://conferencelt.onrender.com/login",
        credentials
      );
      setIsLoading(false);
      messageApi.open({
        type: "success",
        content: response.data.message,
        duration: 5,
      });
      setUserLoggedIn(true);
      createScript();
      localStorage.setItem("credential", JSON.stringify(credentials));
    } catch (error) {
      const message = error.response.data.message;
      setIsLoading(false);
      if (message.includes("Password")) {
        setPassword("");
      } else {
        setEmail("");
      }
      messageApi.open({
        type: "error",
        content: error.response.data.message,
        duration: 5,
      });
    }
  };

  return (
    <>
      <div className="App">
        {contextHolder}
        <div className="main">
          {userLoggedIn ? (
            <iframe
              ref={iframeRef}
              src="https://www.youtube-nocookie.com/embed/C1DhRgN_KUA?si=NgvRCqOMURozSY5I&autoplay=1&modestbranding=1&rel=0&showinfo=0&autohide=1&enablejsapi=1&controls=0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="form">
              <Input
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input.Password
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="primary"
                onClick={handleSubmit}
                disabled={email === "" || password === "" || isLoading}
                styles={{ color: "#fff", maxWidth: "10em" }}
                loading={isLoading}
                block={false}
              >
                Join Conference
              </Button>
            </div>
          )}
        </div>
      </div>
      <Analytics />
    </>
  );
}

export default App;
