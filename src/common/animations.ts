import { keyframes } from "@mui/material";

export const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(33, 150, 243, 0.4), 0 0 10px rgba(33, 150, 243, 0.3), 0 0 15px rgba(33, 150, 243, 0.2);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 10px rgba(33, 150, 243, 0.6), 0 0 20px rgba(33, 150, 243, 0.4), 0 0 30px rgba(33, 150, 243, 0.3);
    transform: scale(1.02);
  }
  100% {
    box-shadow: 0 0 5px rgba(33, 150, 243, 0.4), 0 0 10px rgba(33, 150, 243, 0.3), 0 0 15px rgba(33, 150, 243, 0.2);
    transform: scale(1);
  }
`;

export const attractiveGlow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.3), 0 0 10px rgba(76, 175, 80, 0.2);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 15px rgba(76, 175, 80, 0.5), 0 0 25px rgba(76, 175, 80, 0.3);
    transform: scale(1.02);
  }
  100% {
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.3), 0 0 10px rgba(76, 175, 80, 0.2);
    transform: scale(1);
  }
`;

export const shimmer = keyframes`
  0% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
`;

export const orangeGlow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(255, 152, 0, 0.3), 0 0 10px rgba(255, 152, 0, 0.2);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 15px rgba(255, 152, 0, 0.5), 0 0 25px rgba(255, 152, 0, 0.3);
    transform: scale(1.02);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 152, 0, 0.3), 0 0 10px rgba(255, 152, 0, 0.2);
    transform: scale(1);
  }
`;
