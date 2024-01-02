import React, { useState, useEffect } from "react";
import SigIndividual from "./components/SIGThreads/SigIndividual.js";
import "./styleForum.css";
import { fadeInUp } from "react-animations";
import { fadeInLeft } from "react-animations";
import { StyleSheet, css } from "aphrodite";
import { fadeIn } from "react-animations";
import ErrorPopup from "./components/SIGThreads/ErrorPopup.js";

export default function Sig() {
  //state variable to store threads already posted
  const [data, setData] = React.useState([]);
  const [showPostBar, setShowPostBar] = React.useState(false);
  let [error, setError] = React.useState(false);
  let [title, setTitle] = React.useState("");
  let [allowSubmit, setAllowSubmit] = React.useState("");

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
    fetch("https://forum-project-86d68c9b2875.herokuapp.com/forum/sig/get", {
      mode: "no-cors",
    })
      .then((json) => json.json())
      .then((data) => {
        setData(data);
      })
      .then((response) => {
        // Handle successful response here
      })
      .catch((error) => {
        // Handle error here
        console.error("Fetch error:", error);
      });
    console.log(data);
  }
  //function for posting a new thread
  function isEmptyOrSpaces(str) {
    return !str || str.trim() === "";
  }

  function postThread(event) {
    setAllowSubmit("true");
    setTimeout(() => {
      setAllowSubmit("");
    }, 5500);
    event.preventDefault();
    const publicIp = require("react-public-ip");
    const ipv4 = publicIp.v4() || "";
    const formData = new FormData(event.target);
    formData.append("ip", ipv4);

    if (
      isEmptyOrSpaces(formData.get("content")) ||
      isEmptyOrSpaces(formData.get("title"))
    ) {
      setError(<ErrorPopup />);

      setTimeout(() => {
        setError(null);
      }, 5500);
      return;
    }

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
      "https://forum-project-86d68c9b2875.herokuapp.com/forum/sig/post",
      requestOptions,
      { mode: "no-cors" }
    ); //performing the post
    console.log("should be posted");

    window.location.reload();
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
        if (i == typeWriterText.length - 1) {
          outputText = typeWriterText.slice(0, i + 1);
        } else {
          outputText = typeWriterText.slice(0, i + 1) + "|";
        }

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
            <form className="thread-posting" onSubmit={postThread}>
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
                  disabled={allowSubmit}
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
      <div>{error}</div>
    </div>
  );
}
