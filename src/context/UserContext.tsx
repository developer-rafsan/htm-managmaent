"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define user type
interface User {
  name: string;
  email: string;
}