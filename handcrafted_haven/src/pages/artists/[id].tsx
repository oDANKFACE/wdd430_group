import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import { getArtistById, getArtistIds } from '../api/artists';
import withLayout from '@/components/hoc/withLayout';
import Image from 'next/image';
import Link from 'next/link';
import { Artist, Product, User } from '@/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface ArtistDetailsProps {
  artist: Artist;
}

const ArtistDetailsPage = ({ artist }: ArtistDetailsProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userIsArtist, setUserIsArtist] = useState(false);

  const user = session?.user as User;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const products = artist?.sellerProfile?.products;

  const handleChangePhoto = () => {};
  const handleAddDescription = () => {};

  useEffect(() => {
    if (!!status && !!session) {
      if (status === 'authenticated' && user.id === artist.id) {
        setUserIsArtist(true);
      } else {
        setUserIsArtist(false);
      }
    } else {
      setUserIsArtist(false);
    }
  }, [status, session]);

  return (
    <div className="flex min-h-screen flex-col px-4 md:px-24 my-10">
      <h1 className="text-3xl font-semibold mb-4">Artist Profile</h1>
      <div className="flex flex-col overflow-hidden bg-white shadow-md rounded py-5 px-2 pt-2 pb-8 mb-4">
        <div className="p-5 bg-white md:flex-2 border border-accent">
          <div className="border border-red-500">
            <h3 className=" text-2xl font-semibold text-gray-700">
              {artist.firstName} {artist.lastName}
            </h3>
          </div>

          <div className="flex flex-wrap justify-center border border-blue-300">
            <div className="w-8/3 sm:w-4/18 px-2">
              <Image
                src="/images/profile-pic.png"
                alt="Profile Photo"
                width={150}
                height={150}
                className="shadow rounded-full max-w-full h-auto align-middle border-4 border-blue-950 p-2"
              />
            </div>
            {userIsArtist && (
              <>
                <div className="my-2">
                  <button
                    type="button"
                    className=" py-2 px-2
                transition-colors duration-300 bg-secondary shadow rounded-full max-w-full
                 hover:bg-emerald-400 focus:outline-none focus:ring-emerald-200 focus:ring-4"
                    onClick={handleChangePhoto}
                  >
                    <Image
                      src="/images/photo.png"
                      alt="Profile Photo"
                      width={25}
                      height={25}
                      className="shadow rounded-full max-w-full h-auto align-middle border-none"
                    />
                  </button>
                </div>
                <p className="my-2 px-3 font-semibold text-gray-400">
                  Update Photo
                </p>
              </>
            )}
          </div>
          
          <p className="mt-6 font-normal text-primary font-semibold md:mt-0">
            About the Artist:{' '}
          </p>
          <p className="flex flex-col text-primary">
            <span>{artist.sellerProfile?.bio}</span>
          </p>
        </div>

        <div className="px-3 border-t-2">
          <h5 className="my-4 text-2xl font-semibold text-gray-700 text-center">
            Products
          </h5>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products?.map((p: Product) => {
              return (
                <div
                  key={p.id}
                  className="justify-items-center text-left border rounded"
                >
                  <Link href={`/products/${p.id}`}>
                    <h2 className="text-black text-xl font-bold capitalize bg-slate-300 p-3">
                      {p.name}
                    </h2>
                    <div className="p-3">
                      <p className="text-gray-500 py-2 font-semibold">
                        ${p.price}.00
                      </p>
                      <p className="text-gray-500 font-semibold">
                        About the Product: {p.description}
                      </p>
                      <p className="text-gray-500 py-2 font-semibold">
                        Category: {p.category}
                      </p>
                      <Image
                        src="/images/art.png"
                        alt="Handcrafted Haven Logo"
                        width={50}
                        height={50}
                      />
                    </div>
                  </Link>
                  {userIsArtist && (
                    <div className="my-4 text-center">
                      <button
                        type="button"
                        className="px-12 py-1 text-lg font-semibold text-dark transition-colors duration-300 bg-secondary rounded-md shadow hover:bg-emerald-400 focus:outline-none focus:ring-emerald-200 focus:ring-4"
                        onClick={handleAddDescription}
                      >
                        Add description
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<ArtistDetailsProps> = async (
  context,
) => {
  const { params } = context;
  try {
    const artist = await getArtistById(params!.id as string);

    if (!artist) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        artist,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const paths = await getArtistIds();

    if (paths === undefined) {
      console.error('Error fetching artist IDs.');
      return {
        paths: [],
        fallback: false,
      };
    }

    return {
      paths: paths.map((id) => ({ params: { id } })),
      fallback: false,
    };
  } catch (error) {
    console.error(error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export default withLayout(ArtistDetailsPage);
