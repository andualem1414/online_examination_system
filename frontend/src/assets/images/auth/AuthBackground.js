// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  const theme = useTheme();
  return (
    <Box sx={{ position: 'absolute', filter: 'blur(28px)', zIndex: -1, bottom: 0 }}>
      <svg width="100%" height="calc(100vh - 175px)" viewBox="20 0 57 49" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M28.3175 36.613L28.294 36.6365L22.654 30.9965L25.145 28.5055L28.3175 31.678L34.169 25.85L36.66 28.341L28.341 36.66L28.3175 36.613ZM23.5 0C10.575 0 0 10.575 0 23.5C0 36.425 10.575 47 23.5 47C36.425 47 47 36.425 47 23.5C47 10.575 36.425 0 23.5 0ZM12.549 10.058L15.8625 13.3715L19.176 10.058L21.667 12.549L18.3535 15.8625L21.667 19.176L19.176 21.667L15.8625 18.3535L12.549 21.667L10.058 19.176L13.3715 15.8625L10.058 12.549L12.549 10.058ZM23.5 42.3C18.33 42.3 13.63 40.185 10.105 36.895L36.895 10.105C40.185 13.63 42.3 18.33 42.3 23.5C42.3 33.84 33.84 42.3 23.5 42.3Z"
          fill="#1890FF"
        />
      </svg>
    </Box>
  );
};

export default AuthBackground;
