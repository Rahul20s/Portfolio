import { useEffect } from "react";
import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";
import "./styles/ProjectModal.css";

interface Project {
  id: number;
  title: string;
  category: string;
  technologies: string;
  image: string;
  description: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

const ProjectModal = ({ isOpen, onClose, project }: ProjectModalProps) => {
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

  if (!isOpen || !project) return null;

  return ReactDOM.createPortal(
    <div className="project-modal-overlay" onClick={onClose}>
      <div className="project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="project-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="project-modal-header">
          <h2>{project.title}</h2>
          <span className="project-modal-category">{project.category}</span>
        </div>
        <div className="project-modal-body">
          <div className="project-modal-section">
            <h3>About this project</h3>
            <p>{project.description}</p>
          </div>
          <div className="project-modal-section">
            <h3>Technologies Used</h3>
            <p className="project-modal-tech">{project.technologies}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;
