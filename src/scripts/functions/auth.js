import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";


async function login(auth, email, password) {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        alert(`Bienvenido, usuario ${user.email}`);
        console.log(user);
    } catch (e) {

        console.log(e.code);

        if (e.code === "auth/wrong-password") {
            alert("Tu contraseña es incorrecta");
        }

        if (e.code === "auth/user-not-found") {
            alert("Usuario no encontrado");
        }

        if (e.code === "auth/invalid-email") {
            alert("Email invalido");
        }

    }

}

async function createUser(auth, { email, password }) {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
            //const uderId = user.uid;
        return user;



        //alert(`Bienvenido, usuario ${user.email}`);
        //console.log(newUser);

    } catch (e) {

        //console.log(e.code);

        if (e.code === "auth/weak-password") {
            alert("Tu contraseña debe tener al menos 6 caracteres")
        }

        if (e.code === "auth/email-already-in-use") {
            alert("Este correo ya se encuentra en uso")
        }

    }

}

async function addUSerToDatabase(db, userId, userInfo) {

    try {
        await setDoc(doc(db, "users", userId), userInfo);
    } catch (e) {
        console.log(e);
    }
}

export {
    createUser,
    login,
    addUSerToDatabase
}