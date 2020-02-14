import * as React from "react";
import { getSelection } from "./utils";

const caretSize = 8;
const defaultStyles: React.CSSProperties = {
  background: "#fae704",
  padding: "4px 8px",
  position: "absolute",
  boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.5)"
};

const caretStyles: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  left: "50%",
  border: `${caretSize}px solid transparent`,
  borderTopColor: "#fae704"
};

const buttonStyles: React.CSSProperties = {
  background: "transparent",
  border: "0",
  fontSize: "1rem"
};

const backdropStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%"
};

const Menu: React.FC = () => {
  const elementRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({
    top: 0,
    left: 0
  });
  const style = {
    ...defaultStyles,
    ...position,
    display: isOpen ? "block" : "none"
  };

  const onMouseUp = () => {
    const selection = getSelection();

    if (!selection) {
      setIsOpen(false);
      return;
    }

    const { top, left, width } = selection;

    setPosition({
      top: top + window.scrollY - caretSize,
      left: left + window.scrollX + width / 2
    });

    setIsOpen(true);
  };

  React.useEffect(() => {
    const { current: element } = elementRef;
    if (!isOpen || !element) {
      return;
    }

    const {
      clientHeight: menuHeight,
      clientWidth: menuWidth
    } = elementRef.current;

    setPosition(current => ({
      top: current.top - menuHeight,
      left: current.left - menuWidth / 2
    }));
  }, [isOpen]);

  React.useEffect(() => {
    const delay = () => setTimeout(onMouseUp, 100);
    window.addEventListener("mouseup", delay);

    return () => {
      window.removeEventListener("mouseup", delay);
    };
  }, []);

  const onClick = (event: React.MouseEvent) => {
    setIsOpen(false);

    event.stopPropagation();

    if (window.getSelection().empty) {
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      window.getSelection().removeAllRanges();
    }
  };

  const onClickContainer = () => {
    setIsOpen(false);
  };

  const onClickBackdrop = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && <div style={backdropStyles} onClick={onClickBackdrop}></div>}
      <div onClick={onClickContainer} ref={elementRef} style={style}>
        <button onClick={onClick} style={buttonStyles}>
          🖊️ Highlight
        </button>
        <span style={caretStyles} />
      </div>
    </>
  );
};

export default Menu;
