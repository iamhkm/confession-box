// @/models.ts
import { prop, getModelForClass, pre, post} from "@typegoose/typegoose";
import { validateEmail, validatePassword } from "../util/commonMethods";
import { Date } from "mongoose";
import {
  createHash
} from "../util/commonMethods";
import { v4 as uuidv4 } from 'uuid';

@pre<User>('save', function () {
  console.log("going to save user", this);
  this.password = createHash(this.password);
})

@pre<User>('validate', function () {
  console.log("going to validate user", this);
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

  @prop({default: new Date().getTime() })
  public added_date: number;

  @prop({default: "user" })
  public role: string;

  @prop({default: uuidv4()})
  public _id: string;

  @prop({
    type: [String],
    validate: {
      validator: (value: string[]) => value.length > 0,
      message: 'At least one hobby is required.'
    },
    required: true
  })
  public hobbies!: string[];
}

export const UserModel = getModelForClass(User);