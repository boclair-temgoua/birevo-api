export const checkIfNumberOrEmpty = (property: number) => {
  return !isNaN(property) && Number(property) > 0;
};
