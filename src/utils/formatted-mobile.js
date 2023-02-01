export const getFormattedMobile = phone => {
  const input = phone.replace(/\D/g, '');
  const areaCode = input.substring(0, 3);
  const middle = input.substring(3, 6);
  const last = input.substring(6);

  if (input.length > 6) {
    phone = `${areaCode}-${middle}-${last}`;
  } else if (input.length > 3) {
    phone = `${areaCode}-${middle}`;
  } else if (input.length > 0) {
    phone = `${areaCode}`;
  }

  return phone;
};
