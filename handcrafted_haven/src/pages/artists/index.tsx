import React from 'react';
import { GetServerSideProps } from 'next';
import withLayout from '@/components/hoc/withLayout';
import Link from 'next/link';
import { convertDate } from '@/helpers/utils';
import { Artist } from '@/types';

interface ArtistProps {
  artists: Artist[];
}

const Artists = ({ artists }: ArtistProps) => {
  return (
    <div
      className={`flex min-h-screen flex-col items-center px-4 md:px-24 my-10`}
    >
      <h1 className="text-4xl mb-10">Artists</h1>
      <div className="w-4/5">
        {artists.map((a) => (
          <Link href={`/artists/${a.id}`} key={a.id}>
            <div className="border-2 border-accent rounded-lg w-full my-5 flex justify-between flex-wrap">
              <div className="bg-accent p-4 flex-1">
                <div className="text-2xl">
                  {a.firstName} {a.lastName}
                </div>
                <div className="text-md">
                  Seller since {convertDate(a.sellerProfile?.createdAt)}
                </div>
              </div>
              <div className="p-4 flex-1">{a.sellerProfile?.bio}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/artists');
  const artists = await res.json();
  return {
    props: { artists },
  };
};

export default withLayout(Artists);
