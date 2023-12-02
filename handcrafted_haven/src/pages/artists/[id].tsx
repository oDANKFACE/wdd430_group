import { GetServerSideProps } from 'next';
import { getArtistById} from '../api/artists';
import withLayout from '@/components/hoc/withLayout';
import Image from 'next/image';
import Link from 'next/link';
import { Artist, Product, SellerProfile, User } from '@/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Modal, { ModalProps } from '@/components/Modal';
import FileUpload from '@/components/FileUpload';
import { getBaseUrl } from '@/helpers/utils';
import TextArea from '@/components/TextArea';
import Head from 'next/head';

interface ArtistDetailsProps {
  artist: Artist;
}

enum ActiveModal {
  ProfilePic,
  Bio,
  NewProduct,
}

const ArtistDetailsPage = ({ artist }: ArtistDetailsProps) => {
  const { data: session, status } = useSession();

  const [userIsArtist, setUserIsArtist] = useState(false);
  const [profilePicSrc, setProfilePicSrc] = useState('/images/profile-pic.png');
  const [newProfilePic, setNewProfilePic] = useState<string | null>(null);
  const [clearFileUpload, setClearFileUpload] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>();
  const [newBio, setNewBio] = useState<string | null | undefined>(
    artist.sellerProfile?.bio,
  );
  const [profilePicModalProps, setProfilePicModalProps] = useState<ModalProps>({
    isOpen: false,
    title: '',
    onClose: () => {},
  });
  const [bioModalProps, setBioModalProps] = useState<ModalProps>({
    isOpen: false,
    title: '',
    onClose: () => {},
  });

  const user = session?.user as User;

  const products = artist?.sellerProfile?.products;

  useEffect(() => {
    if (status === 'authenticated' && user.id === artist.id) {
      setUserIsArtist(true);
    } else {
      setUserIsArtist(false);
    }
  }, [status, user, artist]);

  useEffect(() => {
    if (!status || !session) {
      setUserIsArtist(false);
    }
  }, [status, session]);

  useEffect(() => {
    if (!!artist && artist.sellerProfile?.image) {
      setProfilePicSrc(artist.sellerProfile.image);
    } else {
      setProfilePicSrc('/images/profile-pic.png');
    }
  }, [artist]);

  const openProfilePicModal = () => {
    setProfilePicModalProps((prevState) => ({
      ...prevState,
      isOpen: true,
      title: 'Update Profile Picture',
    }));
    setActiveModal(ActiveModal.ProfilePic);
  };

  const openBioModal = () => {
    setBioModalProps((prevState) => ({
      ...prevState,
      isOpen: true,
      title: 'Update Bio',
    }));
    setActiveModal(ActiveModal.Bio);
  };

  const handleChangePhoto = async () => {
    if (!!newProfilePic) {
      const sellerProfile = {
        bio: artist.sellerProfile?.bio,
        image: newProfilePic,
      };

      try {
        const res = await fetch(
          `${getBaseUrl()}/api/artists/update?artistId=${artist.id}`,
          {
            method: 'PATCH',
            body: JSON.stringify(sellerProfile),
          },
        );

        if (!res.ok) {
          throw Error('Failed to update profile picture.');
        }

        const profile = (await res.json()) as SellerProfile;
        if (!!profile.image) {
          setProfilePicSrc(profile.image);
        } else {
          setProfilePicSrc('/images/profile-pic.png');
        }
        handleClearFile();
        closeModal();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleTextChange = (newText: string) => {
    setNewBio(newText);
  };

  const handleEditBio = async () => {
    if (!!newBio) {
      const sellerProfile = {
        bio: newBio,
        image: profilePicSrc,
      };

      try {
        const res = await fetch(
          `${getBaseUrl()}/api/artists/update?artistId=${artist.id}`,
          {
            method: 'PATCH',
            body: JSON.stringify(sellerProfile),
          },
        );

        if (!res.ok) {
          throw Error('Failed to update profile picture.');
        }

        const profile = (await res.json()) as SellerProfile;
        setNewBio(profile.bio);
        closeModal();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onFileChange = (base64Strings: string[] | null) => {
    if (base64Strings && base64Strings.length > 0) {
      setNewProfilePic(base64Strings[0]);
    } else {
      setNewProfilePic('');
    }
  };

  const handleClearFile = () => {
    setClearFileUpload(true);
    setNewProfilePic(null);
  };

  const closeModal = () => {
    switch (activeModal) {
      case ActiveModal.ProfilePic:
        setProfilePicModalProps((prevState) => ({
          ...prevState,
          isOpen: false,
        }));
        break;
      case ActiveModal.Bio:
        setBioModalProps((prevState) => ({
          ...prevState,
          isOpen: false,
        }));
        break;
    }
  };

  return (
    <>
      <Head>
        <title>Artist Details</title>
      </Head>
      <div className="flex min-h-screen flex-col px-4 md:px-24 my-10">
        <h1 className="text-3xl font-semibold mb-4">Artist Profile</h1>
        <div className="flex flex-col overflow-hidden bg-white shadow-md rounded py-5 px-2 pt-2 pb-8 mb-4">
          <div className="p-5 bg-white md:flex-2">
            <div className="flex flex-col md:flex-row">
              <div className="w-full p-4 border-t-4 md:border-t-0 mt-4 md:mt-0 md:border-r-4">
                <h3 className="text-3xl font-semibold text-gray-700 mb-4">
                  {artist.firstName} {artist.lastName}
                </h3>
                <div className="text-xl">
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row">
                    <p className="mt-6 font-normal text-primary font-semibold md:mt-0">
                      About the Artist
                    </p>
                    {userIsArtist && (
                      <button
                        type="button"
                        className="px-2 py-1 ms-0 sm:ms-3 md:ms-0 lg:ms-3 transition-colors duration-300 bg-secondary shadow rounded-full max-w-full hover:bg-emerald-400 focus:outline-none  focus:ring-emerald-200 focus:ring-4 flex text-base mb-1"
                        onClick={openBioModal}
                      >
                        <div className="flex items-center">
                          <Image
                            src="/images/pencil.svg"
                            alt="Profile Photo"
                            width={25}
                            height={25}
                            className="p-1 h-auto align-middle border-none"
                          />
                          <span className="ms-1">Update Bio</span>
                        </div>
                      </button>
                    )}
                  </div>
                  <p className="flex flex-col text-primary">
                    <span>{newBio}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col order-first md:order-last px-3 w-full">
                <div className="relative h-48 w-48 md:h-64 md:w-64 mx-auto my-2">
                  <Image
                    src={profilePicSrc}
                    alt="Profile Photo"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="shadow rounded-full max-w-full h-auto align-middle border-2 border-dark p-2"
                  />
                </div>
                {userIsArtist && (
                  <div className="flex justify-center py-2">
                    <button
                      type="button"
                      className="p-2 transition-colors duration-300 bg-secondary shadow rounded-full max-w-full hover:bg-emerald-400 focus:outline-none  focus:ring-emerald-200 focus:ring-4 flex"
                      onClick={openProfilePicModal}
                    >
                      <Image
                        src="/images/photo.png"
                        alt="Profile Photo"
                        width={25}
                        height={25}
                        className="shadow rounded-full max-w-full h-auto align-middle border-none"
                      />{' '}
                      &nbsp; Update Photo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-3 border-t-4">
            <h5 className="my-4 text-2xl font-semibold text-gray-700 text-center">
              Products
            </h5>
            {!products?.length && (
              <div className="text-gray-700 text-lg w-full text-center">
                There are no products to display.
              </div>
            )}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-5">
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
                        <div className="h-20 flex">
                          {p.images?.map((i, index) => {
                            return (
                              <div
                                key={index}
                                className="relative h-full w-full m-1"
                              >
                                <Image
                                  src={i}
                                  alt={p.name ?? 'Product'}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                            );
                          })}
                        </div>
                        {!p.images?.length && (
                          <Image
                            src="/images/art.png"
                            alt="Handcrafted Haven Logo"
                            width={50}
                            height={50}
                          />
                        )}
                      </div>
                    </Link>
                    {userIsArtist && (
                      <div className="my-4 text-center">
                        <Link
                          href={`/artists/product?productId=${p.id}`}
                          className="px-12 py-1 text-lg font-semibold text-dark transition-colors duration-300 bg-secondary rounded-md shadow hover:bg-emerald-400 focus:outline-none focus:ring-emerald-200 focus:ring-4"
                        >
                          Edit Listing
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {userIsArtist && (
              <div className="flex justify-center">
                <Link
                  href={`/artists/product`}
                  className="ps-2 pb-2 pe-2 transition-colors duration-300 bg-accent shadow rounded-full max-w-full hover:bg-yellow-500 focus:outline-none focus:ring-yellow-500 focus:ring-4 flex"
                >
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">&#x2B;</span>
                    <span className="pt-2 ms-1">Add Product</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Pic Modal */}
      <Modal
        title={profilePicModalProps.title}
        isOpen={profilePicModalProps.isOpen}
        onClose={closeModal}
      >
        <FileUpload
          onFileChange={onFileChange}
          onClearFile={handleClearFile}
          clear={clearFileUpload}
        />
        <div className="flex justify-end">
          <button
            className="mt-4 mx-3 px-4 py-2 rounded border border-gray-700 hover:bg-gray-500 hover:text-white"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-blue-800"
            onClick={handleChangePhoto}
          >
            Update
          </button>
        </div>
      </Modal>

      {/* Bio Modal */}
      <Modal
        title={bioModalProps.title}
        isOpen={bioModalProps.isOpen}
        onClose={closeModal}
      >
        <div className="h-64 sm:h-48">
          <TextArea
            value={newBio}
            onChange={handleTextChange}
            placeholder="Type something..."
          />
        </div>
        <div className="flex justify-end">
          <button
            className="mt-4 mx-3 px-4 py-2 rounded border border-gray-700 hover:bg-gray-500 hover:text-white"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-blue-800"
            onClick={handleEditBio}
          >
            Update
          </button>
        </div>
      </Modal>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  ArtistDetailsProps
> = async (context) => {
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

export default withLayout(ArtistDetailsPage);
