import React from "react";
import { trainingData } from "../Training/Training"; // Importing training data
import { Link } from "react-router-dom";
import "./TrainingSideBar.css"; // Importing CSS file for styling

const TrainingSideBar = ({ showAll }) => {
  return (
    <div className="training-sidebar">
      <div className="training-list-wrapper">
        {trainingData.length > 0 ? (
          showAll ? (
            trainingData.map((training, index) => (
              <div key={index} className="training-item-wrapper">
                <Link to={`/trainings`}>
                  <span className="training-item">
                    <div className="training-title">{training.language}</div>
                    <p className="training-description">
                      {training.description.split(" ").slice(0, 4).join(" ") + "..."}
                    </p>
                  </span>
                </Link>
              </div>
            ))
          ) : (
            <div className="training-item-wrapper">
              <Link to={`/trainings`}>
                <span className="training-item">
                  <div className="training-title">{trainingData[0]?.language}</div>
                  <p className="training-description">
                    {trainingData[0]?.description.split(" ").slice(0, 4).join(" ") + "..."}
                  </p>
                </span>
              </Link>
            </div>
          )
        ) : (
          <p>No available trainings.</p>
        )}
      </div>
    </div>
  );
};

export default TrainingSideBar;

