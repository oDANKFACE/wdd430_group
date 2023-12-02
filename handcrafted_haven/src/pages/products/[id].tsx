import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import withLayout from '@/components/hoc/withLayout';
import { Product, User } from '@/types';
import { convertFullDate, getBaseUrl } from '@/helpers/utils';
import Head from 'next/head';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetailsPage = ({ product }: ProductDetailsProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [selectedImg, setSelectedImg] = useState('');

  const user = session?.user as User;

  useEffect(() => {
    if (!!product?.images?.length) {
      setSelectedImg(product.images[0]);
    }
  }, [product.images]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signIn();
  };

  const handleImageClick = (i: string) => {
    setSelectedImg(i);
  };

  return (
    <>
      <Head>
        <title>Product Details</title>
      </Head>
      <div className="container mx-auto p-6 border border-white rounded my-5">
        <h1 className="text-3xl font-semibold mb-4">Product Details</h1>
        <div className="flex flex-col md:flex-row w-full sm:w-4/5 lg:w-1/2 border-4 border-accent rounded p-4 bg-gray-200 mx-auto">
          <div className="">
            {!!product?.images?.length && (
              <>
                <div className="relative h-64 w-64 mb-4 mx-auto">
                  {selectedImg && (
                    <Image
                      src={selectedImg}
                      alt={product.name || 'Product'}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-md"
                    />
                  )}
                </div>
                <div className="h-20 flex">
                  {product.images.map((i, index) => {
                    return (
                      <div
                        key={index}
                        className={`relative h-full w-full m-1 hover:cursor-pointer ${
                          selectedImg === i && 'border-2 border-dark'
                        }`}
                        onClick={() => handleImageClick(i)}
                      >
                        <Image
                          src={i}
                          alt={product.name || 'Product'}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div className="px-4 mt-5 md:mt-0">
            <h1 className="text-3xl font-semibold mb-4 text-gray-800">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-2">
              {product.description || 'No description available.'}
            </p>
            <p className="text-gray-800 font-semibold mb-2">
              Price: ${product.price}
            </p>
            <p className="text-gray-600 font-semibold mb-2">
              Category: {product.category}
            </p>
            <p className="text-gray-600 font-semibold mb-2">
              Artist: &nbsp;
              <Link
                href={`/artists/${product.seller?.user.id}`}
                className="hover:underline"
              >
                {product.seller?.user.firstName} {product.seller?.user.lastName}
              </Link>
            </p>
          </div>
        </div>

        <hr className="border-white mt-10 mb-4" />
        <div className="flex flex-col sm:flex-row justify-between">
          <h2 className="text-2xl font-semibold mb-4">Product Reviews</h2>

          {status === 'unauthenticated' && (
            <div className="mb-3 sm:mb-0">
              <button
                type="button"
                className="px-3 py-2 font-semibold text-dark transition-colors duration-300 bg-secondary rounded-md shadow hover:bg-emerald-400 focus:outline-none focus:ring-emerald-200 focus:ring-4"
                onClick={handleSignIn}
              >
                Sign in
              </button>{' '}
              <span>to leave a review</span>
            </div>
          )}

          {status === 'authenticated' && (
            <div className="mb-3 sm:mb-0">
              <Link
                href={`/products/reviews?productId=${product.id}`}
                className="px-3 py-2 font-semibold text-dark transition-colors duration-300 bg-accent rounded-md shadow hover:bg-yellow-600 focus:outline-none focus:ring-yellow-600 focus:ring-4"
              >
                <span>Leave a review</span>
              </Link>
            </div>
          )}
        </div>

        {!product.reviews?.length && (
          <div className="text-white">
            There are no reviews for this product.
          </div>
        )}

        {!!product.reviews?.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.reviews.map((r) => {
              return (
                <div
                  className="p-6 border-4 border-accent rounded bg-gray-200 text-gray-800"
                  key={r.id}
                >
                  {user?.id === r.authorId && (
                    <div className="flex justify-end">
                      <Link
                        href={`/products/reviews/edit?reviewId=${r.id}`}
                        className="border-2 border-accent rounded px-3 hover:bg-accent"
                      >
                        Edit
                      </Link>
                    </div>
                  )}
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
                      {r.author?.firstName} {r.author?.lastName}
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

export const getServerSideProps: GetServerSideProps<
  ProductDetailsProps
> = async (context) => {
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

    const product: Product = await response.json();

    return {
      props: {
        product,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      notFound: true,
    };
  }
};

export default withLayout(ProductDetailsPage);
