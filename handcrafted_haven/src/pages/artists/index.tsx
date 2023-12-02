import React from 'react';
import { GetServerSideProps } from 'next';
import withLayout from '@/components/hoc/withLayout';
import Link from 'next/link';
import { convertDate, getBaseUrl } from '@/helpers/utils';
import { Artist } from '@/types';
import Head from 'next/head';

interface ArtistProps {
  artists: Artist[];
}

const url = getBaseUrl();

const Artists = ({ artists }: ArtistProps) => {
  return (
    <div
      className={`flex min-h-screen flex-col items-center px-4 md:px-24 my-10`}
    >
      <Head>
        <title>Artists</title>
      </Head>
      <h1 className="text-4xl mb-10">Artists</h1>
      <div className="w-4/5">
        {artists.map((a) => (
          <Link href={`/artists/${a.id}`} key={a.id}>
            <div className="border-2 border-accent rounded-lg w-full my-5 flex justify-between flex-wrap hover:scale-105 transition-transform duration-300 ease-in-out">
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
  try {
    const res = await fetch(`${url}/api/artists`);

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const artists = await res.json();

    return {
      props: { artists },
    };
  } catch (error: any) {
    console.error('Error fetching data:', error.message);

    return {
      props: {
        artists: [],
      },
    };
  }
};

export default withLayout(Artists);
