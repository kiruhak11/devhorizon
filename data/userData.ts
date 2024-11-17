let user: Record<string, any> = {};

if (typeof window !== "undefined") {
  const userM = localStorage.getItem("userData");

  if (userM) {
    try {
      const userJS = JSON.parse(userM);

      if (Array.isArray(userJS)) {
        user = Object.fromEntries(userJS);
      } else {
        console.warn("userData is not in the expected format (not an array)");
      }
    } catch (error) {
      console.error("Failed to parse userData from localStorage:", error);
    }
  } else {
    console.log("userData not found in localStorage");
  }
}
export function updateUserFromLocalStorage() {
  if (typeof window !== "undefined") {
    const userM = localStorage.getItem("userData");

    if (userM) {
      try {
        const userJS = JSON.parse(userM);
        if (Array.isArray(userJS)) {
          user = Object.fromEntries(userJS);
        } else {
          console.warn("userData is not in the expected format (not an array)");
        }
      } catch (error) {
        console.error("Failed to parse userData from localStorage:", error);
      }
    } else {
      location.reload();
    }
  }
}
export default user;
