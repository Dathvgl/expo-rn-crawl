import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type ThemeType = {
  dark: boolean;
  colors: {
    main: string;
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    popup: string;
  };
};

export const lightTheme: ThemeType = {
  dark: false,
  colors: {
    main: "rgb(255, 255, 255)",
    primary: "rgb(0, 122, 255)",
    background: "rgb(242, 242, 242)",
    card: "rgb(255, 255, 255)",
    text: "rgb(28, 28, 30)",
    border: "rgb(1, 1, 1)",
    notification: "rgb(255, 59, 48)",
    popup: "rgb(242, 242, 242)",
  },
};

export const darkTheme: ThemeType = {
  dark: true,
  colors: {
    main: "rgb(1, 1, 1)",
    primary: "rgb(10, 132, 255)",
    background: "rgb(1, 1, 1)",
    card: "rgb(18, 18, 18)",
    text: "rgb(230, 230, 230)",
    border: "rgb(71 ,85, 105)",
    notification: "rgb(255, 69, 58)",
    popup: "rgb(71 ,85, 105)",
  },
};

const ThemeContext = createContext<{
  theme: boolean;
  setTheme: Dispatch<SetStateAction<boolean>>;
  useTheme: ThemeType;
  setThemeColor: Dispatch<SetStateAction<ThemeType>>;
}>({
  theme: false,
  setTheme: () => {},
  useTheme: lightTheme,
  setThemeColor: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider(props: { children: ReactNode }) {
  const { children } = props;

  const [theme, setTheme] = useState<boolean>(false);
  const [useTheme, setThemeColor] = useState<ThemeType>(lightTheme);

  useEffect(() => {
    setThemeColor(theme ? darkTheme : lightTheme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, useTheme, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}
