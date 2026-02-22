export const logout = (redirect = true) => {
  localStorage.removeItem("token");
  if (redirect) {
    window.location.href = "/login";
  }
};
