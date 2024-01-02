import React from "react";
import SigReply from "./SigReply.js";
import ErrorPopup from "./ErrorPopup.js";
import { StyleSheet, css } from "aphrodite";
import { fadeIn } from "react-animations";

// This is for each individual thread on the main SIG thread home page
export default function SigIndividual(props) {
  //state variable for storing reply props
  const [data, setReplies] = React.useState([]);
  const [text, setText] = React.useState("");
  let [isTruncated, setIsTruncated] = React.useState(true);
  let [popup, setPopup] = React.useState();
  let [popupPosition, setPopupPosition] = React.useState({
    left: -100,
  });
  const [showPostBar, setShowPostBar] = React.useState(false);
  const [imageClicked, setImageClicked] = React.useState(false);
  const [showReplies, setShowReplies] = React.useState(false);
  let [allowSubmit, setAllowSubmit] = React.useState("");
  let [error, setError] = React.useState(false);

  let specialBool = false;
  const maxContentLength = 2000;
  if (props.content.length > maxContentLength) {
    specialBool = true;
  }

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  const styles = StyleSheet.create({
    anim: {
      animationName: fadeIn,
      animationDuration: "0.5s",
    },
  });

  //getting all replies on load
  function getReplies() {
    const id =
      //we need the thread ID to check which replies belong
      {
        id: props.ID,
      };

    const queryString = new URLSearchParams(id).toString(); //query strucutre in URL is needed in order to pass on our threads ID
    fetch(
      `https://forum-project-86d68c9b2875.herokuapp.com/forum/sig/thread/?${queryString}`
    )
      .then((json) => json.json())
      .then((data) => {
        setReplies(Object.values(data)[0]); //setting information found in the replies
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

  function isEmptyOrSpaces(str) {
    return !str || str.trim() === "";
  }

  //function for making a reply
  function postReply(event) {
    setAllowSubmit("true");
    setTimeout(() => {
      setAllowSubmit("");
    }, 5500);
    event.preventDefault();
    const publicIp = require("react-public-ip");
    const ipv4 = publicIp.v4() || "";
    const formData = new FormData(event.target);
    formData.append("threadID", props.ID);
    formData.append("replyingToRef", text);
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
      "https://forum-project-86d68c9b2875.herokuapp.com/forum/sig/threadreply",
      requestOptions
    )
      .then((response) => {
        // Handle successful response here
      })
      .catch((error) => {
        // Handle error here
        console.error("Fetch error:", error);
      }); //performing the post
    window.location.reload();
  }

  //adding the id reference to the content box
  function setContentText(reference) {
    setText((preValue) => preValue + " " + reference.toString() + " ");
  }

  //clearing the reply box
  function clear() {
    setText("");
  }

  //showing a preview when hovering over ID
  function showingPopup(id, event) {
    const div = document.getElementById(id);

    const tempDocument = document.createElement("div");
    tempDocument.innerHTML = div.innerHTML;

    const elements = tempDocument.querySelectorAll(".image");
    elements.forEach((element) => {
      element.style.width = "300px";
      element.style.height = "auto";
    });

    const innerData = tempDocument.innerHTML;
    setPopup(innerData);

    const linkRect = event.target.getBoundingClientRect();
    const linkPosition = {
      top: linkRect.top + window.scrollY,
      left: linkRect.left + 100 + window.scrollX,
    };

    setPopupPosition(linkPosition);
  }

  //removing the popup when not hovering
  function removingPopup() {
    setPopup("<div></div>"); // Clear the popup content
    setPopupPosition({ left: -1000 }); // Reset the popup position
  }

  const replies = data.map((reply) => (
    <SigReply
      name={reply.authorName}
      date={reply.datePosted}
      content={reply.content}
      img={reply.image}
      imgURL={reply.imageURL}
      ID={reply._id}
      setContentText={setContentText}
      answerTo={reply.answerRef}
      subReplies={reply.replyRef}
      IP={reply.uniqueID}
      threadIP={props.threadIP}
      showingPopup={showingPopup}
      removingPopup={removingPopup}
      popup={popup}
      popupPosition={popupPosition}
    />
  ));
  const repliesLength = replies.length;
  let repliesTextReference = props.replyRef;
  repliesTextReference = repliesTextReference.map((text) => (
    <a
      className="referenceButton"
      href={"#" + text}
      onMouseEnter={(event) => showingPopup(text.toString(), event)}
      //onMouseMove={(event) => showingPopup(text.toString(), event)}
      onMouseLeave={removingPopup}
    >
      {text.toString().slice(15, 24)}
    </a>
  ));

  function togglePostBar() {
    setShowPostBar(!showPostBar);
  }

  function toggleReplies() {
    setShowReplies(!showReplies);

    if (!showReplies) {
      getReplies();
    }
  }
  console.log(props.imgURL);
  console.log(props.imgURL);
  console.log(props.imgURL);
  return (
    <div className="thread">
      <div className="thread--content" id={props.ID}>
        <div className="sub1">
          <h3>{props.title}</h3>
          <p>{props.name}</p>
          <p>{props.date}</p>
          <p>
            <button
              className="referenceButton"
              onClick={() => setContentText(props.ID)}
            >
              {props.ID.toString().slice(15, 24)}
            </button>
          </p>
          <div className="image-container">
            <img
              className={`image ${imageClicked ? "full-size" : "preview"}`}
              src={props.imgURL}
              alt="Thread Image"
              onClick={() => setImageClicked(!imageClicked)}
              onError={(e) => {
                e.target.style.display = "none"; // Hide the image on error
              }}
              id="image"
            />
          </div>
        </div>
        <div className="sub2">
          {specialBool ? (
            isTruncated ? (
              <p>
                {props.content.slice(0, maxContentLength)}
                <span>...</span>
                <button onClick={toggleTruncate}>Read More</button>
              </p>
            ) : (
              <p>
                {props.content}
                <button onClick={toggleTruncate}>Read Less</button>
              </p>
            )
          ) : (
            <p>{props.content}</p>
          )}
        </div>
      </div>
      <button className="newPost--button" onClick={togglePostBar}>
        Post a Reply
      </button>
      <button className="newPost--button" onClick={toggleReplies}>
        {showReplies ? "Hide Replies" : "View Replies"}
      </button>
      {showPostBar && (
        <div className={css(styles.anim)}>
          <div className="forum--postbar">
            <button className="exit--button" onClick={togglePostBar}>
              Exit
            </button>
            <form onSubmit={postReply} className="thread-posting">
              <div className="username/title">
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

              <div className="replyReference">
                <input
                  type="text"
                  name="replies"
                  value={text}
                  placeholder="Click on user ID's to reply"
                  style={{ width: "50%" }}
                ></input>
                <button onClick={clear} className="referenceButton">
                  Clear
                </button>
              </div>

              <div className="upload/post">
                <label className="imageUpload--button">
                  <input type="file" name="image"></input>
                </label>
                <input
                  type="submit"
                  value="Post"
                  className="post--button"
                  disabled={allowSubmit}
                ></input>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Conditionally render replies */}
      {showReplies ? (
        repliesLength != 0 ? (
          <div className="thread--replies">{replies}</div>
        ) : (
          <p>No Replies...</p>
        )
      ) : null}

      <div
        className="popup"
        style={{
          top: popupPosition.top,
          left: popupPosition.left,
        }}
        dangerouslySetInnerHTML={{ __html: popup }}
      ></div>
      <div>{error}</div>
    </div>
  );
}
