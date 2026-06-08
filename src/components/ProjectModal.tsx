import { useEffect } from "react";
import ReactDOM from "react-dom";
import { FaTimes, FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { lenis } from "./Navbar";
import { track } from "@vercel/analytics";
import "./styles/ProjectModal.css";

interface Project {
  id: number;
  title: string;
  category: string;
  technologies: string;
  image: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  video?: string;
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
      lenis?.stop();
      if (project) {
        track("Project Modal Opened", { project: project.title });
      }
    } else {
      document.body.style.overflow = "auto";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "auto";
      lenis?.start();
    };
  }, [isOpen, project]);

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
          {project.video && (
            <div className="project-modal-video">
              <video src={project.video} controls autoPlay muted loop style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }}></video>
            </div>
          )}
          <div className="project-modal-section">
            <h3>About this project</h3>
            <p>{project.description}</p>
          </div>
          <div className="project-modal-section">
            <h3>Technologies Used</h3>
            <p className="project-modal-tech">{project.technologies}</p>
          </div>
          {(project.liveUrl || project.githubUrl) && (
            <div className="project-modal-links" style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-modal-btn github-btn" onClick={() => track("Source Code Clicked", { project: project.title })}>
                  <FaGithub /> Source Code
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-modal-btn live-btn" onClick={() => track("Live Site Clicked", { project: project.title })}>
                  <FaExternalLinkAlt /> View Live
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;
