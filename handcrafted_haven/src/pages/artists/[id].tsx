import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import { getArtistById, getArtistIds, Artist } from '../api/artists';
import withLayout from '@/components/hoc/withLayout';
import Image from 'next/image';
import Link from 'next/link';

interface ArtistDetailsProps {
  artist: Artist;
}

const ArtistDetailsPage = ({ artist }: ArtistDetailsProps) => {
  const router = useRouter();
  console.log({ artist });
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleChangePhoto = () => {};

  return (
    <div className="flex items-center min-h-screen p-4 bg-dark lg:justify-center">
      <div className="flex flex-col overflow-hidde bg-white shadow-md rounded py-5 px-2 pt-2 pb-8 mb-4">
        <div className="p-4 py-6 text-primary bg-tertiary md:w-200 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
          <div className="my-3 text-4xl font-bold tracking-wider text-center">
            <div className="flex">
              <Image
                src="/images/HH Color.png"
                alt="Handcrafted Haven Logo"
                width={35}
                height={35}
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-primary ml-1">
                Handcrafted Haven
              </span>
            </div>
          </div>
        </div>
        <div className="p-5 bg-white md:flex-2">
          <div>
            <h3 className=" text-2xl font-semibold text-gray-700">
              {artist.firstName} {artist.lastName}
            </h3>
          </div>
          <div className="flex flex-wrap justify-center">
            <div className="w-8/3 sm:w-4/18 px-2">
              <Image
                src="/images/profile-pic.png"
                alt="Profile Photo"
                width={150}
                height={150}
                className="shadow rounded-full max-w-full h-auto align-middle border-none"
              />
            </div>
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
          </div>
          <p className="mt-6 font-normal text-primary font-semibold md:mt-0">About the Artist: </p>
          <p className="flex flex-col text-primary">
            <span>{artist.sellerProfile?.bio}</span>
          </p>
          <div className='py-10'>
          <h5 className="my-4 font-semibold text-gray-700">Products</h5>
          <div className="mt-3 flex flex-wrap gap-4">
            <div className="flex justify-between gap- w-full text-right">
              <h4 className="text-black capitalize">Product Name</h4>
              <p className="text-gray-500 font-semibold">Price</p>
              <p className="text-gray-500 font-semibold">Description</p>
              <p className="text-gray-500 font-semibold">Category</p>
              <Image
                src="/images/art.png"
                alt="Handcrafted Haven Logo"
                width={35}
                height={35}
              />
            </div>
            <div className="flex justify-between gap- w-full text-right">
              <h4 className="text-black capitalize">Product Name</h4>
              <p className="text-gray-500 font-semibold">Price</p>
              <p className="text-gray-500 font-semibold">Description</p>
              <p className="text-gray-500 font-semibold">Category</p>
              <Image
                src="/images/art.png"
                alt="Handcrafted Haven Logo"
                width={35}
                height={35}
              />
            </div>
            <div className="flex justify-between gap- w-full text-right">
              <h4 className="text-black capitalize">Product Name</h4>
              <p className="text-gray-500 font-semibold">Price</p>
              <p className="text-gray-500 font-semibold">Description</p>
              <p className="text-gray-500 font-semibold">Category</p>
              <Image
                src="/images/art.png"
                alt="Handcrafted Haven Logo"
                width={35}
                height={35}
              />
            </div>
            </div>
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
