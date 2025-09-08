import { CreateAccountHandler } from "./account/createAccount/CreateAccountHandler";
import { signInWithCredentialsHandler } from "./signup/signInWithCredentials/signInWithCredentialsHandler";

export const featuresHandlersCollection : any[] = [
    signInWithCredentialsHandler,
    CreateAccountHandler
]