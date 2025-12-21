import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    email: string;
    password: string;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IUser>;
export default User;
//# sourceMappingURL=User.d.ts.map