
import React, { useEffect, useCallback, useState } from "react";
import { LibraryContext } from "./LibraryContext";
import {
  getMyLibrary,
  addToLibrary,
  updateBookStatus,
  removeFromLibrary,
} from "../services/api";

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLibrary = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getMyLibrary();
      setLibrary(Array.isArray(data) ? data : []);
    } catch {
      setLibrary([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  return (
    <LibraryContext.Provider
      value={{
        library,
        loading,
        fetchLibrary,

        readingList: library.filter(
          (b) => b.UserBooks?.status === "Reading"
        ),
        planToRead: library.filter(
          (b) => b.UserBooks?.status === "Plan to Read"
        ),
        completedBooks: library.filter(
          (b) => b.UserBooks?.status === "Completed"
        ),

        addToLibrary: async (id) => {
          await addToLibrary(id);
          fetchLibrary();
        },

        updateStatus: async (id, status, progress = 0, rating) => {
          await updateBookStatus(id, status, progress, rating);
          fetchLibrary();
        },

        removeFromLibrary: async (id) => {
          await removeFromLibrary(id);
          fetchLibrary();
        },

        isBookSaved: (id) => library.some((b) => b.id === id),
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
