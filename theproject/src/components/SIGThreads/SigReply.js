import React, { useEffect } from "react";

export default function SigReply(props) {
  let repliesTextReference = props.subReplies;
  let answerToTextReference = props.answerTo;
  const [imageClicked, setImageClicked] = React.useState(false);
  let [isTruncated, setIsTruncated] = React.useState(true);
  repliesTextReference = repliesTextReference.map((text) => (
    <a
      className="referenceButton"
      href={"#" + text}
      onMouseEnter={(event) => props.showingPopup(text.toString(), event)}
      //onMouseMove={(event) => showingPopup(text.toString(), event)}
      onMouseLeave={props.removingPopup}
    >
      {text.toString().slice(15, 24)}
    </a>
  ));
  answerToTextReference = answerToTextReference.map((text) => (
    <a
      className="referenceButton"
      href={"#" + text}
      onMouseEnter={(event) => props.showingPopup(text.toString(), event)}
      //onMouseMove={(event) => showingPopup(text.toString(), event)}
      onMouseLeave={props.removingPopup}
    >
      {text.toString().slice(15, 24)}
    </a>
  ));

  let specialBool = false;
  const maxContentLength = 2000;
  if (props.content.length > maxContentLength) {
    specialBool = true;
  }

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  return (
    <div className="reply--content" id={props.ID}>
      <div className="sub1">
        {props.IP == props.threadIP ? (
          <h4>{props.name} (OP)</h4>
        ) : (
          <h4>{props.name}</h4>
        )}
        <p>{props.date}</p>
        <p>
          <button
            className="referenceButton"
            onClick={() => props.setContentText(props.ID)}
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
        <p>To: {answerToTextReference}</p>
        <p>Replies: {repliesTextReference}</p>
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
      <div
        className="popup"
        style={{ top: props.popupPosition.top, left: props.popupPosition.left }}
        dangerouslySetInnerHTML={{ __html: props.popup }}
      ></div>
    </div>
  );
}
