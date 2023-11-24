import React from 'react';
import { GetServerSideProps } from 'next';

export interface Artist {
  firstName: string;
  lastName: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ArtistProps {
  artists: Artist[];
}

const Artists = ({ artists }: ArtistProps) => {
  return (
    <>
      {artists.map((p) => (
        <div>{p.firstName}</div>
      ))}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/artists');
  const artists = await res.json();
  return {
    props: { artists },
  };
};

export default Artists;
