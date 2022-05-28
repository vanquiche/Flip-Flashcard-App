const checkDuplicate = (value: string, reference: string, array: any[]) => {
  // remove trailing whitespace and lowercase
  const strip = (text: string) => text.replace(/[ \t]+$/gm, '').toLowerCase();
  // check reference for existing value
  const exist = array.some((item) => strip(item[reference]) === strip(value));
  // expects a true or false value
  return exist;
};

export default checkDuplicate;
