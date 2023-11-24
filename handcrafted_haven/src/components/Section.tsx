import React, { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  bg?: string;
  height?: string
}

const Section = ({ children, bg, height }: SectionProps) => {
  return (
    <section className={`py-10 w-full ${height} ${bg ?? 'bg-white'}`}>
      <div className="container mx-auto px-3 h-full flex items-center justify-center">{children}</div>
    </section>
  );
};

export default Section;
