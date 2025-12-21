import mongoose, { Document, Types } from "mongoose";
export interface IRefreshToken extends Document {
    token: string;
    userId: Types.ObjectId;
    expiresAt: Date;
}
declare const RefreshToken: mongoose.Model<IRefreshToken, {}, {}, {}, mongoose.Document<unknown, {}, IRefreshToken, {}, mongoose.DefaultSchemaOptions> & IRefreshToken & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IRefreshToken>;
export default RefreshToken;
//# sourceMappingURL=RefreshToken.d.ts.map