export const getBorderStyle = (irow: number, icell: number) => {
  let borderStyle = '';
  if (irow === 0) {
    borderStyle += ' border-t-0';
  }
  if (irow === 2) {
    borderStyle += ' border-b-0';
  }
  if (icell === 0) {
    borderStyle += ' border-l-0';
  }
  if (icell === 2) {
    borderStyle += ' border-r-0';
  }
  return borderStyle;
};
