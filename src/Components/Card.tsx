// Components/Card.tsx

import React, { memo } from "react";

interface CardProps {
  id: string;
  type: string;
  heading: string;
  url: string;
}

const Card: React.FC<CardProps> = ({ id, type, heading, url }) => {
  return (
    <div className="card" role="article" aria-labelledby={`card-title-${id}`}>
      <h4 id={`card-title-${id}`}>{heading}</h4>
      <p>Type: {type}</p>
      <a href={url}>View Details</a>
    </div>
  );
};

export default memo(Card);
