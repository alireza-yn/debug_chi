import { UserModel } from "../model/userModel";




const createUser = async (phone:string,name:string,uuid:string,email:string) => {
  try {
    const user = await UserModel.create({phone,name,uuid,email});
    console.log(user);
 
    return user;
  } catch (error) {
    return false
  }
}

const getUserByUUID = async (uuid: string) => {
  try {
    const user = await UserModel.findOne({ uuid });
    console.log(user);
 
    return user;
  } catch (error) {
    return false
  }
};

export { getUserByUUID };