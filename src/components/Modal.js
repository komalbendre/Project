const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <button onClick={onClose} style={closeBtn}>✕</button>
        {children}
      </div>
    </div>
  );
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modal = {
  background: "#fff",
  padding: "2rem",
  width: "700px",
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: "10px"
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "15px",
  border: "none",
  background: "none",
  fontSize: "18px",
  cursor: "pointer"
};

export default Modal;
