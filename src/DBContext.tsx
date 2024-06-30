import {createContext} from "react";
import {IDBPDatabase} from "idb";

const DBContext = createContext<IDBPDatabase|null>(null);

export default DBContext;