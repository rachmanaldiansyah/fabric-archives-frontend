import React from "react";
import "./Timeline.css";

const Timeline = ({ steps, currentStep }) => {
  return (
    <div className="timeline">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`timeline-item ${index < currentStep ? "completed" : ""} ${
            index === currentStep ? "active" : ""
          }`}
        >
          <div className="timeline-content">
            <span className="step-number">{index + 1}</span>
            <p>{step}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
