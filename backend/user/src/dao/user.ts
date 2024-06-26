import { User, UserModel } from "../model/User";

export async function addUser (user: User) {
    await UserModel.create(user);
}

export async function getUserByEmail (email: string) {
    const user:any = await UserModel.findOne({email});
    if (!user) throw new Error("email or password is incorrect");
    return user;
}