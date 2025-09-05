import { CreateAccountHandler } from "./account/createAccount/CreateAccountHandler";
import { signInWithCredentialsHandler } from "./signInWithCredentials/signInWithCredentialsHandler";

export const featuresHandlersCollection : any[] = [
    signInWithCredentialsHandler,
    CreateAccountHandler
]