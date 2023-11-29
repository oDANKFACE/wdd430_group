import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/images/HH White.png"
            alt="Handcrafted Haven Logo"
            width={25}
            height={25}
          />
          <h5 className="font-semibold ms-1">Handcrafted Haven</h5>
        </div>
        <p className="text-gray-500">
          Discover and support unique handmade treasures.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
