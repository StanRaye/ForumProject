import React, { useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { fadeInRight } from "react-animations";
import { fadeOutRight } from "react-animations";

export default function ErrorPopup(props) {
  const [isVisible, setIsVisible] = useState(true);
  const [id, setId] = useState("ErrorPopup");
  const styles = StyleSheet.create({
    anim: {
      animationName: fadeInRight,
      animationDuration: "0.5s",
    },
  });
  const styles1 = StyleSheet.create({
    anim: {
      animationName: fadeOutRight,
      animationDuration: "0.5s",
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return;
  });

  return isVisible ? (
    <div className={css(styles.anim)} id="ErrorPopup">
      <h2>ERROR: Title and Content Entries Cannot Be Empty</h2>
    </div>
  ) : (
    <div className={css(styles1.anim)} id={id}>
      <h2>ERROR: Title and Content Entries Cannot Be Empty</h2>
    </div>
  );
}
