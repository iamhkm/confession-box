import { User, UserModel } from "../model/User";

export async function addUser (user: User) {
    await UserModel.create(user);
}