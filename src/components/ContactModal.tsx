import { useEffect } from "react";
import ReactDOM from "react-dom";
import { FaTimes, FaPhoneAlt, FaEnvelope, FaCopy } from "react-icons/fa";
import "./styles/ContactModal.css";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied ${text} to clipboard!`);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="contact-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="contact-modal-header">
          <h2>Let's Talk</h2>
          <p>Book a call or send me an email. I'm available for freelance projects.</p>
        </div>
        <div className="contact-modal-body">
          <div className="contact-card">
            <div className="contact-icon phone-icon">
              <FaPhoneAlt />
            </div>
            <div className="contact-info">
              <h3>Phone</h3>
              <p>+91 7304141066</p>
              <div className="contact-actions">
                <a href="tel:+917304141066" className="action-btn call-btn">Call Now</a>
                <button className="action-btn copy-btn" onClick={() => copyToClipboard("+917304141066")}>
                  <FaCopy /> Copy
                </button>
              </div>
            </div>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon email-icon">
              <FaEnvelope />
            </div>
            <div className="contact-info">
              <h3>Email</h3>
              <p>rs7304141066@gmail.com</p>
              <div className="contact-actions">
                <a href="mailto:rs7304141066@gmail.com" className="action-btn email-btn">Send Email</a>
                <button className="action-btn copy-btn" onClick={() => copyToClipboard("rs7304141066@gmail.com")}>
                  <FaCopy /> Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ContactModal;
