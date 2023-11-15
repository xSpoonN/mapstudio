import './App.css'
import { React } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GlobalStoreContextProvider } from './store'
import { AuthContextProvider } from './auth'

import {
    MainScreen
} from './components'

const theme = createTheme({
    typography: {
      fontFamily: 'JetBrains Mono',
      fontWeightRegular: 500,
      button: {
        textTransform: 'none'
      }
    }, 
    palette: {
        razzmatazz: {
            main: '#E3256B'
        }
    }
});

const App = () => {   
    return (
        <ThemeProvider theme={theme}>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <MainScreen/>
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </ThemeProvider>
    )
}

export default App