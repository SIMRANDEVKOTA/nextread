export const getBookImage = (coverName) => {
  // 1. Fallback if no cover name is provided
  if (!coverName) return new URL('../assets/images/book.jpg', import.meta.url).href;

  try {
    // 2. Resolve image from local assets folder
    // Ensure this file is in frontend/src/utils/ to reach ../assets/images/
    return new URL(`../assets/images/${coverName}`, import.meta.url).href;
  } catch {
    // 3. Fallback if file not found
    return new URL('../assets/images/book.jpg', import.meta.url).href;
  }
};