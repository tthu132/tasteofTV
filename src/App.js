import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { publicRoutes, privateRoute } from './routes';
import { DefaultLayout } from '~/Layout';
import { Fragment, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './redux/slice/counterSlice'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query'
import { isJsonString } from './utils';

import * as UserSevice from '~/services/UserService'

import { jwtDecode } from "jwt-decode";
import { updateUser } from '~/redux/slice/userSlide';


function App() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  useEffect(() => {

    const { storgeData, decoded } = handleDecoded()

    console.log('store:  ', storgeData,decoded);

    if (decoded?.id)
      handleGetDetailUser(decoded?.id, storgeData)

  }, [])

  const handleDecoded = () => {
    let storgeData = localStorage.getItem('access_token')
    let decoded = {}
    if (storgeData && isJsonString(storgeData)) {
      storgeData = JSON.parse(storgeData)
      decoded = jwtDecode(storgeData)
    }
    return { decoded, storgeData }
  }

  UserSevice.axiosJWT.interceptors.request.use(async (config) => {

    const currentTime = new Date()
    const { decoded } = handleDecoded()

    if (decoded?.exp < currentTime.getTime() / 1000) {
      const data = await UserSevice.refreshToken()

      console.log('dataaaaaaaaa', data);
      config.headers['token'] = `Bearer ${data?.access_token}`

      console.log('data access token ', data?.access_token);


      console.log('config ', config);
      console.log('doceded exp ', decoded?.exp, currentTime.getTime() / 1000);

    }
    return config;
  }, (error) => {

    return Promise.reject(error);
  });


  const handleGetDetailUser = async (id, token) => {

    const res = await UserSevice.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))

  }

  // const fetchApi = async () => {

  //   const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/get-all`)

  //   console.log('resss ', res);
  //   return res.data
  // }
  // const info = useQuery({ queryKey: ['todos'], queryFn: fetchApi })
  // console.log('data query: ', info);


  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component

            let Layout = DefaultLayout
            if (route.layout) Layout = route.layout
            else if (route.layout === null) Layout = Fragment

            return <Route key={index} path={route.path} element={
              <Layout>
                <Page />
              </Layout>
            } />

          })}

        </Routes>


        {/* <div>
          <button
            aria-label="Increment value"
            onClick={() => dispatch(increment())}
          >
            Increment
          </button>
          <span>{count}</span>
          <button
            aria-label="Decrement value"
            onClick={() => dispatch(decrement())}
          >
            Decrement
          </button>
        </div> */}

      </div>
    </Router>
  );
}

export default App;
