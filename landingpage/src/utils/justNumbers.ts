const justNumbers = (str: string|any) => {
  return str.replace(/\D/g, '');
};

export default justNumbers;
