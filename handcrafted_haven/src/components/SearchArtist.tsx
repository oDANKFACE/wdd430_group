'use client';
import { SearchArtistProps } from '@/types';
import { Combobox, Transition } from '@headlessui/react';
import Image from 'next/image';
import React, { Fragment } from 'react';
import { useState } from 'react';

const SearchArtist = ({ artist, setArtist, artistName }: SearchArtistProps) => {
  const [query, setQuery] = useState('');

  const filterArtistName =
    query === ''
      ? artistName
      : artistName?.filter((item) =>
          item.lastName
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')),
        );

  const filterArtist =
    query === ''
      ? artists
      : artists?.filter((item) =>
          item
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')),
        );

  return (
    <div className="search-artist">
      <Combobox value={artist} onChange={setArtist}>
        <div className="relative w-full">
          <Combobox.Button className="absolute top-[5px]">
            <Image
              src="/images/artist.png"
              alt="filter_image"
              width={40}
              height={40}
            />
          </Combobox.Button>
          <Combobox.Input
            className="search-artist__input"
            placeholder="Artist Name"
            displayValue={(artist: string) => artist}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="search-artist__options">
              {filterArtist.map((item) => (
                <Combobox.Option
                  key={item}
                  className={({ active }) => `relative search-artist__option 
                            ${
                              active
                                ? 'bg-primary text-white'
                                : ' bg-white text-gray-900'
                            }
                            `}
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {item}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 
                          ${active ? 'text-white' : 'text-teal-600'}`}
                        ></span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};
import { artists } from '@/constants/constants';

export default SearchArtist;
