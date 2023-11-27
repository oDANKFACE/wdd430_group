import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import { getArtistById, getArtistIds, Artist } from '../api/artists';
import withLayout from '@/components/hoc/withLayout';

interface ArtistDetailsProps {
  artist: Artist;
}

const ArtistDetailsPage = ({ artist }: ArtistDetailsProps) => {
  const router = useRouter();
  console.log({ artist });
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>
        {artist.firstName} {artist.lastName}
      </h1>
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