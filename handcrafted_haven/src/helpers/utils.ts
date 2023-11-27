const convertDate = (date: string | Date | undefined) => {
  if (!date) return;
  const options = { month: 'long', year: 'numeric' } as const;
  return new Date(date).toLocaleString(undefined, options);
};

export { convertDate };
