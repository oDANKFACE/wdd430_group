import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import withLayout from '@/components/hoc/withLayout';
import { SessionUser, Product, Review, User } from '@/types';
import { convertDate } from '@/helpers/utils';
import Loader from '@/components/Loader';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const user = session?.user as SessionUser;

  const [activeTab, setActiveTab] = useState<string>('sellers');
  const [sellers, setSellers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (tab: string) => {
    try {
      let response, data;
      switch (tab) {
        case 'sellers':
          if (!sellers.length) {
            setLoading(true);
            response = await fetch('/api/artists');
            data = await response.json();
            setSellers(data);
            setLoading(false);
          }
          break;
        case 'products':
          if (!products.length) {
            setLoading(true);
            response = await fetch('/api/products');
            data = await response.json();
            setProducts(data);
            setLoading(false);
          }
          break;
        case 'reviews':
          if (!reviews.length) {
            setLoading(true);
            response = await fetch('/api/products/reviews/readAll');
            data = await response.json();
            setReviews(data);
            setLoading(false);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching data for ${tab}:`, error);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, ]);


  if (user?.role! !== 'ADMIN') {
    return (
      <section className="grid h-screen place-items-center">
        <div className="w-25">
          <div className="flex flex-col">
            <p>You do not have permission to view this page!</p>
            <Link
              href="/"
              className="text-center mt-4 px-4 py-2 text-lg font-semibold text-dark transition-colors duration-300 bg-secondary rounded-md shadow hover:bg-emerald-400 focus:outline-none focus:ring-emerald-200 focus:ring-4"
            >
              Go Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className={`flex min-h-screen flex-col px-4 md:px-24 my-10`}>
      <h1 className="text-4xl">Admin Dashboard</h1>
      <div className="mt-5">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'sellers'
                ? 'bg-accent text-white'
                : 'bg-gray-500 hover:bg-accent'
            }`}
            onClick={() => setActiveTab('sellers')}
          >
            Sellers
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'products'
                ? 'bg-accent text-white'
                : 'bg-gray-500 hover:bg-accent'
            }`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'reviews'
                ? 'bg-accent text-white'
                : 'bg-gray-500 hover:bg-accent'
            }`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>

        <div className="border border-white p-4 rounded">
          {loading && <Loader fullPage={false} />}

          {activeTab === 'sellers' && !loading && (
            <ul>
              {sellers.map((seller) => (
                <li key={seller.id} className="flex justify-center">
                  <div className="bg-white text-dark rounded my-3 p-4 flex justify-between w-3/4">
                    <div className="text-xl font-semibold">
                      {seller.firstName} {seller.lastName} -{' '}
                      <span className="text-base font-normal">
                        Seller since{' '}
                        {convertDate(seller.sellerProfile.createdAt)}
                      </span>
                    </div>
                    <div>
                      <button className="px-3 py-1 rounded bg-secondary text-black font-semibold border-2 border-secondary mx-2">
                        Edit
                      </button>
                      <button className="px-3 py-1 rounded border-2 border-red-500 text-black font-semibold">
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'products' && !loading && (
            <ul>
              {products.map((product) => (
                <li key={product.id}>{product.name}</li>
              ))}
            </ul>
          )}

          {activeTab === 'reviews' && !loading && (
            <ul>
              {reviews.map((review) => (
                <li key={review.id}>{review.comment}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default withLayout(Dashboard);
