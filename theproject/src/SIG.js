import React, { useState, useEffect } from "react";
import SigIndividual from "./components/SIGThreads/SigIndividual.js";
import "./styleForum.css";
import { fadeInUp } from "react-animations";
import { fadeInLeft } from "react-animations";
import { StyleSheet, css } from "aphrodite";
import { fadeIn } from "react-animations";

export default function Sig() {
  //state variable to store threads already posted
  const [data, setData] = React.useState([]);
  const [showPostBar, setShowPostBar] = React.useState(false);
  let [title, setTitle] = React.useState("");

  useEffect(() => {
    consoleLog();
  }, []);

  const styles = StyleSheet.create({
    anim: {
      animationName: fadeInUp,
      animationDuration: "2s",
    },
  });

  const styles1 = StyleSheet.create({
    anim: {
      animationName: fadeInLeft,
      animationDuration: "2s",
    },
  });

  const styles2 = StyleSheet.create({
    anim: {
      animationName: fadeIn,
      animationDuration: "0.5s",
    },
  });

  function consoleLog() {
    fetch("https://forum-backend123-ec047248a0ce.herokuapp.com/forum/sig/get")
      .then((json) => json.json())
      .then((data) => {
        setData(data);
      });
    console.log(data);
  }
  //function for posting a new thread
  function postThread(event) {
    event.preventDefault();
    const publicIp = require("react-public-ip");
    const ipv4 = publicIp.v4() || "";
    const formData = new FormData(event.target);
    formData.append("ip", ipv4);

    let requestOptions = {};
    if (formData.get("image")) {
      console.log("Image Found");
      requestOptions = {
        method: "POST",
        body: formData,
        image: formData.get("image"),
      };
    } else {
      console.log("Image Not Found");
      requestOptions = {
        method: "POST",
        body: formData,
      };
    }

    fetch(
      "https://forum-backend123-ec047248a0ce.herokuapp.com/forum/sig/post",
      requestOptions
    ); //performing the post
    console.log("should be posted");

    setShowPostBar(false);
  }

  //making an array of indivdual threads so that I can view them
  const threads = data.map((thread) => (
    <SigIndividual
      title={thread.title}
      img={thread.image}
      imgURL={thread.imageURL}
      date={thread.datePosted}
      content={thread.content}
      name={thread.authorName}
      ID={thread._id}
      replyRef={thread.replyRef}
      threadIP={thread.uniqueID}
    />
  ));

  function togglePostBar() {
    setShowPostBar(!showPostBar);
  }

  const typeWriterText = "Welcome to the /SIGThread/";
  useEffect(() => {
    let i = 0;
    let outputText = "";

    const interval = setInterval(() => {
      if (i < typeWriterText.length) {
        outputText = typeWriterText.slice(0, i + 1);
        setTitle(outputText);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return;
  }, []);
  return (
    <div>
      <div>
        <div className={css(styles1.anim)}>
          <button className="newPost--button" onClick={togglePostBar}>
            Post a New Thread
          </button>
        </div>
        <h1 className="sigTitle">{title}</h1>
      </div>
      {/* Div for entire post bar */}
      {showPostBar && ( // Conditionally render the post bar popup based on the state
        <div className={css(styles2.anim)}>
          <div className="forum--postbar">
            <button className="exit--button" onClick={togglePostBar}>
              Exit
            </button>
            {/* Form object */}
            <form
              className="thread-posting"
              onSubmit={postThread}
              action="/"
              method="POST"
            >
              <div className="usernametitle">
                <input
                  type="text"
                  name="authorName"
                  placeholder="Username..."
                ></input>
                <input type="text" name="title" placeholder="Title..."></input>
              </div>

              <div className="content">
                <textarea
                  type="text"
                  name="content"
                  className="content--textbox" // Use 'className' instead of 'class'
                  placeholder="Enter your text here..."
                ></textarea>
              </div>
              <div className="emptystuff"></div>
              <div className="upload/post">
                <label className="imageUpload--button">
                  <input type="file" name="image"></input>
                </label>
                <input
                  type="submit"
                  className="post--button"
                  value="Post"
                  onClick={togglePostBar}
                ></input>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Code for after the post section */}

      <div className="forum--threads">
        <div className={css(styles.anim)}>{threads}</div>
      </div>
      <div className="placeholder"></div>
    </div>
  );
}
