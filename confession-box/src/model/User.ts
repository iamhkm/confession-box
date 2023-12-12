// @/models.ts
import { prop, getModelForClass, pre, post} from "@typegoose/typegoose";
import { validateEmail, validatePassword } from "../util/commonMethods";
import { Date } from "mongoose";

@pre<User>('save', function () {
  console.log("going to save user", this)
})

@post<User>('save', (user:User) => {
  console.log("user saved ", user);
})

export class User {
  @prop({
    type: String,
    validate: {
      validator: validateEmail,
      message: props => `${props.value} is not a valid email!`
    },
    required: [true, 'email required'],
    unique: true,
  })
  public email!: string;

  @prop({
    type: String,
    validate: {
      validator: validatePassword,
      message: props => `${props.value} is not a valid password!`
    },
    required: [true, 'password required']
  })
  public password!: string;

  @prop({ required: true, min: 18 })
  public age!: number;

  @prop({required: true, enum : ["MALE","FEMALE","OTHER"]})
  public gender!: string;

  @prop({ required: false, default: false })
  public enable?: boolean;

  @prop({ required: false, default: false })
  public verified?: boolean;

  @prop({default: new Date() })
  public added_date: Date;
}

export const UserModel = getModelForClass(User);