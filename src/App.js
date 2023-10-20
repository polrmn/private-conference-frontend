import { useState } from "react";
import { Button, Input, message } from "antd";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async () => {
    const credentials = { email, password };
    console.log(credentials);
    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        credentials
      );
      messageApi.open({
        type: "success",
        content: response.data.message,
        duration: 5,
      });
      setUserLoggedIn(true);
    } catch (error) {
      const message = error.response.data.message;
      if (message.includes('Password')) {
        setPassword('');
      } else {
        setEmail('')
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
            src="https://www.youtube-nocookie.com/embed/36YnV9STBqc?si=VweogKpiAUjVW1ci&autoplay=1&modestbranding=1&rel=0&showinfo=0"
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
              disabled={email === "" || password === ""}
              styles={{ color: "#fff" }}
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
