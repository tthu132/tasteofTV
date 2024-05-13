import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { publicRoutes, privateRoute } from './routes';
import { DefaultLayout, HeaderOnly } from '~/Layout';
import { Fragment, useEffect, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './redux/slice/counterSlice'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query'
import { isJsonString } from './utils';

import * as UserSevice from '~/services/UserService'

import { jwtDecode } from "jwt-decode";
import { updateUser } from '~/redux/slice/userSlide';
import NotFoundPage from '~/pages/NotFoundPage';

import KommunicateChat from './chatbot';

import Dictaphone from './Dictaphone'

import Translator from './components/Translator';
import useAlan from './hooks/useAlan';
import { Button } from 'antd';

import alanBtn from "@alan-ai/alan-sdk-web";

function App() {



  // const btnAlan = useAlan()
  // const handleAlan = () => {
  //   btnAlan.activate();
  //   // Calling the project API method on button click
  //   btnAlan.callProjectApi("greetUser", {
  //     user: 'John Smith'
  //   }, function (error, result) { });
  // }


  const count = useSelector((state) => state?.counter?.value)
  const user = useSelector((state) => state.user)

  const dispatch = useDispatch()

  useEffect(() => {

    const { storgeData, decoded } = handleDecoded()


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
      config.headers['token'] = `Bearer ${data?.access_token}`
    }
    return config;
  }, (error) => {

    return Promise.reject(error);
  });

  const handleGetDetailUser = async (id, token) => {

    const res = await UserSevice.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))

  }

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

          {user.isAdmin && privateRoute.map((route, index) => {
            const Page = route.component

            let Layout = DefaultLayout

            if (route.layout) Layout = route.layout
            else if (route.layout === HeaderOnly) Layout = HeaderOnly
            else if (route.layout === null) Layout = Fragment

            return <Route key={index} path={route.path} element={
              <Layout>
                <Page />
              </Layout>
            } />

          })}

        </Routes>

      </div>



      <div className="chat-icon-container" >

        <Translator className="chat-icon" />
      </div>
{/* 
      <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
      <df-messenger
        intent="WELCOME"
        chat-title="stateofTV"
        agent-id="6d477915-1783-402e-8ee8-b2e54f8d2fc1"
        language-code="vi"
      ></df-messenger> */}


    </Router>
  );
}

export default App;
