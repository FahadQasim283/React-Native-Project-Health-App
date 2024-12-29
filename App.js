// import { NavigationContainer } from "@react-navigation/native";
// import { UserRoleProvider } from "./lib/assignment/q2/usercontext";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import { AdminScreen, HomeScreen, UserScreen } from "./lib/assignment/q2/home";
// import CustomDrawer from "./lib/assignment/q2/customdrawer";
// import LoginPage from "./lib/assignment/q2/login";

// const Drawer = createDrawerNavigator();
// const App = () => {
//   return (
//     <UserRoleProvider>
//       <NavigationContainer>
//         <Drawer.Navigator
//           drawerContent={(props) => <CustomDrawer {...props} />}
//         >
//           <Drawer.Screen name="Home" component={HomeScreen} />
//           <Drawer.Screen name="User " component={UserScreen} />
//           <Drawer.Screen name="Admin" component={AdminScreen} />
//         </Drawer.Navigator>
//       </NavigationContainer>
//     </UserRoleProvider>
//   );
// };
// export default App;

// import { Provider } from "react-redux";
// import ArticleViewScreen from "./lib/redux_saga/article_view";
// import store from "./lib/redux_saga/store";
// const App = () => (
//   <Provider store={store}>
//     <ArticleViewScreen />
//   </Provider>
// );
// export default App;

// App.js
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// // import { store, persistor } from './store';

import { store,persistor } from './src/redux/store';
import AuthScreen from './src/screens/authScreen';
import SearchScreen from './src/screens/searchScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from './src/screens/profileScreen';
import LocalHostPatients from './lib/API and JSON Server/local_host_patients_view';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import ProductsView from './lib/API and JSON Server/products_view';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Authentication" component={AuthScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="local-host-patient" component={LocalHostPatients} />
            <Tab.Screen name="local-host-product" component={ProductsView} />
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

// App.js
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { persistor, store } from './src/redux/store';
// import AuthScreen from './src/screens/authScreen';
// import HomeScreen from './src/screens/homeScree';

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <NavigationContainer>
//           <Stack.Navigator 
//             initialRouteName="Auth"
//             screenOptions={{ headerShown: false }}
//           >
//             <Stack.Screen 
//               name="Auth" 
//               component={AuthScreen} 
//             />
//             <Stack.Screen 
//               name="Home" 
//               component={HomeScreen} 
//             />
//           </Stack.Navigator>
//         </NavigationContainer>
//       </PersistGate>
//     </Provider>
//   );
// }
