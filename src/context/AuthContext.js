"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSetupData, getUserMe, logoutUser } from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [setupData, setSetupData] = useState(null);
  const [setupLoading, setSetupLoading] = useState(false)
  const [data, setData] = useState({
    name: "fares",
    email: "fares.dev.m@gmail.com",
    password: "123456",
    confirm: "123456",
    checkbox: true
  })
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState({})
  const [categoryCache, setCategoryCache] = useState({})
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [simple, setSimple] = useState('');

  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await getUserMe();
      if (res.success) {
        setUser(res.data);
        setIsAuth(true);
      } else {
        setUser(null);
        setIsAuth(false);
      }
    } catch (err) {
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // ignore error
    } finally {
      setAdmin(null);
      setIsAuth(false);
    }
  };

  const setup = async () => {
    try {
      setSetupLoading(true);
      const res = await getSetupData();
      if (res.success) {
        setSetupData(res.data);
        setSimple(res.data.config.simple);
      } else {
        setSetupData(null);
      }
    } catch (err) {
      console.log(err);

      setSetupData(null);
    } finally {
      setSetupLoading(false);
    }
  };

  useEffect(() => {
    if (setupData) { return }
    setup()
  }, [setupData])

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        setIsAuth,
        loading,
        checkAuth,
        logout,
        data, setData,
        user, setUser,
        setupData, setSetupData,
        setupLoading, setSetupLoading,
        products, setProducts,
        cart, setCart,
        category, setCategory,
        categoryCache, setCategoryCache,
        addresses, setAddresses,
        orders, setOrders,
        simple, setSimple
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
