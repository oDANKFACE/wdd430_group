const convertDate = (date: string | Date | undefined) => {
  if (!date) return;
  const options = { month: 'long', year: 'numeric' } as const;
  return new Date(date).toLocaleString(undefined, options);
};

const getBaseUrl = () => {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const protocol = process.env.NEXT_PUBLIC_VERCEL_URL ? 'https://' : 'http://'
  return `${protocol}${base}`
}

export { convertDate, getBaseUrl };
