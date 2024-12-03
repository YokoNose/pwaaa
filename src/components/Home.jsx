import React from "react";
import appFirebase from "../credenciales";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(appFirebase)

const Home = ({correoUsuario}) =>{
    return (
        <div>
            <h2>Bienvenido{correoUsuario}<button onClick={()=>signOut(auth)}>Logout</button></h2>
        </div>
    )
}
export default Home