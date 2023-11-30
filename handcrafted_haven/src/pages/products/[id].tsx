import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import withLayout from '@/components/hoc/withLayout';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import { Product } from '@/types';
import { convertFullDate, getBaseUrl } from '@/helpers/utils';
import { getProductIds } from '../api/products/read';
import Link from 'next/link';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetailsPage = ({ product }: ProductDetailsProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signIn();
  };

  return (
    <>
      <div className="container mx-auto p-6 border border-white rounded mt-5">
        <h1 className="text-3xl font-semibold mb-4">Product Details</h1>
        <div className="flex w-1/2 border-4 border-accent rounded p-4 bg-gray-200 mx-auto">
          <div className="">
            {product?.images?.length && (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={400}
                height={400}
                className="rounded-md"
              />
            )}
          </div>
          <div className="px-4">
            <h1 className="text-3xl font-semibold mb-4 text-gray-800">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4">
              {product.description || 'No description available.'}
            </p>
            <p className="text-gray-800 font-semibold">${product.price}</p>
            <p className="text-gray-600">Category: {product.category}</p>
          </div>
        </div>

        <hr className="border-white mt-10 mb-4" />
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-4">Product Reviews</h2>

          {status === 'unauthenticated' && (
            <div>
              <button
                type="button"
                className="px-3 py-2 font-semibold text-dark transition-colors duration-300 bg-secondary rounded-md shadow hover:bg-emerald-400 focus:outline-none focus:ring-emerald-200 focus:ring-4"
                onClick={handleSignIn}
              >
                Sign in
              </button>{' '}
              to leave a review
            </div>
          )}

          {status === 'authenticated' && (
            <div>
              <Link
                href={`/products/reviews?productId=${product.id}`}
                className="px-3 py-2 font-semibold text-dark transition-colors duration-300 bg-accent rounded-md shadow hover:bg-emerald-400 focus:outline-none focus:ring-emerald-200 focus:ring-4"
              >
                Leave a review
              </Link>
            </div>
          )}
        </div>

        {!product.reviews?.length && (
          <div className="text-white">
            There are no reviews for this product.
          </div>
        )}

        {product.reviews?.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.reviews.map((r) => {
              return (
                <div
                  className="p-6 border-4 border-accent rounded bg-gray-200 text-gray-800"
                  key={r.id}
                >
                  <div className="flex">
                    <span className="font-semibold">Rating: &nbsp;</span>
                    <p>{r.rating}</p>
                  </div>
                  {r.comment && (
                    <p>
                      <span className="font-semibold">Comment: &nbsp;</span>
                      {r.comment}
                    </p>
                  )}
                  <div className="flex">
                    <span className="font-semibold">Reviewed On: &nbsp;</span>
                    <p>{convertFullDate(r.createdAt)}</p>
                  </div>
                  <div className="flex">
                    <span className="font-semibold">Reviewed By: &nbsp;</span>
                    <p>
                      {r.author.firstName} {r.author.lastName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<ProductDetailsProps> = async (
  context,
) => {
  const { params } = context;

  try {
    const response = await fetch(
      `${getBaseUrl()}/api/products/read?productId=${params?.id}`,
    );

    if (!response.ok) {
      return {
        notFound: true,
      };
    }

    const product = await response.json();

    return {
      props: {
        product,
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
    const paths = await getProductIds();

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

export default withLayout(ProductDetailsPage);
