import React from "react";
import "./Training.css";
import Sidebar from "../Sidebar/sidebar";

export const trainingData = [
  {
    language: "JavaScript",
    description: "Learn the basics of JavaScript, including ES6 features and DOM manipulation.",
    resources: [
      { name: "JavaScript for Beginners", link: "https://www.freecodecamp.org/learn" },
      { name: "MDN JavaScript Guide", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"},
      {name: " Take the quiz", link: "https://docs.google.com/forms/d/e/1FAIpQLSdObtC_LnCTRYCAqjO2Ll6qg8cLdmK3JdWeYnf4O2fsCxsFMA/viewform?usp=header"},
    ],
    video: "https://www.youtube.com/embed/W6NZfCO5SIk", // Example YouTube video
  },
  {
    language: "Python",
    description: "Master Python programming with tutorials on data structures, OOP, and web development.",
    resources: [
      { name: "Python Official Documentation", link: "https://docs.python.org/3/" },
      { name: "Real Python", link: "https://realpython.com/" },
      {name: " Take the quiz", link: "https://docs.google.com/forms/d/e/1FAIpQLSdObtC_LnCTRYCAqjO2Ll6qg8cLdmK3JdWeYnf4O2fsCxsFMA/viewform?usp=header"},
    ],
    video: "https://www.youtube.com/embed/rfscVS0vtbw", // Example YouTube video
  },
  {
    language: "Java",
    description: "Explore Java programming, from basic syntax to advanced topics like multithreading.",
    resources: [
      { name: "Java Tutorials by Oracle", link: "https://docs.oracle.com/javase/tutorial/" },
      { name: "GeeksforGeeks Java", link: "https://www.geeksforgeeks.org/java/" },
      {name: " Take the quiz", link: "https://docs.google.com/forms/d/e/1FAIpQLSdObtC_LnCTRYCAqjO2Ll6qg8cLdmK3JdWeYnf4O2fsCxsFMA/viewform?usp=header"},
    ],
    video: "https://www.youtube.com/embed/grEKMHGYyns", // Example YouTube video
  },
  {
    language: "C++",
    description: "Learn C++ programming with a focus on algorithms, data structures, and system programming.",
    resources: [
      { name: "C++ TutorialsPoint", link: "https://www.tutorialspoint.com/cplusplus/index.htm" },
      { name: "Learn C++", link: "https://www.learncpp.com/" },
      {name: " Take the quiz", link: "https://docs.google.com/forms/d/e/1FAIpQLSdObtC_LnCTRYCAqjO2Ll6qg8cLdmK3JdWeYnf4O2fsCxsFMA/viewform?usp=header"},
    ],
    video: "https://www.youtube.com/embed/vLnPwxZdW4Y", // Example YouTube video
  },
  {
    language: "Ruby",
    description: "Get started with Ruby programming and learn about Ruby on Rails for web development.",
    resources: [
      { name: "Ruby Official Documentation", link: "https://www.ruby-lang.org/en/documentation/" },
      { name: "Learn Ruby the Hard Way", link: "https://learnrubythehardway.org/" },
      {name: " Take the quiz", link: "https://docs.google.com/forms/d/e/1FAIpQLSdObtC_LnCTRYCAqjO2Ll6qg8cLdmK3JdWeYnf4O2fsCxsFMA/viewform?usp=header"},
    ],
    video: "https://www.youtube.com/embed/t_ispmWmdjY", // Example YouTube video
  },
];

function Training() {
  return (
    <div className="training-container">
    <Sidebar />
    <div className="training-content">
      <h1 className="training-header">Programming Language Training</h1>
      <div className="training-list">
        {trainingData.map((training, index) => (
          <div key={index} className="training-card">
            <h2>{training.language}</h2>
            <p>{training.description}</p>
            <ul>
              {training.resources.map((resource, idx) => (
                <li key={idx}>
                  <a href={resource.link} target="_blank" rel="noopener noreferrer">
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="video-container">
              <iframe
                width="100%"
                height="200"
                src={training.video}
                title={`${training.language} Training Video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export default Training;