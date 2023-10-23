import { useState } from "react";
import { Button, Input, message } from "antd";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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
    <div className="App">
      {contextHolder}
      <div className="main">
        {userLoggedIn ? (
          <iframe
            src="https://www.youtube-nocookie.com/embed/4dktzg9iFQ4?si=KBIaxo2YmL7nZqas&autoplay=1&modestbranding=1&rel=0&showinfo=0"
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
  );
}

export default App;
