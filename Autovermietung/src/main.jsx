import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CarContainer from './components/CarContainer/CarContainer.jsx'
import Login from './components/Login/Login.jsx'
import Registration from './components/Registration/Registration.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { configureStore, combineReducers} from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import carReducer  from "./reducer/carrentalReducer.js"
import authReducer from './reducer/authReducer.js'
import Account from './components/Account/Account.jsx'
import CarDetails from './components/CarDetails/CarDetails.jsx'
import CarSearch from './components/CarSearch/CarSearch.jsx'
import AddCar from './components/AddCar/AddCar.jsx'
import RentCar from './components/RentCar/RentCar.jsx'

const rootReducer = combineReducers({
    car: carReducer,
    auth: authReducer
})

const store = configureStore({reducer:rootReducer})

const router = createBrowserRouter([
    {
        path:"/",
        element:<App />,
        children:[
            {
                index:true,
                element:<CarContainer />
            },
            {
              path:"/login",
              element: <Login />
            },
            {
              path:"/signup",
              element: <Registration />
            },
            {
                path:"/account",
                element: <Account />
            },
            {
                path:"/cars/:id",
                element: <CarDetails />
            },
            {
                path:"/search",
                element: <CarSearch />
            },
            {
                path:"/add",
                element: <AddCar />
            },
            {
                path:"/rent/:id",
                element: <RentCar />
            }
        ]
    }
])

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
)