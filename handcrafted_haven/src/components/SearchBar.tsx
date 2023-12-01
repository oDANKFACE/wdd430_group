"use client"
import Image from 'next/image'
import SearchArtist from './SearchArtist'
import { useState } from 'react'

const SearchButton = ({otherClasses} : {otherClasses: string }) => (
    <button type="submit" className={`-ml-3 z-10 ${otherClasses}`}>
        <Image 
            src="/images/magnifier.png"
            alt="magnifying glass"
            width={40}
            height={40}
            className='object-contain'
        />
    </button>
)

const SearchBar = () => {

    const [artist, setArtist] = useState('');
    const [price, setPrice] = useState('');

    const handleSearch = () => {}  
    return (
    <form className='searchbar'
        onSubmit={handleSearch} >
        <div className='searchbar__item'>
            <SearchArtist 
            artist={artist}
            setArtist={setArtist}
            />
        </div>
        <div className='searchbar__item'>
            <Image 
                src="/images/price.png"
                alt="price image"
                width={25}
                height={25}
                className='absolute w-[40px] h-[40px] ml-4'
            />
            <input
                type="text"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder='$0.00'
                className='searchbar__input'
            />
            <SearchButton otherClasses="sm:hidden" />
        </div>
        <SearchButton otherClasses="max-sm:hidden" />
    </form>
  )
}

export default SearchBar