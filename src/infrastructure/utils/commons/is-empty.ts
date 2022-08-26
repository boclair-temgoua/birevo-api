export const isEmpty = (strValue: string) => {
  const strValueString = String(strValue);
  return (
    strValueString.trim() === '' ||
    strValueString.trim().length === 0 ||
    !strValueString
  );
};
