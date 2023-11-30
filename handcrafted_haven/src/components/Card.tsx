import React from 'react';
import Image from 'next/image';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  className?: string;
}

const Card = ({ title, description, imageUrl, className }: CardProps) => {
  const customStyles = className;
  return (
    <div className={`max-w-md mx-1 my-1 bg-white rounded-md overflow-hidden shadow-md ${customStyles}`}>
      {imageUrl && (
        <Image className="w-full h-40 object-cover" src={imageUrl} alt={title} />
      )}
      <div className="p-6">
        <h2 className="text-xl text-center font-semibold text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Card;
