import { useState } from "react";

export const useNavigation = (initialPath = "/dashboard") => {
  const [currentPath, setCurrentPath] = useState(initialPath);

  const navigate = (path) => {
    setCurrentPath(path);
  };

  return {
    currentPath,
    navigate,
  };
};
