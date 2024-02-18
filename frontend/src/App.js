// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { closeSnackbar } from 'notistack';
import { red } from '@mui/material/colors';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          action={(snackbarId) => (
            <IconButton aria-label="delete" sx={{ color: red[50] }} onClick={() => closeSnackbar(snackbarId)}>
              <HighlightOffIcon />
            </IconButton>
          )}
        >
          <Routes />
        </SnackbarProvider>
      </ScrollTop>
    </ThemeCustomization>
  );
};

export default App;
